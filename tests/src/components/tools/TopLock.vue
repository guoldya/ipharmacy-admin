<template>
  <div>
    <a-tooltip placement="bottom" :title="tooltipContent" :getPopupContainer="getPopupContainer">
    <span @click="handleLock" class="header-lock">
      <a-icon style="font-size: 20px; padding: 4px" type="lock" />
    </span>
      <a-modal
        title="设置锁屏密码"
         v-model="dialogVisible"
        :getContainer="getContainer"
        @ok="handleSetLock"
      >
        <a-input
          id="lockpass"
          @pressEnter="handleSetLock"
          auto-focus
          type="password"
          autocomplete="false"
          placeholder="请输入锁屏密码"
          v-model="passwd"
          v-decorator="['password',{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-modal>
    </a-tooltip>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Base64 } from 'js-base64'
  import {
    validatenull
  } from '@/utils/validate'
  export default {
    name: 'TopLock',
    computed: {
      tooltipContent () {
        return "锁屏"
      }
    },
    data () {
      return {
        dialogVisible: false,
        passwd:''
      }
    },
    methods:
      {
        ...mapGetters(['lockpasswd']),
        handleSetLock()
        {
          this.$store.dispatch('preference/SetLockPass',Base64.encode(this.passwd))
          this.passwd =''
          this.handleLock()
          this.dialogVisible = false
        },
        handleLock()
        {
          if (validatenull(this.lockpasswd())) {
            this.dialogVisible = true
            return
          }
          this.$store.commit('SET_LOCK',this.$store.state.page.current)
          setTimeout(() => {
            this.$router.push({ name: 'lock' })
          }, 100)
        },
        getContainer()
        {
          return document.body
        },
        getPopupContainer (trigger) {
          return trigger.parentElement
        }
      }
  }
</script>

<style lang="less">
  .header-lock{
    display: inline-block;
    transition: all 0.3s;
    span {
      vertical-align: initial;
    }
  }
</style>