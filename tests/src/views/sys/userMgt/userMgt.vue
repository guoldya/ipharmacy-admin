<template>
  <div>
    <a-card>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button class="margin-left-5" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-button type="primary" @click="addUser" class="margin-top-10">添加用户</a-button>
      <a-spin tip="加载中..." :spinning="spinning">
        <el-table class="margin-top-10" :data="dataSource" border style="width: 100%">
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <a @click="edit(scope.row)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除吗?" @confirm="delRow(scope.row)">
                <a class="delColor">删除</a>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认启用吗?"
                @confirm="changeStatus(scope.row,true)"
                v-if="scope.row.status == '0'"
              >
                <a>启用</a>
              </a-popconfirm>
              <a-popconfirm title="确认停用吗?" @confirm="changeStatus(scope.row,false)" v-else>
                <a class="delColor">停用</a>
              </a-popconfirm>
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
          >
            <template slot-scope="scope">
              <span v-if="item.prop == 'status'">
                <a-badge
                  :status="scope.row.status == '0'? 'default':'processing'"
                  :text="scope.row.status == '0'?'停用':'启用'"
                />
              </span>
              <span v-else>{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          :total="total"
          showSizeChanger
          v-model="current"
          class="pnstyle"
          :pageSize="pageSize"
          :pageSizeOptions="['10', '20','50']"
          @showSizeChange="sizeChange"
          @change="pageChange"
          size="small"
        ></a-pagination>
      </a-spin>
    </a-card>
    <a-modal
      :title="isNew?'添加用户':'编辑用户'"
      v-model="visible"
      okText="提交"
      @ok="submit"
      :confirmLoading="loading"
      @cancel="cancel"
      width
      centered
      :maskClosable="false"
    >
      <div style="width: 500px;">
        <a-form :form="form">
          <a-form-item label="机构" v-bind="formItemLayout">
            <a-tree-select
              v-if="isNew"
              @change="orgChange"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="orgData"
              placeholder="请选择机构"
              treeDefaultExpandAll
              v-decorator="[
                                'orgId',
                                {rules: [{ required: true, message: '请选择机构' }]}
                                ]"
            ></a-tree-select>
            <a-tree-select
              v-else
              class="readOnlyInput"
              :disabled="true"
              @change="orgChange"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="orgData"
              placeholder="请选择机构"
              treeDefaultExpandAll
              v-decorator="[
                                'orgId',
                                {rules: [{ required: true, message: '请选择机构' }]}
                                ]"
            ></a-tree-select>
          </a-form-item>
          <a-form-item label="部门" v-bind="formItemLayout">
            <a-tree-select
              v-if="isNew"
              @change="deptChange"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="deptData"
              placeholder="请输选择部门"
              treeDefaultExpandAll
              v-decorator="[
                                'deptId',
                                {rules: [{ required: true, message: '请选择所属部门' }]}
                                ]"
            ></a-tree-select>
            <a-tree-select
              v-else
              class="readOnlyInput"
              :disabled="true"
              @change="deptChange"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="deptData"
              placeholder="请输选择部门"
              treeDefaultExpandAll
              v-decorator="[
                                'deptId',
                                {rules: [{ required: true, message: '请选择所属部门' }]}
                                ]"
            ></a-tree-select>
          </a-form-item>
          <a-form-item label="人员" v-bind="formItemLayout">
            <a-select
              v-if="isNew"
              placeholder="请选择人员"
              v-decorator="[
                                'personId',
                                {rules: [{ required: true, message: '请选择人员' }]}
                                ]"
            >
              <a-select-option
                v-for="(item,index) in personData"
                :value="item.personId"
                :key="index"
              >{{item.name}}</a-select-option>
            </a-select>
            <a-select
              v-else
              class="readOnlyInput"
              :disabled="true"
              placeholder="请选择人员"
              v-decorator="[
                                'personId',
                                {rules: [{ required: true, message: '请选择人员' }]}
                                ]"
            >
              <a-select-option
                v-for="(item,index) in personData"
                :value="item.personId"
                :key="index"
              >{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="账号" v-bind="formItemLayout">
            <a-input
              placeholder="请输入..."
              v-decorator="[
                                'account',
                                {rules: [{ required: true, message: '请输入账号' },{ max:20,message:'最多20个字' },{ message: '请勿输入空格', pattern: /^[^\s]*$/}]}
                                ]"
            />
          </a-form-item>
          <a-form-item label="密码" v-bind="formItemLayout">
            <a-input
              placeholder="若不填，后台将生成默认密码"
              v-decorator="['password',{rules:[{ max:30,message:'最多30个字' },{ message: '请勿输入空格', pattern: /^[^\s]*$/}]}]"
            />
          </a-form-item>
          <a-form-item label="状态" :required="true" v-bind="formItemLayout">
            <a-radio-group v-decorator="['status',{initialValue: formData.status}]">
              <a-radio value="1">启用</a-radio>
              <a-radio value="0">停用</a-radio>
            </a-radio-group>
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
      api: {
        orgUrl: '/sys/sysOrgs/selectList',
        deptUrl: '/sys/sysOrgs/selectDeptsByOrgId',
        personUrl: '/sys/sysDeptpersons/selectPersonsListWithDeptId',
        userUrl: '/sys/sysUser/selectPage',
        updateUrl: '/sys/sysUser/update',
        delUrl: '/sys/sysUser/delete',
        getUrl: '/sys/sysDepts/selectList'
      },
      spinning: false,
      dataSource: [],
      columns: [
        { title: '账号', prop: 'account' },
        { title: '姓名', prop: 'username' },
        { title: '机构', prop: 'orgTitle' },
        { title: '部门', prop: 'deptTitle', width: 150 },
        { title: '编辑人', prop: 'updateUsername', width: 120 },
        { title: '编辑时间', prop: 'updateTime', width: 150 },
        { title: '状态', prop: 'status', align: 'center', width: 100 }
      ],
      total: 0,
      current: 1,
      pageSize: 10,
      isNew: true,
      visible: false,
      loading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      formData: {
        status: '1'
      },
      orgData: [],
      deptData: [],
      deptDatas: [],
      personData: [],
      searchData:{}
    }
  },
  components: {},
  computed: {
    list() {
      return [
        { name: '账号', dataField: 'account', type: 'text' },
        { name: '姓名', dataField: 'username', type: 'text' },
        { name: '机构', dataField: 'orgId', type: 'tree-select', keyExpr: 'keyword', treeData: this.orgData,onSelect:this.selectTree },
        { name: '部门', dataField: 'deptId', type: 'tree-select', keyExpr: 'keyword', treeData: this.deptDatas },
        { name: '状态', dataField: 'status', type: 'select', keyExpr: 'id', valueExpr: 'text', dataSource: this.enum.status }
      ]
    }
  },
  mounted() {
    this.getData()
    this.getOrgData()
   // this.getDeptDatas()
  },
  methods: {
    // 选择机构
     selectTree(value){
        this.getDeptDatas(value)
      },
      // 搜索
    search() {
        this.searchData = this.$refs.searchPanel.form.getFieldsValue()
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.offset = 0
      params.pageSize = this.pageSize
      this.getData(params)
    },
    //重置
    resetForm() {
       this.searchData = {}
      this.$refs.searchPanel.form.resetFields()
      let params={}
      this.pageSize = 10
       params.pageSize =10
      params.offset = 0
      this.getData(params)
    },
    addUser() {
      this.isNew = true
      this.form.resetFields()
      this.formData = { status: '1' }
      this.visible = true
    },
    edit(row) {
      this.isNew = false
      this.visible = true
      this.getDeptData(row.orgId)
      this.getPersonData(row.deptId)
      this.formData = row
      let params = {
        orgId: this.formData.orgId,
        deptId: this.formData.deptId,
        personId: this.formData.personId,
        account: this.formData.account,
        password: this.formData.password
      }
      setTimeout(() => {
        this.form.setFieldsValue(params)
      }, 100)
    },
    cancel() {
      this.visible = false
    },
    submit() {
      this.loading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          values.account = values.account.replace(/(^\s*)|(\s*$)/g, '')
          if (values.password) {
            values.password = values.password.replace(/(^\s*)|(\s*$)/g, '')
          }
          let params = values,
            len = this.personData.length
          for (let i = 0; i < len; i++) {
            if (this.personData[i].personId == values.personId) {
              params.userName = this.personData[i].name
              break
            }
          }
          if (!this.isNew) {
            params.userId = this.formData.userId
          }
          this.$axios({
            url: this.api.updateUrl,
            method: 'post',
            data: params
          })
            .then(res => {
              if (res.code == '200') {
                this.success('保存成功!', () => {
                  this.getData()
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
    delRow(row) {
      if (row.status == '1') {
        this.warn('请先停用该用户，再删除!')
        return
      }
      this.$axios({
        url: this.api.delUrl,
        method: 'post',
        data: { userId: row.userId }
      })
        .then(res => {
          if (res.code == '200') {
            this.success('删除成功!', () => {
              this.getData()
            })
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    changeStatus(row, flag) {
      let params = {}
      if (flag) {
        params.status = '1'
      } else {
        params.status = '0'
      }
      params.userId = row.userId
      this.$axios({
        url: this.api.updateUrl,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.success('操作成功!', () => {
              let data = this.searchData;
              data.pageSize = this.pageSize;
              data.offset = (this.current-1)*this.pageSize;
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
    pageChange(page, size) {
     let params = this.searchData
      params.offset = (page - 1) * size
      params.pageSize = size;
      this.getData(params)
    },
    sizeChange(current, size) {
      this.pageSize = size
     let params = this.searchData
      params.pageSize = size
      params.offset = (current-1)*size;
      this.getData(params)
    },
    orgChange(val) {
      this.getDeptData(val)
    },
    deptChange(val) {
      this.getPersonData(val)
    },
    getData(params = {}) {
      this.spinning = true
      // let params = {};
      params.pageSize = params.pageSize || 10
      params.offset = params.offset || 0
      this.$axios({
        url: this.api.userUrl,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dataSource = this.$dateFormat(res.rows, ['updateTime'])
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
    getOrgData(obj = {}) {
      obj.status = '1'
      this.$axios({
        url: this.api.orgUrl,
        method: 'put',
        data: obj
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
    },
    getDeptData(val) {
      this.$axios({
        url: this.api.deptUrl,
        method: 'put',
        data: { orgId: val ,status:'1'}
      })
        .then(res => {
          if (res.code == '200') {
            this.deptData = this.getDeptTreeData(res.rows, undefined)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    getDeptDatas(val) {
      this.$axios({
        url: this.api.deptUrl,
        method: 'put',
        data: { status: '1',orgId: val }
      })
        .then(res => {
          if (res.code == '200') {
            this.deptDatas = this.getDeptTreeData(res.rows, undefined)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    getDeptTreeData(data, pid) {
      let tree = []
      data.forEach(item => {
        let row = item
        row.key = item.deptId
        row.value = item.deptId
        if (pid == item.parentId) {
          row.children = this.getDeptTreeData(data, item.deptId)
          tree.push(row)
        }
      })
      return tree
    },
    getPersonData(val) {
      let params = { deptId: val }
      if (this.isNew) {
        params.status = '1'
      }
      this.$axios({
        url: this.api.personUrl,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.personData = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    }
  }
}
</script>