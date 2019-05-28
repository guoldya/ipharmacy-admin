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
    UserInfo: '/user/info',

    //审方中心（门诊）
    selectTribunalRecord:'/sys/reviewOrderissue/selectTribunalRecord',
    selectOutDetail:'sys/reviewOrderissue/selectTribunalRecordDetail',

    //问题等级设置
    reviewAuditlevelPage:'/sys/reviewAuditlevel/selectPage',
    reviewAuditlevelSelectList:'/sys/reviewAuditlevel/selectPage',
    reviewAuditlevelUpdate:'/sys/reviewAuditlevel/update',

    //审方方案设置
    reviewPlanPage:'/sys/reviewPlan/selectPage',

    //药品说明书
    dicPackageSelectOne:'/sys/dicPackageinsert/selectOne',

    //规则
    coreRuleTypeSelect:'/sys/coreRuleType/selectTypePid',
    coreRuleTypePage:'/sys/coreRule/selectPage',
    coreRuleTypeUpdate:'/sys/coreRuleType/update',
    coreRuleTypeDelete:'/sys/coreRuleType/delete',
    coreRuleSelectKeyword:'/sys/coreRule/selectDrugKeyword',
    coreRuleUpdate:'/sys/coreRule/update',
    coreRuleDelete:'/sys/coreRule/delete',
    coreRuleGroupSpec: '/sys/coreRule/coreGroupingSpec',
    coreRuleNodeSelectOne:'/sys/coreRuleNode/selectOne',
    coreRuleNodeUpdate:'/sys/coreRuleNode/update',
    reviewAuditlevelSelect:'/sys/reviewAuditlevel/selectUsingList',
    dicBaseSelectClassList:'/sys/dicBase/selectClassList',
    coreFactColAll:'/sys/coreFactCol/selectAllUsing',
    coreRuleNodeSelectColId:'/sys/coreRuleNode/selectColId',
    coreRuleCategoryKeyword:'/sys/coreRule/selectCategoryKeyword',




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