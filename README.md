# crowdfunding
一个完整的应用，Ganache + Truffle开发智能合约，用户界面DApp，实现众筹功能

## 项目结构
```
crowdfunding
├── contracts
│   └── Crowdfunding.sol
├── migrations
│   └── 2_deploy_contracts.js
├── node_modules
├── public
│   ├── index.html
│   ├── favicon.ico
├── server
│   ├── index.js
│   └── routes
├── src
│   ├── assets
│   ├── components
│   ├── App.vue
│   ├── main.js
├── test
│   └── ..
├── .gitignore
├── babel.config.js
├── package.json
├── README.md
└── truffle-config.js
```

## 智能合约

#### 前置条件
若还没有安装truffle和ganache-cli的需要提前安装

```bash
npm install -g truffle@6.14.13
npm install -g ganache-cli@6.14.13
```
> node版本说明
> node@16.14.0
```
nvm use 16.14.0
```

若安装后，ganache-cli没生效，需要刷新下bash_profile
```
source ~/.bash_profile
```

若安装后，ganache-cli启动后，无法连接到truffle，需要修改truffle-config.js
```
networks: {
  development: {
    host: "127.0.0.1",     // Localhost (default: none)
    port: 8545,            // Standard Ethereum port (default: none)
    network_id: "*",       // Any network (default: none)
  },
}
```

#### 编译
```
truffle compile
```

#### 启动
新建一个窗口，启动服务
```
ganache-cli
```

#### 部署
```
truffle migrate
```

### 安装
```
yarn
```

### 运行
```js
// 启动前端
yarn serve
```


## 服务端

#### 前置条件
安装mysql

```bash
brew install mysql
```
另一种通过下载安装包进行安装，地址：https://downloads.mysql.com/archives/community/
选择自己的电脑对应的安装包，以及兼容的版本

安装完成后，启动，创建数据库
```bash
// 终端
mysql -u root -p
```

```bash
// 创建数据库
CREATE DATABASE database_name;
```

```bash
// 查看所有数据库
SHOW DATABASES;
```

### 安装
```
yarn
```

#### 运行
```js
// 启动服务
node index.js
```

