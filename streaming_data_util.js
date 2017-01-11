var util = {}
var client = require('./twitter-client')
util.getStream = (data)=>{
  return client.stream('statuses/filter',{track:data})
}
module.exports = util
