/**API路径**/
const api = {
    Login: '/auth/login',
    Logout: '/auth/logout',
    ForgePassword: '/auth/forge-password',
    Register: '/auth/register',
    twoStepCode: '/auth/2step-code',
    SendSms: '/account/sms',
    SendSmsErr: '/account/sms_err',
    // get my info
    UserInfo: '/user/info'
}
export default api


//引用 import { getSmsCaptcha, get2step } from '@/api/login'
/**调用
get2step({ })
  .then(res => {
    this.requiredTwoStepCaptcha = res.result.stepCode
  })
  .catch(() => {
    this.requiredTwoStepCaptcha = false
  })

 getSmsCaptcha({ mobile: values.mobile }).then(res => {
            setTimeout(hide, 2500)
            this.$notification['success']({
              message: '提示',
              description: '验证码获取成功，您的验证码为：' + res.result.captcha,
              duration: 8
            })
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.requestFailed(err)
          })
 **/