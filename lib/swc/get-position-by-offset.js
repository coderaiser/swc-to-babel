'use strict';

module.exports.getPositionByOffset = (offset, source) => {
    let line = 1;
    let column = 0;
    
    for (let i = 0; i < offset; i++) {
        if (source[i] === '\n' && i !== offset - 1) {
            line++;
            column = 0;
        } else {
            column++;
        }
    }
    
    return {
        line,
        column,
        index: offset - 1,
    };
};
