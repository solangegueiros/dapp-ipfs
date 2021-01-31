//using the infura.io node, otherwise ipfs requires you to run a //daemon on your own computer/server.
const IPFS = require('ipfs-api');
//const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const ipfs = new IPFS("https://ipfs.infura.io:5001/api/v0/");
//https://ipfs.infura.io:5001/api/v0/

console.log ("ipfs: ", ipfs);

//run with local daemo
// const ipfsApi = require(‘ipfs-api’);
// const ipfs = new ipfsApi(‘localhost’, ‘5001’, {protocol:‘http’});

export default ipfs;