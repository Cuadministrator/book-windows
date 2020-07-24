const cloud = require('wx-server-sdk')

cloud.init({
  env: 'uat-3n1it',
  traceUser: true
})

export interface LoginReturn {
  openid: string;
  appid: string;
  unionid: string
}

exports.main = async (event: any): Promise<LoginReturn> => {
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}