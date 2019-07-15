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
        height="430"
        :currentChange="currentChange"
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
        selectTitlesList: 'sys/coreFactCol/selectCoreFactColTreeList',
        chastaus: 'sys/coreFactCol/updateStatus'
      },
      loading: false,

      columns: [
        { text: '编码', value: 'id', width: 150, align: 'left' },
        { text: '类型', value: 'colType', width: 150, align: 'left',format: this.coltypeFormat },
        { text: '名称', value: 'colName', width: 300, align: 'left' },
        { text: '属性对应类型', value: 'colDbType', width: 120, align: 'left' ,format:this.colDtypeFormat},
        { text: '显示顺序', value: 'colNo', align: 'left' },
        { text: '更新人', value: 'updateBy', align: 'left' },
        { text: '更新时间', value: 'updateTime', align: 'left', format: this.timeFormat },
        { text: '状态', value: 'status', align: 'center', width: 80 }
      ],
      items: [
        { text: '编辑', showtip: false, click: this.edits },
        { text: '启用', color: '#2D8cF0', showtip: true, click: this.changeStatus, tip: '确认启用吗？', status: '1' },
        { text: '停用', color: '#ff9900', showtip: true, tip: '确认停用吗？', click: this.changeStatus, status: '0' }
      ],
      colors: '#ffffff',
      dataSource: [],
      parentId: ''
    }
  },
  computed: {
    list() {
      return [
        {
          name: '编码',
          dataField: 'id',
          type: 'text'
        },
        {
          name: '名称',
          dataField: 'colName',
          type: 'text'
        },
        {
          name: '类型',
          dataField: 'colType',
          type: 'select',
          dataSource: this.enum.coltype,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '状态',
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
    this.getTreeList()
  },
  methods: {
    // 按条件搜索
    search() {
      //TODO:枚举值回来以后在调用分页查询
      let params = this.$refs.searchPanel.form.getFieldsValue()
      for (let item in params) {
        if (typeof params[item] == 'string') {
          let arr = this.delSpace(params[item])
          params[item] = arr
        }
      }
      //Object.assign(params, { codeclass: 7 })
      this.getTreeList(params)
    },
    // 清空搜索，重置数据
    resetForm() {
      this.$refs.searchPanel.form.resetFields()
      this.getTreeList()
    },
    // 添加数据
    adds(data) {
      this.$router.push({
        name: 'factEngDetail',
        query: { msg: 'new' }
      })
    },
    // 编辑修改数据
    edits(data) {
      this.$router.push({
        name: 'factEngDetail',
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
        if (pid == item.pid) {
          item.items = this.getDataChildren(bdata, item.id)
          items.push(item)
        }
      }
      return items
    },
    // 树形初始数据
    getTreeList(params = {}) {
      let paramsNum = Object.keys(params)
      this.loading = true
      this.$axios({
        url: this.api.selectTitlesList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            if (paramsNum.length == 0) {
              this.dataSource = this.getDataChildren(res.rows, undefined)
            } else {
              this.dataSource = this.getDataChildren(res.rows, undefined)
            }
            this.loading = false
          } else {
            this.loadingTable = false
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.loadingTable = false
          this.error(err)
        })
    },
    changeStatus(data) {
      let params = {}
      params.id = data.id
      if (data.status == '1') {
        params.status = 0
      } else {
        params.status = 1
      }
      this.$axios({
        url: this.api.chastaus,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            if (data.status == '1') {
              this.success('停用成功')
            } else {
              this.success('启用成功')
            }
            this.getTreeList()
          } else {
            if (data.status == '1') {
              this.warn('停用失败')
            } else {
              this.warn('启用失败')
            }
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
    delSpace(str) {
      let strs = str.replace(/^(\s*)|(\s*)$/g, '')
      return strs
    },
    currentChange() {},
    // 时间过滤
    timeFormat(data) {
        if (data.updateTime) {
          return data.updateTime.replace(/(:\d{2})$/, '')
        }
      },
      // 类型过滤
      coltypeFormat(data){
           if (data.colType) {
            let levelText
          this.enum.coltype.forEach(item => {
            if (data.colType == item.id) {
              levelText = item.text
            }
          })
          return levelText
        }
      },
      // 属性类型过滤
      colDtypeFormat(data){
           if (data.colDbType) {
            let levelText
          this.enum.attributeType.forEach(item => {
            if (data.colDbType == item.id) {
              levelText = item.text
            }
          })
          return levelText
        }
      },
  }
}
</script>

<style scoped>
.userModel-p {
  text-align: center;
}
</style>