import {File, ParseResult} from '@putout/babel';
import type {Module} from '@swc/core';

/**
 * Convert an SWC ast to a babel ast
 * @param ast {Module} SWC ast
 * @param {string} [src=""] Source code
 * @returns {ParseResult<File>} Babel ast
 */
export default function toBabel(ast: Module, src?: string): ParseResult<File>;
