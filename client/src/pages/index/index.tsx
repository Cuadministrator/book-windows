import React, { forwardRef, useEffect, useState, useCallback } from 'react'
import { View } from '@tarojs/components'
import { inject, useObserver } from 'mobx-react'
import { AtTabBar } from 'taro-ui'

// components
import Mine from '../mine'

// store
import { Global } from '../../store/global'

// config
import { userRoleEnum } from '../../config'

import './index.scss'

interface TabItem {
  id: string;
  title: string;
  iconType: string;
  iconPrefixClass?: string;
}

interface IProps {
  globalStore: Global
}

const Index = inject(store => store)(forwardRef((props: IProps, ref) => {
  const [current, setCurrent] = useState(0)
  const [tabList, setTabList] = useState<TabItem[]>(userRoleEnum[1].tab)

  useEffect(() => {
    setTabList(
      userRoleEnum[
        props.globalStore.loginUser?.role || 1
      ].tab
    )
  }, [props.globalStore.loginUser?.role])

  const onAtTabBarPress = useCallback(
    async (index, event) => {
      console.warn('event', event)
      setCurrent(index)
    },
    [],
  )

  return useObserver(() => (
    <View className='page-home'>
      <View className='body'>
        {
          tabList[current].id === 'mine' &&
          <Mine globalStore={props.globalStore} />
        }
      </View>
      <AtTabBar
        current={current}
        tabList={tabList}
        fontSize={12}
        onClick={onAtTabBarPress}
      />
    </View>
  ))
}))

export default Index
