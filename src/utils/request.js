import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import util from '@utils/util'
import {
  message
} from 'ant-design-vue'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.delete['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.patch['Content-Type'] = 'application/json;charset=UTF-8'

// 创建一个错误
function errorCreat(msg) {
  const err = new Error(msg)
  errorLog(err)
  throw err
}

// 记录和显示错误
function errorLog(err) {
  // 添加到日志
  store.dispatch('log/add', {
    type: 'error',
    err,
    info: '数据请求异常'
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(err)
  }
}


// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API, // api base_url
  timeout: 5000 // 请求超时时间
})

const err = (error) => {
  if (error && error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    switch (error.response.status) {
      case 400:
        error.message = '请求错误'
        break
      case 401:
        error.message = '未授权，请登录'
        break
        case 402:
            error.message = '账号或密码错误'
            break
      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = `请求地址出错: ${error.response.config.url}`
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器内部错误'
        break
      case 501:
        error.message = '服务未实现'
        break
      case 502:
        error.message = '网关错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网关超时'
        break
      case 505:
        error.message = 'HTTP版本不受支持'
        break
      default:
        break
    }
    errorLog(error)
    if (error.response.status === 401) {
      message.error(error.message)
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
    else {
      message.error(error.message)
    }
  }
  return Promise.reject(error)
}

// request interceptor 在发送请求之前做某件事
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = token// 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  const dataAxios = response.data
  // 这个状态码是和后端约定的
  const { code } = dataAxios
  // 根据 code 进行判断
  if (code === undefined) {
    // 如果没有 code 代表这不是项目后端开发的接口
    return dataAxios
  } else {
    //有 code 代表这是一个后端接口 可以进行进一步的判断
    // switch (code) {
    //     case '200':
    //         // [ 示例 ] code === 0 代表没有错误
    //         return dataAxios.data
    //     case '401':
    //         // [ 示例 ] 其它和后台约定的 code
    //         errorCreat(`[ code: xxx ] ${dataAxios.msg}: ${response.config.url}`)
    //         break
    //     default:
    //         // 不是正确的 code
    //         errorCreat(`${dataAxios.msg}: ${response.config.url}`)
    //         break
    // }
    switch (code){
      case '401':{
        // message.error(dataAxios.msg)
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
        // return Promise.reject(response);
      }
      case '500':{
        // return Promise.reject(response)
      }
    }
  }
  return dataAxios
}, err)

const installer = {
  vm: {},
  install(Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
/**调用方式**
 *第一种方式
 * this.$http.get('/workplace/radar')
 .then(res => {
            const dv = new DataSet.View().source(res.result)
            dv.transform({
              type: 'fold',
              fields: ['个人', '团队', '部门'],
              key: 'user',
              value: 'score'
            })

            this.radarData = dv.rows
            this.radarLoading = false
          })
 this.$http.post('/workplace/radar')
 .then(res => {
          })
 *第二种方式
 this.$axios.post('/login', {
            name: this.form.getFieldValue('name'),
            password: this.form.getFieldValue('password')
          }).then((res) => {
            this.logging = false
            const result = res.data
            if (result.code >= 0) {
              const user = result.data.user
              this.$router.push('/dashboard/workplace')
              this.$store.commit('account/setuser', user)
              this.$message.success(result.message, 3)
            } else {
              this.error = result.message
            }
          })
 */
