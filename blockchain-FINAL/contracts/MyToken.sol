// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {
    constructor() ERC721("MyToken", "MTK") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://media.istockphoto.com/id/1403814398/vector/pixel-art-footballer.jpg?s=612x612&w=0&k=20&c=AvPjPEdirDARAuC_usuVV_VXtKx5oeKkgUnNakAxGmw=";
    }
}