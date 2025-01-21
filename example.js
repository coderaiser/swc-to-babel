'use strict';

const {parseSync} = require('@swc/core');

const traverse = require('@putout/babel');
const toBabel = require('.');

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
