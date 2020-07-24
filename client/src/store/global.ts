import { useLocalStore } from 'mobx-react'

export interface ILoginUser {
  avatarUrl: string;
  createDt: Date;
  name: string;
  role: number;
  _id: string;
}

export interface Global {
  appVersion: string
  loginUser: ILoginUser | null
  changeLoginUser: (value: ILoginUser) => void
}

const global = () => {
  const store = useLocalStore((): Global => ({
    appVersion: '0.0.0',
    loginUser: null,
    changeLoginUser (value: any) {
      store.loginUser = value
    }
  }))
  return store
}

export default global