<template>
  <div>
    <a-card>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button class="margin-left-5" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-button type="primary" class="margin-top-10" @click="addRole">新增角色</a-button>
      <a-spin tip="加载中..." :spinning="spinning">
        <el-table
          ref="table"
          class="margin-top-10"
          :data="dataSource"
          border
          style="width: 100%"
          highlight-current-row
          @current-change="currentChange"
        >
          <el-table-column
            fixed="right"
            label="操作"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <a @click="edit(scope.row)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确认删除吗?" @confirm="delRow(scope.row)">
                <a class="delColor">删除</a>
              </a-popconfirm>
              <a-divider type="vertical"/>
              <a-popconfirm title="确认启用吗?" placement="top" @confirm="changeStatus(scope.row,true)"
                            v-if="scope.row.status == '0'">
                <a>启用</a>
              </a-popconfirm>
              <a-popconfirm title="确认停用吗?" placement="top" @confirm="changeStatus(scope.row,false)" v-else>
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
                            <a-badge :status="scope.row.status == 0? 'default':'processing'"
                                     :text="scope.row.status ==0?'停用':'启用'"/>
                        </span>
              <span v-else>
                            {{scope.row[item.prop]}}
                        </span>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          :total="total"
          showSizeChanger
          hideOnSinglePage
          v-model="current"
          class="pnstyle"
          :defaultPageSize="10"
          :pageSizeOptions="['10', '20','50']"
          @showSizeChange="sizeChange"
          @change="pageChange"
          size="small"
        >
        </a-pagination>
      </a-spin>
      <a-button type="primary" class="margin-top-10" @click="addUser" :disabled="disabled">添加用户</a-button>
      <a-spin tip="加载中..." :spinning="uerSpin">
        <el-table
          class="margin-top-10"
          :data="userData"
          border
          style="width: 100%"
        >
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <a-popconfirm title="确认移除吗?" @confirm="remove(scope.row)">
                <a class="delColor">移除</a>
              </a-popconfirm>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            :prop="item.prop"
            :label="item.title"
            :key="index"
            v-for="(item,index) in userCol"
            :width="item.width"
            :align="item.align"
            :formatter="item.formatter"
          >
          </el-table-column>
        </el-table>
         <a-pagination
          :total="totals"
          showSizeChanger
          v-model="currents"
          class="pnstyle"
          :defaultPageSize="10"
          :pageSizeOptions="['10', '20','50']"
          @showSizeChange="sizeChanges"
          @change="pageChanges"
          size="small"
        >
        </a-pagination>
      </a-spin>
    </a-card>
    <a-modal
      :title="isNew?'新建角色':'编辑角色'"
      v-model="visible"
      okText="提交"
      @ok="submit"
      :confirmLoading="loading"
      @cancel="cancel"
      width=""
      centered
      :maskClosable="false"
    >
      <div style="width: 500px;">
        <a-form :form="form">
          <a-form-item
            label="机构"
            v-bind="formItemLayout"
          >
            <!--<a-select-->
            <!--placeholder="请选择"-->
            <!--v-decorator="[-->
            <!--'orgId',-->
            <!--{rules: [{ required: true, message: '请输选择机构' }],initialValue: formData.orgId}-->
            <!--]"-->
            <!--&gt;-->
            <!--<a-select-option :value="item.orgId" v-for="(item,index) in orgData"-->
            <!--:key="index">-->
            <!--{{item.title}}-->
            <!--</a-select-option>-->
            <!--</a-select>-->
            <a-tree-select
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="orgData"
              placeholder='请选择...'
              treeDefaultExpandAll
              v-decorator="[
                                     'orgId',
                                     {rules: [{ required: true, message: '请输选择机构' }],initialValue: formData.orgId}
                                ]"
            >
            </a-tree-select>
          </a-form-item>
          <a-form-item
            label="角色名称"
            v-bind="formItemLayout"
          >
            <a-input
              placeholder="请输入角色名称"
              v-decorator="[
                                'title',
                                {rules: [{ required: true, message: '请输入角色名称' },{ max:80,message:'最多80个字' },{ message: '请勿输入空格', pattern: /^[^\s]*$/},],initialValue: formData.title}
                                ]"
            />
          </a-form-item>
          <a-form-item
            label="状态"
            :required="true"
            v-bind="formItemLayout"
          >
            <a-radio-group v-decorator="['status',{initialValue: formData.status}]">
              <a-radio value="1">启用</a-radio>
              <a-radio value="0">停用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="备注"
            v-bind="formItemLayout"
          >
            <a-textarea
              placeholder="请输入..."
              :autosize="{ minRows: 4 }"
              v-decorator="[ 'remark',{rules: [{ max:255 }],initialValue: formData.remark}]"/>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <a-modal
      title="添加用户"
      v-model="modalVisible"
      okText="提交"
      @ok="userSubmit"
      :confirmLoading="userLoading"
      @cancel="cancel"
      width=""
      centered
      :maskClosable="false"
    >
      <div style="width: 500px;">
        <a-form :form="userForm">
          <a-form-item
            label="用户"
            v-bind="formItemLayout"
          >
            <a-select
              placeholder="请选择"
              showSearch
              allowClear
              mode="single"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              @search="handleSearch"
              v-decorator="[
                                'userIds',
                                {rules: [{ required: true, message: '请选择用户' }]}
                                ]"
            >
              <a-select-option :value="item.sysUserId" v-for="(item,index) in userForData"
                               :key="index">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import debounce from 'lodash/debounce'
  export default {
    data() {
      this.handleSearch = debounce(this.handleSearch, 800)
      return {
        spinning: false,
        dataSource: [],
        columns: [
          { title: '角色名', prop: 'title' },
          { title: '机构', prop: 'orgTitle' },
          { title: '编辑人', prop: 'editUser', width: 100 },
          { title: '编辑时间', prop: 'editTime', width: 150 },
          { title: '状态', prop: 'status', align: 'center', width: 100 },
          { title: '备注', prop: 'remark' }
        ],
        total: 0,
        current: 1,
        selectRole: {},
        api: {
          roleUrl: '/sys/sysRole/selectPage',
          orgUrl: '/sys/sysOrgs/selectList',
          delUrl: '/sys/sysRole/delete',
          updateUrl: '/sys/sysRole/update',
          updateStatusUrl: 'sys/sysRole/updateStatus',
          userUrl: '/sys/sysRole/selectUsersByRoleId',
          updateUserUrl: '/sys/sysRole/insertOrDeleteRoleUser',
          userByOrgUrl: '/sys/sysRole/selectUsersByRoleIdNotInUserIds'
        },
        isNew: true,
        loading: false,
        visible: false,
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 13 }
        },
        formData: {
          status: '1'
        },
        orgData: [],
        uerSpin: false,
        userData: [],
        userCol: [
          { title: '账号', prop: 'account' },
          { title: '姓名', prop: 'username' },
          { title: '科室', prop: 'deptTitle' },
          { title: '职称', prop: 'titlesName', width: 150 },
          { title: '管理职务', prop: 'mentPositionName', width: 150 }
        ],
        modalVisible: false,
        userLoading: false,
        userForm: this.$form.createForm(this),
        userForData: [],
        disabled: true,
        listData: {},
        totals:1,
        currents:1
      }
    },
    mounted() {
      this.getData()
      this.getOrgData()
    },
    computed: {
      list() {
        return [
          { name: '角色', dataField: 'title', type: 'text' },
          { name: '机构', dataField: 'orgTitle', type: 'text' }
        ]
      }
    },
    methods: {

      // 第二个分页条
        pageChanges(page, size) {
        params.offset = (page - 1) * size
        this.getData(params)
      },
      sizeChanges(current, size) {
        this.currents = 1
        params.pageSize = size
        this.getData(params)
      },
      search() {
        let params = this.$refs.searchPanel.form.getFieldsValue()
        this.getData(params)
      },
      resetForm() {
        this.$refs.searchPanel.form.resetFields()
        this.getData()
      },
      formatter(row) {
        let sex = ['未知', '男', '女']
        return sex[row.sex]
      },
      addRole() {
        this.isNew = true
        this.form.resetFields()
        this.formData = { status: '1' }
        this.visible = true
      },
      edit(row) {
        this.form.resetFields()
        this.isNew = false
        this.formData = row
        this.visible = true
      },
      cancel() {
        this.visible = false
        this.modalVisible = false
      },
      submit() {
        this.loading = true
        this.form.validateFields((err, values) => {
          if (!err) {
            let params = values
            if (!this.isNew) {
              params.roleId = this.formData.roleId
            }
            this.$axios({
              url: this.api.updateUrl,
              method: 'post',
              data: params
            }).then(res => {
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
            }).catch(err => {
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
          this.warn('请先停用该角色，再删除!')
          return
        }
        this.$axios({
          url: this.api.delUrl,
          method: 'delete',
          data: { roleId: row.roleId }
        }).then(res => {
          if (res.code == '200') {
            this.success('删除成功!', () => {
              this.getData()
            })
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      changeStatus(row, flag) {
        let params = {}
        if (flag) {
          params.status = 1
        } else {
          params.status = 0
        }
        params.roleId = row.roleId
        this.$axios({
          url: this.api.updateStatusUrl,
          method: 'post',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.success('操作成功!', () => {
              this.getData()
            })
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      async addUser() {
        let params = {}, ids = []
        params.roleId = this.selectRole.roleId
        params.orgId = this.selectRole.orgId
        this.userData.forEach(item => {
          ids.push(item.userId)
        })
        params.userIds = ids
        console.log(this.userData, 'this.userData')
        await this.getUserFormData(params)
        this.userForm.resetFields()
        this.modalVisible = true
      },
      remove(row) {
        let params = {}
        params.roleId = this.selectRole.roleId
        params.userId = row.userId
        this.$axios({
          url: this.api.updateUserUrl,
          method: 'post',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.success('移除成功!', () => {
              this.getUserData({ roleId: this.selectRole.roleId })
            })
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      userSubmit() {
        this.userLoading = true
        this.userForm.validateFields((err, values) => {
          if (!err) {
            let params = values
            params.roleId = this.selectRole.roleId
            this.$axios({
              url: this.api.updateUserUrl,
              method: 'post',
              data: params
            }).then(res => {
              if (res.code == '200') {
                this.success('保存成功!', () => {
                  this.getUserData({ roleId: this.selectRole.roleId })
                  this.modalVisible = false
                  this.userLoading = false
                })
              } else {
                this.userLoading = false
                this.warn(res.msg)
              }
            }).catch(err => {
              this.userLoading = false
              this.error(err)
            })
          } else {
            this.userLoading = false
          }
        })
      },
      setCurrent() {
        this.$refs.table.setCurrentRow(this.dataSource[0])
      },
      currentChange(row) {
        if (row) {
          this.selectRole = row
          this.disabled = false
          this.getUserData({ roleId: row.roleId })
        } else {
          this.selectRole = {}
          this.userData = []
          this.disabled = true
        }
      },
      pageChange(page, size) {
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.offset = (page - 1) * size
        this.getData(params)
      },
      sizeChange(current, size) {
        this.current = 1
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = size
        this.getData(params)
      },
      getData(obj = {}) {
        this.spinning = true
        this.$axios({
          url: this.api.roleUrl,
          method: 'put',
          data: obj
        }).then(res => {
          if (res.code == '200') {
            this.dataSource = this.$dateFormat(res.rows, ['editTime'])
            this.total = res.total
            this.setCurrent()
            this.spinning = false
          } else {
            this.spinning = false
            this.warn(res.msg)
          }
        }).catch(err => {
          this.spinning = false
          this.error(err)
        })
      },
      getUserData(obj = {}) {
        this.uerSpin = true
        this.$axios({
          url: this.api.userUrl,
          method: 'post',
          data: obj
        }).then(res => {
          if (res.code == '200') {
            this.userData = res.rows
            this.uerSpin = false
          } else {
            this.uerSpin = false
            this.warn(res.msg)
          }
        }).catch(err => {
          this.uerSpin = false
          this.error(err)
        })
      },
      getOrgData(obj = {}) {
        this.$axios({
          url: this.api.orgUrl,
          method: 'put',
          data: obj
        }).then(res => {
          if (res.code == '200') {
            this.orgData = this.getOrgTreeData(res.rows, undefined)
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
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
      getUserFormData(obj = {}) {
        return new Promise((resolve, reject) => {
          this.$axios({
            url: this.api.userByOrgUrl,
            method: 'post',
            data: obj
          }).then(res => {
            if (res.code == '200') {
              this.userForData = res.rows
            } else {
              this.warn(res.msg)
            }
            resolve()
          }).catch(err => {
            this.error(err)
            reject(err)
          })
        })
      },
      handleSearch(value) {
        console.log(value, 'value')
        console.log(this.selectRole, 'this.selectRole')
        let params = { keyword: value, orgId: this.selectRole.orgId, roleId: this.selectRole.roleId,userIds:this.userData }
        this.$axios({
          url: this.api.userByOrgUrl,
          method: 'post',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.userForData = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      }
    }
  }
</script>