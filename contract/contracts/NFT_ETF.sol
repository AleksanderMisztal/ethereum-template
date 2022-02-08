//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract NFT_ETF is ERC20, IERC721Receiver {
    
    // Create the erc20 with name, symbol, and initial supply
    // All tokens are initially sent to the contract creator
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    // This is necessary to be able to receive NFTs
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // Modifier used on subsequent functions
    // Ensures that only the person owning all the tokens can access ETF's underlying resources
    modifier exclusiveOwnerOnly() {
        require(this.balanceOf(msg.sender) == this.totalSupply());
        _;
    }

    // Transfer the NFT to exclusive owner
    function extractERC721(address nftContractAddress, uint tokenId) public exclusiveOwnerOnly {
        ERC721 nftContract = ERC721(nftContractAddress);
        nftContract.safeTransferFrom(address(this), address(msg.sender), tokenId);
    }

    // Transfer the ether to exclusive owner
    function extractEther(uint amount) public exclusiveOwnerOnly {
        require(amount <= address(this).balance);
        msg.sender.call{value: amount}("");
    }

    // Transfer the erc20 to exclusive owner
    function extractERC20(address erc20ContractAddress, uint amount) public exclusiveOwnerOnly {
        ERC20 erc20Contract = ERC20(erc20ContractAddress);
        require(amount <= erc20Contract.balanceOf(address(this)));
        erc20Contract.transfer(msg.sender, amount);
    }
}
