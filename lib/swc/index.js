import {getPositionByOffset} from './get-position-by-offset.js';

const isNull = (a) => !a && typeof a === 'object';
const {assign} = Object;

export const convertModuleToProgram = (path) => {
    path.node.type = 'Program';
    path.node.sourceType = 'module';
};

export const convertSpanToPosition = (path, source) => {
    const {start, end} = path.node.span;
    
    delete path.node.span;
    
    if (end > source.length)
        return assign(path.node, {
            start,
            end,
        });
    
    const startPosition = getPositionByOffset(start, source);
    const endPosition = getPositionByOffset(end, source);
    
    assign(path.node, {
        start: startPosition.index,
        end: endPosition.index,
        loc: {
            start: startPosition,
            end: endPosition,
        },
    });
};

export const convertVariableDeclarator = (path) => {
    delete path.parentPath.node.declare;
    delete path.node.optional;
    delete path.node.definite;
};

export const convertStringLiteral = (path) => {
    delete path.node.hasEscape;
    delete path.node.kind;
};

export const convertIdentifier = ({node}) => {
    const {typeAnnotation} = node;
    
    node.name = node.value;
    
    if (isNull(typeAnnotation))
        delete node.typeAnnotation;
    
    delete node.value;
    delete node.optional;
    delete node.span;
};

export const convertCallExpression = (path) => {
    const newArgs = [];
    
    for (const arg of path.node.arguments) {
        newArgs.push(arg.expression);
    }
    
    delete path.node.typeArguments;
    path.node.arguments = newArgs;
};

export const BlockStatement = (path) => {
    path.node.body = path.node.stmts;
    delete path.node.stmts;
    path.node.directives = [];
};

export const TSMappedType = (path) => {
    const typeParameter = path.node.typeParam;
    
    path.node.constrain = typeParameter.constraint;
    
    if (!path.node.nameType)
        path.node.nameType = null;
    
    if (!path.node.readonly)
        delete path.node.readonly;
    
    if (!path.node.optional)
        delete path.node.optional;
    
    delete path.node.typeParam;
};

export const convertTSTypeParameter = (path) => {
    convertIdentifier({
        node: path.node.name,
    });
};

export const TemplateElement = (path) => {
    const {cooked, raw} = path.node;
    
    path.node.value = {
        cooked,
        raw,
    };
    
    delete path.node.cooked;
    delete path.node.raw;
    delete path.node.tail;
};

export const convertExportDeclaration = (path) => {
    path.node.type = 'ExportNamedDeclaration';
};

export const convertExportDefaultExpression = (path) => {
    path.node.type = 'ExportDefaultDeclaration';
    path.node.declaration = path.node.expression;
    
    delete path.node.expression;
    delete path.node.declare;
};

export const convertParenthesisExpression = (path) => {
    const expressionPath = path.get('expression');
    
    if (expressionPath.type === 'TsAsExpression')
        convertTSAsExpression(expressionPath);
    else if (expressionPath.type === 'TsConstAssertion')
        convertTSConstAssertion(expressionPath);
    
    path.replaceWith(expressionPath.node);
};

export const ClassMethod = (path) => {
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
    delete path.node.ctxt;
};

export const ClassDeclaration = (path) => {
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

export const MemberExpression = ({node}) => {
    node.computed = node.property.type === 'Computed';
    
    if (node.computed)
        node.property = node.property.expression;
};

function convertSpreadElement(node) {
    const {expression} = node;
    
    assign(node, {
        type: 'SpreadElement',
        argument: expression,
    });
    
    delete node.spread;
    delete node.expression;
}

function maybeConvertSpread(arg) {
    if (arg === null)
        return;
    
    const {spread} = arg;
    
    if (spread) {
        convertSpreadElement(arg);
        return;
    }
    
    assign(arg, arg.expression);
    
    delete arg.spread;
    delete arg.expression;
}

export const NewExpression = (path) => {
    path.node.arguments = path.node.arguments || [];
    path.node.arguments.forEach(maybeConvertSpread);
    
    delete path.node.typeArguments;
};

export const ArrayExpression = (path) => {
    path.node.elements.forEach(maybeConvertSpread);
};

export const Function = (path) => {
    const {node} = path;
    
    if (path.parentPath.isExportDefaultDeclaration())
        path.node.type = 'FunctionDeclaration';
    
    const {params, typeParameters} = node;
    
    node.id = node.identifier || null;
    
    delete node.identifier;
    delete node.decorators;
    
    if (!node.returnType)
        delete node.returnType;
    
    for (const [index, param] of params.entries()) {
        if (param.type === 'Parameter')
            params[index] = param.pat;
    }
    
    if (isNull(typeParameters))
        delete node.typeParameters;
    
    delete node.declare;
};

export const TSTypeAliasDeclaration = (path) => {
    delete path.node.declare;
    delete path.node.typeParams;
};

export const TSAsExpression = convertTSAsExpression;

function convertTSAsExpression({node}) {
    node.type = 'TSAsExpression';
    
    if (node.typeAnnotation.kind === 'any')
        assign(node.typeAnnotation, {
            type: 'TSAnyKeyword',
        });
}

export const TSConstAssertion = convertTSConstAssertion;

function convertTSConstAssertion({node}) {
    assign(node, {
        type: 'TSAsExpression',
        extra: {
            parenthesized: true,
            parenStart: 0,
        },
        typeAnnotation: {
            type: 'TSTypeReference',
            typeName: {
                type: 'Identifier',
                name: 'const',
            },
        },
    });
}

export const convertTSTypeReference = (path) => {
    path.node.type = 'TSTypeReference';
    delete path.node.span;
    delete path.node.typeParams;
};

export const convertTSTypeOperator = (path) => {
    path.node.operator = path.node.op;
    path.node.type = 'TSTypeOperator';
    
    delete path.node.op;
};

export const TSTypeParameter = (path) => {
    path.node.name = path.node.name.name;
    
    delete path.node.in;
    delete path.node.out;
    delete path.node.default;
};

export const TSIndexedAccessType = (path) => {
    delete path.node.readonly;
};

export const ImportDeclaration = ({node}) => {
    const {typeOnly} = node;
    
    node.attributes = node.asserts || [];
    node.importKind = typeOnly ? 'type' : 'value';
    delete node.phase;
    
    delete node.asserts;
    delete node.typeOnly;
};

export const ImportSpecifier = ({node}) => {
    if (!node.imported)
        node.imported = {
            ...node.local,
        };
    
    delete node.isTypeOnly;
};

export const convertObjectProperty = (path) => {
    const {node} = path;
    
    node.type = 'ObjectProperty';
    node.shorthand = !node.value;
    
    if (!node.value)
        node.value = {
            ...node.key,
        };
    
    delete path.parentPath.node.optional;
};

export const convertGetterSetter = ({node}) => {
    node.kind = node.type === 'GetterProperty' ? 'get' : 'set';
    node.type = 'ObjectMethod';
    node.params = node.param ? [node.param] : [];
    delete node.thisParam;
    
    delete node.param;
};

export const ExportDefaultDeclaration = ({node}) => {
    // NOTE: It's possible that we've already processed this
    // node if it was a export default expression. If so, we
    // don't want to process it again.
    if (node.declaration)
        return;
    
    node.declaration = node.decl;
    node.exportKind = 'value';
    node.assertions = [];
    
    delete node.decl;
};

export const ExportNamedDeclaration = ({node}) => {
    const {typeOnly} = node;
    
    node.assertions = [];
    node.source = null;
    node.specifiers = node.specifiers || [];
    
    node.exportKind = typeOnly ? 'type' : 'value';
    
    delete node.asserts;
    delete node.typeOnly;
};

export const ExportSpecifier = ({node}) => {
    const {orig, exported} = node;
    
    node.local = orig;
    node.exported = exported || {
        ...orig,
    };
    
    delete node.isTypeOnly;
    delete node.orig;
};

export const JSXElement = (path) => {
    path.node.openingElement = path.node.opening;
    delete path.node.opening;
    path.node.closingElement = path.node.closing;
    delete path.node.closing;
};

export const JSXFragment = (path) => {
    path.node.openingFragment = path.node.opening;
    delete path.node.opening;
    path.node.closingFragment = path.node.closing;
    delete path.node.closing;
};
