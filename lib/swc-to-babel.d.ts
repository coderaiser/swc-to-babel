import {ParseResult} from '@babel/parser';
import {File} from '@babel/types';
import type {Module} from '@swc/core';

export default function toBabel(ast: Module, src: string): ParseResult<File>;
