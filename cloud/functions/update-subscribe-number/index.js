const cloud = require('wx-server-sdk')

cloud.init({
  env: 'uat-3n1it'
})

const db = cloud.database()

exports.main = async (event) => {
  const { _id, subscribeNumber } = event
  const res = await db
    .collection('users')
    .where({ _id })
    .update({
      data: { subscribeNumber },
    })
  return res
}