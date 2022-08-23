import {ParseResult} from '@babel/parser';
import {File} from '@babel/types';
import type {Module} from '@swc/core';

declare module 'swc-to-babel' {
  function toBabel(ast: Module, src: string): ParseResult<File>;
  export default toBabel;
}
