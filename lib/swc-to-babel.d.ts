import type {ParseResult} from '@babel/parser';
import type {File} from '@babel/types';
import type {Module} from '@swc/core';

/**
 * Convert an SWC ast to a babel ast
 * @param ast {Module} SWC ast
 * @param {string} [src=""] Source code
 * @returns {ParseResult<File>} Babel ast
 */
export default function toBabel(ast: Module, src?: string): ParseResult<File>;
