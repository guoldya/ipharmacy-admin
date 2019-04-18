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
        label="等级名称"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input read-only v-decorator="['roleId',]"/>
      </a-form-item>
      <a-form-item
        label="等级说明"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-textarea
          v-decorator="['roleName',{rules: [{ required: true, message: '请输入名称' }],initialValue: formData.roleName}]"/>
      </a-form-item>
      <a-form-item
        label="处理类型"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select v-decorator="[ 'status', {rules: []} ]">
          <a-select-option :value="1">禁止</a-select-option>
          <a-select-option :value="2">上级确认</a-select-option>
          <a-select-option :value="3">本人确认</a-select-option>
          <a-select-option :value="4">提示</a-select-option>
          <a-select-option :value="5">无</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="显示颜色"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-col :span='22' :style="{height: '30px',textAlign:'right', backgroundColor: listData.colors,display: 'inline-block'}">
        </a-col>
        <a-col :span="2">
          <colorPicker @change="handlesColor" style="margin-left: 15px" v-model="colors"/></a-col>
        <!--<a-input v-decorator="['roleId',]"> </a-input>-->
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
  import { roleMaintainDetail, roleMaintainAdd, roleMaintainUpdate } from '@/api/login'
  import ATextarea from 'ant-design-vue/es/input/TextArea'

  export default {
    components: { ATextarea },
    data() {
      return {
        formData: {
          roleId: '',
          roleName: '',
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
        colors:this.$route.params.colors,
        listData:{},
      }
    },
    computed: {},
    mounted() {
      let _this = this;
      _this.listData = this.$route.params;
      console.log(_this.listData);
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            // roleMaintainAdd(values).then(res => {
            //   if (res.code == '200') {
            //     this.$message.info('保存成功!')
            //     this.backTo()
            //   } else {
            //     this.$message.error('保存失败!')
            //     this.warn(res.msg)
            //   }
            // }).catch(err => {
            //   this.error(err)
            // })
          }
        })
      },
      backTo() {
        this.$router.push({
          name: 'problemLevel'
        })
      },
      confirm(e) {

      },
      handlesColor(data){
        console.log(data);
        this.listData.colors = data;
      }
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
  .m-colorPicker/deep/ .colorBtn{
    height: 30px;
    width: 30px;
  }
</style>