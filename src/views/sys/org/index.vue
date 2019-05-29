<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
    <a-spin :spinning="loading" tip="加载中...">
      <a-button class="margin-top-10" type="primary" @click="add">新增</a-button>
      <a-treeTable :columns="columns" :data="dataSource" :items="items" :opColWidth="110" :moreOp="true"></a-treeTable>
    </a-spin>
    <a-modal
      title="分配药师"
      :visible="visible"
      @ok="handleOk"
      :maskClosable="false"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
      width="690px"
    >
      <a-row>
        <a-col :span="10">
          <p class="userModel-p">待分配药师</p>
        </a-col>
        <a-col :span="11" :offset="3">
          <p class="userModel-p">已分配药师</p>
        </a-col>
      </a-row>
      <a-transfer
        :dataSource="mockData"
        :listStyle="{
                width: '280px',
                height: '300px',
                }"
        :titles="['源列表', '目标列表']"
        :targetKeys="targetKeys"
        @change="handleChange"
        :render="item=>item.title"
        :operations="['添加', '移除']"
      ></a-transfer>
    </a-modal>
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
      api:{
      selectClassListWithMoreParam:"/sys/dicBase/selectClassListWithMoreParam",
      },
      loading: false,
      total: 10,
      curent: 1,
      pageSize: 100000,
      visible: false,
      confirmLoading: false,
      enumList: {},
      //穿梭狂数据
      targetKeys: [],
      mockData: [],
      columns: [
        { text: '编码', value: 'orgId', width: 150 },
        { text: '名称', value: 'title', width: 250 },
        { text: '机构代码', value: 'orgCode',  width: 120 },
        { text: '机构类型', value: 'orgType', width: 80, format: this.orgTyoefFormat },
        { text: '医院分类', value: 'orgClass', align: 'center', width: 80, format: this.orgClassFormat },
        { text: '医院等级', value: 'orgGrade', align: 'center', width: 80, format: this.orgGradeFormat },
        { text: '联系电话', value: 'phone', width: 110 },
        { text: '法人', value: 'legalPsn', width: 80 },
        { text: '地址', value: 'adress' },
        { text: '备注', value: 'remarks' },
        { text: '状态', value: 'status', align: 'center', width: 80 },
        { text: '更新时间', value: 'updateDate', align: 'center', width: 140, format: this.timeFormat }
      ],
      items: [
        { text: '编辑', showtip: false, click: this.edits },
        { text: '删除', showtip: true, tip: '确认删除吗？', click: this.delRow },
        { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.changeStatus },
        { text: '停用', showtip: true, tip: '确认停用吗？', click: this.changeStatus }
      ],
      colors: '#ffffff',
      dataSource: []
    }
  },
  computed: {
    list() {
      return [
        {
          name: '医院名称',
          dataField: 'title',
          type: 'text',
        },
        {
          name: '机构代码',
          dataField: 'orgCode',
          type: 'text',
        },
        {
          name: '机构类型',
          dataField: 'orgType',
          type: 'select',
          keyExpr: 'id',
          valueExpr: 'text',
          dataSource: this.enum.orgType
        },
        {
          name: '医院分类',
          dataField: 'orgClass',
          type: 'select',
          keyExpr: 'id',
          valueExpr: 'name',
          dataSource: this.enumList["33"] 
        },
        {
          name: '医院等级',
          dataField: 'orgGrade',
          type: 'select',
          keyExpr: 'id',
          valueExpr: 'name',
          dataSource: this.enumList["34"]
        }
      ]
    }
  },
  mounted() {
    this.getEnumList()
  },
  methods: {
    //搜索
    search() {
      //TODO:枚举值回来以后在调用分页查询
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.pageSize = 100000
      params.offset = 0
      this.getData(params)
    },
    //重置
    resetForm() {
      this.$refs.searchPanel.form.resetFields()
      this.getData({ pageSize: 100000, offset: 0 })
    },
    getData(params = { pageSize: 100000, offset: 0 }) {
      this.loading = true
      // params.orderId = 1
      selectSysOrgs(params)
        .then(res => {
          if (res.code == '200') {
            console.log(this.getDataChildren(res.rows, undefined))
            this.dataSource = this.getDataChildren(res.rows, undefined)
            //console.log(this.dataSource, 'dataSource')
            //children
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
    getEnumList() {
      console.log(this.$api.selectClassListWithMoreParam, '枚举值')
      this.loading = true
      //orgTyoe
      let parameter = {
        codeClass: ['34', '33']
      }
      this.$axios({
        url: this.api.selectClassListWithMoreParam,
        method: 'put',
        data: parameter
      })
        .then(res => {
          console.log(res.data, '枚举值')
          if (res.code == '200') {
            this.enumList = res.data

            this.loading = false
          } else {
            this.loading = false
            this.warn(res.msg)
          }
          this.getData()
        })
        .catch(err => {
          this.getData()
          this.loading = false
          this.error(err)
        })
    },
    pageChangeSize() {},
    pageChange() {},
    getDataChildren(bdata, pid) {
      var items = []
      for (var key in bdata) {
        var item = bdata[key]
        if (pid == item.parentId) {
          item.items = this.getDataChildren(bdata, item.orgId)
          items.push(item)
        }
      }
      return items
    },
    //新增
    add() {
      this.$router.push({
        name: 'PrescriptionsDetail'
        // params:data,
      })
    },
    //停用
    ban(data) {},
    edits(data) {
      this.$router.push({
        name: 'PrescriptionsDetail',
        query: data
      })
    },

    checkRol(data) {
      this.visible = true
      // let rolePass = { account: data.row.account, centerId: data.row.centerId }
      // this.rolePass = rolePass
      // this.getUserRole(rolePass)
    },
    //确认分配药师
    handleOk() {},
    handleCancel() {
      this.visible = false
    },
    handleChange() {},
    orgTyoefFormat(data) {
      let levelText
      this.enum.orgType.forEach(item => {
        if (data.orgType == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
    // 	33		医院分类
    orgClassFormat(data) {
      let levelText
      if (this.enumList['33'] != null) {
        this.enumList['33'].forEach(item => {
          if (data.orgClass == item.id) {
            levelText = item.name
            return
          }
        })
      }
      return levelText
    },
    //    34		医院等级
    orgGradeFormat(data) {
      let levelText
      if (this.enumList['34'] != null) {
        this.enumList['34'].forEach(item => {
          if (data.orgGrade == item.id) {
            levelText = item.name
            return
          }
        })
      }
      return levelText
    },
    timeFormat(data) {
      if (data.updateDate != null) {
        var crtTime = new Date(data.updateDate)
        return this.dateFtt('yyyy-MM-dd hh:mm', crtTime) //直接调用公共JS里面的时间类处理的办法
      }
      return '';
    },
    dateFtt(fmt, date) {
      //author: meizz
      var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      return fmt
    }
  }
}
</script>

<style scoped>
.userModel-p {
  text-align: center;
}
</style>