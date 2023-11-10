// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
import "hardhat/console.sol";


// DEPLOYED CONTRACT ADDRESS = 0x6Acc99AE69736701d5d4988a7B5A5D5ad52992c9
contract BuyMeACoffee {
    // Event to emit when a Memo is creazed
    event NewMemo(
        address indexed from, 
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo {
        address from; // sender of an Memo
        uint256 timestamp; // timestamp created
        string name; // name of an sender
        string message; // message he is leaving
    }

    // List of all memos (list of the Structs) received from friends
    Memo[] memos;

    // Address of contract deployer
    address payable owner;

    // Runs only once, when smart contract is deployed
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the coffee buyer
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can not buy coffee with 0 ETH.");

        // Create new Memo and save it in list of memos
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a log event when new memo is created!
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }


    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
        //address(this).balance; // this contract's address, and balance
        require(owner.send(address(this).balance)); // send contract's money to the owner
    }


    /**
     * @dev retriee all the memos received and stored on the blockchain
     */
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
}
