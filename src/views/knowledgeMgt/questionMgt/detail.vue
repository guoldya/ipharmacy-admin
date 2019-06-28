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
          v-decorator="[
                'id',
                {
                  rules: [{
                    required: true,
                    message: '请选择上级目录',
                  }],
                }
              ]"
        ></a-tree-select>
      </a-form-item>
      <a-form-item label="问题编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          :disabled="disables"
          v-decorator="[
                'code',
                {
                  rules: [{
                    required: true,
                    message: '请输入问题编码',
                  }],
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
                  }],
                }
              ]"
          placeholder="你想新增问题的名称"
        />
      </a-form-item>
      <a-form-item label="拼音编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input v-decorator="['spellCode']" placeholder="为空时由系统自动生成"/>
      </a-form-item>
      <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-textarea v-decorator="['remark']" placeholder="可以添加更多丰富的信息"/>
      </a-form-item>
      <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select v-decorator="[ 'status']">
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
      roleCode: '',
      loadData: [],
      levelColor: '#000',
      listData: {},
      disable: false,
      patientid: '',
      datas: [],
      treedata: []
    }
  },
  computed: {
    disables: function() {
      if (this.$route.query.msg !== 'new') {
        return !!!this.disable
      }
    }
  },
  mounted() {
    // if(this.$route.query.msg !== 'new'){
    //     this.disable=true
    // }
    this.getTreeList({ codeclass: 7, id: this.$route.params.id })
    this.getTreeLists({ codeclass: 7 })
    let _this = this
    if (this.$route.query) {
      if (this.$route.query.msg !== 'new') {
        this.readOnly = this.$route.query.levelType == 1 ? true : false
        if (this.$route.query.levelColor) {
          _this.levelColor = this.$route.query.levelColor
        }
      } else {
        this.readOnly = false
        _this.form.setFieldsValue({ levelName: this.$route.query.length + '级' })
      }
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.$route.query.msg == 'new') {
            let params = values
            params.codeclass = 7
            this.$axios({
              url: this.api.insert,
              method: 'post',
              data: params
            })
              .then(res => {
                if (res.code == '200') {
                  this.$message.info('保存成功!')
                  setTimeout(this.backTo, 1000)
                }
              })
              .catch(err => {
                this.loadingTable = false
                this.error(err)
              })
          }
          if (this.$route.query.msg !== 'new') {
            let params = values
            this.$axios({
              url: this.api.update,
              method: 'post',
              data: params
            })
              .then(res => {
                if (res.code == '200') {
                  this.$message.info('保存成功!')
                  setTimeout(this.backTo, 1000)
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
    // 树形初始数据
    // getTreeList(params = {}) {
    //   var paramsNum = Object.keys(params)
    //   this.loading = true
    //   this.$axios({
    //     url: this.api.selectTitlesList,
    //     method: 'put',
    //     data: params
    //   })
    //     .then(res => {
    //       if (res.code == '200') {
    //         if (paramsNum.length == 1) {
    //           this.dataSource = this.getDataChildren(res.rows, undefined)
    //         } else {
    //           this.dataSource = res.rows
    //         }
    //         this.loading = false
    //       } else {
    //         this.loadingTable = false
    //         this.warn(res.msg)
    //       }
    //     })
    //     .catch(err => {
    //       this.loadingTable = false
    //       this.error(err)
    //     })
    // },
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