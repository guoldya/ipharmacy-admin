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
          label="编码"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input :read-only="readOnly" v-decorator="['id',
        {rules: [{ required: true, message: '请输入编号' },{pattern: /^\d+$/,message:'请输入数字'}]}]"/>
        </a-form-item>
        <a-form-item
          label="数据源"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input :read-only="readOnly" v-decorator="['dsId',
        {rules: [{ required: true, message: '请输入等级名称' },{max: 50,message:'输入名称过长'}]}]"/>
        </a-form-item>
        <a-form-item
          label="名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
           <a-input :read-only="readOnly" v-decorator="['dsName',
        {rules: [{ required: true, message: '名称' },{pattern: /^\w+$/,message:'请输入名称'}]}]"/>
        </a-form-item>
         <a-form-item label="数据库文本" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-textarea :read-only="readOnly" v-decorator="['sqlText']"/>
      </a-form-item>
      <a-form-item label="值" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['val']"/>
      </a-form-item>
      <a-form-item label="显示名称" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['display']"/>
      </a-form-item>
      <a-form-item label="创建人" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['createBy']"/>
      </a-form-item>
      <a-form-item label="更新时间" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['updateTime']"/>
      </a-form-item>
       <a-form-item label="更新人" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['updateBy']"/>
      </a-form-item>
       <a-form-item label="创建时间" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :read-only="readOnly" v-decorator="['createTime']"/>
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
          selectOne: 'sys/coreRuleDatasource/selectOne',
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
        isNew: true
      }
    },
    computed: {},
    mounted() {
      this.init()
    },
    methods: {
     // 查询数据
    getselectData(params = {}) {
      this.$axios({
        url: this.api.selectOne,
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
            values.auditLevel = Number(values.auditLevel)
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
          }
        })
      },
      backTo() {
        this.$router.push({
          name: 'ruleEngindex'
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
</style>