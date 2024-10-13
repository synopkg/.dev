import { execSync } from 'node:child_process'
import { DOTCOM_URL } from '@sourcegraph/cody-shared'

export interface TestingCredentials {
    readonly token?: string
    readonly redactedToken?: string
    readonly serverEndpoint: string
}

function loadSecret(name: string): string {
    return execSync(
        `gcloud secrets versions access latest --secret ${name} --project cody-agent-tokens --quiet`
    )
        .toString()
        .trim()
}

export function dotcomCredentials(): TestingCredentials {
    return {
        redactedToken: 'REDACTED_3dd704711f82a44ff6aba261b53b61a03fb8edba658774639148630d838c2d1d',
        serverEndpoint: 'https://sourcegraph.com/',
        token: loadSecret('CODY_PRO_ACCESS_TOKEN'),
    }
}

// See instructions in agent/scripts/export-cody-http-recording-tokens.sh for
// how to update the `redacted` tokens when the access token changes.
export const DOTCOM_TESTING_CREDENTIALS = {
    dotcom: {
        token: process.env.SRC_DOTCOM_PRO_ACCESS_TOKEN,
        redactedToken: 'REDACTED_3dd704711f82a44ff6aba261b53b61a03fb8edba658774639148630d838c2d1d',
        serverEndpoint: DOTCOM_URL.toString(),
    } satisfies TestingCredentials,
    dotcomProUserRateLimited: {
        token: process.env.SRC_DOTCOM_PRO_RATE_LIMIT_ACCESS_TOKEN,
        redactedToken: 'REDACTED_e2ef220aa0a2f84113dc065a7fd9c7a620f17455d0aca3690d312676518dc48f',
        serverEndpoint: DOTCOM_URL.toString(),
    } satisfies TestingCredentials,
    dotcomUnauthed: {
        token: undefined,
        redactedToken: undefined,
        serverEndpoint: DOTCOM_URL.toString(),
    } satisfies TestingCredentials,
}

export const ENTERPRISE_TESTING_CREDENTIALS = {
    enterprise: {
        token: process.env.SRC_ENTERPRISE_ACCESS_TOKEN,
        redactedToken: 'REDACTED_b20717265e7ab1d132874d8ff0be053ab9c1dacccec8dce0bbba76888b6a0a69',
        serverEndpoint: 'https://demo.sourcegraph.com/',
    } satisfies TestingCredentials,
    s2: {
        token: process.env.SRC_S2_ACCESS_TOKEN,
        redactedToken: 'REDACTED_4229eb42e0efa2f15f3e6f8843764c7f92ab8051020cc4e90802f4fc0cc91bfa',
        serverEndpoint: 'https://sourcegraph.sourcegraph.com/',
    } satisfies TestingCredentials,
    s2Unauthed: {
        token: undefined,
        redactedToken: undefined,
        serverEndpoint: 'https://sourcegraph.sourcegraph.com/',
    } satisfies TestingCredentials,
}

export const TESTING_CREDENTIALS: typeof ENTERPRISE_TESTING_CREDENTIALS &
    typeof DOTCOM_TESTING_CREDENTIALS = {
    ...DOTCOM_TESTING_CREDENTIALS,
    ...ENTERPRISE_TESTING_CREDENTIALS,
}
