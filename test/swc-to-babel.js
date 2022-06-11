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
        classMethod: readJSON('class-method.json'),
        memberExpression: readJSON('member-expression.json'),
        spread: readJSON('spread.json'),
        call: readJSON('call.json'),
        typeAliasDeclaration: readJSON('type-alias-declaration.json'),
        function: readJSON('function.json'),
        array: readJSON('array.json'),
        esm: readJSON('esm.json'),
        destructuring: readJSON('destructuring.json'),
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
    },
};

test('swc-to-babel: swc: parse: cwcModule', (t) => {
    const ast = swc.parseSync(fixture.js.swcModule);
    const result = swcToBabel(ast, fixture.js.swcModule);
    
    update('swc-module', result);
    
    t.jsonEqual(result, fixture.ast.swcModule);
    t.end();
});

test('swc-to-babel: swc: parse: identifier', (t) => {
    const ast = swc.parseSync(fixture.js.identifier);
    const result = swcToBabel(ast, fixture.js.identifier);
    
    update('identifier', result);
    
    t.jsonEqual(result, fixture.ast.identifier);
    t.end();
});

test('swc-to-babel: swc: parse: BlockStatement', (t) => {
    const ast = swc.parseSync(fixture.js.blockStatement);
    const result = swcToBabel(ast, fixture.js.blockStatement);
    
    update('block-statement', result);
    
    t.jsonEqual(result, fixture.ast.blockStatement);
    t.end();
});

test('swc-to-babel: swc: parse: position', (t) => {
    const name = 'position';
    const ast = swc.parseSync(fixture.js[name]);
    const result = swcToBabel(ast, fixture.js[name]);
    
    update(name, result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: parse: keyof', (t) => {
    const name = 'keyof';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update(name, result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: parse: template-element', (t) => {
    const name = 'templateElement';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('template-element', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: export', (t) => {
    const name = 'export';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('export', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: parens', (t) => {
    const name = 'parens';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('parens', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: ClassMethod', (t) => {
    const name = 'classMethod';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('class-method', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: member-expression', (t) => {
    const name = 'memberExpression';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('member-expression', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: spread', (t) => {
    const name = 'spread';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('spread', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: call', (t) => {
    const name = 'call';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('call', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: type-alias-declaration', (t) => {
    const name = 'typeAliasDeclaration';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('type-alias-declaration', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: function', (t) => {
    const name = 'function';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('function', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: array', (t) => {
    const name = 'array';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('array', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: esm', (t) => {
    const name = 'esm';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('esm', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

test('swc-to-babel: swc: destructuring', (t) => {
    const name = 'destructuring';
    const ast = swc.parseSync(fixture.js[name], {
        syntax: 'typescript',
    });
    const result = swcToBabel(ast, fixture.js[name]);
    
    update('destructuring', result);
    
    t.jsonEqual(result, fixture.ast[name]);
    t.end();
});

