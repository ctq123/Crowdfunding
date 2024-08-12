const setListener = () => {
  const { History } = require('./db');
  // 引入web库
  const Web3 = require('web3');
  // 使用WebSocket协议 连接节点
  const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

  // 获取合约实例
  var Crowdfunding = require('../build/contracts/CrowdfundingCamp.json');
  const crowdFund = new web3.eth.Contract(
    Crowdfunding.abi,
    Crowdfunding.networks[1723453756124].address
  );

  //  监听Join事件
  crowdFund.events.Join(async function(error, event) {
    if (error) {
      console.log(error);
    }

    // 打印出交易hash 及区块号
    console.log("交易hash:" + event.transactionHash);
    console.log("区块高度:" + event.blockNumber);

    // 获得监听到的数据：
    console.log("参与地址:" + event.returnValues.user);
    console.log("参与金额:" + event.returnValues.price);

    try {
      const { transactionHash: tx, blockNumber: blockNo } = event;
      const { user: address, price } = event.returnValues;
      const crowdId = 1;
      // 使用 GraphQL Mutation 创建用户
      const history = await History.create({ address, price, tx, blockNo, crowdId });
      console.log('History created:', history);
    } catch (error) {
      console.error('Error create-history:', error);
    }
  });
}

module.exports = {
  setListener
}