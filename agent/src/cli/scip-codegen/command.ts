import fspromises from 'node:fs/promises'
import { Command, InvalidOptionArgumentError, Option } from 'commander'
import type { BaseCodegen } from './BaseCodegen'
import { Codegen, TargetLanguage } from './Codegen'
import { ConsoleReporter } from './ConsoleReporter'
import { MarkdownCodegen } from './MarkdownCodegen'
import { SymbolTable } from './SymbolTable'
import { scip } from './scip'

export interface CodegenOptions {
    input: string
    output: string
    language: string
    protocol: string
    kotlinPackage: string
    discriminatedUnions: 'flat' | 'nested'
    severity: string
}

enum CodegenLanguage {
    Java = 'java',
    Kotlin = 'kotlin',
    Markdown = 'markdown',
    CSharp = 'csharp',
}

function discriminatedUnion(value: string): 'flat' | 'nested' {
    switch (value) {
        case 'flat':
            return 'flat'
        case 'nested':
            return 'nested'
        default:
            throw new InvalidOptionArgumentError(
                `Invalid discriminated union. Valid options are 'flat' and 'nested'.`
            )
    }
}

function languageOption(value: string): CodegenLanguage {
    switch (value) {
        case 'kotlin':
            return CodegenLanguage.Kotlin
        case 'java':
            return CodegenLanguage.Java
        case 'markdown':
            return CodegenLanguage.Markdown
        case 'csharp':
            return CodegenLanguage.CSharp
        default:
            throw new InvalidOptionArgumentError(
                `Invalid language. Valid options are ${CodegenLanguage.Kotlin}, ${CodegenLanguage.Java}, ${CodegenLanguage.Markdown}, ${CodegenLanguage.CSharp}.`
            )
    }
}

const command = new Command('scip-codegen')
    .option('--input <path>', 'path to SCIP file', 'index.scip')
    .option('--output <directory>', 'path where to generate bindings')
    .addOption(
        new Option('--language <value>', 'what programming language to generate the bindings')
            .argParser(languageOption)
            .default(CodegenLanguage.Kotlin)
    )
    .option('--protocol <value>', 'what protocol to generate bindings for', 'agent')
    .option('--severity <warning|error>', 'what protocol to generate bindings for', 'error')
    .addOption(
        new Option(
            '--discriminated-unions <flat|nested>',
            'whether to translate discriminated unions as flat or nested types'
        )
            .default('nested')
            .argParser(discriminatedUnion)
    )
    .option(
        '--kotlin-package <value>',
        'what package name to use for the kotlin classes',
        'com.sourcegraph.cody.agent.protocol_generated'
    )
    .action(async (options: CodegenOptions) => {
        const codegen = await initializeCodegen(options)

        await codegen.run()

        if (codegen.reporter.hasErrors()) {
            codegen.reporter.reportErrorCount()
            process.exit(1)
        }
    })

async function initializeCodegen(options: CodegenOptions): Promise<BaseCodegen> {
    const bytes = await fspromises.readFile(options.input)
    const index = scip.Index.deserialize(bytes)
    const symtab = new SymbolTable(index)
    const reporter = new ConsoleReporter(index, { severity: options.severity as any })
    switch (options.language) {
        case CodegenLanguage.Kotlin:
            return new Codegen(TargetLanguage.Kotlin, options, symtab, reporter)
        case CodegenLanguage.Java:
            return new Codegen(TargetLanguage.Java, options, symtab, reporter)
        case CodegenLanguage.CSharp:
            return new Codegen(TargetLanguage.CSharp, options, symtab, reporter)
        case CodegenLanguage.Markdown:
            return new MarkdownCodegen(options, symtab, reporter)
        default:
            throw new Error(`unknown language: ${options.language}`)
    }
}

const args = process.argv.slice(2)

command.parseAsync(args, { from: 'user' }).catch(error => {
    console.error(error)
    process.exit(1)
})
