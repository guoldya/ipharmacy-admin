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
        <a-input read-only v-decorator="['levelName',]"/>
      </a-form-item>
      <a-form-item
        label="等级说明"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-textarea :read-only="readOnly"
          v-decorator="['levelDescription']"/>
      </a-form-item>
      <a-form-item
        label="处理类型"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select v-decorator="[ 'handleType']">
          <a-select-option v-for="(op,index) in this.enum.handleType" :value="op.id" :key="index">{{op.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="显示颜色"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-col :span="2">
          <colorPicker @change="handlesColor" class="colorPick" v-model="levelColor"/>
        </a-col>
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
      }
    },
    computed: {},
    mounted() {
      let _this = this;
      if (this.$route.query.msg == 'old'){
        this.readOnly=true;
        _this.listData = this.$route.query;
        _this.form.setFieldsValue({
          levelName:_this.listData.levelName,
          handleType:_this.listData.handleType,
          levelDescription:_this.listData.levelDescription,
        });
        if (this.$route.query.levelColor){
          _this.levelColor = this.$route.query.levelColor;
        }
      }else {
        this.readOnly=false;
        _this.form.setFieldsValue({levelName:this.$route.query.length+'级'});
      }
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            values.levelColor = this.levelColor;
            values.auditLevel = this.$route.query.auditLevel;
            if (this.$route.query.msg == 'new'){
              values.levelType = 0;
            }
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
          name: 'problemLevelIndex'
        })
      },
      confirm(e) {

      },
      handlesColor(data){
        if (data) {
          console.log(data);
          this.listData.levelColor = data;
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