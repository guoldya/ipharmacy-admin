<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
    <a-button class="margin-top-10" type="primary" @click="adds">新增</a-button>
    <a-spin :spinning="loading" tip="加载中...">
      <a-treeTable
        class="margin-top-10"
        :columns="columns"
        :handleCurrentChange="clicks"
        :data="dataSource"
        :items="items"
        :opColWidth="110"
        :moreOp="false"
        :currentChange="currentChange"
        :isoperate="'questionMgt'"
      ></a-treeTable>
    </a-spin>
  </a-card>
</template>

<script>
import { selectSysOrgs } from '@/api/login'
import treeTable from '@/components/tree-table/treeTable.vue'

export default {
  name: 'index',
  components: {
    'a-treeTable': treeTable
  },
  data() {
    return {
      api: {
        selectTitlesList: 'sys/dicBase/selectTitlesList',
        insert: 'sys/dicBase/insert',
        update: 'sys/dicBase/updateStatus'
      },
      loading: false,

      columns: [
        { text: '问题序号', value: 'id', width: 150, align: 'left' },
        { text: '问题编码', value: 'code', width: 150, align: 'left' },
        { text: '问题名称', value: 'name', width: 300, align: 'left' },
        { text: '拼音编码', value: 'spellCode', width: 120, align: 'left' },
        { text: '备注', value: 'remark', align: 'left' },
        { text: '状态', value: 'status', align: 'center', width: 80 }
      ],
      items: [
        { text: '编辑', showtip: false, click: this.edits },
        { text: '启用', color: '#2D8cF0', showtip: true, click: this.changeStatus, tip: '确认启用吗？', status: '1' },
        { text: '停用', color:'#ff9900',showtip: true, tip: '确认停用吗？', click: this.changeStatus, status: '0' }
      ],
      colors: '#ffffff',
      dataSource: [],
      parentId: '',
      searchData:{},
     
    }
  },
  computed: {
    list() {
      return [
        {
          name: '问题编码',
          dataField: 'id',
          type: 'text'
        },
        {
          name: '问题名称',
          dataField: 'name',
          type: 'text'
        },
        {
          name: '拼音编码',
          dataField: 'spellCode',
          type: 'text'
        },
        {
          name: '类型',
          dataField: 'status',
          type: 'select',
          dataSource: this.enum.statu,
          keyExpr: 'id',
          valueExpr: 'text'
        }
      ]
    }
  },
  mounted() {
    //console.log(this.items)
    this.getTreeList({ codeclass: 7 })
  },
  methods: {
    // 按条件搜索
    search() {
      //TODO:枚举值回来以后在调用分页查询
      let params = this.$refs.searchPanel.form.getFieldsValue()
      this.searchData = this.$refs.searchPanel.form.getFieldsValue()
      for (let item in params) {
        if (typeof params[item] == 'string') {
          //  let arr=params[item].split('').filter(item =>{
          //       return item!==' '
          //     }).join('')
          let arr = this.delSpace(params[item])
          params[item] = arr
        }
      }
      Object.assign(params, { codeclass: 7 })
      this.getTreeList(params)
    },
    // 清空搜索，重置数据
    resetForm() {
      this.searchData = {}
      this.$refs.searchPanel.form.resetFields()
      this.getTreeList({ codeclass: 7 })
    },
    // 添加数据
    adds(data) {
      this.$router.push({
        name: 'questionMgtDetail',
        params: { id: '-1' }
      })
    },
    // 编辑修改数据
    edits(data) {
      this.$router.push({
        name: 'questionMgtDetail',
        params: { id: data.id }
      })
    },
    // 组件绑定函数
    clicks() {
      console.log('xxxx')
    },
    // 构造树状结构
    getDataChildren(bdata, pid) {
      var items = []
      for (var key in bdata) {
        var item = bdata[key]
        if (pid == item.parentId) {
          item.items = this.getDataChildren(bdata, item.id)
          items.push(item)
        }
      }
      return items
    },
    // 树形初始数据
    getTreeList(params = {}) {
      // var paramsNum = Object.keys(params)
      this.loading = true
      this.$axios({
        url: this.api.selectTitlesList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dataSource = this.getDataChildren(res.rows, undefined)
            this.loading = false
          } else {
            this.loading = false
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.loading = false
          this.error(err)
        })
    },
    currentChange() {},
    changeStatus(data) {
      let params = {}
      params.id = data.id
      params.codeClass = '7'
      if (data.status == '1') {
        params.status = '0'
      } else {
        params.status = '1'
      }
      this.$axios({
        url: this.api.update,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
           this.success(res.msg)
            let obj = this.searchData;
            obj.codeClass = 7
            this.getTreeList(obj)
          } else {
           this.warn(res.msg)
          }
        })
        .catch(err => {
          this.loading = false
          this.error(err)
        })
    },
    trim(str) {
      str = str.replace(/^(\s|\u00A0)+/, '')
      for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
          str = str.substring(0, i + 1)
          break
        }
      }
      return str
    },
    delSpace(str){
     let strs=str.replace(/^(\s*)|(\s*)$/g,'')
     return strs
    }
  }
}
</script>

<style scoped>
.userModel-p {
  text-align: center;
}
</style>