'use strict';

const {join} = require('path');
const {
    readFileSync,
    writeFileSync,
} = require('fs');

const {extend} = require('supertape');
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
    },
};

test('estree-to-babel: swc: parse: cwcModule', (t) => {
    const ast = swc.parseSync(fixture.js.swcModule);
    const result = swcToBabel(ast, fixture.js.swcModule);
    
    update('swc-module', result);
    
    t.jsonEqual(result, fixture.ast.swcModule);
    t.end();
});

test('estree-to-babel: swc: parse: identifier', (t) => {
    const ast = swc.parseSync(fixture.js.identifier);
    const result = swcToBabel(ast, fixture.js.identifier);
    
    update('identifier', result);
    
    t.jsonEqual(result, fixture.ast.identifier);
    t.end();
});

test('estree-to-babel: swc: parse: BlockStatement', (t) => {
    const ast = swc.parseSync(fixture.js.blockStatement);
    const result = swcToBabel(ast, fixture.js.blockStatement);
    
    update('block-statement', result);
    
    t.jsonEqual(result, fixture.ast.blockStatement);
    t.end();
});

test('estree-to-babel: swc: parse: position', (t) => {
    const name = 'position';
    const ast = swc.parseSync(fixture.js[name]);
    const result = swcToBabel(ast, fixture.js[name]);
    
    update(name, result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('estree-to-babel: swc: parse: keyof', (t) => {
    const name = 'keyof';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update(name, result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('estree-to-babel: swc: parse: template-element', (t) => {
    const name = 'templateElement';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('template-element', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('estree-to-babel: swc: export', (t) => {
    const name = 'export';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('export', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('estree-to-babel: swc: parens', (t) => {
    const name = 'parens';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('parens', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

