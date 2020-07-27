const cloud = require('wx-server-sdk')

cloud.init({
  env: 'uat-3n1it'
})

const db = cloud.database()

exports.main = async (event) => {
  const { _id, role } = event
  const res = await db
    .collection('users')
    .where({ _id })
    .update({
      data: { role },
    })
  return res
}