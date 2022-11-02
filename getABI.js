const nodeAbi = require('node-abi');

nodeAbi.getAbi('7.2.0', 'node');
// '51'
console.log(nodeAbi.getAbi('12.0.16', 'electron'));
