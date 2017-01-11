var streamDataUtil = require('./streaming_data_util')
var express = require('express')
var path = require('path')
var expressServer = express()
expressServer.use(express.static(path.join(__dirname,'public')))
var http = require('http')
var server = http.createServer(expressServer)
var socketIo = require('socket.io')
var io = socketIo(server)


io.of('/tweetStream').on('connection',(socket)=>{
  var streamTweets = []
  setInterval(()=>{
      if(streamTweets.length>0) {
        var data = streamTweets[0]
        var tweet = {}
        var entities = data.entities
        var text = data.text
        tweet.text = text
        tweet.entities = entities
        console.log(entities)
        var user = data.user
        var profileImage = user.profile_image_url
        var userName = user.name
        var userScreenName = user.screen_name
        tweet.profileImage = profileImage
        tweet.userScreenName = userScreenName
        tweet.userName = userName
        socket.emit('newTweet',tweet)
        streamTweets.splice(0,1)
      }
  },10000)
  console.log('connected to a client')
  var stream = streamDataUtil.getStream('#RahulDravid')
  stream.on('data',(streamTweet)=>{
      streamTweets.push(streamTweet)
  })
})
server.listen(8000)
