import React, { forwardRef, useCallback } from 'react'
import { View } from '@tarojs/components'
// components
import Login from '../../components/login'
import UserInfo from '../../components/userInfo'

// store
import { Global } from '../../store/global'

import './index.scss'

interface IProps {
  globalStore: Global
}

const Mine = forwardRef((props: IProps, ref) => {
  return (
    <View className='page-mine'>
      {
        !props.globalStore.loginUser
          ? <Login globalStore={props.globalStore} />
          : <UserInfo globalStore={props.globalStore} />
      }
    </View>
  )
})

export default Mine
