import React, { forwardRef } from 'react'
import { View } from '@tarojs/components'
import { inject, useObserver } from 'mobx-react'

// components
import Login from '../../components/login'
import UserInfo from '../../components/userInfo'

// store
import { Global } from '../../store/global'

import './index.scss'

interface IProps {
  globalStore: Global
}

const Index = inject(store => store)(forwardRef((props: IProps, ref) => {
  return useObserver(() => (
    <View className='page-mine'>
      {
        !props.globalStore.loginUser
          ? <Login globalStore={props.globalStore} />
          : <UserInfo globalStore={props.globalStore} />
      }
    </View>
  ))
}))

export default Index
