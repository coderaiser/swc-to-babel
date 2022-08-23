import {ParseResult} from '@babel/parser';
import {File} from '@babel/types';
import {parseSync} from '@swc/core';
import toBabel from '../';

const code = 'const f = ({a}) => a;';

const result: ParseResult<File> = toBabel(parseSync(code), code);
