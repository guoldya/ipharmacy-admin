<template>
  <div>
    <div class="myScroll" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <div v-for="item in data" :key="item.index">{{item.name}}</div>
    </div>
    <a-select  style="width: 200px;">
        <div slot="dropdownRender"
             slot-scope="menu">
          <div class="myScroll" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
          <div v-for="item in data" :key="item.index">{{item.name}}</div>
          </div>
        </div>
    </a-select>
    <a-card style="width: 50px">
      <a @click="edit(props)" >编辑</a>
      <a-divider type="vertical"/>
      <a-popconfirm title="确认启用吗？" placement="top" >
        <a href="javascript:;">启用</a>
      </a-popconfirm>
      <a-popconfirm title="确认停用吗？" placement="top">
        <a href="javascript:;">停用</a>
      </a-popconfirm>
      <a-divider type="vertical" />
      <a-popconfirm title="确定删除?" placement="top" >
        <a href="javascript:;">删除</a>
      </a-popconfirm>
    </a-card>

  </div>

</template>

<script>

  export default {
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
    data() {
      return {
        data: [],
        count: 0,
        busy: false,
        heightPx: 500,
        pageSize:1,
      }
    },
    mounted() {
      // this.getData();
      for (var i = 0, j = 20; i < j; i++) {
        this.data.push({name: this.count++ })
      }
    },
    methods: {
      loadMore(){
        console.log(1);
        this.busy = true;
        this.pageSize++;
        setTimeout(()=>{
          for (var i = 0, j = 20; i < j; i++) {
            this.data.push({name: this.count++ })
          }
          console.log(111);
        },1000)


        this.busy = false;
      }
    }
  }
</script>
<style>

  .myScroll {
    max-height: 250px;
    overflow-y: auto;
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
