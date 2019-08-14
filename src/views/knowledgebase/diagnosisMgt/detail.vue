<template>
  <a-card>
    <div class="cardHead">
      <a href="#" @click.prevent="backTo">
        <a-icon type="left"></a-icon>返回
      </a>
    </div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          class="readOnlyInput"
          :disabled="true"
          placeholder="<系统自动生产>"
          v-decorator="['id',]"
        />
      </a-form-item>
      <a-form-item label="ICD编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          :read-only="readOnly"
          placeholder="ICD编码..."
          v-decorator="['icdcode', {rules: [{ required: true, message: '请输入编号' },{validator:checkChinese}]}, ]"
        />
      </a-form-item>
      <a-form-item label="附加编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          :read-only="readOnly"
          v-decorator="['addcode',{rules:[{validator:checkChinese}]}]"
        />
      </a-form-item>
      <a-form-item label="自定义编码1" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          :read-only="readOnly"
          v-decorator="['defcode1',{rules:[{validator:checkChinese}]}]"
        />
      </a-form-item>
      <a-form-item label="自定义编码2" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          :read-only="readOnly"
          v-decorator="['defcode2',{rules:[{validator:checkChinese}]}]"
        />
      </a-form-item>
      <a-form-item label="拼音码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          :read-only="readOnly"
          v-decorator="['spellcode',{rules:[{validator:checkChinese}]}]"
        />
      </a-form-item>
      <a-form-item label="自定义名称" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          :read-only="readOnly"
          v-decorator="['icdname',{rules:[{ required: true, message: '请输入编号' },{validator:checkChinese}]}]"
        />
      </a-form-item>
      <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-textarea
          :read-only="readOnly"
          v-decorator="['remark',{rules:[,{validator:checkChinese}]}]"
        />
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
      <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
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
        diagnosisMgtselectPage: '/sys/dicIcd/selectOne',
        selectPage: '/sys/dicIcd/selectPage'
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
      loadingTable: false,
      pid: ''
    }
  },
  created() {
    this.patientid = this.$route.params.patientid
  },
  computed: {},
  mounted() {
    if (this.$route.params.id == 'n') {
      this.isNew = true
    } else {
      this.isNew = false
      this.getselectData({ id: this.$route.params.id })
    }
  },
  methods: {
    //校验数据
    checkChinese(rule, value, callback) {
      if (value) {
        let obj = { icdcode: 20, addcode: 20, defcode1: 20, defcode2: 20, spellcode: 50, icdname: 200, remark: 2000 }
        console.log(obj[rule.field])
        let num = obj[rule.field]
        let newarr = value.match(/[^\x00-\xff]+/g) == null ? 0 : value.match(/[^\x00-\xff]+/g).join('').length
        // console.log(value.length, newarr)
        let endLength = value.length + newarr
        if (endLength > num) {
          callback('输入字符超过限制')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    handleSubmit(e) {
      this.loadingTable = true
      e.preventDefault()
      // console.log(this.form.getFieldsValue())
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = values
          if (this.$route.params.id != 'n') {
            if (this.pid == undefined) {
              params.patientid = ''
            } else {
              params.patientid = this.pid
            }
          }
          if (this.$route.params.id == 'n') {
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
                sessionStorage.setItem('patientid', this.patientid)
                this.backTo()
                this.loadingTable = false
              }
              if (res.code == '500') {
                this.warn(`${res.msg}！`)
                this.loadingTable = false
              } else {
                this.loadingTable = false
              }
            })
            .catch(err => {
              this.loadingTable = false
              this.error(err)
            })
        } else {
          this.loadingTable = false
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
            this.pid = res.data.patientid
            let { id, icdcode, addcode, defcode1, defcode2, spellcode, icdname, remark, icdtype, status } = arr,
              formData = { id, icdcode, addcode, defcode1, defcode2, spellcode, icdname, remark, icdtype, status }
            this.form.setFieldsValue(formData)
            // console.log(arr,'arr')
            // if (arr.icdtype == '1'){
            //   this.readOnly =true
            // } else{
            //   this.readOnly =false
            // }
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
    //获取网格分页
    getPageData(params = {}) {
      if (params.offset == 0) {
        this.current = 1
      }
      Object.assign(params, { offset: 0, pageSize: 10, patientid: this.patientid })
      this.$axios({
        url: this.api.selectPage,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.loadData = res.rows
            this.total = res.total

            this.disable = false
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