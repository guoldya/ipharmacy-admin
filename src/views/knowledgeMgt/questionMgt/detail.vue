<template>
  <a-card>
    <div class="cardHead">
      <a href="#" @click.prevent="backTo">
        <a-icon type="left"></a-icon>返回
      </a>
    </div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="上级目录" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-tree-select
          :treeData="treedata"
          placeholder="请选择"
          allowClear
          v-decorator="[ 'parentId', ]"
        ></a-tree-select>
      </a-form-item>
      <!--      <a-form-item label="问题序号" :label-col="labelCol" :wrapper-col="wrapperCol">-->
      <!--        <a-input-->
      <!--          class="readOnlyInput"-->
      <!--          :disabled="true"-->
      <!--          v-decorator="[-->
      <!--                'id',-->
      <!--              ]"-->
      <!--          placeholder="<系统自动生成>"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <a-form-item label="问题编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          v-if="disable"
          class="readOnlyInput"
          :disabled="true"
          v-decorator="[
                'code',
                {
                  rules: [{
                    required: true,
                    message: '请输入问题编码',
                  },{max:10,message:'两位有效编码'}],
                }
              ]"
          placeholder="一般由数字和字母组成"
        />
        <a-input
          v-else
          v-decorator="[
                'code',
                {
                  rules: [{
                    required: true,
                    message: '请输入问题编码',
                  },{ message: '不超过10个字符的英文或数字', pattern: /^[0-9a-zA-Z]{1,10}$/}],
                }
              ]"
          placeholder="一般由数字和字母组成"
        />
      </a-form-item>
      <a-form-item label="问题名称" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          v-decorator="[
                'name',
                {
                  rules: [{
                    required: true,
                    message: '请输入问题名称',
                  },{max:33,message:'问题名称过长'},{ message: '请勿输入空格', pattern: /^[^\s]*$/}],
                }
              ]"
          placeholder="你想新增问题的名称"
        />
      </a-form-item>
      <a-form-item label="拼音编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          v-decorator="['spellCode',{rules:[{validator:checkChinese},{ message: '请勿输入空格', pattern: /^[^\s]*$/}]}]"
          placeholder="为空时由系统自动生成"
        />
      </a-form-item>
      <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-textarea
          v-decorator="['remark',{rules:[{validator:checkChinese},{ message: '请勿输入空格', pattern: /^[^\s]*$/}]}]"
          placeholder="可以添加更多丰富的信息"
        />
      </a-form-item>
      <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-radio-group v-decorator="[ 'status',{initialValue:'1'}]">
          <a-radio v-for="(op,index) in this.enum.status" :value="op.id" :key="index">{{op.text}}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
        <a-button type="primary" @click="handleSubmit">保存</a-button>
        <a-button class="margin-left-20" @click="backTo">取消</a-button>
      </a-form-item>
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
        dicBaseSelectOne: 'sys/dicBase/selectOne',
        selectTitlesList: 'sys/dicBase/selectTitlesList',
        insert: 'sys/dicBase/insert',
        update: 'sys/dicBase/update'
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
      listData: {},
      disable: false,
      treedata: [],
      isNew: false,
      getIdData: {}
    }
  },
  mounted() {
    if (this.$route.params.id == '-1') {
      this.isNew = true
      this.disable = false
    } else {
      this.disable = true
      this.isNew = false
    }
    this.getTreeLists({ codeclass: 7,editId:this.$route.params.id,editPid:-1 })
    if (!this.isNew) {
      this.getDetail()
    }
  },
  methods: {
    //校验数据长度
    checkChinese(rule, value, callback) {
      if (value) {
        let obj = { spellCode: 15, remark: 80 }
        let num = obj[rule.field]
        let newarr = value.match(/[^\x00-\xff]+/g) == null ? 0 : value.match(/[^\x00-\xff]+/g).join('').length
        let endLength = value.length + newarr
        if (endLength > num) {
          callback('输入字符超过限制')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    getDetail() {
      this.$axios({
        url: this.api.dicBaseSelectOne,
        method: 'put',
        data: { codeclass: 7, id: this.$route.params.id }
      })
        .then(res => {
          if (res.code == '200') {
            let params = {}
            this.getIdData = res.data
            params.parentId = res.data.parentId
            params.id = res.data.id
            params.code = res.data.code
            params.name = res.data.name
            params.spellCode = res.data.spellCode
            params.remark = res.data.remark
            params.status = res.data.status
            setTimeout(() => {
              this.form.setFieldsValue(params)
            }, 100)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.loadingTable = false
          this.error(err)
        })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.$route.params.id == '-1') {
            let params = values
            params.codeclass = 7
            this.$axios({
              url: this.api.insert,
              method: 'post',
              data: params
            })
              .then(res => {
                if (res.code == '200') {
                  this.success('保存成功!')
                  setTimeout(this.backTo, 500)
                } else {
                  this.warn(res.msg)
                }
              })
              .catch(err => {
                this.loadingTable = false
                this.error(err)
              })
          }
          if (this.$route.params.id != '-1') {
            let params = values
            params.codeclass = 7
            params.id = this.getIdData.id
            this.$axios({
              url: this.api.update,
              method: 'post',
              data: params
            })
              .then(res => {
                if (res.code == '200') {
                  this.success('保存成功!')
                  setTimeout(this.backTo, 500)
                } else {
                  this.warn(res.msg)
                }
              })
              .catch(err => {
                this.loadingTable = false
                this.error(err)
              })
          }
        }
      })
    },
    // 返回
    backTo() {
      this.$router.push({
        name: 'questionIndex'
      })
    },
    confirm(e) {},
    handlesColor(data) {
      if (data) {
        this.listData.levelColor = data
      }
    },

    // 树形初始数据
    getTreeList(params = {}) {
      this.$axios({
        url: this.api.selectTitlesList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            if (this.$route.query.msg !== 'new') {
              let { code, name, spellCode, remark, status } = res.rows[0],
                formData = { code, name, spellCode, status, remark }
              this.form.setFieldsValue(formData)
            }
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
    // 父级初始结构
    getTreeLists(params = {}) {
      var paramsNum = Object.keys(params)
      this.loading = true
      this.$axios({
        url: this.api.selectTitlesList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.treedata = this.getDataChildrens(res.rows, undefined)
            this.loading = false
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
    // 树形结构拼接
    getDataChildren(bdata, pid) {
      var items = []
      for (var key in bdata) {
        var item = bdata[key]
        if (pid == item.parentId) {
          items.push({
            title: item.name,
            value: item.id,
            key: item.id,
            children: this.getDataChildren(bdata, item.id)
          })
        }
      }
      return items
    },
    //树形结构拼接
    getDataChildrens(bdata, pid) {
      var items = []
      for (var key in bdata) {
        var item = bdata[key]
        if (pid == item.parentId) {
          items.push({
            title: item.name,
            value: item.id,
            key: item.id,
            children: this.getDataChildren(bdata, item.id)
          })
        }
      }
      return items
    }
  }
}
</script>
<style>
</style>