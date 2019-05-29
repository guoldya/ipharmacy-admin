<template>
  <a-card>
    <div class="cardHead">
      <a href="#" @click.prevent="backTo">
        <a-icon type="left"></a-icon>
        返回
      </a>
    </div>
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="编码"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input read-only v-decorator="['orgId', {rules: [{ required: true, message: '<系统自动生成>' }]}]"/>
      </a-form-item>
      <a-form-item
        label="名称"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input
          v-decorator="['title', {rules: [{ required: true, message: '请输入名称' }]}]"/>
      </a-form-item>
      <a-form-item
        label="机构代码"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input
          v-decorator="['orgCode', {rules: [{ required: true, message: '请输入机构代码' }]}]"/>
      </a-form-item>
      <a-form-item
        label="机构类型"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select v-decorator="[ 'orgType']">
          <a-select-option v-for="(op,index) in this.enum.orgType" :value="op.id" :key="index">{{op.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="医院分类"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select v-decorator="[ 'orgClass']">
          <a-select-option v-for="(op,index) in this.enum.orgType" :value="op.id" :key="index">{{op.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 20, offset: 10 }"
      >
        <a-button class="margin-left-20" type="primary" @click="handleSubmit">保存</a-button>
        <a-button class="margin-left-20" @click="backTo">取消</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
  import {reviewAuditlevelUpdate} from '@/api/login'
  import ATextarea from 'ant-design-vue/es/input/TextArea'

  export default {
    components: { ATextarea },
    data() {
      return {
        api: {
          selectClassListWithMoreParam: '/sys/dicBase/selectClassListWithMoreParam'
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
        levelColor:'#000',
        listData:{},
        readOnly:false,
        enumList:[],
      }
    },
    computed: {},
    mounted() {
      this.getEnumList()
    },
    methods: {
      getEnumList() {
        console.log(this.$api.selectClassListWithMoreParam, '枚举值')
        this.loading = true
        //orgTyoe
        let parameter = {
          codeClass: ['34', '33']
        }
        this.$axios({
          url: this.api.selectClassListWithMoreParam,
          method: 'put',
          data: parameter
        })
          .then(res => {
            console.log(res.data, '枚举值')
            if (res.code == '200') {
              this.enumList = res.data

              this.loading = false
            } else {
              this.loading = false
              this.warn(res.msg)
            }
            this.getData()
          })
          .catch(err => {
            this.getData()
            this.loading = false
            this.error(err)
          })
      },
      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            reviewAuditlevelUpdate(values).then(res => {
              if (res.code == '200') {
                this.$message.info('保存成功!')
                this.backTo()
              } else {
                this.$message.error('保存失败!')
                this.warn(res.msg)
              }
            }).catch(err => {
              this.error(err)
            })
          }
        })
      },
      backTo() {
        this.$router.push({
          name: 'sys_org'
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
    color: #1694fb
  }
  .m-colorPicker .colorBtn[data-v-11842410] {
    width: 38px;
    height: 38px;
    border-radius: 10%;
  }
  .colorPick{
    margin-left: 15px;
    z-index: 3;
  }
</style>