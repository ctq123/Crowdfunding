const Koa = require('koa');
const Router = require('koa-router');
const { ApolloServer } = require('apollo-server-koa');
const { typeDefs, resolvers } = require('./user-schema');
const { sequelize, User } = require('./db');

// 创建 Koa 应用实例
const app = new Koa();
const router = new Router();

// 同步数据库模型
sequelize.sync()
  .then(() => console.log('Tables have been created.'))
  .catch(err => console.log('Error: ' + err));

// 创建 Apollo Server 实例
async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); // 确保 Apollo Server 启动
  server.applyMiddleware({ app });

  router.get('/', async (ctx) => {
    ctx.body = 'Hello World!';
  })
  
  // 定义路由来处理前端路径数据
  router.post('/create-user', async (ctx) => {
    const { username, email } = ctx.request.body;

    // 确保请求体中包含所需的字段
    if (!username || !email) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Username and email are required'
      };
      return;
    }
  
    // 使用 GraphQL Mutation 创建用户
    const user = await User.create({ username, email });
  
    ctx.body = {
      success: true,
      data: user,
    };
  });

  // 将路由应用到 Koa 应用
  app
    .use(router.routes())
    .use(router.allowedMethods());

  // 启动 Koa 服务器
  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

// 启动服务器
startServer();
