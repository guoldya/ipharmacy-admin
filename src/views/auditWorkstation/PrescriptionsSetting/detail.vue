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
                                'clientName',
                                {rules: [{ required: true, message: '请输入方案名称' },{ max:20 }]}
                                ]"
          />
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="方案类型"
          :required="true"
        >
          <a-radio-group v-decorator="['status',{initialValue: '1'}]">
            <a-radio value="1">药师审方</a-radio>
            <a-radio value="0">处方点评</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="方案范围"
          :required="true"
        >
          <a-radio-group v-decorator="['around',{initialValue: '1'}]">
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
            v-decorator="['contacts',{rules: [{ max:100 }]}]"
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
      <div v-for="(cd,index) in conditionList" class="margin-top-10">
        <a-row>
          <a-col :span="7"></a-col>
          <a-col :span="4">
            <a-select  class="width-100" v-model="cd.val">
              <a-select-option
                v-for="item in levelData"
                :value='item.id'
                :key="index"
              >
                {{item.text}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="2">
            <a-select class="width-100 margin-left-5" v-model="cd.calculate">
              <a-select-option
                v-for="item in classData"
                :value='item.id'
                :key="index"
              >
                {{item.text}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="3">
            <!--文本输入框-->
            <a-input v-if="cd.val==1" class="width-100 marLeft10" v-model="cd.value"></a-input>
            <!--下拉框-->
            <a-select  :mode="selectMode" maxTagPlaceholder="..." :maxTagCount="2" v-else-if="cd.val==2" class="width-100 marLeft10" v-model="cd.list">
              <a-select-option
                v-for="item in classData"
                :value='item.id'
                :key="index"
              >
                {{item.text}}
              </a-select-option>
            </a-select>
            <!--日期框-->
            <a-date-picker class="width-100 marLeft10"  v-else-if="cd.val==3" v-model="cd.value"></a-date-picker>
            <!--日期范围-->
            <a-range-picker class="width-100 marLeft10"  v-else-if="cd.val==6" v-model="cd.list" />
            <!--数字范围-->
            <div v-else-if="cd.val==4" class="width-100 marLeft10">
              <a-input-number v-model="cd.value"  style="width:44%" ></a-input-number>
              <span>~</span>
              <a-input-number v-model="cd.valueTwo" style="width:44%"></a-input-number>
            </div>
            <!--默认为输入框-->
            <!--<a-input v-else class="width-100 marLeft10" v-model="cd.value"></a-input>-->
          </a-col>
          <a-col :span="1">
            <a-icon class="iconStyle" @click="deleteCondition(index)" type="minus-circle" theme="filled"/>
          </a-col>
        </a-row>
      </div>
      <a-row class="btnStyle">
        <a-button @click="cancle" >取消</a-button>
        <a-button htmlType="submit" type="primary" style="margin-left: 8px" :loading="loading">提交</a-button>
      </a-row>
    </a-card>
  </div>
</template>
<script>

  import ATextarea from 'ant-design-vue/es/input/TextArea'

  export default {
    components: { ATextarea },
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
        conditionList: [],
        selectMode:'tags',
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    mounted() {

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
          name: 'PrescriptionsSetting'
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