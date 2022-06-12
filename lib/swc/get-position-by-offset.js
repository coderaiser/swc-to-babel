'use strict';

module.exports.getPositionByOffset = (offset, source) => {
    let i = -1;
    let line = 1;
    let column = -1;
    
    if (offset > source.length)
        throw Error('end cannot be more then length ' + offset + ', ' + source.length);
    
    while (i < offset - 1) {
        ++i;
        ++column;
    }
    
    return {
        line,
        column,
    };
};

