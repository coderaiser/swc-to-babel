# SWC-to-babel [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/swc-to-babel.svg?style=flat&longCache=true
[BuildStatusURL]: https://github.com/coderaiser/swc-to-babel/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/swc-to-babel/workflows/Node%20CI/badge.svg
[NPMURL]: https://npmjs.org/package/swc-to-babel "npm"
[BuildStatusURL]: https://travis-ci.org/coderaiser/swc-to-babel "Build Status"
[CoverageURL]: https://coveralls.io/github/coderaiser/swc-to-babel?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/swc-to-babel/badge.svg?branch=master&service=github

Convert [`SWC`](https://swc.rs/) `JavaScript AST` to [`Babel AST`](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md).

To use `SWC` parser with `babel` tools like:

- [`@babel/traverse`](https://babeljs.io/docs/en/babel-traverse)
- [`@babel/types`](https://babeljs.io/docs/en/babel-types)
- etc...

The thing is [`@babel/parser`](https://babeljs.io/docs/en/babel-parser) has a a little differences with `swc` standard:

- `File` node exists;
- `Program` instead of `Module`;
- `loc` with `line` and `column` instead of `span`;
- `StringLiteral` has no `kind` an `hasEscape`;
- [`Identifier`](https://github.com/coderaiser/putout/blob/master/docs/the-book-of-ast.md#identifier) has no `optional` and uses `name` instead of `value`;
- `BlockStatement` has `body` instead of `stmts`;
- `VariableDeclarator` has no `optional` and `definite`;
- `CallExpression` has no `typeArguments`, `spread` and `expression` properties in `arguments`;
- `TemplateElement` has `value` field with `raw` and `cooked`;
- TypeScript ast nodes has prefix `TS` instead of `Ts`;
- `ExportNamedDeclaration` instead of `ExportDeclaration`;
- `ExportDefaultDeclaration` instead of `ExportDefaultExpression`;
- `VariableDeclaration` has no `declare` field;
- Has no `ParenthesisExpression`;
- `ClassDeclaration` and `ClassExpression` uses `id` instead of `identifier`, has `ClassBody`;
- `ClassMethod` uses `static` instead of `isStatic`;
- [`MemberExpression`](https://github.com/coderaiser/putout/blob/master/docs/the-book-of-ast.md#memberexpression) has `computed` property instead of `Computed` node in `property` field;
- `NewExpression` has no untyped node with a `spread` property in `arguments`, always has `arguments` field, instead of `null` when absent;
- `ArrayExpression` has no untyped node with a `spread` property in `elements`;
- `Function` has no `typeParameters`;
- `TSTypeReference` has no `typeParams` field;
- `TSTypeOperator` has `operator` instead of `op`;
- `TSTypeParameter` has a field `name` which is `string` instead of `Identifier`;
- `FunctionDeclaration` instead of `FunctionExpression` with `identifier` field;
- `ImportDeclaration` has `importKind` instead of `typeOnly` field;
- `ObjectProperty` instead of `KeyValueProperty`, `KeyValuePatternProperty` and `AssignmentPatternProperty`;
- `ExportNamedDeclaration` has `exportKind`, `specifiers` and `assertions` fields;
- `ExportSpecifier` has `local` which is never `null` instead of `orig`;
- `ExportDefaultDeclaration` has `declaration` instead of `decl`;
- `TSAnyKeyword` instead of `TSKeywordType`;
- `ObjectMethod` with `kind: get` instead of `GetterProperty`
- `ObjectMethod` with `kind: set` instead of `SetterProperty`
- etc...

`swc-to-babel` aims to smooth this differences.

## Install

```
npm i swc-to-babel
```

### Example

```js
const swc = require('@swc/core');
const toBabel = require('swc-to-babel');
const traverse = require('@babel/traverse').default;

const ast = toBabel(swc.parseSync(`
    const f = ({a}) => a;
`));

traverse({
    ObjectProperty(path) {
        console.log(path.value.name);
        // output
        'a';
    },
});
```

## API reference

```ts
/**
 * Convert an SWC ast to a babel ast
 * @param ast {Module} SWC ast
 * @param {string} [src=""] Source code
 * @returns {ParseResult<File>} Babel ast
 */
export default function toBabel(ast: Module, src?: string): ParseResult<File>;
```

## License

MIT
