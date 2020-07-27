const cloud = require('wx-server-sdk')

cloud.init({
  env: 'uat-3n1it',
  traceUser: true
})

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}