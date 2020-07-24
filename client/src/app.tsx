import React, { useState, useEffect } from 'react'
import { Provider } from 'mobx-react'
import Taro from '@tarojs/taro'

// component
import { View } from '@tarojs/components'

// store
import useStore from './store'

// service
import { login } from './service/user'

// style
import './app.scss'
import 'taro-ui/dist/style/index.scss'

const App = ({children}) => {
  const store = useStore()
  const initLogin = async () => {
    await Taro.login()
    const loginRes = await login()
    if (loginRes && loginRes.success && loginRes.data) {
      console.warn('login success!', loginRes.data)
      store.globalStore.changeLoginUser(loginRes.data)
    } else {
      console.warn('login fail!')
    }
  }
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
      initLogin()
    }
  }, [])

  return (
    <View className='app'>
      <Provider {...store}>
        {
          children
        }
      </Provider>
    </View>
  )
}

export default App
