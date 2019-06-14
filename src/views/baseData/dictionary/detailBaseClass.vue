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
        label="分类编码"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-decorator="['classCode', {rules: [{ required: true,message: '请输入分类编码'  }]} ]"/>
      </a-form-item>
      <a-form-item
        label="分类名称"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-decorator="['name' ,{rules: [{ required: true,message: '请输入分类名称'  }]} ]"/>
      </a-form-item>
      <a-form-item
        label="标准代码"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-decorator="[ 'standardCode',{rules: [{ required: true,message: '请输入标准代码'  }]} ]"/>
      </a-form-item>
      <a-form-item
        label="备注"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-textarea v-decorator="[ 'remark']"/>
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 24, offset: 10 }"
      >
        <a-button type="primary" @click="handleSubmit">保存</a-button>
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
        api:{
        dicBaseClassUpdate:'sys/dicBaseclass/update',
        dicBaseClassSelectOne:'sys/dicBaseclass/selectOne',
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
        isNew:true,
      }
    },
    computed: {},
    mounted() {
      this.init();
    },
    methods: {
      init(){
        if (this.$route.params.code == 0 ){
          this.isNew = true;
        } else{
          this.isNew = false;
          let params = this.$route.params;
          this.$axios({
            url: this.api.dicBaseClassSelectOne,
            method: 'put',
            data: params
          })
            .then(res => {
              if (res.code == '200') {
                // this.listData = res.data;
                this.form.setFieldsValue(res.data)
              } else {
                this.warn(res.msg)
              }
            })
            .catch(err => {
              this.error(err)
            })
        }
      },
      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$axios({
              url: this.api.dicBaseClassUpdate,
              method: 'put',
              data: values
            })
              .then(res => {
                if (res.code == '200') {
                  this.success('保存成功!');
                  this.backTo();
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
          name: 'dictionaryIndex'
        })
      },
      confirm(e) {

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