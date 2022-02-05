'use strict';

const {getPositionByOffset} = require('./get-position-by-offset');
const {assign} = Object;

module.exports.convertModuleToProgram = (path) => {
    path.node.type = 'Program';
    path.node.sourceType = 'module';
};

module.exports.convertSpanToPosition = (path, source) => {
    const {start, end} = path.node.span;
    
    const startPosition = getPositionByOffset(start, source);
    const endPosition = getPositionByOffset(end, source);
    
    delete path.node.span;
    
    assign(path.node, {
        start,
        end,
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

module.exports.convertIdentifier = (path) => {
    delete path.node.optional;
};

