<template>
  <a-card>
    <div class="cardHead">
      <a href="#" @click.prevent="backTo">
        <a-icon type="left"></a-icon>
        返回
      </a>
    </div>
    <a-spin tip="加载中..." :spinning="spinning">
      <a-form
        :form="form"
        @submit="handleSubmit"
      >
        <a-form-item
          label="等级编号"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input class="readOnlyInput"  placeholder="<系统自动生成>" :disabled="true" v-decorator="['auditLevel',]"/>
        </a-form-item>
        <a-form-item
          label="等级名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input  v-if="readOnly" class="readOnlyInput"  :disabled="true" v-decorator="['levelName',]"/>
          <a-input v-else v-decorator="['levelName',
        {rules: [{ required: true, message: '请输入等级名称' },{max: 50,message:'输入名称过长'},{ message: '请勿输入空格', pattern: /^[^\s]*$/}]}]"/>
        </a-form-item>
        <a-form-item
          label="等级说明"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-textarea v-if="readOnly" class="readOnlyInput"  :disabled="true"
                      v-decorator="['levelDescription',]"/>
          <a-textarea v-else
                      v-decorator="['levelDescription',
                     {rules: [{max: 200,message:'输入等级说明过长'}]}]"/>
        </a-form-item>
        <a-form-item
          label="处理类型"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select v-decorator="[ 'handleType',{rules: [{ required: true, message: '请选择处理类型' }]} ]">
            <a-select-option v-for="(op,index) in this.enum.handleType" :value="op.id" :key="index">{{op.text}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="状态"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-radio-group v-decorator="[ 'status']">
            <a-radio v-for="(op,index) in status" :value="op.id" :key="index">{{op.text}}</a-radio>
          </a-radio-group>
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
          selectOne: 'sys/reviewAuditlevel/selectOne',
          levelInsert: 'sys/reviewAuditlevel/insert'
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
        status: [
          { id: 0, text: '停用' },
          { id: 1, text: '启用' }
        ],
        form: this.$form.createForm(this),
        roleCode: '',
        loadData: [],
        levelColor: '#000',
        listData: {},
        readOnly: false,
        isNew: true,
        readOnlys:true
      }
    },
    created(){
    if(this.$route.params.auditLevel == 'new'){
       this.readOnlys=false
    }
    },
    computed: {},
    mounted() {
      this.init()
    },
    methods: {
      init() {
        if (this.$route.params.auditLevel == 'new') {
          this.isNew = true
          setTimeout(() => {
            this.form.setFieldsValue({ status: 0 })
          })
        } else {
          this.isNew = false;
          this.spinning = true;
          this.$axios({
            url: this.api.selectOne,
            method: 'put',
            data: this.$route.params
          }).then(res => {
            if (res.code == '200') {
              this.listData = res.data
              this.form.setFieldsValue({
               auditLevel: res.data.auditLevel,
                levelName: this.listData.levelName,
                handleType: this.listData.handleType,
                levelDescription: this.listData.levelDescription,
                status: this.listData.status
              })
              if (this.listData.levelType == 1) {
                this.readOnly = true
              } else {
                this.readOnly = false
              }
              this.levelColor = this.listData.levelColor
              this.spinning = false;
            } else {
              this.warn(res.msg);
              this.spinning = false;
            }
          })
            .catch(err => {
              this.error(err);
              this.spinning = false;
            })
        }
      },
      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            values.levelColor = this.levelColor
            values.levelType = this.$route.params.levelType
            if (!this.isNew){
              values.auditLevel = Number(this.$route.params.auditLevel)
            }
            if (this.isNew) {
              this.$axios({
                url: this.api.levelInsert,
                method: 'post',
                data: values
              }).then(res => {
                if (res.code == '200') {
                  this.success('保存成功')
                  this.backTo()
                } else {
                  this.warn(res.msg)
                }
              })
                .catch(err => {
                  this.error(err)
                })
            } else {
              reviewAuditlevelUpdate(values).then(res => {
                if (res.code == '200') {
                  this.success('保存成功!')
                  this.backTo()
                } else {
                  this.error('保存失败!')
                }
              }).catch(err => {
                this.error(err)
              })
            }
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
    color: #1694fb
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
  .readOnlyInput{
    border: 1px dashed #d9d9d9;
    background-color: #ffff !important;
    cursor:default;
    color: rgba(0, 0, 0, 0.65);
  }
  .readOnlyInput:hover{
    border: 1px dashed #2d8cf0 !important;
    background-color: #ffff !important;
    cursor:default;
    color: rgba(0, 0, 0, 0.65);
  }


</style>