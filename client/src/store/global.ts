import { useLocalStore } from 'mobx-react'

export interface Global {
  appVersion: string
}

const global = () => {
  const store = useLocalStore(() => ({
    appVersion: '0.0.0',
    loginUser: null,
    changeLoginUser (value) {
      store.loginUser = value
    }
  }))
  return store
}

export default global