import { version,name } from '../package'

export default {
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: {
    search: {
      open: 's',
      close: 'esc'
    }
  },
  // 在读取持久化数据失败时默认页面
  page: {
    opened: [
      {
        name: 'Workplace',
        fullPath: '/dashboard/workplace',
        meta: {
          title: '工作台'
        }
      }
    ]
  },
  // 版本
  releases: {
    version,
    name
  },
  // 菜单搜索
  search: {
    enable: true
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  },
  // 在读取持久化数据失败时默认用户信息
  user: {
    account: {
      info: {},
      name: '未知用户',
      id:'ghost',
      lockPasswd:'',
      //默认头像
      avatar: '/default-avatar.png'
    }
  }
}
