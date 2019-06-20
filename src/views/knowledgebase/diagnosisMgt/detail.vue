<template>
  <a-card>
    <div class="cardHead">
      <a href="#" @click.prevent="backTo">
        <a-icon type="left"></a-icon>返回
      </a>
    </div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input read-only v-decorator="['id',]"/>
      </a-form-item>
      <a-form-item label="ICD编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['icdcode']"/>
      </a-form-item>
      <a-form-item label="附加编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['addcode']"/>
      </a-form-item>
      <a-form-item label="自定义编码1" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['defcode1']"/>
      </a-form-item>
      <a-form-item label="自定义编码2" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['defcode2']"/>
      </a-form-item>
      <a-form-item label="拼音码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['spellcode']"/>
      </a-form-item>
      <a-form-item label="自定义名称" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['icdname']"/>
      </a-form-item>
      <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-textarea :read-only="readOnly" v-decorator="['remark']"/>
      </a-form-item>
      <a-form-item label="诊断类型" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select v-decorator="[ 'icdtype']">
          <a-select-option
            v-for="(op,index) in this.enum.icdType"
            :value="op.id"
            :key="index"
          >{{op.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select v-decorator="[ 'statu']">
          <a-select-option
            v-for="(op,index) in this.enum.statu"
            :value="op.id"
            :key="index"
          >{{op.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
        <a-button type="primary" @click="handleSubmit">保存</a-button>
        <a-button class="margin-left-20" @click="backTo">取消</a-button>
      </a-form-item>
    </a-form>
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
        diagnosisMgtupdate: '/sys/dicIcd/update',
        diagnosisMgtselectPage: '/sys/dicIcd/selectPage'
      },
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 }
      },
      form: this.$form.createForm(this),
      roleCode: '',
      loadData: [],
      levelColor: '#000',
      listData: {},
      readOnly: false,
      patientid: '',
      formData: []
    }
  },
  computed: {},
  mounted() {
    this.getselectData({ patientid: this.$route.params.patientid, id: this.$route.params.id })
    let _this = this
    if (this.$route.query) {
      if (this.$route.query.msg !== 'new') {
        _this.listData = this.$route.query
        _this.form.setFieldsValue({})
        this.readOnly = this.$route.query.levelType == 1 ? true : false
        if (this.$route.query.levelColor) {
          _this.levelColor = this.$route.query.levelColor
        }
      } else {
        this.readOnly = false
        _this.form.setFieldsValue({ levelName: this.$route.query.length + '级' })
      }
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.$route.query.msg == 'new') {
            let params = values
            params.patientid = this.$route.query.patientid
            this.$axios({
              url: this.api.diagnosisMgtupdate,
              method: 'post',
              data: params
            })
              .then(res => {
                if (res.code == '200') {
                  this.$message.info('保存成功!')
                  this.backTo()
                }
              })
              .catch(err => {
                this.loadingTable = false
                this.error(err)
              })
          }
          if (this.$route.query.msg !== 'new') {
            let params = values
            params.patientid = this.$route.query.patientid

            this.$axios({
              url: this.api.diagnosisMgtupdate,
              method: 'post',
              data: params
            })
              .then(res => {
                if (res.code == '200') {
                  this.$message.info('保存成功!')
                  this.patientid = this.$route.query.patientid
                  this.backTo()
                }
              })
              .catch(err => {
                this.loadingTable = false
                this.error(err)
              })
          }
        }
      })
    },
    // 查询数据
    getselectData(params = {}) {
      this.$axios({
        url: this.api.diagnosisMgtselectPage,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            let arr = res.rows
            let reqArr = []
            arr.map(item => {
              if (item.id == this.$route.params.id) {
                reqArr = item
              }
            })
            let { id, icdcode, addcode, defcode1, defcode2, spellcode, icdname, remark, icdtype, status } = reqArr,
              formData = { id, icdcode, addcode, defcode1, defcode2, spellcode, icdname, remark, icdtype, status }
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
    },
    backTo() {
      this.$router.push({
        name: 'diagnosisIndex'
      })
    },
    confirm(e) {},
    handlesColor(data) {
      if (data) {
        console.log(data)
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