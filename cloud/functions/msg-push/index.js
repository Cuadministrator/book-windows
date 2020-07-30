// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'uat-3n1it',
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  const { name, phone, createDt } = event
  if (!(name && phone && createDt)) return false

  let touser = [wxContext.OPENID]
  const adminRes = await db.collection('users').where({role: 1}).get()
  if (adminRes && adminRes.data && adminRes.data.length > 0) {
    touser = [...touser, ...adminRes.data.map(item => item._openid)]
  }
  touser = [...new Set(touser)]

  touser.forEach(item => {
    cloud.openapi.subscribeMessage.send({
      touser: item,
      templateId: 'NB9mU7pksIbQaZ_xl4IGEFwH3zM7qsPr3gxK9-qEqGU',
      page: '/pages/index/index?current=1',
      data: {
        // 结果
        phrase18: { value: '处理中' },
        // 客户姓名
        name2: { value: name },
        // 预约项目
        thing8: { value: 'WELL金级办公室参观' },
        // 联系方式
        phone_number23: { value: phone },
        // 预约时间
        date17: { value: createDt },
      },
    })
  })

  return { data: null }
}