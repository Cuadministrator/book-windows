interface RequestResponse {
  data: any;
  success: boolean;
  message: string
}

export const dbRequestResponse = (res: any): RequestResponse => {
  let result: RequestResponse = {
    data: null,
    success: false,
    message: '网络错误'
  }
  if (!res) return result
  const { data, errMsg } = res
  if (data) {
    result.success = true
    result.data = data
  }
  if (errMsg) {
    result.message = errMsg
  }
  return result
}