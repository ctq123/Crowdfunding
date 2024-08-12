// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract CrowdfundingCamp {
    // 创作者
    address public author;
    // 参与金额
    mapping(address => uint) public joined;
    // 众筹目标
    uint constant Target = 10 ether;
    // 众筹截止时间
    uint public endTime;
    // 记录当前众筹价格
    uint public price = 0.02 ether;
    // 作者提取资金之后，关闭众筹
    bool public closed = false;

    // address[] joinAccouts;
    event Join(address indexed user, uint price);

    // 部署合约时调用，初始化作者及众筹结束时间
    constructor() {
        author = msg.sender;
        endTime = block.timestamp + 30 days;
    }
    // 更新价格，这是一个内部函数
    function updatePrice() internal {
        uint rise = address(this).balance / 1 ether * 0.002 ether;
        price = 0.02 ether + rise;
    }

    // 用户向合约转账时，触发的回调函数
    receive() external payable {
        // 众筹已结束
        require(block.timestamp < endTime && !closed , "The crowdfunding has ended");
        // 你已经参与过众筹
        require(joined[msg.sender] == 0, "You've already participated in crowdfunding");
        // 出价太低了
        require(msg.value >= price, "The bid is too low");
        joined[msg.sender] = msg.value;
        updatePrice();

        emit Join(msg.sender, msg.value);
    }
    // 作者提取资金
    function withdrawFund() external {
        // 你不是作者
        require(msg.sender == author, "You are not the author");
        // 未达到众筹目标
        require(address(this).balance >= Target, "The crowdfunding goal was not reached");
        closed = true;
        payable(msg.sender).transfer(address(this).balance);
    }
    // 读者赎回资金
    function withdraw() external {
        // 还未到众筹结束时间
        require(block.timestamp > endTime, "It's not the end of the crowdsale yet");
        // 众筹达标， 众筹资金已提取
        require(!closed, "The crowdfunding has reached the standard, and the crowdfunding funds have been withdrawn");
        // 众筹达标，你没法提取资金
        require(Target > address(this).balance, "If the crowdfunding is reached, you can't withdraw the funds");
        payable(msg.sender).transfer(joined[msg.sender]);
    }
}
