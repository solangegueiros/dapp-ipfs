const IPFS = require('ipfs-api');

//https://ipfs.infura.io:5001/api/v0/
//const ipfs = new IPFS("https://ipfs.infura.io:5001/api/v0/");

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
console.log ("ipfs: ", ipfs);

// or local
// const ipfsApi = require('ipfs-api');
// const ipfs = new ipfsApi('localhost', '5001', {protocol:'http'});

export default ipfs;