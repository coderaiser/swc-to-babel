'use strict';

const {join} = require('path');

const {
    readFileSync,
    writeFileSync,
} = require('fs');

const {extend} = require('supertape');
const swc = require('@swc/core');
const {print} = require('putout');
const swcToBabel = require('..');
const tryCatch = require('try-catch');

const json = (a) => JSON.parse(JSON.stringify(a));

const test = extend({
    jsonEqual: (operator) => (error, actual, expected, message = 'should jsonEqual') => {
        if (error)
            return operator.fail(error.message);
        
        const {
            is,
            output,
        } = operator.deepEqual(json(actual), json(expected));
        
        return {
            is,
            message,
            actual,
            expected,
            output,
        };
    },
    compile: (operator) => (name) => {
        const ast = swc.parseSync(fixture.js[name], {
            syntax: 'typescript',
        });
        
        const babelAST = swcToBabel(ast, fixture.js[name]);
        const [error] = tryCatch(print, babelAST);
        
        update(name, babelAST);
        
        return operator.jsonEqual(error, babelAST, fixture.ast[name]);
    },
});

const fixtureDir = join(__dirname, 'fixture');

const isUpdate = process.env.UPDATE;

const update = (a, json) => {
    if (!isUpdate)
        return;
    
    writeFileSync(`${fixtureDir}/${a}.json`, `${JSON.stringify(json, null, 4)}\n`);
};

const readJS = (a) => readFileSync(join(`${fixtureDir}/${a}`), 'utf8');
const readJSON = (a) => require(`${fixtureDir}/${a}`);

const fixture = {
    ast: {
        'swc-module': readJSON('swc-module.json'),
        'identifier': readJSON('identifier.json'),
        'block-statement': readJSON('block-statement.json'),
        'position': readJSON('position.json'),
        'keyof': readJSON('keyof.json'),
        'template-element': readJSON('template-element.json'),
        'export': readJSON('export.json'),
        'parens': readJSON('parens.json'),
        'class-method': readJSON('class-method.json'),
        'member-expression': readJSON('member-expression.json'),
        'spread': readJSON('spread.json'),
        'call': readJSON('call.json'),
        'type-alias-declaration': readJSON('type-alias-declaration.json'),
        'function': readJSON('function.json'),
        'array': readJSON('array.json'),
        'esm': readJSON('esm.json'),
        'destructuring': readJSON('destructuring.json'),
        'as': readJSON('as.json'),
        'object-expression': readJSON('object-expression.json'),
        'getter-setter': readJSON('getter-setter.json'),
        'no-src': readJSON('no-src.json'),
        'parenthesized-const-assertion': readJSON('parenthesized-const-assertion.json'),
    },
    js: {
        'swc-module': readJS('swc-module.js'),
        'identifier': readJS('identifier.js'),
        'block-statement': readJS('block-statement.js'),
        'position': readJS('position.js'),
        'keyof': readJS('keyof.js'),
        'template-element': readJS('template-element.js'),
        'export': readJS('export.js'),
        'parens': readJS('parens.js'),
        'class-method': readJS('class-method.js'),
        'member-expression': readJS('member-expression.js'),
        'spread': readJS('spread.js'),
        'call': readJS('call.js'),
        'type-alias-declaration': readJS('type-alias-declaration.ts'),
        'function': readJS('function.js'),
        'array': readJS('array.js'),
        'esm': readJS('esm.js'),
        'destructuring': readJS('destructuring.js'),
        'as': readJS('as.ts'),
        'object-expression': readJS('object-expression.js'),
        'getter-setter': readJS('getter-setter.js'),
        'no-src': readJS('no-src.js'),
        'parenthesized-const-assertion': readJS('parenthesized-const-assertion.ts'),
    },
};

test('swc-to-babel: swc: parse: swcModule', (t) => {
    t.compile('swc-module');
    t.end();
});

test('swc-to-babel: swc: parse: identifier', (t) => {
    t.compile('identifier');
    t.end();
});

test('swc-to-babel: swc: parse: BlockStatement', (t) => {
    t.compile('block-statement');
    t.end();
});

test('swc-to-babel: swc: parse: position', (t) => {
    t.compile('position');
    t.end();
});

test('swc-to-babel: swc: parse: keyof', (t) => {
    t.compile('keyof');
    t.end();
});

test('swc-to-babel: swc: parse: template-element', (t) => {
    t.compile('template-element');
    t.end();
});

test('swc-to-babel: swc: export', (t) => {
    t.compile('export');
    t.end();
});

test('swc-to-babel: swc: parens', (t) => {
    t.compile('parens');
    t.end();
});

test('swc-to-babel: swc: ClassMethod', (t) => {
    t.compile('class-method');
    t.end();
});

test('swc-to-babel: swc: member-expression', (t) => {
    t.compile('member-expression');
    t.end();
});

test('swc-to-babel: swc: spread', (t) => {
    t.compile('spread');
    t.end();
});

test('swc-to-babel: swc: call', (t) => {
    t.compile('call');
    t.end();
});

test('swc-to-babel: swc: type-alias-declaration', (t) => {
    t.compile('type-alias-declaration');
    t.end();
});

test('swc-to-babel: swc: function', (t) => {
    t.compile('function');
    t.end();
});

test('swc-to-babel: swc: array', (t) => {
    t.compile('array');
    t.end();
});

test('swc-to-babel: swc: esm', (t) => {
    t.compile('esm');
    t.end();
});

test('swc-to-babel: swc: destructuring', (t) => {
    t.compile('destructuring');
    t.end();
});

test('swc-to-babel: swc: as', (t) => {
    t.compile('as');
    t.end();
});

test('swc-to-babel: swc: object-expression', (t) => {
    t.compile('object-expression');
    t.end();
});

test('swc-to-babel: swc: getter-setter', (t) => {
    t.compile('getter-setter');
    t.end();
});

test('swc-to-babel: swc: no-src', (t) => {
    t.compile('no-src');
    t.end();
});

test('swc-to-babel: swc: parenthesized-const-assertion', (t) => {
    t.compile('parenthesized-const-assertion');
    t.end();
});
