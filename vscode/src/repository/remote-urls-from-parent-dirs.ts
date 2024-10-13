import ini from 'ini'
import * as vscode from 'vscode'

import { isFileURI } from '@sourcegraph/cody-shared'
import { vscodeGitAPI } from './git-extension-api'

const textDecoder = new TextDecoder('utf-8')

/**
 * Get the Git remote URLs for a given URI, which is assumed to be a file or path in a Git
 * repository. If it's not in a Git repository or there are no remote URLs, it returns `undefined`.
 *
 * This function tries 2 different ways to get the remote URLs: (1) by using the Git extension API
 * available in VS Code only, and (2) by crawling the file system for the `.git/config` file.
 */
export async function gitRemoteUrlsForUri(
    uri: vscode.Uri,
    signal?: AbortSignal
): Promise<string[] | undefined> {
    const fromGitExtension = gitRemoteUrlsFromGitExtension(uri)
    if (fromGitExtension && fromGitExtension.length > 0) {
        return fromGitExtension
    }
    return await gitRemoteUrlsFromParentDirs(uri, signal)
}

/**
 * Walks the tree from the current directory to find the `.git` folder and
 * extracts remote URLs.
 */
async function gitRemoteUrlsFromParentDirs(
    uri: vscode.Uri,
    signal?: AbortSignal
): Promise<string[] | undefined> {
    if (!isFileURI(uri)) {
        return undefined
    }

    const isFile = (await vscode.workspace.fs.stat(uri)).type === vscode.FileType.File
    const dirUri = isFile ? vscode.Uri.joinPath(uri, '..') : uri

    const gitRepoURIs = await gitRepoURIsFromParentDirs(dirUri, signal)
    return gitRepoURIs
        ? await gitRemoteUrlsFromGitConfigUri(gitRepoURIs.gitConfigUri, signal)
        : undefined
}

/**
 * ❗️ The Git extension API instance is only available in the VS Code extension. ️️❗️
 */
function gitRemoteUrlsFromGitExtension(uri: vscode.Uri): string[] | undefined {
    const repository = vscodeGitAPI?.getRepository(uri)
    if (!repository) {
        return undefined
    }

    const remoteUrls = new Set<string>()
    for (const remote of repository.state?.remotes || []) {
        if (remote.fetchUrl) {
            remoteUrls.add(remote.fetchUrl)
        }
        if (remote.pushUrl) {
            remoteUrls.add(remote.pushUrl)
        }
    }
    return remoteUrls.size ? Array.from(remoteUrls) : undefined
}

interface GitRepoURIs {
    rootUri: vscode.Uri
    gitConfigUri: vscode.Uri
}

async function gitRepoURIsFromParentDirs(
    uri: vscode.Uri,
    signal?: AbortSignal
): Promise<GitRepoURIs | undefined> {
    const gitConfigUri = await resolveGitConfigUri(uri, signal)

    if (!gitConfigUri) {
        const parentUri = vscode.Uri.joinPath(uri, '..')
        if (parentUri.fsPath === uri.fsPath) {
            return undefined
        }

        return await gitRepoURIsFromParentDirs(parentUri, signal)
    }

    return { rootUri: uri, gitConfigUri }
}

async function gitRemoteUrlsFromGitConfigUri(
    gitConfigUri: vscode.Uri,
    signal?: AbortSignal
): Promise<string[] | undefined> {
    try {
        const raw = await vscode.workspace.fs.readFile(gitConfigUri)
        signal?.throwIfAborted()
        const configContents = textDecoder.decode(raw)
        const config = ini.parse(configContents)
        const remoteUrls = new Set<string>()

        for (const [key, value] of Object.entries(config)) {
            if (key.startsWith('remote ')) {
                if (value?.pushurl) {
                    remoteUrls.add(value.pushurl)
                }

                if (value?.fetchurl) {
                    remoteUrls.add(value.fetchurl)
                }

                if (value?.url) {
                    remoteUrls.add(value.url)
                }
            }
        }

        return remoteUrls.size ? Array.from(remoteUrls) : undefined
    } catch (error) {
        if (error instanceof Error && 'code' in error) {
            return undefined
        }

        throw error
    }
}

/**
 * Reads the .git directory or file to determine the path to the git config.
 */
async function resolveGitConfigUri(
    uri: vscode.Uri,
    signal?: AbortSignal
): Promise<vscode.Uri | undefined> {
    const gitPathUri = vscode.Uri.joinPath(uri, '.git')

    try {
        const gitPathStat = await vscode.workspace.fs.stat(gitPathUri)
        signal?.throwIfAborted()

        if (gitPathStat.type === vscode.FileType.Directory) {
            return vscode.Uri.joinPath(gitPathUri, 'config')
        }

        if (gitPathStat.type === vscode.FileType.File) {
            const rawGitPath = await vscode.workspace.fs.readFile(gitPathUri)
            signal?.throwIfAborted()
            const submoduleGitDir = textDecoder.decode(rawGitPath).trim().replace('gitdir: ', '')

            return vscode.Uri.joinPath(uri, submoduleGitDir, 'config')
        }

        return undefined
    } catch (error) {
        if (error instanceof Error && 'code' in error) {
            return undefined
        }

        throw error
    }
}
