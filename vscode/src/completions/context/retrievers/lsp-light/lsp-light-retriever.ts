import debounce from 'lodash/debounce'
import * as vscode from 'vscode'

import type { AutocompleteContextSnippet } from '@sourcegraph/cody-shared'
import { IS_LSP_LIGHT_LOGGING_ENABLED } from '../../../../graph/lsp/debug-logger'
import {
    IS_LSP_LIGHT_CACHE_DISABLED,
    getSymbolContextSnippets,
    invalidateDocumentCache,
} from '../../../../graph/lsp/symbol-context-snippets'
import { SupportedLanguage } from '../../../../tree-sitter/grammars'
import type { ContextRetriever, ContextRetrieverOptions } from '../../../types'
import { RetrieverIdentifier } from '../../utils'
import { getLastNGraphContextIdentifiersFromDocument } from '../graph/identifiers'

const SUPPORTED_LANGUAGES = new Set([
    SupportedLanguage.python,
    SupportedLanguage.go,
    SupportedLanguage.javascript,
    SupportedLanguage.javascriptreact,
    SupportedLanguage.typescript,
    SupportedLanguage.typescriptreact,
])

interface RetrieveParams extends Pick<ContextRetrieverOptions, 'document' | 'position' | 'hints'> {}
const RECURSION_LIMIT = 3
const IDENTIFIERS_TO_RESOLVE = 1

export class LspLightRetriever implements ContextRetriever {
    public identifier = RetrieverIdentifier.LspLightRetriever
    private disposables: vscode.Disposable[] = []
    private isCacheDisabled = IS_LSP_LIGHT_CACHE_DISABLED

    private lastRequestKey: string | null = null
    private abortLastRequest: () => void = () => {}

    private lastResult: AutocompleteContextSnippet[] | null = null
    private lastResultKey: string | null = null

    constructor(
        // All arguments are optional, because they are only used in tests.
        private window: Pick<typeof vscode.window, 'onDidChangeTextEditorSelection'> = vscode.window,
        private workspace: Pick<typeof vscode.workspace, 'onDidChangeTextDocument'> = vscode.workspace
    ) {
        const onSelectionChange = debounce(this.onDidChangeTextEditorSelection.bind(this), 100)
        const onTextChange = debounce(this.onDidChangeTextDocument.bind(this), 50)

        this.disposables.push(
            this.window.onDidChangeTextEditorSelection(onSelectionChange),
            this.workspace.onDidChangeTextDocument(onTextChange)
        )
    }

    // TODO: set a timeout on the retrieve call and return partial results if the LSP call takes too long
    // TODO: collect information about CPU usage data
    // TODO: index import tree proactively if the request queue is empty
    public async retrieve(params: RetrieveParams): Promise<AutocompleteContextSnippet[]> {
        const {
            document,
            position,
            hints: { isPreload } = { isPreload: false },
        } = params

        const key = `${document.uri.toString()}█${position.line}█${document.lineAt(position.line).text}`
        if (this.lastRequestKey !== key) {
            this.abortLastRequest()
        }

        const abortController = new AbortController()

        this.lastRequestKey = key
        this.abortLastRequest = () => abortController.abort()

        // TODO: walk up the tree to find identifiers on the closest parent start line
        const symbolsSnippetRequests = getLastNGraphContextIdentifiersFromDocument({
            n: IDENTIFIERS_TO_RESOLVE,
            document,
            position,
        })

        const resultKey = symbolsSnippetRequests
            .map(
                request =>
                    `${request.uri}:${request.position.line}:${request.position.character}:${request.symbolName}`
            )
            .join('::')

        if (!this.isCacheDisabled && resultKey === this.lastResultKey && this.lastResult) {
            return this.lastResult
        }

        const start = performance.now()
        const contextSnippets = await getSymbolContextSnippets({
            symbolsSnippetRequests,
            recursionLimit: RECURSION_LIMIT,
            abortSignal: abortController.signal,
        })

        this.lastResultKey = resultKey
        this.lastResult = contextSnippets

        if (IS_LSP_LIGHT_LOGGING_ENABLED) {
            console.log(
                `[LspLightRetriever] got context snippets in ${(performance.now() - start).toFixed(2)}ms`
            )

            console.log('-------------------------------------------------------------')
            for (const snippet of contextSnippets) {
                console.log(snippet.content)
            }
            console.log('-------------------------------------------------------------')
        }

        if (isPreload) {
            // For preload requests we don't need to prepare the actual context, we just need to
            // preload the cache
            return []
        }

        return contextSnippets
    }

    public isSupportedForLanguageId(languageId: string): boolean {
        return SUPPORTED_LANGUAGES.has(languageId as SupportedLanguage)
    }

    public dispose(): void {
        this.abortLastRequest()
        for (const disposable of this.disposables) {
            disposable.dispose()
        }
    }

    /**
     * When the cursor is moving into a new line, we want to fetch the context for the new line.
     */
    private onDidChangeTextEditorSelection(event: vscode.TextEditorSelectionChangeEvent): void {
        if (!this.isSupportedForLanguageId(event.textEditor.document.languageId)) {
            return
        }

        // Start a preloading requests as identifier by setting the maxChars to 0
        void this.retrieve({
            document: event.textEditor.document,
            position: event.selections[0].active,
            hints: { maxChars: 0, maxMs: 150 },
        })
    }

    /**
     * Whenever there are changes to a document, all relevant contexts must be evicted
     */
    private onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent): void {
        if (event.contentChanges.length === 0 || event.document.uri.scheme !== 'file') {
            return
        }
        // TODO: consider lazily updating the most popular cache entries instead of evicting everything.
        invalidateDocumentCache(event.document)
    }
}
