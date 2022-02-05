'use strict';

module.exports.convertTSClassImplements = (path) => {
    path.node.type = 'TSExpressionWithTypeArguments';
};

module.exports.convertPropertyDefinition = (path) => {
    const {node} = path;
    
    if (node.key.type === 'PrivateIdentifier') {
        const {key} = node;
        
        node.type = 'ClassPrivateProperty';
        node.key = createPrivateName(key);
        
        return;
    }
    
    path.node.type = 'ClassProperty';
};

module.exports.convertTSInterfaceHeritage = (path) => {
    path.node.type = 'TSExpressionWithTypeArguments';
    
    let {expression} = path.node;
    
    while (expression.type === 'MemberExpression') {
        const {object, property} = expression;
        
        expression.type = 'TSQualifiedName';
        expression.left = object;
        expression.right = property;
        
        delete expression.object;
        delete expression.property;
        
        expression = object;
    }
};

module.exports.convertPrivateIdentifier = (path) => {
    path.replaceWith(createPrivateName(path.node));
};

module.exports.convertTSAbstractMethodDefinition = (path) => {
    const {node} = path;
    
    const {
        generator,
        async,
        params,
        id,
        returnType,
    } = node.value;
    
    const newNode = {
        ...node,
        abstract: true,
        generator,
        async,
        params,
        id,
        returnType,
        type: 'TSDeclareMethod',
    };
    
    delete newNode.value;
    
    path.replaceWith(newNode);
};

function createPrivateName(node) {
    return {
        type: 'PrivateName',
        id: {
            ...node,
            type: 'Identifier',
        },
    };
}
