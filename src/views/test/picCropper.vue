<template>
  <div>
    <div class="app" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <div class="content"></div>
      <div class="loading" v-show="busy">loading.....</div>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        data:[],
        count: 0,
        busy: false,
      }
    },
    mounted(){
      // this.getData();
    },
    methods: {
      getData(){
        for (var i = 0, j = 10; i < j; i++) {
          this.data.push({name: this.count++ })
        }
      },
      loadMore: function() {
        var self = this;
        self.busy = true;
        console.log('loading... ' + new Date());
        setTimeout(function() {
          var target = document.querySelector('.content');
          var height = target.clientHeight;
          target.style.height = height + 300 + 'px';
          console.log('end... ' + new Date());
          self.busy = false;
        }, 1000);
      },
    },
  }
</script>
<style>
  .app {
    height: 1000px;
    border: 1px solid red;
    width: 600px;
    margin: 0 auto;
    overflow: auto;
  }
  .content {
    height: 1300px;
    background-color: #ccc;
    width: 80%;
    margin: 0 auto;
  }
  .loading {
    font-weight: bold;
    font-size: 20px;
    color: red;
    text-align: center;
  }
</style>


<!--<template>-->
  <!--<div class="certain-category-search-wrapper" style="width: 250px">-->
    <!--<a-auto-complete-->
      <!--class="certain-category-search"-->
      <!--dropdownClassName="certain-category-search-dropdown"-->
      <!--:dropdownMatchSelectWidth="false"-->
      <!--:dropdownStyle="{width: '300px'}"-->
      <!--size="large"-->
      <!--style="width: 100%"-->
      <!--placeholder="input here"-->
      <!--optionLabelProp="value"-->
    <!--&gt;-->
      <!--<template slot="dataSource">-->
        <!--<a-select-opt-group-->
          <!--v-for="group in dataSource"-->
          <!--:key="group.title"-->
        <!--&gt;-->
          <!--<span slot="label">-->
            <!--{{group.title}}-->
            <!--<a-->
              <!--style="float: right"-->
              <!--href="https://www.google.com/search?q=antd"-->
              <!--target="_blank"-->
              <!--rel="noopener noreferrer"-->
            <!--&gt;更多-->
            <!--</a>-->
          <!--</span>-->
          <!--<a-select-option v-for="opt in group.children" :key="opt.title" :value="opt.title">-->
            <!--{{opt.title}}-->
            <!--<span class="certain-search-item-count">{{opt.count}} 人 关注</span>-->
          <!--</a-select-option>-->
        <!--</a-select-opt-group>-->
        <!--<a-select-option disabled key="all" class="show-all">-->
          <!--<a-->
            <!--href="https://www.google.com/search?q=antd"-->
            <!--target="_blank"-->
            <!--rel="noopener noreferrer"-->
          <!--&gt;-->
            <!--查看所有结果-->
          <!--</a>-->
        <!--</a-select-option>-->
      <!--</template>-->
      <!--<a-input>-->
        <!--<a-icon slot="suffix" type="search" class="certain-category-icon" />-->
      <!--</a-input>-->
    <!--</a-auto-complete>-->
  <!--</div>-->
<!--</template>-->
<!--<script>-->
  <!--const dataSource = [{-->
    <!--title: '话题',-->
    <!--children: [{-->
      <!--title: 'AntDesign',-->
      <!--count: 10000,-->
    <!--}, {-->
      <!--title: 'AntDesign UI',-->
      <!--count: 10600,-->
    <!--}],-->
  <!--}, {-->
    <!--title: '问题',-->
    <!--children: [{-->
      <!--title: 'AntDesign UI 有多好',-->
      <!--count: 60100,-->
    <!--}, {-->
      <!--title: 'AntDesign 是啥',-->
      <!--count: 30010,-->
    <!--}],-->
  <!--}, {-->
    <!--title: '文章',-->
    <!--children: [{-->
      <!--title: 'AntDesign 是一个设计语言',-->
      <!--count: 100000,-->
    <!--}],-->
  <!--}];-->
  <!--export default {-->
    <!--data() {-->
      <!--return {-->
        <!--dataSource,-->
      <!--}-->
    <!--},-->
  <!--}-->
<!--</script>-->
<!--<style>-->
  <!--.certain-category-search-dropdown .ant-select-dropdown-menu-item-group-title {-->
    <!--color: #666;-->
    <!--font-weight: bold;-->
  <!--}-->

  <!--.certain-category-search-dropdown .ant-select-dropdown-menu-item-group {-->
    <!--border-bottom: 1px solid #F6F6F6;-->
  <!--}-->

  <!--.certain-category-search-dropdown .ant-select-dropdown-menu-item {-->
    <!--padding-left: 16px;-->
  <!--}-->

  <!--.certain-category-search-dropdown .ant-select-dropdown-menu-item.show-all {-->
    <!--text-align: center;-->
    <!--cursor: default;-->
  <!--}-->

  <!--.certain-category-search-dropdown .ant-select-dropdown-menu {-->
    <!--max-height: 300px;-->
  <!--}-->
<!--</style>-->
<!--<style scoped>-->
  <!--.certain-category-search-wrapper >>> .certain-category-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix {-->
    <!--right: 12px;-->
  <!--}-->
  <!--.certain-category-search-wrapper >>> .certain-search-item-count {-->
    <!--position: absolute;-->
    <!--color: #999;-->
    <!--right: 16px;-->
  <!--}-->
  <!--.certain-category-search-wrapper >>> .certain-category-search.ant-select-focused .certain-category-icon {-->
    <!--color: #108ee9;-->
  <!--}-->
  <!--.certain-category-search-wrapper >>> .certain-category-icon {-->
    <!--color: #6E6E6E;-->
    <!--transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);-->
    <!--font-size: 16px;-->
  <!--}-->
<!--</style>-->
