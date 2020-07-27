import React, { forwardRef, useState, useCallback, useImperativeHandle } from 'react'
import { View, ScrollView, Text, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'

import { AtInput, AtInputNumber, AtList, AtListItem, AtButton, AtToast } from 'taro-ui'

// service
import { addBook, getBookRemain } from '../../service/book'

// config
import { bookDtEnum, bookTimeEnum } from './config'
import { tempMessage } from '../../config'

import './index.scss'

interface BookDtEnum {
  id: number
  name: string
  value: string
}

interface IProps {
}

const Book = forwardRef((props: IProps, ref) => {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')
  const [email, setEmail] = useState('')
  const [bookNumber, setBookNumber] = useState(0)
  const [pickerValue, setPickerValue] = useState([0, 0])
  const [bookDt, setBookDt] = useState<BookDtEnum[] | null>(null)
  const [remainNumber, setRemainNumber] = useState(0)
  const [tostText, setToastText] = useState('123123')
  const [tostVisible, setToastVisible] = useState(false)

  const onBookDtChange = useCallback(
    async (e) => {
      const { value } = e.detail
      const bookDt = [bookDtEnum[value[0]], bookTimeEnum[value[1]]]
      const bookDate = dayjs(bookDt.map(item => item.value).join('')).toDate()
      const remainRes = await getBookRemain(bookDate)
      if (remainRes && remainRes.success && remainRes.data && remainRes.data.remain) {
        setRemainNumber(remainRes.data.remain)
      } else {
        showToast(remainRes.message)
      }
      setPickerValue(value)
      setBookDt(bookDt)
    },
    [],
  )
  const submit = useCallback(
    async () => {
      if (!name) return showToast('请填写姓名')
      if (!company) return showToast('请填写公司')
      if (!position) return showToast('请填写职位')
      if (!phone) return showToast('请填写电话')
      if (!email) return showToast('请填写邮箱')
      if (!bookDt) return showToast('请填写预约时间')
      if (!bookNumber) return showToast('请填写预约人数')
      const bookTime = dayjs(bookDt.map(item => item.value).join(''))
      const startDt = bookTime.toDate()
      const endDt = bookTime.add(1, 'hour').toDate()
      await Taro.requestSubscribeMessage({
        tmplIds: tempMessage
      })
      const res = await addBook(
        name,
        company,
        phone,
        position,
        email,
        bookNumber,
        startDt,
        endDt,
      )
      if (res && res.success && res.data) {
        showToast('预约成功')
        Taro.cloud.callFunction(
          {
            name: 'msg-push',
            data: {
              // 客户姓名
              name,
              // 预约项目
              projectName: `${bookNumber}人`,
              // 联系方式
              phone,
              // 预约时间
              createDt: `${dayjs(startDt).format('YYYY-MM-DD HH:mm:ss')}~${dayjs(endDt).format('HH:mm:ss')}`,
            }
          }
        )
        resetData()
      } else {
        showToast(res.message)
      }
    },
    [name, company, position, phone, email, bookDt, bookNumber],
  )

  const resetData = useCallback(
    () => {
      setName('')
      setCompany('')
      setPhone('')
      setPosition('')
      setEmail('')
      setBookNumber(0)
      setPickerValue([0, 0])
      setBookDt(null)
      setRemainNumber(0)
    },
    [],
  )

  useImperativeHandle(ref, () => ({
    resetData: () => {
      resetData()
    }
  }))
  
  const showToast = useCallback(
    (text) => {
      setToastText(text)
      setToastVisible(true)
    },
    [setToastText, setToastVisible],
  )
  return (
    <ScrollView className='page-form'>
      <AtInput
        name='name'
        title='姓名'
        type='text'
        placeholder='请填写姓名'
        value={name}
        onChange={(value: string) => setName(value)}
      />
      <AtInput
        name='company'
        title='公司'
        type='text'
        placeholder='请填写公司'
        value={company}
        onChange={(value: string) => setCompany(value)}
      />
      <AtInput
        name='position'
        title='职位'
        type='text'
        placeholder='请填写职位'
        value={position}
        onChange={(value: string) => setPosition(value)}
      />
      <AtInput
        name='phone'
        title='电话'
        type='phone'
        placeholder='请填写电话'
        value={phone}
        onChange={(value: string) => setPhone(value)}
      />
      <AtInput
        name='email'
        title='邮箱'
        type='text'
        placeholder='请填写邮箱'
        value={email}
        onChange={(value: string) => setEmail(value)}
      />
      <Picker
        mode='multiSelector'
        range={[bookDtEnum, bookTimeEnum]}
        rangeKey='name'
        value={pickerValue}
        onChange={onBookDtChange}
        onCancel={() => {}}
      >
        <AtList hasBorder={false}>
          <AtListItem title='预约时间' note={bookDt ? bookDt.map(item => item.name).join(' ') : '请选择'} arrow='right' />
        </AtList>
      </Picker>
      <View className='list-item'>
      <Text className='list-item-title'>预约人数 (剩余{remainNumber}人)</Text>
        <AtInputNumber
          min={0}
          max={remainNumber}
          type='number'
          step={1}
          value={bookNumber}
          onChange={(value: number) => setBookNumber(value)}
        />
      </View>
      <View className='btn-box'>
        <AtButton className='btn-submit' type='primary' size='normal' onClick={submit}>提交</AtButton>
        <AtButton className='btn-reset' type='secondary' size='normal' onClick={resetData}>重置</AtButton>
      </View>
      <AtToast
        isOpened={tostVisible}
        onClose={() => setToastVisible(false)}
        text={tostText}
        duration={2000}
      ></AtToast>
    </ScrollView>
  )
})

export default Book
