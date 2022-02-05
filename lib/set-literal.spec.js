'use strict';

const test = require('supertape');
const setLiteral = require('./set-literal');

test('estree-to-babel: setLiteral: unknown', (t) => {
    const type = 'Unknown';
    const node = {
        type,
    };
    
    setLiteral(node);
    
    t.equal(node.type, type);
    t.end();
});

