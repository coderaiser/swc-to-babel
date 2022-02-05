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
- `Identifier` has no `optional`;
- `VariableDeclarator` has no `optional` and `definite`;
- etc...

`swc-to-babel` aims to smooth this differences.

## Install

```
npm i swc-to-babel
```

### Example

```js
const cherow = require('cherow');
const toBabel = require('swc-to-babel');
const traverse = require('@babel/traverse').default;

const ast = toBabel(cherow.parse(`
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

## License

MIT
