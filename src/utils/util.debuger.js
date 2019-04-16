import util from '@utils/util'
const debuger = {}

//调试
debuger.debug = function debug(info,title='DEBUG')
{
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
     util.log.capsule(title, info, 'default')
  }
}
//警告
debuger.warning = function warning(info,title='WARNING')
{
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.capsule(title, info, 'warning')
  }
}

//警告
debuger.error =  function error(info,title='ERROR')
{
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.capsule(title, info, 'danger')
  }
}

export default debuger