<template>
  <div class="ruleContent">
    <a-card>
      <div class="cardHead">
        <a href="#" @click.prevent="backTo">
          <a-icon type="left"></a-icon>
          返回
        </a>
      </div>
      <a-spin tip="加载中..." :spinning="spinning">
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item label="编码" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-tree-select
              v-if="isedit"
              :disabled='isedit'
              class="readOnlyInput"
              :treeData="treedata"
              placeholder="请选择"
              @select="treeDataSelect"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              v-decorator="[
                'id',
                {
                  rules: [{
                    required: true,
                    message: '请选择上级编码',
                  }],
                }
              ]"
            ></a-tree-select>
            <a-tree-select
              v-else
              :treeData="treedata"
              placeholder="请选择"
              @select="treeDataSelect"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              v-decorator="[
                'id',
                {
                  rules: [{
                    required: true,
                    message: '请选择上级编码',
                  }],
                }
              ]"
            ></a-tree-select>
          </a-form-item>
          <a-form-item label="数据源" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select v-decorator="[ 'dsId']">
              <a-select-option v-for="(op,index) in lists" :value="op.id" :key="index">{{op.dsName}}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :read-only="readOnly"
              v-decorator="['dsName',{rules:[{ max:10,message:'最多10个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="sql文本" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-textarea
              :read-only="readOnly"
              :autosize="{ minRows: 2, maxRows: 9 }"
              v-decorator="['sqlText',{rules:[{ required: true,message:'请输入sql文本'},{ max:2000,message:'最多2000个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="值" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              v-if="valueDisabled"
              v-decorator="['val',{rules:[{ required: true,message:'请输入值'},{ max:10,message:'最多10个字符' }]}]"
            />
            <a-input
              v-else
              v-decorator="['val',{rules:[{ max:10,message:'最多10个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="显示名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              v-if="valueDisabled"
              v-decorator="['display',{rules:[{ required: true,message:'请输入显示名称'},{ max:10,message:'最多10个字符' }]}]"
            />
            <a-input
              v-else
              v-decorator="['display',{rules:[{ max:10,message:'最多10个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="父级值" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              :read-only="readOnly"
              v-decorator="['parentId',{rules:[{ max:10,message:'最多10个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-radio-group v-decorator="['status']">
              <a-radio v-for="(op,index) in status" :value="op.id" :key="index">{{op.text}}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 9, offset: 7 }">
            <a-alert message="在oracle数据库中建议值、显示名称，父级值大写" banner/>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
<!--            <a-button  @click="handleSubmit">校验</a-button>-->
            <a-button type="primary" :loading="loading"  @click="handleSubmit">保存</a-button>
            <a-button class="margin-left-20" @click="backTo">取消</a-button>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-card>
  </div>
</template>
<script>
  import ATextarea from 'ant-design-vue/es/input/TextArea'

  export default {
    components: { ATextarea },
    data() {
      return {
        api: {
          selectOne: 'sys/coreRuleDatasource/selectOne',
          updt: 'sys/coreRuleDatasource/update',
          dataFrom: 'sys/coreDbDatasource/selectList',
          selectTitlesList: 'sys/coreFactCol/selectListNonHaveRuleDb',
          insert: 'sys/coreRuleDatasource/insert',
          checkSqlName:'sys/coreRuleDatasource/superSqlAndSuperName'
    },
        spinning: false,
        labelCol: {
          xs: { span: 8 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 8 },
          sm: { span: 8 }
        },
        status: [{ id: 0, text: '停用' }, { id: 1, text: '启用' }],
        form: this.$form.createForm(this),
        roleCode: '',
        loadData: [],
        levelColor: '#000',
        listData: {},
        readOnly: false,
        isNew: true,
        lists: [],
        treedata: [],
        isedit: true,
        valueDisabled: false,
        loading:false,
      }
    },
    computed: {},
    created() {
      if (this.$route.params.id == 'new') {
        this.isedit = false
      }
      setTimeout(() => {
        this.form.setFieldsValue({ status: 1 })
      })
    },
    mounted() {
      this.getTreeList()
      this.getDatas()
      this.getselectData({ id: this.$route.params.id })
    },
    methods: {
      // 编号的树形结构
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
              this.treedata = this.getDataChildren(res.rows, undefined)
              this.getnewData(this.treedata)
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
      getDataChildren(bdata, pid) {
        var items = []
        for (var key in bdata) {
          var item = bdata[key]
          if (pid == item.pid) {
            items.push({
              title: item.colName,
              value: item.id + '',
              lo: item.lo,
              children: this.getDataChildren(bdata, item.id)
            })
          }
        }
        return items
      },
      // 二次递归
      getnewData(data) {
        for (var key in data) {
          var item = data[key]
          if (data[key].children.length > 0) {
            data[key].disabled = true
            this.getnewData(data[key].children)
          } else {
            data[key].disabled = false
          }
        }
      },
      // 数据源的查询
      getDatas() {
        let params = {}
        //  params.id=this.$route.params.id=='new'?'':this.$route.params.id
        this.$axios({
          url: this.api.dataFrom,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.lists = res.rows
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
      // 查询数据
      getselectData(params = {}) {
        if (this.$route.params.id !== 'new') {
          this.$axios({
            url: this.api.selectOne,
            method: 'put',
            data: params
          })
            .then(res => {
              if (res.code == '200') {

                let reqArr = res.data
                let id = '' + reqArr.id
                let { dsId, dsName, sqlText, val, display, status,parentId } = reqArr,
                  formData = {
                    id,
                    dsId,
                    dsName,
                    sqlText,
                    val,
                    display,
                    status,
                    parentId,
                  }
                this.form.setFieldsValue(formData)
                if (res.data.lo == '3') {
                  this.valueDisabled = true
                } else {
                  this.valueDisabled = false
                }
              } else {
                this.warn(res.msg)
              }
            })
            .catch(err => {
              this.loadingTable = false
              this.error(err)
            })
        }
      },

      handleSubmit(e) {
        this.loading = true;
        e.preventDefault()
        let fieldsData = this.form.getFieldsValue();
        let checkData = {};
        checkData.sqlText = fieldsData.sqlText;
        checkData.val = fieldsData.val;
        checkData.display = fieldsData.display;
        checkData.parentId = fieldsData.parentId;
        this.$axios({
          url: this.api.checkSqlName,
          method: 'post',
          data: checkData
        })  .then(res => {
          if (res.code == '200') {
            this.submitForm();
          } else {
            this.loading = false;
            this.warn(res.msg)
          }
        })
      },

      //submit
      submitForm(){
        this.loading = true;
        this.form.validateFields((err, values) => {
          if (!err) {
            let urls
            urls = this.$route.params.id == 'new' ? 'insert' : 'updt'
            this.$axios({
              url: this.api[urls],
              method: 'post',
              data: values
            })
              .then(res => {
                if (res.code == '200') {
                  this.loading = false;
                  this.success(res.msg)
                  this.backTo()
                } else {
                  this.loading = false;
                  this.warn(res.msg)
                }
              })
              .catch(err => {
                this.loading = false;
                this.error(err)
              })
          }
        })
      },
      backTo() {
        this.$router.push({
          name: 'ruleEngindex'
        })
      },
      confirm(e) {
      },
      handlesColor(data) {
        if (data) {
          this.listData.levelColor = data
        }
      },
      //树选择事件
      treeDataSelect(value, node, extra) {
        console.log(value, 'value')
        console.log(node.$vnode.data.props.lo, 'node')
        if (node.$vnode.data.props.lo == '3') {
          this.valueDisabled = true
        } else {
          this.valueDisabled = false
        }
      }
    }
  }
</script>
<style lang='less'>
  .ruleContent {


    .btn {
      margin: 0 5px;
    }

    .spanBtn {
      color: #1694fb;
    }

    .m-colorPicker .colorBtn[data-v-11842410] {
      width: 38px;
      height: 38px;
      border-radius: 10%;
    }

    .colorPick {
      margin-left: 15px;
      z-index: 3;
    }

    .ant-select-tree-treenode-disabled {
      color: black;
    }
  }
</style>