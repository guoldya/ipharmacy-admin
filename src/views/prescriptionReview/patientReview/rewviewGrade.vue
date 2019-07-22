<template>
  <a-card>
    <div class="dealRight">
      <a-tabs defaultActiveKey="1" size="small" class="width-100">
        <a-tab-pane tab="点评结果" key="1">
          <div class="content">
            <header>是否为合理处方:</header>
            <div class="check">
              <a-icon type="warning" theme="filled" style="color:#FFAD0E;font-size:20px" />
              <a-radio-group name="radioGroup" :defaultValue="1">
                <a-radio :value="1">合理</a-radio>
                <a-radio :value="2">不合理</a-radio>
              </a-radio-group>
            </div>
          </div>

          <a-card title="问题" style="margin-top:20px;">
            <a href="#" slot="extra" class="addquestion">
              <a-icon type="plus" style="color:#1890ff" />
              <span class="add" @click="addqus('visibles',true)">新增问题</span>
              <a-icon type="sync" style="color:#1890ff" />
              <span class="updrw">重新点评</span>
            </a>
            <aside v-for="item in proList" v-if="proList&&proList.length">
              <p>&emsp;&emsp;药品：{{item.name}}</p>
              <p>点评结论：{{item.completion}}</p>
              <p>
                违反规则：
                <a-tag color="orange" v-for="op in item.cId">{{op}}</a-tag>
              </p>
              <p>点评描述：{{item.reviewTemplate}}</p>
              <footer>
                <p class="foot">
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
        <a-tab-pane tab="问题描述" key="2"></a-tab-pane>
      </a-tabs>
    </div>
    <a-modal title="另存为模板" :visible="visibles" @ok="handleOk" @cancel="handleCancel" width="600px">
      <a-form :form="form">
        <a-form-item label="药品" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-select
            v-decorator="[ 'name',  {rules: [{ required: true,message: '请选择分类'  }]}  ]"
            placeholder="请选择分类"
          >
            <a-select-option
              :value="op.drugName"
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
            v-decorator="[ 'completion']"
            placeholder="请选择点评结果"
          >
            <a-select-option
              v-for="(item,index) in this.rewList"
              :value="item.completion"
              :key="item.cId"
              :completion="item.completion"
              :reviewCompletionRegularVOList="item.reviewCompletionRegularVOList"
            >{{item.completion}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="违反规则" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-select v-decorator="[ 'cId']" @change="handleChanges" mode="tags">
            <a-select-option
              v-for="(op,index) in ruleList"
              :value="op.cId"
              :key="op.cId"
            >{{op.regularContent}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="点评描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-textarea
            v-decorator="[ 'reviewTemplate',  {rules: [{ required: true,message: '请输入内容'  }]}  ]"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  name: 'index',
  data() {
    this.handleSearch = debounce(this.handleSearch, 800)
    return {
      // labelCol: {
      //   xs: { span: 8 },
      //   sm: { span: 8 }
      // },
      // wrapperCol: {
      //   xs: { span: 8 },
      //   sm: { span: 8 }
      // },
      visibles: false,
      drugList: [],
      form: this.$form.createForm(this),
      api: {
        rewviewList: 'sys/reviewCompletion/selectListByKeyword'
      },
      drugselval: '',
      rewList: [],
      form: this.$form.createForm(this),
      ruleList: [],
      proList: [],
      num: 1
    }
  },
  created() {
    //this.drugList=this.$store.state.drugList
  },
  computed: {},
  mounted() {
    this.getDrugList()
  },
  methods: {
    // 删除问题框
    deletes(data) {
      let arr = this.proList.filter(item => {
        return item.index !== data.index
      })
      this.proList = arr
    },
    // 修改那边问题的东西
    editing(data) {
      //console.log(data)
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
      let cId = []
      // console.log(option.data.attrs.reviewCompletionRegularVOList)
      option.data.attrs.reviewCompletionRegularVOList.forEach(item => {
        cId.push(item.regularContent)
      })
      let formData = {
        cId
      }
      this.form.setFieldsValue(formData)
    },
    handleChanges() {},
    // 控制modal框
    addqus(val, bool) {
      this[val] = bool
    },
    handleOk(e) {
      this.visibles = false
      e.preventDefault()
      this.form.validateFields((err, values) => {
        values.index = this.num
        this.proList.push(values)
        this.num++
      })
      this.form.resetFields()
    },
    handleCancel() {
      this.visibles = false
    }
  }
}
</script>

<style  lang='less'>
.dealRight {
  .ant-card-body {
    padding: 24px 24px 16px 24px;
  }
  .ant-card-wider-padding .ant-card-body {
    padding: 20px 20px;
  }
  .ant-radio-group {
    margin-left: 90px;
    margin-top: 10px;
  }
  .content {
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