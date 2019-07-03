<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-spin tip="加载中..." :spinning="spinning">
        <div class="cardHead">
          <a href="#" @click.prevent="cancle">
            <a-icon type="left"></a-icon>
            返回
          </a>
        </div>
        <a-form :form="form" id="form">
          <a-form-item
            label="方案名称"
            v-bind="formItemLayout"
          >
            <a-input
              placeholder="请输入..."
              v-decorator="['planName',{rules: [{ required: true, message: '请输入方案名称' },{ max:20 }]}]"
            />
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="方案类型"
            :required="true"
          >
            <a-radio-group v-decorator="['planType',{initialValue: '1'}]">
              <a-radio value="1">药师审方</a-radio>
              <a-radio value="2">处方点评</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="方案范围"
            :required="true"
          >
            <a-radio-group @change="radioGroup" v-decorator="['planScope',{initialValue: '1'}]">
              <a-radio value="1">门诊</a-radio>
              <a-radio value="0">住院</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="状态"
            :required="true"
          >
            <a-radio-group v-decorator="['status',{initialValue: '1'}]">
              <a-radio value="1">启用</a-radio>
              <a-radio value="0">停用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="方案描述"
            v-bind="formItemLayout"
          >
            <a-textarea
              v-decorator="['describe',{rules: [{ max:100 }]}]"
            />
          </a-form-item>
          <a-form-item
            :wrapperCol="{ span: 7}"
            style="text-align: right"
          >
            <a-button type="primary" @click="addCondition()">
              <a-icon type="plus-circle" theme="filled"/>
              添加条件
            </a-button>
          </a-form-item>
        </a-form>
        <conditionSelect
          class="margin-top-10"
          :conditions="planruleList"
          :treeData="treeList"
          :classData="classData"
          :deleteCon="deleteCondition"
          :baseSelectTree="baseSelectTree"
          :searchSelect="searchSelect"
          :searchTreeSelect="searchTreeSelect"
        >
        </conditionSelect>
        <a-row class="btnStyle">
          <a-button htmlType="submit" type="primary" @click="handleSubmit" :loading="loading">保存</a-button>
          <a-button @click="cancle" style="margin-left: 8px">取消</a-button>
        </a-row>
      </a-spin>
    </a-card>
  </div>
</template>
<script>
  import debounce from 'lodash/debounce'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import conditionSelect from '../component/condition-select'

  export default {
    components: { ATextarea, conditionSelect },
    data() {
      this.searchSelect = debounce(this.searchSelect, 500)
      this.searchTreeSelect = debounce(this.searchTreeSelect, 500)
      return {
        api: {
          selectAttributes: 'sys/reviewPlan/selectClassificationAndAttributes',
          planSelectData: 'sys/reviewPlan/selectData',
          reviewPlanUpdate: 'sys/reviewPlan/update',
          detailUrl: 'sys/reviewPlan/selectList'
        },
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
        classData: [
          { id: '1', text: '等于' },
          { id: '2', text: '不等于' },
          { id: '3', text: '小于' },
          { id: '4', text: '小于等于' },
          { id: '5', text: '大于' },
          { id: '6', text: '大于等于' },
          { id: '7', text: '包含' },
          { id: '8', text: '不包含' }
        ],
        isNew: true,
        spinning: false,
        planruleList: [],
        selectMode: 'tags',
        treeList: [],
        CoreFactAllTree: [],
        defaults:{
          drugCategory:'DRUGCATEGORY',
          drugTypes:'DRUGTYPES',
          drugGrade:'DRUGGRADE',
          anestheticDrugs:'ANESTHETICDRUGS',
          essentialDrugs:'ESSENTIALDRUGS',
        }
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    mounted() {
      this.getListTypeData();
      setTimeout(()=>{
        this.init()
      },500)

    },
    methods: {
      init() {
        this.spinning = true
        let planId = this.$route.params.planId
        if (planId == 0) {
          this.isNew = true
          this.spinning = false
        } else {
          this.isNew = false
          this.$axios({
            url: this.api.detailUrl,
            method: 'put',
            data: { planId: planId }
          }).then(res => {
            if (res.code == '200') {
              if (!res.data){
                this.spinning = false
                return
              }
              this.planruleList = res.data.reviewPlanrules
              for (let key in this.planruleList) {
                this.planruleList[key].spec = '';
                this.planruleList[key].inputType = ''
                this.planruleList[key].operators = []
                this.planruleList[key].treeData = []
                if (this.planruleList[key].columnId == 'AGE'){
                  let assertVal = '';
                  let assertVal2 = '';
                  let spec = '';
                  assertVal = this.planruleList[key].assertVal;
                  assertVal2 = this.planruleList[key].assertVal2;
                  if (assertVal) {
                    this.planruleList[key].assertVal = Number(assertVal.slice(0,$.trim(assertVal).length-1));
                    spec  = assertVal.slice($.trim(assertVal).length-1,$.trim(assertVal).length);
                  }
                  if (assertVal2){
                    this.planruleList[key].assertVal2 =Number(assertVal2.slice(0,$.trim(assertVal2).length-1));
                  }
                   if (spec == '岁'){
                     this.planruleList[key].spec = '3'
                   }else if (spec == '月'){
                     this.planruleList[key].spec = '2'
                   } else if (spec == '天'){
                     this.planruleList[key].spec = '1'
                   }
                }
                if (this.planruleList[key].logic == '1') {
                  if (this.planruleList[key].columnId == 'AGE' || this.planruleList[key].columnId == 'LENGTHOFSTAY'){
                    this.planruleList[key].inputType = 'inputNumber'
                  }else{
                    this.planruleList[key].inputType = 'input'
                  }
                } else if (this.planruleList[key].logic == '2') {
                  this.planruleList[key].inputType = 'dataRange'
                } else if (this.planruleList[key].logic == '3') {
                  if (this.planruleList[key].columnId == 'ANTIBACTERIALLEVEL') {
                    this.planruleList[key].inputType = 'select'
                    this.planruleList[key].treeData = this.enum.drugGrade
                  }
                  else if (this.planruleList[key].columnId == 'PURPOSEOFDRUGUSE') {
                    this.planruleList[key].inputType = 'select'
                    this.planruleList[key].treeData = this.enum.purposeDrug
                  } else if (this.planruleList[key].columnId == 'TYPESOFDRUGS') {
                    this.planruleList[key].inputType = 'select'
                    this.planruleList[key].treeData = this.enum.drugType
                  } else if (this.planruleList[key].columnId == 'PATIENTYPE') {
                    this.planruleList[key].inputType = 'select'
                    this.planruleList[key].treeData = this.enum.patientType
                  } else if (this.planruleList[key].columnId) {
                    let params = {}
                    params.code = this.planruleList[key].columnId
                    this.$axios({
                      url: this.api.planSelectData,
                      method: 'put',
                      data: params
                    }).then(res => {
                      if (res.code == '200') {
                        let pidNum = 0
                        for (let i in res.rows) {
                          if (res.rows[i].PID) {
                            this.planruleList[key].inputType = 'tree'
                            let indexData = this.dealAllStartTree(res.rows)
                            this.planruleList[key].treeData = this.recursiveNodeTree(indexData, 'undefined')
                            pidNum += 1
                            break
                          }
                        }
                        if (pidNum == 0) {
                          this.planruleList[key].inputType = 'select'
                          this.planruleList[key].treeData = res.rows
                        }
                        this.planruleList.push()
                      } else {
                        this.warn(res.msg)
                      }
                    })
                      .catch(err => {
                        this.error(err)
                      })
                  }
                }
                this.treeList = this.deletePresOut(this.treeList,res.data.planScope);
                let loadData = this.getItemTreeData(this.planruleList[key].columnId, this.treeList)
                for (let j in this.classData) {
                  for (let k in loadData.operators) {
                    if (this.classData[j].id == loadData.operators[k]) {
                      this.planruleList[key].operators.push(this.classData[j])
                    }
                  }
                }
                if (loadData.logic == '2'){
                  this.planruleList[key].operators.push( { id: '9', text: '区间' },)
                }
              }
              setTimeout(() => {
                this.form.setFieldsValue({
                  planName: res.data.planName,
                  planType: res.data.planType,
                  planScope: res.data.planScope,
                  status: res.data.status,
                  describe: res.data.describe
                })
              })
              this.spinning = false
            } else {
              this.spinning = false
              this.warn(res.msg)
            }
          }).catch(err => {
            this.spinning = false
            this.error(err)
          })
        }
      },
      //门诊或者住院
      radioGroup(value){
        this.treeList = this.deletePresOut(this.treeList,value.target.value);
        if (value.target.value == 1){
          console.log(this.planruleList)
          for (let key in this.planruleList){
            if (this.planruleList[key].columnId == 'LENGTHOFSTAY'){
              this.planruleList.splice(key, 1)
            }
          } 
        }
      },
      //删除住院费用
      deletePresOut(data,value){
        data.map((item) => {
          if (item.code == 'LENGTHOFSTAY'){
            if (value == 1){
              item.disabled = true
            } else{
              item.disabled = false
            }
          }
          if (item.children) {
            this.deletePresOut(item.children,value)
          }
        })
        this.treeList.push()
        return data
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
            params = values
            let listData = this.planruleList
            let specText = '';
            for (let key in listData) {
              if (listData[key].columnId == 'AGE'){
                if (listData[key].spec == '3'){
                  specText = '岁'
                }else if (listData[key].spec == '2') {
                  specText = '月'
                }else if (listData[key].spec == '1') {
                  specText = '天'
                }
                if (listData[key].logic == '1'){
                  listData[key].assertVal =  ''+listData[key].assertVal+specText
                } else{
                  listData[key].assertVal =  ''+listData[key].assertVal+specText
                  listData[key].assertVal2 =  ''+listData[key].assertVal2+specText
                }
              }
                delete listData[key].spec
                delete listData[key].inputType
                delete listData[key].operators
                delete listData[key].treeData
            }
            params.sampling = '1'
            params.distribution = '1'
            params.reviewPlanrules = listData
            if (this.$route.params.planId) {
              params.planId = this.$route.params.planId
            }
            console.log(params.reviewPlanrules )
            this.$axios({
              url: this.api.reviewPlanUpdate,
              method: 'post',
              data: params
            })
              .then(res => {
                if (res.code == '200') {
                  this.success(res.msg)
                  setTimeout(() => {
                    this.$router.push({
                      name: 'PrescriptionsSettingIndex'
                    })
                  }, 500)
                } else {
                  this.warn(res.msg)
                }
                 this.loading = false
              })
              .catch(err => {
             this.loading = false
                this.error(err)
              })
          } else {
             this.loading = false
          }
        })
      },
      //添加条件
      addCondition() {
        this.planruleList.push({
          dbId: '',
          columnId: '',
          relation: null,
          operators: [],
          logic:'',
          status: '1',
          inputType: 'input',
          assertVal: null,
          assertVal2: null,
          values: []
        })
      },
      deleteCondition(index) {
        this.planruleList.splice(index, 1)
      },

      getListTypeData(params = {}) {
        this.$axios({
          url: this.api.selectAttributes,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.treeList = this.dealTreeList(res.rows)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      dealTreeList(data) {
        data.map((item) => {
          item.key = item.code
          item.value = item.code
          item.title = item.name
          if (item.type == 1) {
            item.disabled = true
          } else {
            item.disabled = false
          }
          if (item.childNodes) {
            item.children = item.childNodes
            this.dealTreeList(item.children)
          }
        })
        return data
      },
      baseSelectTree(index, item) {
        item.operators = []
        item.treeData = []
        item.values = []
        item.spec = ''
        item.assertVal = null
        item.assertVal2 = null
        let data = this.getItemTreeData(item.columnId, this.treeList)
          for (let key in this.classData) {
            for (let i in data.operators) {
              if (this.classData[key].id == data.operators[i]) {
                item.operators.push(this.classData[key])
                item.relation = this.classData[key].id
              }
            }
          }
        if (data.logic == '2'){
          item.operators.push({ id: '9', text: '区间' },)
          item.relation = '9';
        }
        item.logic = data.logic
        if (data.logic == '1') {
          item.inputType = 'input'
        } else if (data.logic == '2') {
          item.inputType = 'dataRange'
        } else if (data.logic == '3') {
          if (item.columnId == 'ANTIBACTERIALLEVEL') {
            item.inputType = 'select'
            item.treeData = this.enum.drugGrade
          } else if (item.columnId == 'DRUGGRADE') {
            item.inputType = 'select'
            item.treeData = this.enum.drugGrade
          } else if (item.columnId == 'PURPOSEOFDRUGUSE') {
            item.inputType = 'select'
            item.treeData = this.enum.purposeDrug
          } else if (item.columnId == 'TYPESOFDRUGS') {
            item.inputType = 'select'
            item.treeData = this.enum.drugType
          } else if (item.columnId == 'PATIENTYPE') {
            item.inputType = 'select'
            item.treeData = this.enum.patientType
          } else {
            let params = {}
            params.code = data.code
            this.$axios({
              url: this.api.planSelectData,
              method: 'put',
              data: params
            }).then(res => {
              if (res.code == '200') {
                let pidNum = 0
                for (let key in res.rows) {
                  if (res.rows[key].PID) {
                    item.inputType = 'tree'
                    let indexData = this.dealAllStartTree(res.rows)
                    item.treeData = this.recursiveNodeTree(indexData, 'undefined')
                    pidNum += 1
                    break
                  }
                }
                if (pidNum == 0) {
                  item.inputType = 'select'
                  item.treeData = res.rows
                }
                this.planruleList.push();

              } else {
                this.warn(res.msg)
              }
            })
              .catch(err => {
                this.error(err)
              })
          }
        }
      },
      //处理模型字段
      dealAllStartTree(list) {
        let indexData = {}
        for (let key in list) {
          let children = indexData[list[key].PID]
          if (children instanceof Array) {
            children.push({
              title: list[key].TITLE,
              value: '' + list[key].ID,
              key: list[key].ID,
              PID: list[key].PID
            })
          } else {
            children = [{
              title: list[key].TITLE,
              value: '' + list[key].ID,
              key: list[key].ID,
              PID: list[key].PID
            }]
          }
          indexData[list[key].PID] = children
        }
        return indexData
      },
      recursiveNodeTree(indexData, PID) {
        let children = indexData[PID]
        if (children != null && children != undefined) {
          for (let ckey in children) {
            let cnode = children[ckey]
            children[ckey].children = this.recursiveNodeTree(indexData, cnode.value)
          }
        }
        return children
      },


      getItemTreeData(code, trees) {
        let arrays = trees
        while (arrays != null && arrays.length > 0) {
          let temps = []
          for (let i = 0; i < arrays.length; i++) {
            if (arrays[i].code == code) {
              return arrays[i]
            } else if (arrays[i].children != null) {
              temps = temps.concat(arrays[i].children)
            }
          }
          //TODO:数据交换
          arrays = temps
        }
        return arrays
      },


      //枚举时搜索下拉框
      searchSelect(value, data, code, item) {

        let params = {}
        params.keyword = value
        params.code = code
        this.$axios({
          url: this.api.planSelectData,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            item.treeData = res.rows
            this.planruleList.push()
          } else {
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.error(err)
          })
      },
      //树下拉
      searchTreeSelect(value, data, code, item) {
        let params = {}
        params.keyword = value
        params.code = code
        this.$axios({
          url: this.api.planSelectData,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            let indexData = this.dealAllStartTree(res.rows)
            item.treeData = this.recursiveNodeTree(indexData, 'undefined')
            this.planruleList.push()
          } else {
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.error(err)
          })
      }
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