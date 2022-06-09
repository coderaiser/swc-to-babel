'use strict';

const {getPositionByOffset} = require('./get-position-by-offset');
const {assign} = Object;

module.exports.convertModuleToProgram = (path) => {
    path.node.type = 'Program';
    path.node.sourceType = 'module';
};

module.exports.convertSpanToPosition = (path, source) => {
    const {start, end} = path.node.span;
    const deltaEnd = end - start;
    const deltaStart = 1;
    
    const startPosition = getPositionByOffset(deltaStart, source);
    const endPosition = getPositionByOffset(deltaEnd, source);
    
    delete path.node.span;
    
    assign(path.node, {
        start: deltaStart,
        end: deltaEnd,
        loc: {
            start: startPosition,
            end: endPosition,
        },
    });
};

module.exports.convertVariableDeclarator = (path) => {
    delete path.node.optional;
    delete path.node.definite;
};

module.exports.convertStringLiteral = (path) => {
    delete path.node.hasEscape;
    delete path.node.kind;
};

module.exports.convertIdentifier = ({node}) => {
    node.name = node.value;
    
    delete node.value;
    delete node.optional;
};

module.exports.convertCallExpression = (path) => {
    const newArgs = [];
    
    for (const arg of path.node.arguments) {
        newArgs.push(arg.expression);
    }
    
    path.node.arguments = newArgs;
};

module.exports.BlockStatement = (path) => {
    path.node.body = path.node.stmts;
    delete path.node.stmts;
};

