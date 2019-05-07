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
        <a-input read-only v-decorator="['problemLevel',]"/>
      </a-form-item>
      <a-form-item
        label="等级说明"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-textarea :read-only="readOnly"
          v-decorator="['levelThat']"/>
      </a-form-item>
      <a-form-item
        label="处理类型"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select v-decorator="[ 'dealType']" mode="multiple">
          <a-select-option v-for="(op,index) in this.enum.dealType" :value="op.value" :key="index">{{op.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="显示颜色"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-col :span="2">
          <colorPicker @change="handlesColor" class="colorPick" v-model="colors"/>
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
  import {} from '@/api/login'
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
        colors:'#000',
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
        console.log(_this.listData);
        _this.form.setFieldsValue({
          problemLevel:_this.listData.problemLevel,
          dealType:_this.listData.dealType,
          levelThat:_this.listData.levelThat,
        });
        _this.colors = this.$route.query.colors;
      }else {
        this.readOnly=false;
        _this.form.setFieldsValue({problemLevel:this.$route.query.length+'级'});
      }
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
          name: 'problemLevelIndex'
        })
      },
      confirm(e) {

      },
      handlesColor(data){
        if (data) {
          console.log(data);
          this.listData.colors = data;
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