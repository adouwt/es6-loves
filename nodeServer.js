import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import logger from "./core/logger/app-logger"
import morgan from "morgan"
import config from "./core/config/config.dev"
import { getRouter, postRouter } from "./routes/indexRouter.js"
import connectToDb from "./db/connect"

import connectRedis from "./db/redis"

const port = config.serverPort
logger.stream = {
  write: function(message, encoding) {
    logger.info(message)
  }
}

connectToDb()
connectRedis()

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan("dev", { stream: logger.stream }))

// 挂在路由 /get 是一级路由  转到 ./routes/* 中来 里面的 /* 是子路由，完整的路由 /get/*
app.use("/get", getRouter)
app.use("/post", postRouter)

//Index route
app.get("/", (req, res) => {
  res.send("对不起您访问的路径不正确，请核对访问地址！")
})

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

// 为socket.io 准备一个服务
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
    // chats 服务端和客户端要一致，作为一个聊天房间，如何一致，前端告知和某个用户连接，然后传递给后端?
    // 我 和 我的好友只要发起聊天，数据库存在一条聊天室id,之后不管谁先发起聊天，都是这个聊天室，进入聊天室可以获取
    // 历史信息，信息保存7（）天，删除该聊天室id;聊天室id = 我id + 好友id(或者好友id+我id) ，将聊天内容保存进mongo(后期用redis 缓存信息时间为两分钟)
    // 区分你 我， 进入聊天室传递ID  聊天室id = 我id + 好友id   根据前面的一个id,设置 isMe 字段为 true
    socket.on("chats",function (msg) {
        //把接受到的信息在返回到页面中去 （广播）
        console.log(msg)
        io.emit("chats",msg);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


app.listen(port, () => {
  logger.info("server started - ", port)
  logger.info("项目已经启动：", `http://localhost:${port}`)
})
