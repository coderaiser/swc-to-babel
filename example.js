'use strict';

const {parseSync} = require('@swc/core');
const toBabel = require('.');
const traverse = require('@babel/traverse').default;

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
