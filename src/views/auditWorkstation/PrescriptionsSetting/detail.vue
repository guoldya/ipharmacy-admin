<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
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
            v-decorator="[
                                'planName',
                                {rules: [{ required: true, message: '请输入方案名称' },{ max:20 }]}
                                ]"
          />
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="方案类型"
          :required="true"
        >
          <a-radio-group v-decorator="['planType',{initialValue: '1'}]">
            <a-radio value="1">药师审方</a-radio>
            <a-radio value="0">处方点评</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="方案范围"
          :required="true"
        >
          <a-radio-group v-decorator="['planScope',{initialValue: '1'}]">
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
        <!--<a-form-item-->
          <!--v-bind="formItemLayout"-->
          <!--label="选择已有方案"-->
        <!--&gt;-->
          <!--<a-select v-decorator="['clientClass',]"-->
          <!--&gt;-->
            <!--<a-select-option-->
              <!--v-for="(item,index) in classData"-->
              <!--:value='item.id'-->
              <!--:key="index"-->
            <!--&gt;-->
              <!--{{item.text}}-->
            <!--</a-select-option>-->
          <!--</a-select>-->
        <!--</a-form-item>-->
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
          <a-button type="primary"  @click="addCondition()">
            <a-icon type="plus-circle" theme="filled" />
            添加条件
          </a-button>
        </a-form-item>
      </a-form>
      <conditionSelect class="margin-top-10"
                       :conditions="planruleList"
                       :treeData="treeList"
                       :levelData="levelData"
                       :classData="classData"
                       :deleteCon="deleteCondition"
                       :baseSelectTree="baseSelectTree">
      </conditionSelect>
      <a-row class="btnStyle">
        <a-button htmlType="submit" type="primary" @click="handleSubmit" :loading="loading">提交</a-button>
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
        api:{
        selectAttributes:'sys/reviewPlan/selectClassificationAndAttributes',
        planSelectData:'sys/reviewPlan/selectData',
        reviewPlanUpdate:'sys/reviewPlan/update',
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
        classData:[
          {id:1,text:'等于'},
          {id:2,text:'不等于'},
          {id:3,text:'小于'},
          {id:4,text:'小于等于'},
          {id:5,text:'大于'},
          {id:6,text:'大于等于'},
          {id:7,text:'包含'},
          {id:6,text:'不包含'},
        ],
        levelData: this.enum.clientLevel,
        planruleList: [{dbId:'',columnId:'',relation:'',operators:[],logic:'',status:'1',inputType:'input', assertVal: null, assertVal2: null, values:[]}],
        selectMode:'tags',
        treeList:[],
        CoreFactAllTree:[],
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
      this.getListTypeData();
    },
    methods: {
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
            let params = {};
            params = values;
            console.log(params,'params');
            console.log(this.planruleList);
            let listData = this.planruleList;
            for (let key in listData){
              delete listData[key].inputType;
              delete listData[key].operators;
              delete listData[key].treeData;
            }
            params.sampling = '1';
            params.distribution = '1';
            params.reviewPlanrules = listData;
            console.log(JSON.stringify(params));
            this.$axios({
              url: this.api.reviewPlanUpdate,
              method: 'post',
              data: params
            })
              .then(res => {
                if (res.code == '200') {
                  this.success(res.msg);
                  this.loading = false
                } else {
                  this.warn(res.msg);
                  this.loading = false
                }
              })
              .catch(err => {
                this.error(err)
              })
          } else {
            this.loading = false
          }
        })
      },
      //添加条件
      addCondition() {
        this.planruleList.push({dbId:'',columnId:'',relation:'',operators:[],logic:'',status:'1',inputType:'input', assertVal: null, assertVal2: null, values:[]})
      },
      deleteCondition(index) {
        this.planruleList.splice(index, 1);
      },

      getListTypeData(params = {}){
        this.$axios({
          url: this.api.selectAttributes,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.treeList = res.rows;
              this.dealTreeList(res.rows);
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      dealTreeList(data){
        data.map((item) => {
          item.key = item.code
          item.value = item.code
          item.title = item.name
          if (item.type == 1){
            item.disabled = true;
          }else{
            item.disabled = false;
          }
          if (item.childNodes) {
            item.children = item.childNodes;
            this.dealTreeList(item.children);
          }
        })
        return data
      },
      baseSelectTree(index, item){
        item.operators = [];
        item.treeData = [];
        let data = this.getItemTreeData(item.columnId, this.treeList);
        for (let key in this.classData){
          for (let i in data.operators){
            if (this.classData[key].id == data.operators[i]){
              item.operators.push(this.classData[key]);
              item.relation = this.classData[key].id;
            }
          }
        }
        console.log(item,'dada');
        item.logic = data.logic;
        if (data.logic == '1'){
          item.inputType = 'input'
        }else if (data.logic == '2'){
          item.inputType = 'dataRange'
        }else if (data.logic == '3'){
          if (data.code){
            let params = {};
            params.code = data.code;
            this.$axios({
              url: this.api.planSelectData,
              method: 'put',
              data: params
            }).then(res => {
              if (res.code == '200') {
                let pidNum = 0;
                for(let key in res.rows){
                  if (res.rows[key].PID){
                    item.inputType = 'tree';
                    let indexData = this.dealAllStartTree(res.rows);
                    item.treeData = this.recursiveNodeTree(indexData, 'undefined');
                    pidNum +=1;
                  }
                }
                if (pidNum == 0){
                  item.inputType = 'select';
                  item.treeData = res.rows;
                }
                console.log(item,'item');
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
      dealAllStartTree(list){
        let indexData = {}
        for (let key in list) {
          let children = indexData[list[key].PID]
          if (children instanceof Array) {
            children.push({
              title:list[key].TITLE,
              value:''+list[key].ID,
              key:list[key].ID,
              PID:list[key].PID,
            })
          } else {
            children = [{
              title:list[key].TITLE,
              value:''+list[key].ID,
              key:list[key].ID,
              PID:list[key].PID,
            }]
          }
          indexData[list[key].PID] = children
        }
        return indexData;
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
          let temps=[];
          for (let i=0; i < arrays.length; i++) {
            if (arrays[i].code == code) {
              return arrays[i]
            } else if (arrays[i].children != null) {
              temps= temps.concat(arrays[i].children);
            }
          }
          //TODO:数据交换
          arrays=temps;
        }
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