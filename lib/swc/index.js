'use strict';

const isNull = (a) => !a && typeof a === 'object';

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
    delete path.parentPath.node.declare;
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
    const {typeAnnotation} = node;
    
    node.name = node.value;
    
    if (isNull(typeAnnotation)) {
        delete node.typeAnnotation;
    }
    
    delete node.value;
    delete node.optional;
    delete node.span;
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

module.exports.convertExportDeclaration = (path) => {
    path.node.type = 'ExportNamedDeclaration';
};

module.exports.convertExportDefaultExpression = (path) => {
    path.node.type = 'ExportDefaultDeclaration';
    path.node.declaration = path.node.expression;
    
    delete path.node.expression;
    delete path.node.declare;
};

module.exports.convertParenthesisExpression = (path) => {
    path.replaceWith(path.node.expression);
};

module.exports.ClassMethod = (path) => {
    const {node} = path;
    const {key} = path.node;
    
    Object.assign(node, {
        ...path.node.function,
        key,
    });
    
    delete path.node.isStatic;
    delete path.node.accessibility;
    delete path.node.isAbstract;
    delete path.node.isOptional;
    delete path.node.isOverride;
    delete path.node.optional;
    delete path.node.function;
    delete path.node.decorators;
    delete path.node.typeParameters;
    delete path.node.returnType;
    delete path.node.span;
};

module.exports.ClassDeclaration = (path) => {
    path.node.id = path.node.identifier;
    path.node.body = {
        type: 'ClassBody',
        body: path.node.body,
    };
    
    delete path.node.identifier;
    delete path.node.declare;
    delete path.node.decorators;
    delete path.node.isAbstract;
    delete path.node.typeParams;
    delete path.node.superTypeParams;
    delete path.node.implements;
};

