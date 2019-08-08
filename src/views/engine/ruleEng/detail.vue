<template>
  <a-card>
    <div class="cardHead">
      <a href="#" @click.prevent="backTo">
        <a-icon type="left"></a-icon>返回
      </a>
    </div>
    <a-spin tip="加载中..." :spinning="spinning">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="编码" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-tree-select
            :treeData="treedata"
            placeholder="请选择"
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
          <a-input  :read-only="readOnly" v-decorator="['dsName',{rules:[{ max:10,message:'最多10个字符' }]}]" />
        </a-form-item>
        <a-form-item label="sql文本" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-textarea  :read-only="readOnly" v-decorator="['sqlText',{rules:[{ required: true,message:'请输入sql文本'},{ max:2000,message:'最多2000个字符' }]}]" />
        </a-form-item>
        <a-form-item label="值" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input  :read-only="readOnly" v-decorator="['val',{rules:[{ max:10,message:'最多10个字符' }]}]" />
        </a-form-item>
        <a-form-item label="显示名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input  :read-only="readOnly" v-decorator="['display',{rules:[{ max:10,message:'最多10个字符' }]}]" />
        </a-form-item>
        <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-radio-group v-decorator="['status']">
            <a-radio v-for="(op,index) in status" :value="op.id" :key="index">{{op.text}}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
          <a-button type="primary" @click="handleSubmit">保存</a-button>
          <a-button class="margin-left-20" @click="backTo">取消</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>
<script>
import { reviewAuditlevelUpdate } from '@/api/login'
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
        insert:'sys/coreRuleDatasource/insert'
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
      treedata: []
    }
  },
  computed: {},
  created(){
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
        if (data[key].children.length>0) {
          data[key].disabled = true
          this.getnewData(data[key].children)
        } else {
          data[key].disabled = false
        }
      }
    },
    // 数据源的查询
    getDatas() {
       let params={};
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
              let id = ''+reqArr.id;
              let {  dsId, dsName, sqlText, val, display, status } = reqArr,
                formData = {
                  id,
                  dsId,
                  dsName,
                  sqlText,
                  val,
                  display,
                  status
                }
              this.form.setFieldsValue(formData)
            } else {
              this.loadingTable = false
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
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let urls
          urls=this.$route.params.id=='new'?'insert':'updt'
          this.$axios({
            url: this.api[urls],
            method: 'post',
            data: values
          })
            .then(res => {
              if (res.code == '200') {
                this.success(res.msg)
                this.backTo()
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
    backTo() {
      this.$router.push({
        name: 'ruleEngindex'
      })
    },
    confirm(e) {},
    handlesColor(data) {
      if (data) {
        this.listData.levelColor = data
      }
    }
  }
}
</script>
<style>
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
</style>