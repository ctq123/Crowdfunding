<template>
<div class="content">
  <h3> 新书众筹</h3>
  <span>以最低的价格获取我的新书 </span>

  <!-- 众筹的总体状态  -->
  <div class="status">
    <div v-if="!closed">已众筹资金：<b>{{ total }} ETH </b></div>
    <div v-if="closed"> 众筹已完成 </div>
    <div>众筹截止时间：{{ endDate }}</div>
  </div>

  <!-- 当读者参与过，显示如下div  -->
  <div v-if="joined" class="card-bkg">
    <div class="award-des">
      <span> 参与价格 </span>
      <b> {{ joinPrice }} ETH </b>
    </div>

    <button :disabled="closed" @click="withdraw">赎回</button>
  </div>

  <!--  当读者还未参与时，显示如下div  -->
  <div v-if="!joined" class="card-bkg">
    <div class="award-des">
      <span> 当前众筹价格 </span>
      <b> {{ price }} ETH </b>
    </div>

    <button :disabled="closed" @click="join">参与众筹</button>
  </div>

  <!--  如果是创作者，显示 -->
  <div class="box" v-if="isAuthor">
    <div >
      <p :key="i" v-for="(item, i) in joinList" >
        <label> 地址：{{ item.address.substring(0, 30) + "..."  }}</label>
        金额：<b> {{ item.price }} </b>
      </p>
    </div>

    <button :disabled="closed" @click="withdrawFund"> 提取资金</button>
  </div>

</div>
</template>


<script>
import Web3 from "web3";
import contract from "truffle-contract";
import crowd from '../../build/contracts/CrowdfundingCamp.json';

export default {
  name: 'CrowdFund',
  data() {
    return {
      price: 0,
      total: 0,
      closed: true,
      joinPrice: 0,
      joined: false,
      endDate: "null",
      isAuthor: true,
      joinList: [],
    };
  },

  // 当前Vue组件被创建时回调的hook 函数
  async created() {
    try {
      // 初始化web3及账号
      await this.initWeb3Account()
      // 初始化合约实例
      await this.initContract()
      // 获取合约的状态信息
      await this.getCrowdInfo()

      // 获取后端的数据
      this.getJoins()
    } catch(e) {
      console.error('created e', e)
    }
  },

  methods: {

    // 初始化 web3及账号
    async initWeb3Account() {
      console.log("initWeb3Account", window.ethereum);
      if (window.ethereum) {
        this.provider = window.ethereum;
        try {
          this.web3 = new Web3(this.provider);
          console.log('web3', this.web3);
          // await window.ethereum.enable();
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log('accounts', accounts);
          this.account = accounts[0];
        } catch (error) {
          //   console.log("User denied account access");
        }
      } else if (window.web3) {
        this.provider = window.web3.currentProvider;
        this.web3 = new Web3(this.provider);
        try {
          const accounts = await this.web3.eth.getAccounts();
          this.account = accounts[0]
        } catch (error) {
          console.error('error', error);
        }
      } else {
        this.provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
        this.web3 = new Web3(this.provider);
        console.log('web3', this.web3);
        // await window.ethereum.enable();
        try {
          const accounts = await this.web3.eth.getAccounts();
          console.log("accounts", accounts);
          this.account = accounts[0]
        } catch (error) {
          console.error('error111', error);
        }
      }
    },

    // 初始化合约实例
    async initContract() {
      const crowdContract = contract(crowd);
      crowdContract.setProvider(this.provider);
      // console.log('crowdContract', crowdContract)
      try {
        this.crowdFund = await crowdContract.deployed();
        console.log("Contract deployed at:", this.crowdFund);
      } catch (error) {
        console.error("Error1111:", error);
      }
    },

    getPrice(c) {
      // console.log('c', c);
      const BN = this.web3.utils.BN;
      const b = this.web3.utils.isBN(c) ? c : new BN(c);
      return this.web3.utils.fromWei(b, 'ether')
    },

    setPrice(c) {
      const BN = this.web3.utils.BN;
      const b = this.web3.utils.isBN(c) ? c : new BN(c);
      return this.web3.utils.toWei(b, 'ether')
    },

    // 获取合约的状态信息
    async getCrowdInfo() {
      // 获取合约的余额
      this.web3.eth.getBalance(this.crowdFund.address).then(
        r => {
          this.total = this.getPrice(r) || 0
          console.log('r222', r, this.total);
        }
      );
      // 获取读者的参与金额， joined 在合约中是public 的状态变量，自动生成相应的访问器函数
      this.crowdFund.joined(this.account).then(
        r => {
          if (r > 0) {
            this.joined = true
            this.joinPrice = this.getPrice(r) || 0
            console.log('r111', r, this.joinPrice);
          }
        }
      );
     // 获取合约的关闭状态
      this.crowdFund.closed().then(
        r => this.closed = r
      );
      // 获取当前的众筹价格
      this.crowdFund.price().then(
        r => {
          this.price = this.getPrice(r) || 0
          console.log('r333', r, this.price);
        }
      );
      // 获取众筹截止时间
      this.crowdFund.endTime().then(r => {
        const futureDate = new Date();
        futureDate.setDate(new Date().getDate() + 3);
        let endTime = r ? new Date(r * 1000) : new Date(futureDate);
        // 把时间戳转化为本地时间
        this.endDate = endTime.toLocaleDateString().replace(/\//g, "-") + " " + endTime.toTimeString().substr(0, 8);
      });
      console.log('this.crowdFund', this.crowdFund)
      // 获取众筹创作者地址
      // const author = await this.crowdFund.author();
      // console.log('author', author)
      this.crowdFund.author().then(r => {
        console.log('this.account', this.account, r)
        // if (this.account == r) {
        //   this.isAuthor = true
        // } else {
        //   this.isAuthor = false
        // }
      });
    },

    // 读者点击参与众筹时调用
    join() {
      this.web3.eth.sendTransaction({
        from: this.account,
        to: this.crowdFund.address,
        value: this.setPrice(this.price)
      }).then(() =>
        this.getCrowdInfo()
      );
    },

    // 赎回
    withdraw() {
      this.crowdFund.withdraw(
        this.crowdFund.withdraw({
          from: this.account
        }).then(() => {
          this.getCrowdInfo()
        })
      );
    },

    // 提取资金
    withdrawFund() {
      this.crowdFund.withdrawFund({
        from: this.account
      }).then(() => {
        this.getCrowdInfo()
      })
    },

    // 获取众筹列表
    getJoins() {
      const crowdId = 1;
      fetch(`http://localhost:4000/api/get-history?crowdId=${crowdId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(res => {
          console.log('res', res)
          this.joinList = res.data
        })
        .catch((error) => {
          console.log(error);
        });
    },

  }
}
</script>