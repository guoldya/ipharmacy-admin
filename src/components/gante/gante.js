/**
 * Created by Administrator on 2018/12/27.
 */
import Gante from '@/components/gante/gante.vue'

export default {
  install(Vue, options = {}) {
    const VueGante = Vue.extend(Gante)
    let gante = null

    function $gante(params) {
      return new Promise(resolve => {
        if (!gante) {
          gante = new VueGante()
          let container = 'body'
          if (params.container) {
            container = params.container
          }
          gante.$mount(container)
          //document.querySelector(container).appendChild(gante.$el)
        }
        gante.init(params)
        resolve()
      })
    }

    Vue.prototype.$gante = $gante
  }
}
