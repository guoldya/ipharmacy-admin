<template>
  <div>
    <a-card>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button class="margin-left-5" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-spin tip="加载中..." :spinning="spinning">
        <el-table ref="table" class="margin-top-10" :data="dataSource" border style="width: 100%">
          <el-table-column fixed="right" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <a @click="edit(scope.row)">编辑</a>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            :prop="item.prop"
            :label="item.title"
            :key="index"
            v-for="(item,index) in columns"
            :width="item.width"
            :align="item.align"
            :formatter="item.formatter"
          ></el-table-column>
        </el-table>
        <a-pagination
          :total="total"
          showSizeChanger
          v-model="current"
          class="pnstyle"
          :pageSize="pageSize"
          :pageSizeOptions="['10','20','50']"
          @showSizeChange="sizeChange"
          @change="pageChange"
          size="small"
        ></a-pagination>
      </a-spin>
    </a-card>
    <a-modal
      :title="isNew?'新建参数':'编辑参数'"
      v-model="visible"
      okText="提交"
      @ok="submit"
      :confirmLoading="loading"
      @cancel="cancel"
      :width="650"
      centered
      :maskClosable="false"
    >
      <div>
        <a-form :form="form">
          <a-form-item label="id" v-bind="formItemLayout">
            <a-input
             class="readOnlyInput"
              placeholder="<系统自动生成>"
              :disabled="true"
           
              v-decorator="['paramId']"
            />
          </a-form-item>
          <!-- <a-form-item label="id" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              class="paramId"
              placeholder="<系统自动生成>"
              :disabled="true"
              v-decorator="['auditLevel',]"
            />
          </a-form-item>-->
          <a-form-item label="机构" v-bind="formItemLayout">
            <a-select
              placeholder="不选为全局参数"
              v-decorator="[
                                'orgId',
                                {initialValue: formData.orgId}
                                ]"
            >
              <a-select-option
                :value="item.orgId"
                v-for="(item,index) in orgData"
                :key="index"
              >{{item.title}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="参数名称" v-bind="formItemLayout">
            <a-input
              placeholder="请输入..."
              v-decorator="[
                                'paramName',
                                {rules: [{ required: true, message: '请输入参数' },{ max:6,message:'最多6个字' }],initialValue: formData.paramName}
                                ]"
            />
          </a-form-item>
          <a-form-item label="参数数据类型" v-bind="formItemLayout">
            <a-select
              placeholder="请选择"
              v-decorator="[
                                'paramDataType',
                                {rules: [{ required: true, message: '请选择参数数据类型' }],initialValue: formData.paramDataType}
                                ]"
            >
              <a-select-option
                :value="item.id"
                v-for="(item,index) in typeData"
                :key="index"
              >{{item.text}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="参数值" v-bind="formItemLayout">
            <a-textarea
              placeholder="请输入..."
              :autosize="{ minRows: 4 }"
              v-decorator="[ 'paramValue',{rules: [{ required: true, message: '请输入参数值' },{ max:40,message:'最多40个字' },{ message: '只能输入数字和字母', pattern: /^\w+$/}],initialValue: formData.paramValue}]"
            />
          </a-form-item>
          <a-form-item label="备注" v-bind="formItemLayout">
            <a-textarea
              placeholder="请输入..."
              :autosize="{ minRows: 4 }"
              v-decorator="[ 'ramark',{rules: [{ max:60 ,message:'最多60个字' }],initialValue: formData.ramark}]"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      spinning: false,
      dataSource: [],
      columns: [
        { title: 'id', prop: 'paramId', width: 120 },
        { title: '参数名称', prop: 'paramName' },
        { title: '机构', prop: 'orgTitle', width: 200 },
        { title: '数据类型', prop: 'paramDataType', align: 'center', width: 150, formatter: this.setType },
        { title: '参数值', prop: 'paramValue' },
        // { title:'参数类型', prop:'paramClass', align:'center', width:100,formatter:this.setClass },
        // { title:'参数单位', prop:'paramUnit', width:100 },
        // { title:'参数数据源', prop:'paramDatasource', width:150 },

        { title: '参数说明', prop: 'ramark' }
      ],
      total: 0,
      current: 1,
      pageSize: 10,
      searchData: {},
      api: {
        paramUrl: '/sys/sysParams/selectPage',
        orgUrl: '/sys/sysOrgs/selectList',
        updateUrl: '/sys/sysParams/update',
        delUrl: ''
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 15 }
      },
      isNew: false,
      visible: false,
      loading: false,
      form: this.$form.createForm(this),
      orgData: [],
      formData: {}
    }
  },
  computed: {
    list() {
      return [
        { name: '参数名称', dataField: 'paramName', type: 'text' },
        // { name: '机构', dataField: 'orgTitle', type: 'text' },
        { name: '机构', dataField: 'orgId', type: 'tree-select', keyExpr: 'keyword', treeData: this.orgData }
      ]
    },
    typeData() {
      return this.enum.paramDataType
    },
    classData() {
      return this.enum.paramClass
    }
  },
  mounted() {
    this.getData()
    this.getClientData()
  },
  methods: {
    moment,
    search() {
      this.searchData = this.$refs.searchPanel.form.getFieldsValue()
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.offset = (this.current - 1) * this.pageSize
      params.pageSize = this.pageSize
      this.getData(params)
    },
    resetForm() {
      this.$refs.searchPanel.form.resetFields()
      this.searchData = {}
      this.pageSize = 10
      this.getData()
    },
    setType(row) {
      let text = ''
      this.enum.paramDataType.forEach(item => {
        if (item.id == row.paramDataType) {
          text = item.text
        }
      })
      return text
    },
    setClass(row) {
      let text = ''
      this.enum.paramClass.forEach(item => {
        if (item.id == row.paramClass) {
          text = item.text
        }
      })
      return text
    },
    edit(row) {
      this.form.resetFields()
      this.isNew = false
      this.formData = row
      this.visible = true
    },
    delRow(row) {
      this.$axios({
        url: this.api.delUrl,
        method: 'delete',
        data: { paramId: row.paramId }
      })
        .then(res => {
          if (res.code == '200') {
            this.success('删除成功!', () => {
              let data = this.searchData
              data.pageSize = this.pageSize
              data.offset = (this.current - 1) * this.pageSize
              this.getData(data)
            })
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    cancel() {
      this.visible = false
    },
    submit() {
      this.loading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = values
          if (!this.isNew) {
            params.paramId = this.formData.paramId
          }
          params.paramName = params.paramName.replace(/^(\s*)|(\s*)$/g, '')
          this.$axios({
            url: this.api.updateUrl,
            method: 'post',
            data: params
          })
            .then(res => {
              if (res.code == '200') {
                this.success('保存成功!', () => {
                  let data = this.searchData
                  data.pageSize = this.pageSize
                  data.offset = (this.current - 1) * this.pageSize
                  this.getData(data)
                  this.visible = false
                  this.loading = false
                })
              } else {
                this.loading = false
                this.warn(res.msg)
              }
            })
            .catch(err => {
              this.loading = false
              this.error(err)
            })
        } else {
          this.loading = false
        }
      })
    },
    pageChange(page, size) {
      let params = this.searchData
      params.offset = (page - 1) * size
      params.pageSize = size
      this.getData(params)
    },
    sizeChange(current, size) {
      this.pageSize = size
      let params = this.searchData
      params.pageSize = size
      params.offset = (current - 1) * size
      this.getData(params)
    },
    getData(params = {}) {
      this.spinning = true
      params.pageSize = params.pageSize || 10
      params.offset = params.offset || 0
      this.$axios({
        url: this.api.paramUrl,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dataSource = res.rows
            this.total = res.total
            if (!params.offset) {
              this.current = 1
            }
            this.spinning = false
          } else {
            this.spinning = false
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.spinning = false
          this.error(err)
        })
    },
    getClientData() {
      this.$axios({
        url: this.api.orgUrl,
        method: 'put',
        data: {}
      })
        .then(res => {
          if (res.code == '200') {
            this.orgData = this.getOrgTreeData(res.rows, undefined)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    getOrgTreeData(data, pid) {
      let tree = []
      data.forEach(item => {
        let row = item
        row.key = item.orgId
        row.value = item.orgId
        if (pid == item.parentId) {
          row.children = this.getOrgTreeData(data, item.orgId)
          tree.push(row)
        }
      })
      return tree
    }
  }
}
</script>