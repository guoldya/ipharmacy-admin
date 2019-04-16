<template>
  <page-layout :desc="description" :title="getTitle" :linkList="linkList" :search="search" :tabs="tabs">
    <div slot="extra" class="extra-img">
      <img v-if="typeof extraImage !== 'undefined'" :src="extraImage"/>
    </div>
    <transition :name="transition ? 'page-toggle' : ''">
      <keep-alive v-if="multipage">
        <router-view ref="page" />
      </keep-alive>
      <router-view ref="page" v-else />
    </transition>
  </page-layout>
</template>


<script>
  import PageLayout from '../page/PageLayout'
  import RouteView from './RouteView'
  import PageHeader from '../page/PageHeader'
  export default {
    name: 'PageContent',
    components: {
      RouteView,
      PageLayout,
      PageHeader
    },
    data() {
      return {
        title: '',
        description: '',
        linkList: [],
        extraImage: '',
        search: false,
        tabs: {}
      }
    },
    mounted() {
      this.getPageHeaderInfo()
    },
    updated() {
      this.getPageHeaderInfo()
    },
    computed: {
      getTitle() {
        return this.$route.meta.title
      },
      multipage () {
        return this.$store.getters.multiPage
      },
      transition() {
        return this.$store.getters.transition
      }
    },
    methods: {
      getPageHeaderInfo() {
        // eslint-disable-next-line
        this.title = this.$route.meta.title
        // 因为套用了一层 route-view 所以要取 ref 对象下的子节点的第一个对象
        const page = this.$refs.page
        if (page) {
          this.description = page.description
          this.linkList = page.linkList
          this.extraImage = page.extraImage
          this.search = page.search == true ? true : false
          this.tabs = page.tabs
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .extra-img {
    margin-top: -60px;
    text-align: center;
    width: 195px;

    img {
      width: 100%;
    }
  }

  .mobile {
    .extra-img{
      margin-top: 10px;
      text-align: center;
      width: 96px;

      img{
        width: 100%;
      }
    }
  }
</style>