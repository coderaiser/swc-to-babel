'use strict';

const {getPositionByOffset} = require('./get-position-by-offset');
const {assign} = Object;

module.exports.convertModuleToProgram = (path) => {
    path.node.type = 'Program';
    path.node.sourceType = 'module';
};

module.exports.convertSpanToPosition = (path, source) => {
    const {start, end} = path.node.span;
    delete path.node.span;
    
    if (end > source.length)
        return assign(path.node, {
            start,
            end,
        });
    
    const startPosition = getPositionByOffset(start, source);
    const endPosition = getPositionByOffset(end - 1, source);
    
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

module.exports.convertIdentifier = ({node}) => {
    convertIdentifier(node);
};

function convertIdentifier(node) {
    node.name = node.value;
    
    delete node.value;
    delete node.optional;
}

module.exports.convertCallExpression = (path) => {
    const newArgs = [];
    
    for (const arg of path.node.arguments) {
        newArgs.push(arg.expression);
    }
    
    delete path.node.typeArguments;
    path.node.arguments = newArgs;
};

module.exports.BlockStatement = (path) => {
    path.node.body = path.node.stmts;
    delete path.node.stmts;
};

module.exports.convertTSMappedType = (path) => {
    path.node.typeParameter = path.node.typeParam;
    
    delete path.node.typeParam;
};

module.exports.convertTSTypeParameter = (path) => {
    convertIdentifier(path.node.name);
};

module.exports.TemplateElement = (path) => {
    const {cooked, raw} = path.node;
    path.node.value = {
        cooked,
        raw,
    };
    
    delete path.node.cooked;
    delete path.node.raw;
    delete path.node.tail;
};
