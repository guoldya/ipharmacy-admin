<template>
  <a-card>
    <div class="cardHead">
      <a href="#" @click.prevent="backTo">
        <a-icon type="left"></a-icon>返回
      </a>
    </div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input class="readOnlyInput"  :disabled="true"    placeholder='<系统自动生产>' v-decorator="['id',]"/>
      </a-form-item>
      <a-form-item label="ICD编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly"  placeholder='ICD编码...' v-decorator="['icdcode', {rules: [{ required: true, message: '请输入编号' },{max: 20,message:'最多输入20个字'}]}]"/>
      </a-form-item>
      <a-form-item label="附加编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['addcode',{rules:[,{max: 20,message:'最多输入20个字'}]}]"/>
      </a-form-item>
      <a-form-item label="自定义编码1" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['defcode1',{rules:[,{max: 20,message:'最多输入20个字'}]}]"/>
      </a-form-item>
      <a-form-item label="自定义编码2" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['defcode2',{rules:[,{max: 20,message:'最多输入20个字'}]}]"/>
      </a-form-item>
      <a-form-item label="拼音码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['spellcode',{rules:[,{max: 50,message:'最多输入50个字'}]}]"/>
      </a-form-item>
      <a-form-item label="自定义名称" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['icdname',{rules:[{ required: true, message: '请输入编号' },{max: 200,message:'最多输入200个字'}]}]"/>
      </a-form-item>
      <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-textarea :read-only="readOnly" v-decorator="['remark',{rules:[,{max: 2000,message:'最多输入2000个字'}]}]"/>
      </a-form-item>
      <a-form-item label="诊断类型" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select v-decorator="[ 'icdtype',{rules: [{ required: true, message: '选择诊断类型' },]}]">
          <a-select-option
            v-for="(op,index) in this.enum.icdType"
            :value="op.id"
            :key="index"
          >{{op.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="状态"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-radio-group v-decorator="[ 'status',{initialValue:'0'}]">
          <a-radio v-for="(op,index) in this.enum.status" :value="op.id" :key="index">{{op.text}}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
        <a-button :loading="loadingTable" type="primary" @click="handleSubmit">保存</a-button>
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
        diagnosisMgtselectPage: '/sys/dicIcd/selectOne'
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
      readOnly: false,
      patientid: '',
      formData: [],
      loadingTable:false,
    }
  },
  computed: {},
  mounted() {
    if (this.$route.params.id == 'n') {
      this.isNew = true
    }else{
      this.isNew = false;
      this.getselectData({  id: this.$route.params.id })
    }
  },
  methods: {
    handleSubmit(e) {
      this.loadingTable = true;
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
           this.loadingTable = false;
            let params = values
          if (this.$route.params.patientid != 'n'){
            params.patientid = this.$route.params.patientid
          }
            this.$axios({
              url: this.api.diagnosisMgtupdate,
              method: 'post',
              data: params
            })
              .then(res => {
                if (res.code == '200') {
                  this.$message.info('保存成功!')
                  this.backTo();
                  this.loadingTable = false
                }else{
                  this.loadingTable = false
                }
              })
              .catch(err => {
                this.loadingTable = false
                this.error(err)
              })
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
            let arr = res.data          
            let { id, icdcode, addcode, defcode1, defcode2, spellcode, icdname, remark, icdtype, status } = arr,
              formData = { id, icdcode, addcode, defcode1, defcode2, spellcode, icdname, remark, icdtype, status }
            this.form.setFieldsValue(formData);
            if (arr.icdtype == '1'){
              this.readOnly =true
            } else{
              this.readOnly =false
            }
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    backTo() {
      this.$router.push({
        name: 'diagnosisIndex'
      })
    },
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