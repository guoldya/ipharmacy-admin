const VueAxios = {
    vm: {},
    // eslint-disable-next-line no-unused-vars
    install(Vue, router = {}, instance) {
        if (this.installed) {
            return
        }
        this.installed = true

        if (!instance) {
            // eslint-disable-next-line no-console
            console.error('You have to install axios')
            return
        }

        Vue.axios = instance

        Object.defineProperties(Vue.prototype, {
            axios: {
                get: function get() {
                    return instance
                }
            },
            $http: {
                get: function get() {
                    return instance
                },
                put:function put() {
                  return instance
                },
                del:function put() {
                  return instance
                },
                post:function post()
                {
                  return instance
                },
               patch:function post()
                {
                  return instance
                }
            }
        })
    }
}

export {
    VueAxios,
    // eslint-disable-next-line no-undef
    //TODO:注释掉问题代码  ES6导出模块无法找到  源模块  不明白为啥子这样写
    //instance as axios
}