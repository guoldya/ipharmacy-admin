<template>
  <div class="main screen-lock-page" >
    <div>
      <div class="avatar">
        <img :src="avatar()">
      </div>
      <div class="nickname">{{nickname()}}</div>
    </div>
    <a-form
      id="formLock"
      class="user-layout-lock"
      ref="formLock"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入锁屏密码"
          v-decorator="['password',{rules: [{ required: true, message: '请输入锁屏密码' }], validateTrigger: 'blur'}]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.unLockBtn"
          :disabled="state.unLockBtn"
        >解锁
        </a-button>
      </a-form-item>
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          class="login-button"
          @click="handleLogout"
        >注销登录
        </a-button>
      </a-form-item>
    </a-form>
    <Clock/>
  </div>
</template>

<script>
  import Clock from '@/my-components/clock'
  import { mapActions,mapGetters } from 'vuex'
  import { Base64 } from 'js-base64'
  import {setSessionStore,getSessionStore,removeSessionStore} from  '@utils/storage.js'
  export default {
    name: 'LockScreen',
    components: {
      Clock
    },
    data() {
      return {
        loginBtn: false,
        form: this.$form.createForm(this),
        state: {
          time: 60,
          unLockBtn: false,
        }
      }
    },
    methods:{
      ...mapActions(['Logout']),
      ...mapGetters(['lockpasswd','nickname', 'avatar']),
      handleSubmit(e){
        e.preventDefault()
        const lastPath = getSessionStore({
          name: 'lastPath'
        })|| '/dashboard/workplace'

        const {
          form: { validateFields },
          state
        } = this

        state.unLockBtn = true

        const validateFieldsKey =  ['password']

        validateFields(validateFieldsKey, { force: true }, (err, values) => {
          if (!err) {

            const unLockParams = { ...values }
            unLockParams.password = values.password

            this.UnLock(unLockParams)
              .then((res) =>
              {
                setTimeout(() => {
                  this.$store.commit('CLEAR_LOCK')
                  //返回上次路径

                  this.$router.push({path: lastPath })
                }, 500)
              })
              .catch(err => this.requestFailed(err))
              .finally(() => {
                state.unLockBtn = false
              })

          } else {
            setTimeout(() => {
              state.unLockBtn = false
            }, 600)
          }
        })
      },
      requestFailed(err) {
        this.$notification['error']({
          message: '错误',
          description: '解锁密码错误!',
          duration: 4
        })
      },
      UnLock(info) {
        return new Promise((resolve, reject) => {
          if (Base64.encode(info.password)!==this.lockpasswd())
          {
            reject()
          }
          resolve()
        })
      },
      handleLogout() {
        const that = this
        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            return that.Logout({}).then(() => {
              window.location.reload()
            }).catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
          },
          onCancel() {
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .user-layout-lock {
    label {
      font-size: 14px;
    }
    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
      margin-bottom: 5px;
    }
    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;
      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }
      .register {
        float: right;
      }
    }
  }
  .screen-lock-page .antui-clock {
    bottom: 50px;
    //color: #fff;
    padding: 0;
    position: absolute;
    right: 50px;
    width: auto;
  }
  .main.screen-lock-page
  {
    background-color :transparent !important;
    .nickname
    {
      text-align: center;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 5px;
      margin-bottom: 10px;
    }
  }

  .ant-form-item
  {
    color :transparent;
  }
  .avatar {
    margin: 0 auto;
    width: 80px;
    height: 80px;
    margin-bottom: 5px;
    border-radius: 50%;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
    }
  }
</style>