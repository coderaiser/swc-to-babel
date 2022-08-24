'use strict';

const {join} = require('path');
const {readFileSync, writeFileSync} = require('fs');

const {extend} = require('supertape');
const swc = require('@swc/core');
const generate = require('@babel/generator').default;
const swcToBabel = require('..');
const {ESLint} = require('eslint');
const eslint = new ESLint({
    baseConfig: require('../.eslintrc.json'),
});

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

async function generateTest(name, key, t) {
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    
    const result = swcToBabel(ast, fixture.js[name]);
    const {code} = generate(result);
    
    update(key, result);
    let errors = 0;
    
    for (const current of await eslint.lintText(code, {filePath: 'file.ts'})) {
        errors += current.fatalErrorCount;
    }
    
    t.jsonEqual({ast: result, errors}, {ast: fixture.ast[name], errors: 0});
}

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
        swcModule: readJSON('swc-module.json'),
        identifier: readJSON('identifier.json'),
        blockStatement: readJSON('block-statement.json'),
        position: readJSON('position.json'),
        keyof: readJSON('keyof.json'),
        templateElement: readJSON('template-element.json'),
        export: readJSON('export.json'),
        parens: readJSON('parens.json'),
        classMethod: readJSON('class-method.json'),
        memberExpression: readJSON('member-expression.json'),
        spread: readJSON('spread.json'),
        call: readJSON('call.json'),
        typeAliasDeclaration: readJSON('type-alias-declaration.json'),
        function: readJSON('function.json'),
        array: readJSON('array.json'),
        esm: readJSON('esm.json'),
        destructuring: readJSON('destructuring.json'),
        as: readJSON('as.json'),
        objectExpression: readJSON('object-expression.json'),
        getterSetter: readJSON('getter-setter.json'),
        noSrc: readJSON('no-src.json'),
    },
    js: {
        swcModule: readJS('swc-module.js'),
        identifier: readJS('identifier.js'),
        blockStatement: readJS('block-statement.js'),
        position: readJS('position.js'),
        keyof: readJS('keyof.js'),
        templateElement: readJS('template-element.js'),
        export: readJS('export.js'),
        parens: readJS('parens.js'),
        classMethod: readJS('class-method.js'),
        memberExpression: readJS('member-expression.js'),
        spread: readJS('spread.js'),
        call: readJS('call.js'),
        typeAliasDeclaration: readJS('type-alias-declaration.ts'),
        function: readJS('function.js'),
        array: readJS('array.js'),
        esm: readJS('esm.js'),
        destructuring: readJS('destructuring.js'),
        as: readJS('as.ts'),
        objectExpression: readJS('object-expression.js'),
        getterSetter: readJS('getter-setter.js'),
        noSrc: readJS('no-src.js'),
    },
};

test('swc-to-babel: swc: parse: swcModule', async (t) => {
    await generateTest('swcModule', 'swc-module', t);
    t.end();
});

test('swc-to-babel: swc: parse: identifier', async (t) => {
    await generateTest('identifier', 'identifier', t);
    t.end();
});

test('swc-to-babel: swc: parse: BlockStatement', async (t) => {
    await generateTest('blockStatement', 'block-statement', t);
    t.end();
});

test('swc-to-babel: swc: parse: position', async (t) => {
    await generateTest('position', 'position', t);
    t.end();
});

test('swc-to-babel: swc: parse: keyof', async (t) => {
    await generateTest('keyof', 'keyof', t);
    t.end();
});

test('swc-to-babel: swc: parse: template-element', async (t) => {
    await generateTest('templateElement', 'template-element', t);
    t.end();
});

test('swc-to-babel: swc: export', async (t) => {
    await generateTest('export', 'export', t);
    t.end();
});

test('swc-to-babel: swc: parens', async (t) => {
    await generateTest('parens', 'parens', t);
    t.end();
});

test('swc-to-babel: swc: ClassMethod', async (t) => {
    await generateTest('classMethod', 'class-method', t);
    t.end();
});

test('swc-to-babel: swc: member-expression', async (t) => {
    await generateTest('memberExpression', 'member-expression', t);
    t.end();
});

test('swc-to-babel: swc: spread', async (t) => {
    await generateTest('spread', 'spread', t);
    t.end();
});

test('swc-to-babel: swc: call', async (t) => {
    await generateTest('call', 'call', t);
    t.end();
});

test('swc-to-babel: swc: type-alias-declaration', async (t) => {
    await generateTest('typeAliasDeclaration', 'type-alias-declaration', t);
    t.end();
});

test('swc-to-babel: swc: function', async (t) => {
    await generateTest('function', 'function', t);
    t.end();
});

test('swc-to-babel: swc: array', async (t) => {
    await generateTest('array', 'array', t);
    t.end();
});

test('swc-to-babel: swc: esm', async (t) => {
    await generateTest('esm', 'esm', t);
    t.end();
});

test('swc-to-babel: swc: destructuring', async (t) => {
    await generateTest('destructuring', 'destructuring', t);
    t.end();
});

test('swc-to-babel: swc: as', async (t) => {
    await generateTest('as', 'as', t);
    t.end();
});

test('swc-to-babel: swc: object-expression', async (t) => {
    await generateTest('objectExpression', 'object-expression', t);
    t.end();
});

test('swc-to-babel: swc: getter-setter', async (t) => {
    await generateTest('getterSetter', 'getter-setter', t);
    t.end();
});

test('swc-to-babel: swc: no-src', async (t) => {
    await generateTest('noSrc', 'no-src', t);
    t.end();
});

