'use strict';

const traverse = require('@babel/traverse').default;
const {isIdentifier} = require('@babel/types');

const {
    convertModuleToProgram,
    convertSpanToPosition,
    convertVariableDeclarator,
    convertStringLiteral,
    convertIdentifier,
    convertCallExpression,
    BlockStatement,
    TemplateElement,
    convertTSTypeParameter,
    convertTSMappedType,
    convertExportDeclaration,
    convertExportDefaultExpression,
    convertParenthesisExpression,
    ClassMethod,
    ClassDeclaration,
    MemberExpression,
} = require('./swc');

const getAST = require('./get-ast');

module.exports = (node, source) => {
    const ast = getAST(node);
    
    traverse(ast, {
        noScope: true,
        
        BlockStatement,
        TemplateElement,
        ClassMethod,
        ClassDeclaration,
        MemberExpression,
        
        enter(path) {
            const {node} = path;
            const {type} = node;
            
            if ('span' in path.node)
                convertSpanToPosition(path, source);
            
            if (type?.startsWith('Ts'))
                node.type = type.replace('Ts', 'TS');
            
            if (type?.endsWith('Literal'))
                setEsprimaRaw(node);
            
            if (isIdentifier(path))
                return convertIdentifier(path);
            
            if (path.isStringLiteral())
                return convertStringLiteral(path);
            
            if (type === 'Module')
                return convertModuleToProgram(path);
            
            if (path.isVariableDeclarator())
                return convertVariableDeclarator(path);
            
            if (path.isCallExpression())
                return convertCallExpression(path);
            
            if (path.isTSTypeParameter())
                return convertTSTypeParameter(path);
            
            if (path.isTSMappedType())
                return convertTSMappedType(path);
            
            if (path.type === 'ExportDeclaration')
                return convertExportDeclaration(path);
            
            if (path.type === 'ExportDefaultExpression')
                return convertExportDefaultExpression(path);
            
            if (path.type === 'ParenthesisExpression')
                return convertParenthesisExpression(path);
        },
    });
    
    return ast;
};

function setEsprimaRaw(node) {
    const {raw} = node;
    
    node.raw = raw || node.extra?.raw;
    node.extra = node.extra || {
        raw,
    };
}

