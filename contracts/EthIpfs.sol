pragma solidity 0.8.1;

contract EthIpfs {
    
    string[] ipfsHashes;
 
    function addHash(string memory x) public {
        ipfsHashes.push(x);
    }

    function ipfsHashesCount() public view returns (uint256) {
        return ipfsHashes.length;
    }    

    function listHashes() public view returns (string[] memory) {
        return ipfsHashes;
    }
    
    function getHash() public view returns (string memory) {
        return ipfsHashes[ipfsHashes.length-1];
    }
}
