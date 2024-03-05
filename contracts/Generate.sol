pragma solidity 0.8.19;

contract Generate {
    struct Certificate{
        string name;
        string reg;
        uint valid_year;
        bool revoked;
        uint timestamp;
        bytes32 hash;
    }

    Certificate[] certificates;
    address owner;
    constructor(){
        owner = msg.sender;
    }

    function generateCertificate(string calldata name, string calldata reg, uint valid_year) external {
        uint timestamp = block.timestamp;
        bytes32 hash = keccak256(abi.encode(name, reg, valid_year, timestamp));
        certificates.push(Certificate(name,reg,valid_year,false,timestamp,hash));
    }

    function revoke(bytes32 hash) external {
        for (uint i = 0; i < certificates.length; i++) 
        {
            if (certificates[i].hash == hash) {
                certificates[i].revoked = true;
                break;
            }
        }
    }

    function verify(bytes32 hash) public view returns (bool) {
        for (uint i = 0; i < certificates.length; i++) 
        {
            if (certificates[i].hash == hash) {
                bool valid = ((block.timestamp / 31557600) + 1970) <= certificates[i].valid_year;
                return valid && !certificates[i].revoked;
            }
        }
        return false;
    }

    function getCertificates() public view returns(Certificate[] memory){
        return certificates;
    }
}