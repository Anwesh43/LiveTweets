var w = window.innerWidth
var h = window.innerHeight
var canvas = document.createElement('canvas')
canvas.width = 3*w/4
canvas.height = 2*h/3
canvas.style.position = "absolute"
canvas.style.left = w/4
canvas.style.top = h/6
document.body.appendChild(canvas)
var currentTweetObj = {}
var tweetObjs = []
var ctx = canvas.getContext('2d')
var x = 0 ,y = 30
var socket = io.connect('http://localhost:8000/tweetStream')
function drawText(tweet) {
  ctx.font = "20px sans-seriff"
  ctx.fillStyle = 'black'
  var w = ctx.measureText(tweet.text).width
  var tokens = tweet.text.split(" ")
  var msg = ""
  for(var i=0;i<tokens.length;i++) {
      var token = tokens[i]
      var text_w = ctx.measureText(msg).width
      var tw = ctx.measureText(token).width
      if(text_w+tw<canvas.width*4/5) {
          msg = msg+token+" "
      }
      else {
          ctx.fillText(msg,canvas.width/9,y)
          y+=21
          msg = token
      }
  }
  ctx.fillText(msg,canvas.width/9,y)
}
function drawImage(tweet) {
    var profile = new Image()
    profile.src = tweet.profileImage
    profile.onload = function() {
        ctx.drawImage(profile,0,y-10,30,30)
    }
}
function drawUserName(tweet) {
    var userName = tweet.userName
    ctx.font = "15px sans-serif"
    ctx.fillStyle = "black"
    ctx.fillText(userName,10,y-20)
}
function drawTweet(tweet) {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawText(tweet)
    drawImage(tweet)
    drawUserName(tweet)
    tweetObjs.forEach((tweetObj)=>{
        y+=40
        drawText(tweetObj)
        drawImage(tweetObj)
        drawUserName(tweetObj)
    })
    tweetObjs.push(tweet)
    var tempTweets = tweetObjs
    tweetObjs = [tweet]
    tempTweets.forEach((prevtweet)=>{
      tweetObjs.push(prevtweet)
    })
    
}
socket.on('newTweet',function(tweet){
    console.log(tweet)
    y = 30
    drawTweet(tweet)
})
