/**
 * 项目默认配置项
 * primaryColor - 默认主题色
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * autoHideHeader - 向下滚动时，隐藏 Header : boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */
import setting from '@/setting.js'

export default {
    primaryColor: '#1890FF', // primary color of ant design
    navTheme: 'dark', // 导航菜单主题
    layout: 'sidemenu', // 导航菜单位置：sidemenu或topmenu
    contentWidth: 'Fixed', // 内容布局：流动或固定，仅当布局为TopMenu时才有效
    fixedHeader: false, // sticky header
    fixSiderbar: false, // sticky siderbar
    autoHideHeader: false, //  自动隐藏标题
    colorWeak: false,
    multiPage: true,
    transition:true,//页面过渡动画
    device: 'desktop',
    lockPasswd:'',
    sidebar: true,
    storageOptions: {
    namespace: setting.releases.name+'__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  }
}