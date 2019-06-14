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
        label="名称"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-decorator="['specName',{rules: [{ required: true, message: '请输入名称' }],}]"/>
      </a-form-item>
      <a-form-item
        label="备注"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-textarea v-decorator="['remark']"/>
      </a-form-item>
      <a-form-item
        label="状态"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select v-decorator="[ 'status']">
          <a-select-option v-for="(op,index) in status" :value="op.id" :key="index">{{op.text}}</a-select-option>
        </a-select>
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
  export default {
    data() {
      return {
        api: {
          specSelectOne: 'sys/coreGroupingSpec/selectOne',
          specUpdate:'sys/coreGroupingSpec/update',
        },
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
        isNew: true,
        listData:{},
      }
    },
    computed: {},
    mounted() {
      this.init()
    },
    methods: {
      init() {
        let id = this.$route.params.id
        let params = {id:id}
        if (id == 0) {
          this.isNew = true
        } else {
          this.isNew = false
          this.$axios({
            url: this.api.specSelectOne,
            method: 'put',
            data: params
          })
            .then(res => {
              if (res.code == '200') {
                this.listData = res.data;
                this.form.setFieldsValue({ remark: res.data.remark,specName:res.data.specName,status:res.data.status })
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
            if (!this.isNew){
              values.id = this.listData.id;
              values.drugList = this.listData.drugList;
            }
            console.log(values,'value');
            this.$axios({
              url: this.api.specUpdate,
              method: 'post',
              data: values
            })
              .then(res => {
                if (res.code == '200') {
                  this.success(res.msg);
                  setTimeout(()=>{
                    this.$router.push({
                      name: 'drugAdminIndex',
                    })
                  },500)
                } else {
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
          name: 'drugAdminIndex'
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