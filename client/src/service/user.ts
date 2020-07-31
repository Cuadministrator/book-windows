import Taro from '@tarojs/taro'

import { dbRequestResponse } from './index'

export const login = async (
  name?: string,
  avatarUrl?: string
) => {
  const userRes = await getUserInfo()
  if (userRes && userRes.success && userRes.data) {
    return userRes
  } else {
    if (name && avatarUrl) {
      const userRes = await addUser(name, 2, avatarUrl)
      if (userRes.success && userRes.data) {
        return userRes
      }
    } else {
      const userInfoRes = await Taro.getUserInfo()
      if (userInfoRes && userInfoRes.userInfo) {
        const { nickName, avatarUrl: headerImg } = userInfoRes.userInfo
        const userRes = await addUser(nickName, 2, headerImg)
        if (userRes.success && userRes.data) {
          return userRes
        }
      }
    }
  }
  return dbRequestResponse(null)
}


export const addUser = async (name, role, avatarUrl?) => {
  const db = Taro.cloud.database()
  const res = await db.collection('users').add({
    data: {
      name,
      avatarUrl,
      role,
      subscribeNumber: 0,
      createDt: new Date()
    }
  })
  if (res && res._id) {
    const userRes = await searchUser({_id: res._id})
    if (userRes.success && userRes.data && userRes.data.length > 0) {
      userRes.data = userRes.data[0]
      return userRes
    }
  }
  return dbRequestResponse(res)
}

export const searchUser = async (params = {}, config?) => {
  const db = Taro.cloud.database()
  const MAX_LIMIT = 20
  const countRes = await db.collection('users').where(params).count()
  const total = countRes.total
  if (total === 0) return dbRequestResponse({data: [], errMsg: '无有效用户'})
  // 计算分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  let tasks: Promise<Taro.DB.Query.IQueryResult>[] = []
  for (let i = 0; i< batchTimes; i++) {
    tasks.push(
      db
        .collection('users')
        .where(params)
        .orderBy('role', 'asc')
        .orderBy('createDt', 'asc')
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .get()
    )
  }
  const promises = (await Promise.all(tasks))
  const res = promises.reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg
  }))
  if (res && res.data && res.data.length > 0) {
    res.data.forEach((item, index) => {
      if (!(config && config.stopDefault)) {
        delete res.data[index]._openid
        delete res.data[index].createDt
      }
    })
  }
  return dbRequestResponse(res)
}

export const getUserInfo = async () => {
  const userRes = await searchUser({_openid: '{openid}'})
  if (userRes && userRes.success && userRes.data && userRes.data.length > 0) {
    const user = userRes.data[0]
    return dbRequestResponse({data: user, errMsg: ''})
  }
  return dbRequestResponse(null)
}

export const modifyUserRole = async (_id: string, role: number) => {
  const res: any = await Taro.cloud.callFunction(
    { name: 'update-role', data: { _id, role } }
  )
  if (res && res.result && res.result.stats && res.result.stats.updated === 1) {
    return dbRequestResponse({data: true, errMsg: '修改成功'})
  }
  return dbRequestResponse({data: null, errMsg: '修改失败'})
}

export const modifyUserSubscribeNumber = async (_id: string, subscribeNumber: number) => {

  const res: any = await Taro.cloud.callFunction(
    { name: 'update-subscribe-number', data: { _id, subscribeNumber } }
  )
  if (res && res.result && res.result.stats && res.result.stats.updated === 1) {
    return dbRequestResponse({data: true, errMsg: '修改成功'})
  }
  return dbRequestResponse({data: null, errMsg: '修改失败'})
}
