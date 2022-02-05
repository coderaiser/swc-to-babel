'use strict';

const {assign} = Object;

module.exports = (path) => {
    const {assertions = []} = path.node;
    
    assign(path.node, {
        assertions,
    });
};
