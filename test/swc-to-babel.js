'use strict';

const {join} = require('path');
const {
    readFileSync,
    writeFileSync,
} = require('fs');

const {extend} = require('supertape');
const espree = require('espree');
const babel = require('@babel/parser');
const tsEstree = require('@typescript-eslint/typescript-estree');
const swc = require('@swc/core');

const swcToBabel = require('..');

const json = (a) => JSON.parse(JSON.stringify(a));

const test = extend({
    jsonEqual: (operator) => (actual, expected, message = 'should jsonEqual') => {
        const {is, output} = operator.deepEqual(json(actual), json(expected));
        
        return {
            is,
            message,
            actual,
            expected,
            output,
        };
    },
});

const parse = (source) => {
    return espree.parse(source, {
        sourceType: 'module',
        ecmaVersion: 2022,
        loc: true,
        comment: true,
    });
};

const acornParse = (source) => {
    const {Parser} = require('acorn');
    const stage3 = require('acorn-stage3');
    
    const parser = Parser.extend(stage3);
    
    return parser.parse(source, {
        locations: true,
        comment: true,
        ecmaVersion: 2022,
        sourceType: 'module',
    });
};

const fixtureDir = join(__dirname, 'fixture');

const isUpdate = process.env.UPDATE;
const update = (a, json) => {
    if (!isUpdate)
        return;
    
    writeFileSync(`${fixtureDir}/${a}.json`, JSON.stringify(json, null, 4));
};

const readJS = (a) => readFileSync(join(`${fixtureDir}/${a}`), 'utf8');
const readJSON = (a) => require(`${fixtureDir}/${a}`);
const fixture = {
    ast: {
        property: readJSON('property.json'),
        objectMethod: readJSON('object-method.json'),
        stringLiteral: readJSON('string-literal.json'),
        numericLiteral: readJSON('numeric-literal.json'),
        nullLiteral: readJSON('null-literal.json'),
        boolLiteral: readJSON('bool-literal.json'),
        regexpLiteral: readJSON('regexp-literal.json'),
        comments: readJSON('comments.json'),
        commentsAttached: readJSON('comments-attached.json'),
        classMethod: readJSON('class-method.json'),
        classPrivateMethod: readJSON('class-private-method.json'),
        classPrivateProperty: readJSON('class-private-property.json'),
        strictMode: readJSON('strict-mode.json'),
        classMethodBabel: readJSON('class-method-babel.json'),
        importExpression: readJSON('import-expression.json'),
        exportDeclaration: readJSON('export-declaration.json'),
        importDeclaration: readJSON('import-declaration.json'),
        bigInt: readJSON('big-int.json'),
        chainExpression: readJSON('chain-expression.json'),
        tsClassImplements: readJSON('ts-class-implements.json'),
        tsPropertyDefinition: readJSON('ts-property-definition.json'),
        tsPrivateIdentifier: readJSON('ts-private-identifier.json'),
        tsInterfaceHeritage: readJSON('ts-interface-heritage.json'),
        tsAbstractMethodDefinition: readJSON('ts-abstract-method-definition.json'),
        swcModule: readJSON('swc-module.json'),
    },
    js: {
        property: readJS('property.js'),
        objectMethod: readJS('object-method.js'),
        stringLiteral: readJS('string-literal.js'),
        numericLiteral: readJS('numeric-literal.js'),
        nullLiteral: readJS('null-literal.js'),
        boolLiteral: readJS('bool-literal.js'),
        regexpLiteral: readJS('regexp-literal.js'),
        comments: readJS('comments.js'),
        commentsAttached: readJS('comments-attached.js'),
        strictMode: readJS('strict-mode.js'),
        classMethod: readJS('class-method.js'),
        classPrivateMethod: readJS('class-private-method.js'),
        classPrivateProperty: readJS('class-private-property.js'),
        importExpression: readJS('import-expression.js'),
        importDeclaration: readJS('import-declaration.js'),
        exportDeclaration: readJS('export-declaration.js'),
        bigInt: readJS('big-int.js'),
        chainExpression: readJS('chain-expression.js'),
        tsClassImplements: readJS('ts-class-implements.ts'),
        tsPropertyDefinition: readJS('ts-property-definition.ts'),
        tsPrivateIdentifier: readJS('ts-private-identifier.ts'),
        tsInterfaceHeritage: readJS('ts-interface-heritage.ts'),
        tsAbstractMethodDefinition: readJS('ts-abstract-method-definition.ts'),
        swcModule: readJS('swc-module.js'),
    },
};

test('estree-to-babel: property', (t) => {
    const ast = parse(fixture.js.property);
    const result = swcToBabel(ast);
    
    update('property', result);
    
    t.jsonEqual(result, fixture.ast.property);
    t.end();
});

test('estree-to-babel: object-method', (t) => {
    const ast = parse(fixture.js.objectMethod);
    const result = swcToBabel(ast);
    
    update('object-method', result);
    
    t.jsonEqual(result, fixture.ast.objectMethod);
    t.end();
});

test('estree-to-babel: string-literal', (t) => {
    const ast = parse(fixture.js.stringLiteral);
    const result = swcToBabel(ast);
    
    update('string-literal', result);
    
    t.jsonEqual(result, fixture.ast.stringLiteral);
    t.end();
});

test('estree-to-babel: null-literal', (t) => {
    const ast = parse(fixture.js.nullLiteral);
    const result = swcToBabel(ast);
    
    update('null-literal', result);
    
    t.jsonEqual(result, fixture.ast.nullLiteral);
    t.end();
});

test('estree-to-babel: numeric-literal', (t) => {
    const ast = parse(fixture.js.numericLiteral);
    const result = swcToBabel(ast);
    
    update('numeric-literal', result);
    
    t.jsonEqual(result, fixture.ast.numericLiteral);
    t.end();
});

test('estree-to-babel: bool literal', (t) => {
    const ast = parse(fixture.js.boolLiteral);
    const result = swcToBabel(ast);
    
    update('bool-literal', result);
    
    t.jsonEqual(result, fixture.ast.boolLiteral);
    t.end();
});

test('estree-to-babel: regexp literal', (t) => {
    const ast = parse(fixture.js.regexpLiteral);
    const result = swcToBabel(ast);
    
    update('regexp-literal', result);
    
    t.jsonEqual(result, fixture.ast.regexpLiteral);
    t.end();
});

test('estree-to-babel: comments', (t) => {
    const ast = parse(fixture.js.comments);
    const result = swcToBabel(ast);
    
    update('comments', result);
    
    t.jsonEqual(result, fixture.ast.comments);
    t.end();
});

test('estree-to-babel: attached comments', async (t) => {
    const ast = parse(fixture.js.commentsAttached);
    const {comments} = ast;
    
    // Some estree parsers support only a top-level `comments` array.
    // Others support only attached comment nodes.
    // Babel has both.
    const {attachComments} = await import('estree-util-attach-comments');
    
    attachComments(ast, comments);
    ast.comments = comments;
    
    const result = swcToBabel(ast);
    
    update('comments-attached', result);
    
    t.jsonEqual(result, fixture.ast.commentsAttached);
    t.end();
});

test('estree-to-babel: class method', (t) => {
    const ast = parse(fixture.js.classMethod);
    const result = swcToBabel(ast);
    
    update('class-method', result);
    
    t.jsonEqual(result, fixture.ast.classMethod);
    t.end();
});

test('estree-to-babel: class method: babel.parse', (t) => {
    const ast = babel.parse(fixture.js.classMethod);
    const result = swcToBabel(ast);
    
    update('class-method-babel', result);
    
    t.jsonEqual(result, fixture.ast.classMethodBabel);
    t.end();
});

test('estree-to-babel: class private method: babel.parse', (t) => {
    const ast = babel.parse(fixture.js.classPrivateMethod, {
        plugins: [
            'estree',
            'classPrivateMethods',
        ],
    });
    const result = swcToBabel(ast);
    
    update('class-private-method', result);
    
    t.jsonEqual(result, fixture.ast.classPrivateMethod);
    t.end();
});

test('estree-to-babel: babel.parse: strict mode', (t) => {
    const ast = babel.parse(fixture.js.strictMode, {
        plugins: [
            'estree',
            'classPrivateMethods',
            'classPrivateProperties',
        ],
    });
    const result = swcToBabel(ast);
    
    update('strict-mode', result);
    
    t.jsonEqual(result, fixture.ast.strictMode);
    t.end();
});

test('estree-to-babel: acorn.parse: private property', (t) => {
    const ast = acornParse(fixture.js.classPrivateProperty);
    const result = swcToBabel(ast);
    
    update('class-private-property', result);
    
    t.jsonEqual(result, fixture.ast.classPrivateProperty);
    t.end();
});

test('estree-to-babel: espree.parse: ImportExpression', (t) => {
    const ast = acornParse(fixture.js.importExpression);
    const result = swcToBabel(ast);
    
    update('import-expression', result);
    
    t.jsonEqual(result, fixture.ast.importExpression);
    t.end();
});

test('estree-to-babel: espree.parse: ExportNamedDeclaration', (t) => {
    const ast = parse(fixture.js.exportDeclaration);
    const result = swcToBabel(ast);
    
    update('export-declaration', result);
    
    t.jsonEqual(result, fixture.ast.exportDeclaration);
    t.end();
});

test('estree-to-babel: parse: BigIntLiteral', (t) => {
    const ast = babel.parse(fixture.js.bigInt);
    const result = swcToBabel(ast);
    
    update('big-int', result);
    
    t.jsonEqual(result, fixture.ast.bigInt);
    t.end();
});

test('estree-to-babel: parse: ChainExpression', (t) => {
    const ast = acornParse(fixture.js.chainExpression);
    const result = swcToBabel(ast);
    
    update('chain-expression', result);
    
    t.jsonEqual(result, fixture.ast.chainExpression);
    t.end();
});

test('estree-to-babel: parse: ImportDeclaration: assertions', (t) => {
    const ast = acornParse(fixture.js.importDeclaration);
    const result = swcToBabel(ast);
    
    update('import-declaration', result);
    
    t.jsonEqual(result, fixture.ast.importDeclaration);
    t.end();
});

test('estree-to-babel: parse: TSClassImplements', (t) => {
    const ast = tsEstree.parse(fixture.js.tsClassImplements);
    const result = swcToBabel(ast);
    
    update('ts-class-implements', result);
    
    t.jsonEqual(result, fixture.ast.tsClassImplements);
    t.end();
});

test('estree-to-babel: parse: PropertyDefinition', (t) => {
    const ast = tsEstree.parse(fixture.js.tsPropertyDefinition);
    const result = swcToBabel(ast);
    
    update('ts-property-definition', result);
    
    t.jsonEqual(result, fixture.ast.tsPropertyDefinition);
    t.end();
});

test('estree-to-babel: parse: PrivateIdentifier', (t) => {
    const ast = tsEstree.parse(fixture.js.tsPrivateIdentifier);
    const result = swcToBabel(ast);
    
    update('ts-private-identifier', result);
    
    t.jsonEqual(result, fixture.ast.tsPrivateIdentifier);
    t.end();
});

test('estree-to-babel: parse: InterfaceHeritage', (t) => {
    const ast = tsEstree.parse(fixture.js.tsInterfaceHeritage);
    const result = swcToBabel(ast);
    
    update('ts-interface-heritage', result);
    
    t.jsonEqual(result, fixture.ast.tsInterfaceHeritage);
    t.end();
});

test('estree-to-babel: parse: TSAbstractMethodDefinition', (t) => {
    const ast = tsEstree.parse(fixture.js.tsAbstractMethodDefinition);
    const result = swcToBabel(ast);
    
    update('ts-abstract-method-definition', result);
    
    t.jsonEqual(result, fixture.ast.tsAbstractMethodDefinition);
    t.end();
});

test.only('estree-to-babel: swc: parse: ', (t) => {
    const ast = swc.parseSync(fixture.js.swcModule);
    //const ast = babel.parse(fixture.js.swcModule);
    const result = swcToBabel(ast, fixture.js.swcModule);
    
    update('swc-module', result);
    
    t.jsonEqual(result, fixture.ast.swcModule);
    t.end();
});

