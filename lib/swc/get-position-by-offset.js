'use strict';

const {entries} = Object;

function getPositionFromCache(offset, cache) {
    for (const {offset: prevOffset, line, column} of cache) {
        if (prevOffset > offset)
            continue;
        
        return {
            prevOffset,
            line,
            column,
        };
    }
    
    return {
        prevOffset: 0,
        line: 1,
        column: 0,
    };
}

module.exports.createPositionByOffset = (source) => {
    const cache = [];
    
    return (offset, source) => {
        const {
            prevOffset,
            line,
            column,
        } = getPositionFromCache(offset, cache);
        
        if (prevOffset === offset) {
            return {
                line,
                column,
            };
        }
        
        const result = getPositionByOffset(offset, source, {
            line,
            column,
            prevOffset,
        });
        
        cache.push({
            offset,
            ...result,
        });
        
        return result;
    };
};

function getPositionByOffset(
offset,
    source,
    {prevOffset, line, column}
) {
    let i = -1;
    const n = source.length;
    
    if (offset > source.length)
        throw Error('end cannot be more then length');
    
    while (i < offset) {
        ++i;
        
        if (source[i] === '\n') {
            ++line;
            column = 0;
            ++i;
            continue;
        }
        
        ++column;
    }
    
    return {
        line,
        column,
    };
}

module.exports.getPositionByOffset = (offset, source) => {
    let i = -1;
    const n = source.length;
    let line = 1;
    let column = -1;
    
    if (offset > source.length)
        throw Error('end cannot be more then length' + offset + ', ' + source.length);
    
    while (i < offset) {
        ++i;
        
        if (source[i] === '\n') {
            ++line;
            column = 0;
            ++i;
            continue;
        }
        
        ++column;
    }
    
    return {
        line,
        column,
    };
};

