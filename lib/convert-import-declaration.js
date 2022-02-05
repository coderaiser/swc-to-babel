'use strict';

module.exports = (path) => {
    const {assertions = []} = path.node;
    path.node.assertions = assertions;
};
