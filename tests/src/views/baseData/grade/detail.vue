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
          <a-input read-only placeholder="由系统自动生成,无需填写" v-decorator="['cId']" />
        </a-form-item>
        <!-- <a-form-item label="结论类型" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input :read-only="readOnly" v-decorator="['cTypeContent']" />
        </a-form-item> -->
         <a-form-item label="结论类型" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select v-decorator="[ 'cType',{rules:[{message:'强选择结论类型',required:true}]}]" @change="handleChange" >
            <a-select-option v-for="(op,index) in typeList" :value="op.id" :key="index">{{op.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="结论" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-textarea :read-only="readOnly" v-decorator="['completion',{rules:[{message:'请输入结论',required:true},{ max:100,message:'最多100个字符' }]}]" />
        </a-form-item>
        <a-form-item label="违反规则" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select v-decorator="[ 'id',{rules:[{message:'请选择违反规则',required:true}]}]" @change="handleChange" mode="multiple" :filterOption='false'>
            <a-select-option v-for="(op,index) in ruleList" :value="op.id" :key="index">{{op.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select v-decorator="[ 'status',{rules:[{message:'请选择状态',required:true}]}]">
            <a-select-option
              v-for="(op,index) in this.enum.status"
              :value="op.id"
              :key="index"
            >{{op.text}}</a-select-option>
          </a-select>
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
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  components: { ATextarea },
  data() {
    return {
      api: {
        selectOne: 'sys/reviewCompletion/selectOne',
        updt: 'sys/reviewCompletion/update',
        breakRule: 'sys/dicBase/selectTitlesList',
        rewtype: 'sys/dicBase/selectTitlesList'
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
      status: [{ id: 0, text: '停用' }, { id: 1, text: '启用' }],
      form: this.$form.createForm(this),
      roleCode: '',
      loadData: [],
      levelColor: '#000',
      listData: {},
      readOnly: false,
      isNew: true,
      ruleList: [],
      typeList:[]
    }
  },
  computed: {},
  mounted() {
    this.getselectData({ cId: this.$route.params.id })
    this.getruleData({ codeClass: 7 })
    this.gettypeData({ codeClass: 44})
  },
  methods: {
    // 违反规则点击
    handleChange(value) {
    },
    // 获取违反字典表
    getruleData(params = {}) {
      this.$axios({
        url: this.api.breakRule,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.ruleList = res.rows
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
    // 结构类型
     gettypeData(params = {}) {
      this.$axios({
        url: this.api.rewtype,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.typeList = res.rows
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
              let id=[]
              if (res.data) {
                res.data.reviewCompletionRegularVOList.forEach(item => {
                           id.push(item.regularId)
                })
              }
              let { cId, completion, status, cType, cTypeContent } = reqArr,
                formData = {
                  cId,
                  completion,
                  status,
                  cType,
                  id
                }
              setTimeout(() => {
                this.form.setFieldsValue(formData)
              }, 100)
            } else {
              this.loadingTable = false
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.loadingTable = false
            this.error(err)
          })
      }
    },

    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
          console.log(values)
          let reviewCompletionRegularVOList=[]
          values.id.forEach(item=>{
              if(this.$route.params.id=='new'){
                   reviewCompletionRegularVOList.push({
                 cId:'',
                 regularId:item
             })
              }else{
                   reviewCompletionRegularVOList.push({
                 cId:this.$route.params.id,
                 regularId:item
             })
              }
          })
          values.reviewCompletionRegularVOList=reviewCompletionRegularVOList
          //delete values.id
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
        name: 'gradeIndex'
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