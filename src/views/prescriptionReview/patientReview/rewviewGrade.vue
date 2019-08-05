<template>
  <a-card>
    <div class="dealRight">
      <a-tabs defaultActiveKey="1" size="small" class="width-100">
        <a-tab-pane tab="点评结果" key="1">
          <div class="content" v-if="statu==2||statu==3">
            <a-row>
            <a-col :span="7">
              <a-icon type="warning" theme="filled" style="color:#FFAD0E;font-size:20px" />&emsp;是否为合理处方:
            </a-col>
            <a-col class="check" :span="14"> 
              <a-radio :defaultChecked='statu==2' :disabled="disabled">合理</a-radio>
              <a-radio :defaultChecked='statu==3' :disabled="disabled">不合理</a-radio>
            </a-col>
            </a-row>
             <a-row class="rewPerson">
            <a-col :span="7">
              点评人：
            </a-col>
            <a-col class="check" :span="14"> 
              {{objData.prescDocName}}
            </a-col>
            </a-row>
       <a-row class="rewPerson">
            <a-col :span="7">
              点评时间：
            </a-col>
            <a-col class="check" :span="14"> 
              {{changeTimes(objData.prescDate)}}
            </a-col>
            </a-row>
          </div>
         
          <a-row class="content" v-if="statu==1">
            <a-col :span="6">
              <a-icon type="warning" theme="filled" style="color:#FFAD0E;font-size:20px" />&emsp;是否为合理处方:
            </a-col>
            <a-col class="check" :span="14">
              <a-radio-group name="radioGroup" @change="onChange" v-model="value">
                <a-radio :value="2">合理</a-radio>
                <a-radio :value="3">不合理</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>

          <a-card title="问题" style="margin-top:20px;" v-if="value==3">
            <a slot="extra" class="addquestion" v-if="statu==1">
              <a-icon type="plus" style="color:#1890ff" />
              <span class="add" @click="addqus('visibles',true)">新增问题</span>
              <a-icon type="sync" style="color:#1890ff" />
              <span class="updrw" @click="rush">重新点评</span>
            </a>
            <aside v-for="item in proList" v-if="proList&&proList.length&&proList[0].cId">
              <p>&emsp;&emsp;药品：{{fliterdrug(item.prescId)}}</p>
              <p>点评结论：{{fliterreview(item.cId)}}</p>
              <p>
                违反规则：
                <a-tag color="orange" v-for="op in item.regularIdList" :key="op">{{fliterRule(op)}}</a-tag>
              </p>
              <p>点评描述：{{item.problemOpinion}}</p>
              <footer>
                <p class="foot" v-if="statu==1">
                  <a-popconfirm title="确定删除?" placement="topLeft" @confirm="deletes(item)">
                    <a>删除</a>
                  </a-popconfirm>
                  <a-divider type="vertical" />
                  <a @click="editing(item)">修改</a>
                </p>
              </footer>
              <a-divider />
            </aside>
          </a-card>
        </a-tab-pane>
        <a-tab-pane tab="问题描述" key="2">
            <qusTalk
        :visidId="objData.visId"
        :submitNos="objData.submitNo"
      ></qusTalk>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-modal title="另存为模板" :visible="visibles" @ok="handleOk" @cancel="handleCancel" width="600px">
      <a-form :form="form">
        <a-form-item
          label="药品"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 17 }"
          v-if="planScope==2"
        >
          <a-select
            v-decorator="[ 'prescId',  {rules: [{ required: true,message: '请选择分类'  }]}  ]"
            placeholder="请选择分类"
          >
            <a-select-option
              :value="op.medicalId"
              v-for="(op,index) in $store.state.drugList"
              :key="index"
            >{{op.drugName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="药品"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 17 }"
          v-if="planScope!=2"
        >
          <a-select
            v-decorator="[ 'prescId',  {rules: [{ required: true,message: '请选择分类'  }]}  ]"
            placeholder="请选择分类"
          >
            <a-select-option
              :value="op.clinicPrescId"
              v-for="(op,index) in $store.state.drugList"
              :key="index"
            >{{op.drugName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="点评结论" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-select
            style="width:100%"
            showSearch
            allowClear
            mode="single"
            optionLabelProp="completion"
            :defaultActiveFirstOption="false"
            :showArrow="false"
            :filterOption="false"
            @search="handleSearch"
            @change="handleChange"
            v-decorator="[ 'cId',  {rules: [{ required: true,message: '请输入内容'  }]}]"
            placeholder="请选择点评结果"
          >
            <a-select-option
              v-for="(item,index) in this.rewList"
              :value="item.cId"
              :key="item.cId"
              :completion="item.completion"
              :reviewCompletionRegularVOList="item.reviewCompletionRegularVOList"
            >{{item.completion}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="违反规则" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-select
            v-decorator="[ 'regularIdList' ,  {rules: [{ required: true,message: '请输入内容'  }]}]"
            mode="multiple"
            :filterOption="false"
          >
            <a-select-option v-for="(op,index) in ruleList" :value="op.id" :key="index">{{op.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="点评描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-textarea v-decorator="[ 'problemOpinion', {rules:[{message:'请输入点评',required:true}]} ]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import debounce from 'lodash/debounce'
import qusTalk from './qusTalk.vue'
export default {
   components: {
   qusTalk
  },
  name: 'index',
  data() {
    this.handleSearch = debounce(this.handleSearch, 800)
    return {
      visibles: false,
      drugList: [],
      form: this.$form.createForm(this),
      api: {
        rewviewList: 'sys/reviewCompletion/selectListByKeyword',
        rewviewupdate: 'sys/reviewProblem/update',
        breakRule: 'sys/dicBase/selectTitlesList',
        getqueList: 'sys/reviewProblem/selectProblemDetailByFilterId'
      },
      drugselval: '',
      rewList: [],
      form: this.$form.createForm(this),
      ruleList: [],
      proList: [],
      num: 1,
      values: 1,
      status: false,
      index: '',
      checkDellist: [],
      value: 2,
      statu: '',
      planScope: '',
      disabled:true,
      objData:{},
    }
  },
  created() {
    this.planScope = JSON.parse(sessionStorage.getItem('patinRew')).planScope
    this.statu = JSON.parse(sessionStorage.getItem('patinRew')).status
    this.value = JSON.parse(sessionStorage.getItem('patinRew')).status
    this.objData=JSON.parse(sessionStorage.getItem('patinRew'))
    this.getruleData({ codeClass: 7 })
    this.getDrugList()
    this.getprobleList({ filterId: JSON.parse(sessionStorage.getItem('patinRew')).filterId })
    //console.log(this.value)
    console.log('eeee')
  },
  computed: {},
  mounted() {},
  methods: {
    //问题列表复现
    getprobleList(params = {}) {
      this.$axios({
        url: this.api.getqueList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            if (res.data) {
              this.proList = res.data.reviewProblemVOList
              //this.value = res.data.status - 1
            }
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 违反规则表
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
    onChange(e) {
      this.values = e.target.value
      if (this.values == 2) {
        this.proList = []
        this.$store.state.proslist = this.proList
      }
      this.$store.state.status = this.values
    },
    saves() {
      let params = { filterId: JSON.parse(sessionStorage.getItem('patinRew')).filterId, status: this.values + '' }
      let reviewProblemVOList = []
      let isclub = JSON.parse(sessionStorage.getItem('patinRew')).planScope
      this.proList.forEach(item => {
        let data = typeof item.completion == 'string' ? JSON.parse(item.completion) : item.completion
        item.cId = data.cId
        item.problemOpinion = item.reviewTemplate
        if (isclub == 1) {
          item.prescId = item.name
        }
        if (isclub == 2) {
          item.prescId = item.name
        }
        this.checkDel(item, 'index', 'completion', 'name', 'reviewTemplate')
        reviewProblemVOList.push(item)
      })
      Object.assign(params, { reviewProblemVOList: reviewProblemVOList })
      this.$axios({
        url: this.api.rewviewupdate,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.$message.info('保存成功!')
            this.back()
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 删除问题框
    deletes(data) {
      let arr = this.proList.filter(item => {
        return item.index !== data.index
      })
      this.proList = arr
      this.$store.state.proslist = this.proList
    },
    // 修改那边问题的东西
    editing(data) {
      this.status = true
      this.index = data.index
      this.visibles = true
      let formData = data
      this.form.setFieldsValue(formData)
    },
    //获取结论list
    getDrugList() {
      let params = { keyword: '' }
      this.$axios({
        url: this.api.rewviewList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.rewList = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 结论搜索框
    handleSearch(value) {
      let params = { keyword: value }
      this.$axios({
        url: this.api.rewviewList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.rewList = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 获取结论值
    handleChange(value, option) {
      let regularIdList = []
      option.data.attrs.reviewCompletionRegularVOList.forEach(item => {
        regularIdList.push(item.regularId)
      })
      let formData = {
        regularIdList
      }
      this.form.setFieldsValue(formData)
    },
    handleChanges() {},
    // 控制modal框
    addqus(val, bool) {
      //
      this[val] = bool
      this.status = false
    },
    handleOk(e) {
      e.preventDefault()
      if (this.status == true) {
        this.form.validateFields((err, values) => {
          if (!err) {
            values.index = this.index
            let arr = this.proList.map(item => {
              if (item.index == this.index) {
                item = values
              }
              return item
            })
            this.proList = arr
            this.$store.state.proslist = this.proList
            this.visibles = false
            this.form.resetFields()
            this.status == false
          }
        })
      }
      if (this.status == false) {
        this.form.validateFields((err, values) => {
          if (!err) {
            values.index = this.num
            this.proList.push(values)
            this.$store.state.proslist = this.proList
            this.num++
            this.visibles = false
            this.form.resetFields()
            this.status == false
          }
        })
      }
    },
    handleCancel() {
      this.visibles = false
      this.form.resetFields()
    },
    rush() {
      this.proList = []
      this.$store.state.proslist = this.proList
    },
    checkDel(obj, ...args) {
      args.forEach(v => {
        delete obj[v]
      })
      return obj
    },

    // 过滤规则
    fliterRule(item) {
      if (this.ruleList && this.ruleList.length) {
        let text
        this.ruleList.forEach(items => {
          if (item == items.id) {
            text = items.name
          }
        })
        return text
      }
    },
    // 过滤药品
    fliterdrug(item) {
      if (this.$store.state.drugList && this.$store.state.drugList.length) {
        let text
        this.$store.state.drugList.forEach(items => {
          if (item == items.medicalId && JSON.parse(sessionStorage.getItem('patinRew')).planScope == 2) {
            text = items.drugName
          }
          if (item == items.clinicPrescId && JSON.parse(sessionStorage.getItem('patinRew')).planScope == 1) {
            text = items.drugName
          }
        })
        return text
      }
    },
    // 过滤结论
    fliterreview(item) {
      //this.rewList
      if (this.rewList && this.rewList.length) {
        let text
        this.rewList.forEach(items => {
          if (item == items.cId) {
            text = items.completion
          }
        })
        return text
      }
    },
    // 修改时间格式
     changeTimes(time) {
      if (time) {
         return time.replace(/(\d{2}:\d{2}:\d{2})$/, '')
        // return time.replace(/^(\d{4}-)|(:\d{2})$/g, '')
      }
    },
  }
}
</script>

<style  lang='less'>
.dealRight {
  .rewPerson{
    margin-top: 10px;
  }
  .ant-card-body {
    padding: 24px 24px 16px 24px;
  }
  .ant-card-wider-padding .ant-card-body {
    padding: 20px 20px;
  }
  .ant-radio-group {
    margin-left: 10px;
  }
  .content {
    .ant-radio-disabled + span {
    color: black;
    cursor: not-allowed;
    opacity: 0.8;
}
    padding-bottom: 10px;
    background: #fffbf1;
    padding-left: 15px;
    padding-top: 20px;
    font-size: 16px;
    border: 1px solid #ffad0e;
    .dianping {
      height: 30px;
      width: 85%;
      margin-top: 20px;
    }
    .reviews {
      float: left;
    }
    .reviewsper {
      float: right;
      color: #ffad0e;
      // margin-right: 20px;
    }
  }
  .check {
    display: inline-block;
    //margin-top: 20px;
  }
  .addquestion {
    margin-top: 15px;
    .add {
      padding: 0 9px 0 3px;
      color: #1890ff;
      cursor: pointer;
    }
    .updrw {
      cursor: pointer;
      padding: 0 9px 0 3px;
      color: #1890ff;
    }
  }
  .wenti {
    margin-top: 10px;
    padding: 5px 10px;
    color: whitesmoke;
    background: #1890ff;
    width: 55px;
  }
  .foot {
    float: right;
  }
}
</style>