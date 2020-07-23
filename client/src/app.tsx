import React, { useEffect } from 'react'
import { Provider } from 'mobx-react'
import Taro from '@tarojs/taro'

// store
import useStore from './store'
// style
import './app.scss'
import 'taro-ui/dist/style/index.scss'

const App = ({children}) => {
  const store = useStore()
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }, [])

  return (
    <Provider {...store}>
      {
        children
      }
    </Provider>
  )
}

export default App
