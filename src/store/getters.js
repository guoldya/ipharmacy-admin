const getters = {
  preference:state => state.preference.info,
  device: state => state.preference.info.device,
  theme: state => state.preference.info.navTheme,
  layout: state => state.preference.info.layout,
  multiPage: state => state.preference.info.multiPage,
  transition:state=>state.preference.info.transition,
  color: state => state.preference.info.primaryColor,
  token: state => state.user.account.token,
  avatar: state => state.user.account.avatar,
  lockpasswd: state => state.preference.info.lockPasswd,
  nickname: state => state.user.account.name,
  welcome: state => state.user.account.welcome,
  userInfo: state => state.user.account.info,
  userId: state=> state.user.account.id,
  addRouters: state => state.permission.addRouters
}

export default getters