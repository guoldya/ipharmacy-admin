<template>
  <div class="user-wrapper">
    <top-lock  class="action"/>
    <header-notice class="action"/>
    <err-log class="action"/>
    <a-dropdown>
            <span class="action ant-dropdown-link user-dropdown-menu">
              <a-avatar class="avatar" size="small" v-if="avatar()==undefined||avatar().length === 0">{{nickname().substr(0,1)}}</a-avatar>
              <a-avatar class="avatar" size="small" v-else :src="avatar()"></a-avatar>
                <span>{{ nickname() }}</span>
            </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="0">
          <router-link :to="{ name: 'center' }">
            <a-icon type="user"/>
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1">
          <router-link :to="{ name: 'settings' }">
            <a-icon type="setting"/>
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
  import HeaderNotice from './HeaderNotice'
  import ErrLog from './ErrLog'
  import TopLock from './TopLock'
  import { mapActions, mapGetters } from 'vuex'
  export default {
    name: 'UserMenu',
    components: {
      HeaderNotice,
      ErrLog,
      TopLock
    },
    methods: {
      ...mapActions( ['Logout'],),
      ...mapGetters(['nickname', 'avatar']),
      ...mapActions( 'page',['closeAll']),
      handleLogout() {
        const that = this
        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            return that.Logout({}).then(() => {
              that.closeAll(that);
              that.success('注销成功');
               that.$router.push({ name: 'login' })
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