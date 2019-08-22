<template>
  <div>
    <a-row>
      <a-col :span="16">
        <a-input-search placeholder="请输入" @search="onChange"/>
      </a-col>
      <a-col :span="8" class="treeCol">
        <a-dropdown :trigger="['click']">
          <a class="more">
            操作
            <a-icon type="down"/>
            <a-popconfirm
              :title="popTitle"
              @confirm="confirm"
              class="pop"
              :visible="visible"
              @cancel="cancel"
            ></a-popconfirm>
          </a>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="new" @click="newTreeNode">新增</a-menu-item>
            <a-menu-item key="update" v-if="classification.disable" @click="updateTreeNode">编辑</a-menu-item>
            <a-menu-item style="color: #2D8cF0" key="enable" v-if="nodeData.status == 0&&classification.disable">启用
            </a-menu-item>
            <a-menu-item style="color: #ff9900" key="disable" v-else-if="nodeData.status == 1&&classification.disable">
              停用
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-col>
    </a-row>
    <a-row>
      <a-spin tip="加载中..." :spinning="loading">
        <a-tree class="draggable-tree" :treeData="gData"  :autoExpandParent="false" :loadData="onLoadData"
                :loadedKeys="loadedKeys"  @select="onSelect" @load="expandTree" ></a-tree>
      </a-spin>
    </a-row>
    <a-modal
      :title="Modal.title"
      :visible="Modal.visible"
      @ok="handleOk"
      :confirmLoading="Modal.confirmLoading"
      @cancel="handleCancel"
      class="ruleModal"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-form-item
          v-if="!classification.disable && Modal.title == '新增分类'"
          style="padding-top: 20px"
          label="上级分类"
          v-bind="formItemLayout"
        >
          <a-input disabled v-model="fatherTitle"></a-input>
        </a-form-item>
        <a-form-item
          v-if="detailData.pid && Modal.title == '编辑分类'"
          style="padding-top: 20px"
          label="上级分类"
          v-bind="formItemLayout"
        >
          <a-input disabled  v-model="detailData.pidName"></a-input>
        </a-form-item>
        <a-form-item
          v-if="classification.disable && Modal.title == '新增分类'"
          style="padding-top: 20px"
          label="上级分类"
          v-bind="formItemLayout"
        >
          <a-input disabled v-model="fatherTitle">
            <!--<a-tooltip placement="top">-->
            <!--<template slot="title" style="width: 100px">-->
            <!--选择为顶级分类-->
            <!--</template>-->
            <a-icon slot="addonAfter" class="icon" @click="deleteFather" type="minus-circle"/>
            <!--</a-tooltip>-->
          </a-input>
        </a-form-item>
        <a-form-item
          label="分类名称"
          v-if=" Modal.title == '新增分类'"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[ 'categoryName',{rules: [{ required: true, message: '请输入分类名称' }]} ] "
            placeholder="请输入分类名称"
          />
        </a-form-item>
        <a-form-item
          label="分类名称"
          style="padding-top: 20px"
          v-if="!detailData.pid && Modal.title == '编辑分类'"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[ 'categoryName',{rules: [{ required: true, message: '请输入分类名称' }]} ] "
            placeholder="请输入分类名称"
          />
        </a-form-item>
        <a-form-item
          label="分类名称"
          v-else-if="detailData.pid && Modal.title == '编辑分类'"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[ 'categoryName',{rules: [{ required: true, message: '请输入分类名称' }]} ] "
            placeholder="请输入分类名称"
          />
        </a-form-item>
        <a-form-item label="拼音码"  v-bind="formItemLayout">
          <a-input v-decorator="[ 'spellCode' ]" placeholder="为空时后台自动生成"/>
        </a-form-item>
        <a-form-item label="分类属性"  v-bind="formItemLayout">
          <a-select allowClear v-decorator="[ 'categoryProperty' ]">
            <a-select-option
              :value="op.id"
              v-for="(op,index) in codeClassData"
              :key="index"
            >{{op.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态"  v-bind="formItemLayout">
          <a-radio-group v-decorator="[ 'status' ]">
            <a-radio :value="op.id" v-for="(op,index) in this.enum.status" :key="index">{{op.text}}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import treeTable from '@/components/tree-table/treeTable.vue'

  export default {
    name: 'drugClassification',
    components: {
      'a-treeTable': treeTable
    },
    props: {
      onSelect: {
        Function
      },
      nodeData: {
        Object
      },
      classification: {
        Object
      },
      disable: {
        Boolean
      }
    },
    data() {
      return {
        api: {
          drugCategoryList: 'sys/dicDrugcategory/selectList',
          dicDrugSelectList: 'sys/dicBase/selectClassList',
          drugCategoryUpdate: 'sys/dicDrugcategory/update',
          updateStatus: 'sys/dicDrugcategory/updateStatus',
          selectOne: 'sys/dicDrugcategory/selectOne'
        },
        columns: [],
        baseData: [],
        items: [],
        isOpcol: true,
        loading: false,
        loadedKeys: [],
        gData: [],
        codeClassData: [],
        visible: false,
        popTitle: '',
        clickItem: '',
        newDataId: '',
        Modal: {
          title: '',
          visible: false,
          confirmLoading: false
        },
        detailData:{},
        fatherTitle: '',
        fatherId: null,
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 15 }
        },
      }
    },
    mounted() {
      this.getData({ pid: -1 })
      this.getDicBase()
    },
    methods: {
      getData(params = {}) {
        this.loading = true
        this.$axios({
          url: this.api.drugCategoryList,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.loading = false
              this.dealData(res.rows,params)
            } else {
              this.loading = false
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
            this.loading = false
          })
      },
      getDicBase() {
        let params = {}
        params.codeClass = 38
        this.$axios({
          url: this.api.dicDrugSelectList,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.codeClassData = res.rows
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      dealData(data,params) {
        this.gData = [];

        for (let i in data) {
          if (this.$util.trim(params.keyword)){
            data[i].isleaf = 0;
          }
          let isleaf = false
          if (data[i].isleaf == 1) {
            isleaf = false
          } else {
            isleaf = true
          }
          this.gData.push({
            key: data[i].categoryId,
            title: data[i].categoryName,
            isLeaf: isleaf,
            status: data[i].status,
            categoryCode: data[i].categoryCode,
            spellCode: data[i].spellCode,
            categoryProperty: data[i].categoryProperty,
            pid: data[i].pid,
            categoryType: data[i].categoryType
          })
        }
      },
      //延迟加载树
      onLoadData(treeNode) {
        return new Promise(resolve => {
          if (treeNode.dataRef.children) {
            resolve()
            return
          }
          setTimeout(() => {
            let params = {}
            params.pid = treeNode.dataRef.key
            this.$axios({
              url: this.api.drugCategoryList,
              method: 'put',
              data: params
            })
              .then(res => {
                if (res.code == '200') {
                  treeNode.dataRef.children = []
                  for (let i in res.rows) {
                    let isLeaf = false
                    if (res.rows[i].isleaf == 1) {
                      isLeaf = false
                    } else {
                      isLeaf = true
                    }
                    treeNode.dataRef.children.push({
                      key: res.rows[i].categoryId,
                      title: res.rows[i].categoryName,
                      isLeaf: isLeaf,
                      status: res.rows[i].status,
                      categoryCode: res.rows[i].categoryCode,
                      spellCode: res.rows[i].spellCode,
                      categoryProperty: res.rows[i].categoryProperty,
                      pid: res.rows[i].pid,
                      categoryType: res.rows[i].categoryType
                    })
                  }
                  this.gData = [...this.gData]
                } else {
                  this.warn(res.msg)
                }
              })
              .catch(err => {
                this.error(err)
              })
            resolve()
          }, 100)
        })
      },
      newTreeNode() {
        this.fatherTitle = this.nodeData.title
        this.fatherId = this.nodeData.key
        this.Modal.visible = true
        this.Modal.title = '新增分类'
        this.form.resetFields()
        setTimeout(() => {
          this.form.setFieldsValue({
            status: '1'
          })
        }, 0)
      },
      updateTreeNode() {
        this.Modal.visible = true
        this.Modal.title = '编辑分类'
        let params = {}
        this.$axios({
          url: this.api.selectOne,
          method: 'put',
          data: { categoryId: this.nodeData.key }
        })
          .then(res => {
            if (res.code == '200') {
              params = res.data
              this.detailData = res.data;
              setTimeout(() => {
                this.form.setFieldsValue({
                  categoryName: params.categoryName,
                  spellCode: params.spellCode,
                  categoryProperty: params.categoryProperty,
                  status: params.status,
                })
              }, 100)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      enableTreeNode() {
        let params = {}
        if (this.nodeData.status == '1') {
          params.status = '0'
        } else {
          params.status = '1'
        }
        params.categoryId = this.nodeData.key
        params.categoryName = this.nodeData.title
        params.categoryCode = this.nodeData.categoryCode
        params.spellCode = this.nodeData.spellCode
        params.categoryType = this.nodeData.categoryType
        this.$axios({
          url: this.api.updateStatus,
          method: 'post',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.updateGdata(params, this.gData)
              this.Modal.visible = false
               this.success('保存成功!')
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      //modal 提交
      handleOk(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.Modal.title == '编辑分类') {
              values.categoryCode = this.nodeData.categoryCode
              values.categoryId = this.nodeData.key
              values.pid = this.nodeData.pid
            } else {
              values.pid = this.fatherId
            }
            values.categoryType = 2
            this.$axios({
              url: this.api.drugCategoryUpdate,
              method: 'post',
              data: values
            })
              .then(res => {
                if (res.code == '200') {
                  if (this.Modal.title == '编辑分类') {
                    this.updateGdata(values, this.gData)
                  } else if (this.Modal.title == '新增分类' && this.nodeData.children) {
                    this.newDataId = res.data
                    values.categoryId = this.newDataId
                    if (values.pid) {
                      this.addGdata(values, this.gData)
                        this. getData({pid: -1})
                    }
                  } else if (this.Modal.title == '新增分类' && !this.nodeData.children) {
                    values.categoryId = res.data
                    this.addFatherData(values, this.gData)
                      this. getData({pid: -1})
                  }
                  this.Modal.visible = false
                 this.success('保存成功!')
                 
                } else {
                  this.warn(res.msg)
                }
              })
              .catch(err => {
                this.error(err)
              })
          }
        })
      },
      //本地编辑时修改gdata
      updateGdata(params, gdata) {
        for (let i in gdata) {
          let item = gdata[i]
          if (item.key == params.categoryId) {
            item.title = params.categoryName
            item.status = params.status
            return
          } else if (item.children) {
            this.updateGdata(params, item.children)
          }
        }
      },
      addGdata(params, gdata) {
        let obj = {}
        obj.key = params.categoryId
        obj.title = params.categoryName
        obj.pid = params.pid
        obj.spellCode = params.spellCode
        obj.categoryType = params.categoryType
        obj.categoryProperty = params.categoryProperty
        obj.status = params.status
        obj.isLeaf = true
        for (let i in gdata) {
          let item = gdata[i]
          if (item.key == params.pid) {
            item.children.push(obj)
            return
          } else if (item.children) {
            this.addGdata(params, item.children)
          }
        }
      },
      addFatherData(params, gdata) {
        let obj = {}
        obj.key = params.categoryId
        obj.categoryProperty = params.categoryProperty
        obj.title = params.categoryName
        obj.spellCode = params.spellCode
        obj.categoryType = params.categoryType
        obj.status = params.status
        obj.isLeaf = true
        gdata.push(obj)
      },
      //modal 取消
      handleCancel() {
        this.Modal.visible = false
      },
      // onSelect(selectedKeys, e) {
      //   this.nodeData = e.node.dataRef
      //   this.disable = false
      // },

      //操作点击事件
      handleMenuClick(e) {
        if (e.key == 'new') {
          this.visible = false
          this.clickItem = 'new'
        } else if (e.key == 'update') {
          this.visible = false
          this.clickItem = 'update'
        } else if (e.key == 'enable') {
          this.visible = true
          this.popTitle = '确认启用？'
          this.clickItem = 'enable'
        } else if (e.key == 'disable') {
          this.visible = true
          this.popTitle = '确认停用？'
          this.clickItem = 'disable'
        }
      },
      //删除父级
      deleteFather() {
        this.fatherTitle = ''
        this.fatherId = null
      },
      cancel() {
        this.visible = false
      },
      confirm() {
        this.enableTreeNode()
        this.visible = false
      },
      onChange(value) {
        this.loadedKeys = []
        if (this.$util.trim(value)) {
          this.gData = []
          let params = { keyword: value }
          this.getData(params)
        } else {
          this.gData = []
          let data = { pid: -1 }
          this.getData(data)
        }
      },
      expandTree(loadedKeys, expanded) {
        this.loadedKeys = loadedKeys
      },
    }
  }
</script>

<style>
  .disableNode {
    color: #2d8cf0;
  }

  .ruleCow .ant-tree li {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon {
    cursor: pointer;
  }

  .treeCol {
    text-align: right;
  }
</style>