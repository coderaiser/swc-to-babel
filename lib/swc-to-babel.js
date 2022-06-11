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
    convertObjectProperty,
    BlockStatement,
    TemplateElement,
    convertTSTypeParameter,
    convertExportDeclaration,
    convertExportDefaultExpression,
    convertParenthesisExpression,
    convertSpreadElement,
    ClassMethod,
    ClassDeclaration,
    ArrayExpression,
    MemberExpression,
    NewExpression,
    Function,
    ImportDeclaration,
    ImportSpecifier,
    TSTypeAliasDeclaration,
    TSMappedType,
    TSTypeReference,
    TSTypeOperator,
    TSTypeParameter,
    TSIndexedAccessType,
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
        ArrayExpression,
        MemberExpression,
        NewExpression,
        Function,
        ImportDeclaration,
        ImportSpecifier,
        
        TSTypeAliasDeclaration,
        TSMappedType,
        TSTypeReference,
        TSTypeOperator,
        TSTypeParameter,
        TSIndexedAccessType,
        
        enter(path) {
            const {node} = path;
            const {type} = node;
            
            if ('span' in path.node)
                convertSpanToPosition(path, source);
            
            delete node.start;
            delete node.end;
            
            if (type?.startsWith('Ts'))
                node.type = type.replace('Ts', 'TS');
            
            if (type?.endsWith('Literal'))
                setEsprimaRaw(node);
            
            if (!type && node.spread)
                return convertSpreadElement(path);
            
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
            
            //if (path.isTSMappedType())
            //return convertTSMappedType(path);
            
            if (path.type === 'ExportDeclaration')
                return convertExportDeclaration(path);
            
            if (path.type === 'ExportDefaultExpression')
                return convertExportDefaultExpression(path);
            
            if (path.type === 'ParenthesisExpression')
                return convertParenthesisExpression(path);
            
            if (path.type === 'KeyValuePatternProperty')
                return convertObjectProperty(path);
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

