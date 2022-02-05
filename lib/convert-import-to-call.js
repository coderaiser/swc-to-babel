'use strict';

const {
    CallExpression,
    Identifier,
} = require('@babel/types');

const setLiteral = require('./set-literal');

module.exports = (path) => {
    const {source} = path.node;
    
    setLiteral(source);
    
    const callNode = CallExpression(Identifier('import'), [
        source,
    ]);
    
    path.replaceWith(callNode);
};

