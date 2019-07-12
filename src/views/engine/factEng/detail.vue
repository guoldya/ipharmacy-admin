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
          <a-input read-only placeholder="由系统自动生成,无需填写" v-decorator="['id']" />
        </a-form-item>
        <a-form-item label="上级编号" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-tree-select
            :treeData="treedata"
            placeholder="请选择"
            v-decorator="[
                'pid',
                {   
                }
              ]"
          ></a-tree-select>
        </a-form-item>
        <a-form-item label="类型" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select
            v-decorator="[ 'colType',{
                  rules: [{
                    required: true,
                    message: '请选择类型',
                  }],
                }]"
          >
            <a-select-option
              v-for="(op,index) in this.enum.coltype"
              :value="op.id"
              :key="index"
            >{{op.text}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['colName',{rules:[{message:'请输入名称',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="列编码" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['colCode',{rules:[{message:'请输入列编码',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="显示顺序" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['colNo',{rules:[{pattern:/^\d{1,100}$/,message:'请输入显示顺序',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="数据库" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['sql',{rules:[{message:'请输入数据库',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="扩展字段" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['dbId',{rules:[{pattern:/^\d{1,100}$/,message:'请输入数字',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="属性类型" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select
            v-decorator="[ 'colDbType',{
                  rules: [{
                    required: true,
                    message: '请选择属性类型',
                  }],
                }]"
          >
            <a-select-option
              v-for="(op,index) in this.enum.attributeType"
              :value="op.id"
              :key="index"
            >{{op.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="逻辑运算" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select
            v-decorator="[ 'lo',{
                  rules: [{
                      
                    required: true,
                    message: '请选择逻辑运算',
                  }],
                }]"
          >
            <a-select-option
              v-for="(op,index) in this.enum.logical"
              :value="op.id"
              :key="index"
            >{{op.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-radio-group v-decorator="[ 'status']">
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
        selectOne: 'sys/coreFactCol/selectOne',
        updt: 'sys/coreFactCol/update',
        selectTree: 'sys/coreFactCol/selectListWithoutSelf'
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
      treedata:[]
    }
  },
  computed: {},
  mounted() {
    this.getselectData({ id: this.$route.params.id })
    this.getTree({ id: this.$route.params.id })
  },
  methods: {
    getTree(params = {}) {
      this.$axios({
        url: this.api.selectTree,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
           this.treedata = this.getDataChildren(res.rows, undefined)
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
    // 递归形成树状结构
     getDataChildren(bdata, pid) {
      var items = []
      for (var key in bdata) {
        var item = bdata[key]
        if (pid == item.parentId) {
          items.push({
            title: item.colName,
            // value: item.id,
            key: item.id,
            children: this.getDataChildren(bdata, item.id)
          })
        }
      }
      return items
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
              console.log('dddd')
              let { id, pie, colType, conName, colCode, colDbType, colNo, colSql, dbId, status, lo } = reqArr,
                formData = {
                  id,
                  pie,
                  colType,
                  conName,
                  colCode,
                  colDbType,
                  colNo,
                  colSql,
                  dbId,
                  status,
                  lo
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
          this.$axios({
            url: this.api.updt,
            method: 'post',
            data: values
          })
            .then(res => {
              if (res.code == '200') {
                this.$message.info('保存成功!')
                this.backTo()
              } else {
                this.$message.error('保存失败!')
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
        name: 'factEngindex'
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