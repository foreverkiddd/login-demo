const express = require('express')
const app = express()

app.listen(7777)

const userRouter = require('./users') // user-demo 파일 소환
const channelRouter = require('./routes/channels') // channel-demo 파일 소환

app.use("/", userRouter)
app.use("/channels", channelRouter)