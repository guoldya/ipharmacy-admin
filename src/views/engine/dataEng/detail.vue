<template>
  <a-card>
    <div class="cardHead">
      <a href="#" @click.prevent="backTo">
        <a-icon type="left"></a-icon>返回
      </a>
    </div>
    <a-spin tip="加载中..." :spinning="spinning">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="编码" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input read-only placeholder="由系统自动生成,无需填写" v-decorator="['id']" />
        </a-form-item>
        <a-form-item label="数据源名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['dsName',{rules:[{message:'请输入数据源名称',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="驱动名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['driverClass',{rules:[{message:'请输入驱动名称',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="数据库连接" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['url',{rules:[{message:'请输入数据库连接',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="用户名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['username',{rules:[{message:'请输入用户名称',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="密码" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['password',{rules:[{message:'请输入密码',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="初始大小" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['initialSize',{rules: [{pattern:/^\d{1,4}$/,message:'请输入4位以内的数字',required:true}]} ]"
          />
        </a-form-item>
        <a-form-item label="最大活跃" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['maxActive',{rules: [{pattern:/^\d{1,4}$/,message:'请输入4位以内的数字',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="验证查询" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :read-only="readOnly"
            v-decorator="['testSql',{rules:[{message:'请输入验证查询',required:true}]}]"
          />
        </a-form-item>
        <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-radio-group v-decorator="[ 'status']">
            <a-radio v-for="(op,index) in status" :value="op.id" :key="index">{{op.text}}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
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
        selectOne: 'sys/coreDbDatasource/selectOne',
        updt: 'sys/coreDbDatasource/update'
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
      status: [{ id: 1, text: '启用' }, { id: 0, text: '停用' }],
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
    this.getselectData({ id: this.$route.params.id })
  },
  methods: {
    // 查询数据
    getselectData(params = {}) {
      if (this.$route.params.id !== 'new') {
        this.$axios({
          url: this.api.selectOne,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              let reqArr = res.data
              let {
                  id,
                  dsName,
                  driverClass,
                  url,
                  username,
                  password,
                  initialSize,
                  maxActive,
                  testSql,
                  createBy,
                  createTime,
                  updateBy,
                  updateTime,
                  status
                } = reqArr,
                formData = {
                  id,
                  dsName,
                  driverClass,
                  url,
                  username,
                  password,
                  initialSize,
                  maxActive,
                  testSql,
                  createBy,
                  createTime,
                  updateBy,
                  updateTime,
                  status
                }
              this.form.setFieldsValue(formData)
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
            url: this.api.updt,
            method: 'post',
            data: values
          })
            .then(res => {
              if (res.code == '200') {
                this.$message.info('保存成功!')
                this.backTo()
              } else {
                this.$message.error('保存失败!')
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
        name: 'dataEngindex'
      })
    },
    confirm(e) {},
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