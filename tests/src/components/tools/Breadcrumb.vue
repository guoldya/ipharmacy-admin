<template>
    <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item v-for="(item, index) in breadList" :key="index">
          <span v-if="index === 0"><a :href=homepath>{{item.meta.title}}</a></span>
          <span v-else>{{item.meta.title}}</span>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>

<script>
  // 设置文件
import setting from '@/setting.js'
    export default {
        data() {
            return {
                name: '',
                breadList: [],
                homepath:setting.page.opened[0].fullPath
            }
        },
        created() {
            this.getBreadcrumb()
        },
        methods: {
            getBreadcrumb() {

                console.log('this.$route.matched', this.$route.matched)

                this.breadList = []
                this.breadList.push({ name: 'index', path: '/dashboard/', meta: { title: '首页' } })

                this.name = this.$route.name
                this.$route.matched.forEach((item) => {
                    // item.meta.name === 'dashboard' ? item.path = '/dashboard' : this.$route.path === item.path
                    this.breadList.push(item)
                })
            }
        },
        watch: {
            $route() {
                this.getBreadcrumb()
            }
        }
    }
</script>

<style scoped>

</style>