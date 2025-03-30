import {matchToFlat} from '@putout/eslint-flat';
import {defineConfig} from 'eslint/config';
import {safeAlign} from 'eslint-plugin-putout';

export const match = {
    '*md{ts}': {
        'n/no-unsupported-features/node-builtins': 'off',
    },
};

export default defineConfig([
    safeAlign, {
        rules: {
            'no-useless-return': 'off',
        },
    },
    ...matchToFlat(match),
]);
