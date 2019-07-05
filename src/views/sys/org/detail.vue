<template>
  <a-card>
    <div class="cardHead">
      <a href="#" @click.prevent="backTo">
        <a-icon type="left"></a-icon>返回
      </a>
    </div>
    <a-form :form="form" @submit="handleSubmit">
      <a-row>
        <a-form-item label="编码" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input read-only v-decorator="['orgId']" placeholder="<系统自动生成>" />
        </a-form-item>
        <a-form-item label="名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input v-decorator="['title', {rules: [{ required: true, message: '请输入名称' }]}]" />
        </a-form-item>
        <a-form-item label="上级机构" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select allowClear v-decorator="[ 'parentId',]">
            <a-select-option
              v-for="(op,index) in listData"
              :value="op.orgId"
              :key="index"
            >{{op.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="机构代码" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input v-decorator="['orgCode', {rules: [{ required: true, message: '请输入机构代码' }]}]" />
        </a-form-item>
        <a-form-item label="机构类型" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select v-decorator="[ 'orgType',{rules: [{ required: true, message: '请选择机构类型' }]}]">
            <a-select-option
              v-for="(op,index) in this.enum.orgType"
              :value="op.id"
              :key="index"
            >{{op.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="医院分类" :label-col="{span: 8}" :wrapper-col="{span: 8}">
          <a-select
            style="margin-left: 1px"
            v-decorator="[ 'orgClass',{rules: [{ required: true, message: '请选择医院分类' }]}]"
          >
            <a-select-option
              v-for="(op,index) in enumList['33']"
              :value="op.id"
              :key="index"
            >{{op.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="等级" :label-col="{span: 8}" :wrapper-col="{span: 8}">
          <a-select v-decorator="[ 'orgGrade',{rules: [{ required: true, message: '请选择医院分类' }]}]">
            <a-select-option
              v-for="(op,index) in enumList['34']"
              :value="op.id"
              :key="index"
            >{{op.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系电话" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="['phone',{rules: [{ required: true,message: '请输入手机号' },{ message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ },]}]"
            placeholder="11 位手机号"
          ></a-input>
        </a-form-item>
        <a-form-item label="地址" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input v-decorator="[ 'adress']"></a-input>
        </a-form-item>
        <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input v-decorator="[ 'remarks']"></a-input>
        </a-form-item>
        <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-radio-group v-decorator="['status',{initialValue: '1'}]">
            <a-radio value="1">启用</a-radio>
            <a-radio value="0">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 20, offset: 10 }">
          <a-button class="margin-left-20" type="primary" @click="handleSubmit">保存</a-button>
          <a-button class="margin-left-20" @click="backTo">取消</a-button>
        </a-form-item>
      </a-row>
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
        selectClassListWithMoreParam: '/sys/dicBase/selectClassListWithMoreParam',
        selectOrgList: 'sys/sysOrgs/selectList',
        selectOrgUpdate: 'sys/sysOrgs/update',
        // sysOrgs/selectListWithOutCurrentOrgId
        getoriData: 'sys/sysOrgs/selectListWithOutCurrentOrgId'
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
      listData: [],
      readOnly: false,
      enumList: []
    }
  },
  computed: {},
  mounted() {
    this.getEnumList()
    this.getOrgLists()
    console.log(this.$store.state.routerData, 'datas')
    if (this.$store.state.routerData) {
      let list = {}
      console.log( this.$store.state.routerData)
      list.orgId = this.$store.state.routerData.orgId
      list.title = this.$store.state.routerData.title
      list.parentId = this.$store.state.routerData.parentId
      list.orgCode = this.$store.state.routerData.orgCode
      list.orgType = this.$store.state.routerData.orgType
      list.orgClass = this.$store.state.routerData.orgClass
      list.orgGrade = this.$store.state.routerData.orgGrade
      list.phone = this.$store.state.routerData.phone
      list.adress = this.$store.state.routerData.adress
      list.remarks = this.$store.state.routerData.remarks
      list.status = this.$store.state.routerData.status
      this.form.setFieldsValue(list)
    }

    console.log(this.$store.state.routerData, '1')
  },
  methods: {
    //验证手机号
    // handlePhoneCheck(rule, value, callback){
    //   console.log(value);
    //   checkMobile({account:this.userData.account,phone:value}).then(res=>{
    //     if (res.code == '200') {
    //       if (res.data == false){
    //         callback();
    //       }else if (res.data == true) {
    //         callback(new Error('手机号已被注册'));
    //       }
    //     }else {
    //       this.warn(res.msg);
    //     }
    //   }).catch(err => {
    //     this.error(err)
    //   })
    // },
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
        })
        .catch(err => {
          this.loading = false
          this.error(err)
        })
    },
    getOrgList() {
      this.$axios({
        url: this.api.selectOrgList,
        method: 'put',
        data: {}
      })
        .then(res => {
          if (res.code == '200') {
            //this.listData = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 上级机构数据
    getOrgLists() {
      let params={orgId: this.$store.state.routerData.orgId}
      this.$axios({
        url: this.api.getoriData,
        method: 'put',
        data:params
      })
        .then(res => {
          if (res.code == '200') {
            this.listData = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 提交数据
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(JSON.stringify(values))
          this.$axios({
            url: this.api.selectOrgUpdate,
            method: 'post',
            data: values
          })
            .then(res => {
              if (res.code == '200') {
                this.success('保存成功')
                setTimeout(() => {
                  this.$router.push({
                    name: 'sys_org'
                  })
                }, 500)
              } else {
                this.warn('保存失败')
              }
            })
            .catch(err => {
              this.loading = false
              this.error(err)
            })
        }
      })
    },
    backTo() {
      this.$router.push({
        name: 'sys_org'
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