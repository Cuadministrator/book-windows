import { useLocalStore } from 'mobx-react'

export interface Global {
  appVersion: string
}

const global = () => {
  const store = useLocalStore(() => ({
    appVersion: '0.0.0'
  }))
  return store
}

export default global