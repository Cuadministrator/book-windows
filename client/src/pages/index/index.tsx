import React, { useRef, forwardRef, useEffect, useState, useCallback } from 'react'
import { View } from '@tarojs/components'
import { inject, useObserver, observer } from 'mobx-react'
import { AtTabBar, AtTabs, AtTabsPane } from 'taro-ui'

// components
import Mine from '../mine'
import Book from '../book'
import Record from '../record'
import User from '../user'

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
  current: number
}

const Index = inject('globalStore')(observer(forwardRef((props: IProps, ref) => {
  const [initEnd, setInitEnd] = useState(false)
  const [current, setCurrent] = useState(props.current || 0)
  const [tabList, setTabList] = useState<TabItem[]>(userRoleEnum[2].tab)
  const bookRef = useRef<any>(null)
  const recordRef = useRef<any>(null)
  const userRef = useRef<any>(null)
  const mineRef = useRef<any>(null)

  useEffect(() => {
    setInitEnd(false)
    setTabList(
      userRoleEnum[
        props.globalStore.loginUser?.role || 3
      ].tab
    )
    setInitEnd(true)
  }, [props.globalStore.loginUser])

  const onAtTabBarPress = useCallback(
    async (index) => {
      if (tabList[index].id === 'book') {
      } else if (tabList[index].id === 'record') {
        if (recordRef.current) {
          recordRef.current.initData()
        }
      } else if (tabList[index].id === 'user') {
        if (userRef.current) {
          userRef.current.initData()
        }
      } else if (tabList[index].id === 'mine') {
      }
      setCurrent(index)

    },
    [recordRef, tabList, userRef],
  )

  if (!initEnd) return useObserver(() => null)

  return useObserver(() => (
    <View className='page-home'>
      <AtTabs
        current={current}
        tabList={[]}
        height='100%'
        onClick={onAtTabBarPress}
      >
        {
          tabList.map((item, index) => {
            if (item.id === 'book') {
              return (
                <AtTabsPane className='at-tab-pan' current={current} index={index} >
                  <Book ref={bookRef} />
                </AtTabsPane>
              )
            } else if (item.id === 'record') {
              return (
                <AtTabsPane className='at-tab-pan' current={current} index={index}>
                  <Record ref={recordRef} />
                </AtTabsPane>
              )
            } else if (item.id === 'user') {
              return (
                <AtTabsPane className='at-tab-pan' current={current} index={index}>
                  <User ref={userRef} />
                </AtTabsPane>
              )
            } else if (item.id === 'mine') {
              return (
                <AtTabsPane className='at-tab-pan' current={current} index={index}>
                  <Mine ref={mineRef} globalStore={props.globalStore} />
                </AtTabsPane>
              )
            } else {
              return null
            }
          })
        }
      </AtTabs>
      <AtTabBar
        current={current}
        tabList={tabList}
        fontSize={12}
        onClick={onAtTabBarPress}
      />
    </View>
  ))
})))

export default Index
