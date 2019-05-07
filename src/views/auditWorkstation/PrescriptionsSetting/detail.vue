<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <div class="cardHead">
        <a href="#" @click.prevent="cancle">
          <a-icon type="left"></a-icon>
          返回
        </a>
      </div>
      <a-form :form="form" id="form" @submit="handleSubmit">
        <a-form-item
          label="方案名称"
          v-bind="formItemLayout"
        >
          <a-input
            placeholder="请输入..."
            v-decorator="[
                                'id',
                                {rules: [{ required: true, message: '请输入方案名称' },{ max:20 }]}
                                ]"
          />
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="方案类型"
          :required="true"
        >
          <a-radio-group v-decorator="['levelType',{initialValue: '1'}]">
            <a-radio value="1">药师审方</a-radio>
            <a-radio value="0">处方点评</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="方案范围"
          :required="true"
        >
          <a-radio-group v-decorator="['problemLevel',{initialValue: '1'}]">
            <a-radio value="1">门诊</a-radio>
            <a-radio value="0">住院</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="选择已有方案"
        >
          <a-select v-decorator="['clientClass',]"
          >
            <a-select-option
              v-for="(item,index) in classData"
              :value='item.id'
              :key="index"
            >
              {{item.text}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="方案描述"
          v-bind="formItemLayout"
        >
          <a-textarea
            v-decorator="['createTime',{rules: [{ max:100 }]}]"
          />
        </a-form-item>
        <a-form-item
          :wrapperCol="{ span: 7}"
          style="text-align: right"
        >
          <a-button type="primary"  @click="addCondition()">
            <a-icon type="plus-circle" theme="filled" />
            添加条件
          </a-button>
        </a-form-item>
      </a-form>
      <conditionSelect class="margin-top-10"
                       :conditions="conditionList"
                       :levelData="levelData"
                       :classData="classData"
                       :deleteCon="deleteCondition">
      </conditionSelect>
      <a-row class="btnStyle">
        <a-button htmlType="submit" type="primary" :loading="loading">提交</a-button>
        <a-button @click="cancle"  style="margin-left: 8px" >取消</a-button>

      </a-row>
    </a-card>
  </div>
</template>
<script>

  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import conditionSelect from '@/components/condition-select';
  export default {
    components: { ATextarea,conditionSelect },
    data() {
      return {
        formItemLayout: {
          labelCol: {
            lg: { span: 7 },
            sm: { span: 7 }
          },
          wrapperCol: {
            lg: { span: 10 },
            sm: { span: 17 }
          }
        },
        loading: false,
        classData: this.enum.clientClass,
        levelData: this.enum.clientLevel,
        conditionList: [{ val: '1', calculate: null, value: null, valueTwo: null, list: [] }],
        selectMode:'tags',
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    mounted() {
      this.form.setFieldsValue({
        id:this.$route.query.id,
        levelType:this.$route.query.levelType,
        problemLevel:this.$route.query.problemLevel,
        createTime:this.$route.query.createTime,
      });
    },
    methods: {
      //验证手机
      validPhone(rule, value, callback) {
        if (value) {
          if (!(/^1[3584679]\d{9}$/.test(value))) {
            callback('请输入正确的联系电话')
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      //返回首页
      cancle() {
        this.$router.push({
          name: 'PrescriptionsSettingIndex'
        })
      },
      // //新增客户
      handleSubmit(e) {
        e.preventDefault()
        this.loading = true
        this.form.validateFields((err, values) => {
          if (!err) {
            let params = {}
            params.status = this.value
            params.centerId = this.$route.params.id
            values.parentId = '&'
            params.clients = [{ ...values }]
            // addClientAndLink(params).then(res => {
            //   if (res.code == '200') {
            //     this.success('保存成功!', () => {
            //       this.$router.push({
            //         name: 'deliveryCenter'
            //       })
            //     })
            //   } else {
            //     this.loading = false
            //     this.warn(res.msg)
            //   }
            // }).catch(err => {
            //   this.loading = false
            //   this.error(err)
            // })
          } else {
            this.loading = false
          }
        })
      },
      //添加条件
      addCondition() {
        this.conditionList.push({ val: '1', calculate: null, value: null, valueTwo: null, list: [] })
      },
      deleteCondition(index) {
        this.conditionList.splice(index, 1);
        console.log(this.conditionList);
      },
    }
  }
</script>
<style>
  .iconStyle {
    color: red;
    line-height: 32px;
    font-size: 18px;
    margin-left: 15px;
  }

  .btnStyle {
    text-align: center;
    margin-top: 20px;
  }
</style>