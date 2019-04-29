<template>
  <div>
    <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
    <a-tree
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      :treeData="gData"
    >
      <template slot="title" slot-scope="{title}">
        <span v-if="title.indexOf(searchValue) > -1">
          {{title.substr(0, title.indexOf(searchValue))}}
          <span style="color: #f50">{{searchValue}}</span>
          {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
        </span>
        <span v-else>{{title}}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
  const x = 3
  const y = 2
  const z = 1
  const gData = []

  const generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || '0'
    const tns = _tns || gData

    const children = []
    for (let i = 0; i < x; i++) {
      const key = `${preKey}${i}`
      tns.push({ title: key, key, scopedSlots: { title: 'title' }})
      if (i < y) {
        children.push(key)
      }
    }
    if (_level < 0) {
      return tns
    }
    const level = _level - 1
    children.forEach((key, index) => {
      tns[index].children = []
      return generateData(level, key, tns[index].children)
    })
  }
  generateData(z)

  const dataList = []
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const key = node.key
      dataList.push({ key, title: key })
      if (node.children) {
        generateList(node.children, node.key)
      }
    }
  }
  generateList(gData)

  const getParentKey = (key, tree) => {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children)
        }
      }
    }
    return parentKey
  }
  export default {
    data () {
      return {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        gData,
      }
    },
    mounted(){
      console.log(gData)
    },
    methods: {
      onExpand  (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      onChange (e) {
        const value = e.target.value
        const expandedKeys = dataList.map((item) => {
          if (item.key.indexOf(value) > -1) {
            return getParentKey(item.key, gData)
          }
          return null
        }).filter((item, i, self) => item && self.indexOf(item) === i)
        console.log(value)
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        })
      },
    },
  }
</script>


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
