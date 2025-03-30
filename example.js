import {parseSync} from '@swc/core';
import traverse from '@putout/babel';
import toBabel from './index.js';

const code = `
    const f = ({a}) => a;
`;

const ast = toBabel(parseSync(code), code);

traverse(ast, {
    noScope: false,
    ObjectProperty(path) {
        console.log(`variable is "${path.node.value.name}"`);
        // output
        'a';
    },
});
