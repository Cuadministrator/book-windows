import React, { useRef, forwardRef, useEffect, useState, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { inject, useObserver, observer } from 'mobx-react'
import {
  AtTabBar,
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtMessage,
} from 'taro-ui'

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
  const [modalVisible, setModalVisible] = useState(true)
  const bookRef = useRef<any>(null)
  const recordRef = useRef<any>(null)
  const userRef = useRef<any>(null)
  const mineRef = useRef<any>(null)

  useEffect(() => {

  }, [])

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

  const showMessage = useCallback(
    (message: '正在加载中', type: 'info') => {
      Taro.atMessage({
        message: message,
        type: type,
      })
    },
    []
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
                  <Book ref={bookRef} showMessage={showMessage} />
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
                  <User ref={userRef} showMessage={showMessage} />
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
      <AtModal
        isOpened={modalVisible}
      >
        <AtModalHeader>
          <View className='modal-header'>西格林科技</View>
          <View className='modal-header'>WEST GREEN TECH</View>
        </AtModalHeader>
        <AtModalContent>
          {
            [
              'westgreen office是四川省西格林科技有限公司的办公基地，项目位于成都国际科技节能大厦A座703-704,项目获得成都首个国际WELL健康建筑认证金级和LEED O+M铂金级认证以及成都房地产绿色发展示范奖。项目直观展示了WELL健康办公的十大概念对应场景，高度体现了WELL以人为本的核心理念。',
              '成都国际科技节能大厦是由中国节能在西南地区开发的绿色建筑示范性项目，获得LEED金级认证+绿色建筑二星认证（设计&运营标识）。整个项目建筑按国内外领先的绿色建筑标准，整体综合集成了国内外多种节能建筑技术和新能源应用技术。',
              '公司以人为本的设计理念贯穿到整个Westgreen office，项目将WELL标准的十大概念（空气、水、光环境、营养、热舒适、声环境、材料、社区、精神、运动）充分融入到办公环境，例如：办公室室内污染物常年保持在0.2ppm以内，提供纯净的水源和果蔬、提供符合人体工学所设计的工位，提供冥想室、健身区、电话亭等空间。',
              '为了积极响应国家健康中国2030目标，westgreen秉承开放共享的发展理念，一直致力于推动健康人居环境，积极分享绿色健康领域实践成果，欢迎更多志同道合的伙伴到访西格林参观交流，共同探讨绿色健康美好人居！',
              'westgreen office期待您的到来！'
            ].map((item, index) =>
              <View key={index} className='modal-context'>{item}</View>
            )
          }
        </AtModalContent>
        <AtModalAction>
          <Button
            onClick={() => { setModalVisible(false) }}
          >进入预约</Button>
        </AtModalAction>
      </AtModal>
      <AtMessage />
    </View>
  ))
})))

export default Index
