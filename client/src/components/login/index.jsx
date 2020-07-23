import React, { useState } from 'react'
import Taro, { Component } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import { AtButton } from 'taro-ui'

// style
import './index.scss'

const Login = () => {
  const [context, setContext] = useState({})
  const getLogin = () => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then(res => {
        setContext(res.result)
      })
  }
  return (
    <View className='login-box'>
      <AtButton onClick={getLogin}>获取登录云函数</AtButton>
      <Text style={{width: '100%', flexWrap: 'wrap'}}>context：{JSON.stringify(context)}</Text>
    </View>
  )
}

export default Login
