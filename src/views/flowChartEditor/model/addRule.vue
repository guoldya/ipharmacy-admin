<template>
  <div>
    <a-modal
      title="新增规则"
      :visible="visible"
      @ok="addRuleOk(ruleName)"
      @cancel="addRuleCancel"
      class="drugModal"
      width="700px">
    <a-form :form="drugForm">
      <a-form-item label="类型"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 17 }">
        <a-radio-group v-decorator="[ 'type2',  {rules: [{ required: true,message: '请选择类型'  }]}  ]"
                       @change="selectType"
                       placeholder="请选择类型">
          <a-radio :value='op.id' v-for="(op,index) in this.enum.ruleClassification" :key="index">
            {{op.text}}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="药品"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 18 }"
                   v-if="selkeys == 1"
      >
        <a-select v-decorator="[ 'limitedItemid',  {rules: [{ required: true,message: '请选择药品'  }]} ]"
                  showSearch
                  allowClear
                  optionLabelProp="title"
                  @search="handleSearch"
                  :defaultActiveFirstOption="false"
                  :showArrow="false"
                  :filterOption="false"
                  labelInValue
                  @change="handleChange"
                  placeholder="请选择药品"
        >
          <a-select-option :value='op.drugCode' v-for="(op,index) in selectDrug" :key="op.drugCode"
                           :title="op.drugName">
            <a-row>
              <a-col :span="16">
                {{op.drugName}}
              </a-col>
              <a-col :span="8" style="text-align: right">
                <a-tag>{{op.dosageForms}}</a-tag>
              </a-col>
            </a-row>
            <a-row>
              <a-col style="opacity: 0.6">
                生产厂商：{{op.producedBy}}
              </a-col>
            </a-row>
            <a-divider style="margin: 8px 0 0 0;"/>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="药品分类"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 18 }"
                   v-if="selkeys == 2"
      >
        <a-select v-decorator="[ 'categoryId',  {rules: [{ required: true,message: '请选择分类'  }]} ]"
                  showSearch
                  optionLabelProp="title"
                  @search="handleCategory"
                  :defaultActiveFirstOption="false"
                  :showArrow="false"
                  :filterOption="false"
                  labelInValue
                  @change="handleChange"
                  placeholder="请选择分类"
        >
          <a-select-option :value='op.categoryId' v-for="(op,index) in selectCategory" :key="op.categoryId"
                           :title="op.categoryName">
            <a-row>
              <a-col :span="23" class="selectCol">
                {{op.categoryName}}
              </a-col>
              <a-col v-if="op.isleaf == '1'" style="text-align: right">
                <a-tag>存在下级</a-tag>
              </a-col>
            </a-row>
            <a-row>
              <a-col style="opacity: 0.6">
                {{op.categoryPath}}
              </a-col>
            </a-row>
            <a-divider style="margin: 8px 0 0 0;"/>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="药品组"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 18 }"
                   v-if=" selkeys == 3"
      >
        <a-select v-decorator="[ 'limited',{rules: [{ required: true,message: '请选择药品组'  }]} ]"
                  showSearch
                  allowClear
                  @search="searchCoreRule"
                  :defaultActiveFirstOption="false"
                  :showArrow="false"
                  :filterOption="false"
                  labelInValue
                  @change="handleChange"
                  placeholder="请选择药品组"
        >
          <a-select-option :value='op.id' v-for="op in coreRule" :key="op.id">{{op.specName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="规则名称"
                   :label-col="{ span: 4}"
                   :wrapper-col="{ span: 18 }"
                   v-if=" selkeys == 4"
                   placeholder="请输入规则名称"
      >
        <a-input v-decorator="[ 'name',{rules: [{ required: true,message: '请输入规则名称'  }]} ]">
        </a-input>
      </a-form-item>
    </a-form>
    </a-modal>
  </div>
</template>

<script>
  export default {
    props:{
      visible:Boolean,
      addRuleOk:Function,
      addRuleCancel:Function,
    },
    name: 'addRule',
    data() {
      return {
        api: {
          selectDrugKeyword: 'sys/coreRule/selectDrugKeyword',
          selectCategoryKeyword:'sys/coreRule/selectCategoryKeyword',
          coreGroupingSpec:'sys/coreRule/coreGroupingSpec',
          coreRuleUpdate:'/sys/coreRule/update',
        },
        drugForm: this.$form.createForm(this),
        selectDrug: [],
        selectCategory:[],
        coreRule:[],
        selkeys: 1,
        ruleName: '',
        //新增规则
      }

    },
    mounted(){
      this.coreRuleSelect({ keyword: '' })
    },
    methods: {
      selectType(e){
        if (e.target.value == 1) {
          this.selkeys = 1
          this.coreRuleSelect({ keyword: '' })
        } else if (e.target.value == 2) {
          this.selkeys = 2
          this.coreRuleCategory({keyword:''})
        } else if (e.target.value == 3) {
          this.coreRuleGroup({ keyword: '' })
          this.selkeys = 3
        } else if (e.target.value == 4) {
          this.selkeys = 4
        }
      },

      handleSearch() {
        this.$axios({
          url: this.api.selectDrugKeyword,
          method: 'put',
          data: { keyword: value }
        }).then(res => {
          if (res.code == '200') {
            this.selectDrug = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //药品分类
      handleCategory(value) {
        this.$axios({
          url: this.api.selectCategoryKeyword,
          method: 'put',
          data: { keyword: value }
        }).then(res => {
          if (res.code == '200') {
            this.selectCategory = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //药品组搜索
      searchCoreRule(value) {
        this.$axios({
          url: this.api.coreGroupingSpec,
          method: 'put',
          data: { keyword: value }
        }).then(res => {
          if (res.code == '200') {
            for (let key in res.rows) {
              this.coreRule.push({ id: '' + res.rows[key].id, specName: res.rows[key].specName })
            }
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      handleChange(value) {
        this.ruleName = value
      },
      //药品select列
      coreRuleSelect(params = {}) {
        this.$axios({
          url: this.api.selectDrugKeyword,
          method: 'put',
          data: params
        })
          .then(res => {
          if (res.code == '200') {
            this.selectDrug = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //药品分类列
      coreRuleCategory(params = {}){
          this.$axios({
          url: this.api.selectCategoryKeyword,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.selectCategory = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },

      //药品组select列
      coreRuleGroup(params = {}) {
        this.coreRule=[];
        this.$axios({
          url: this.api.coreGroupingSpec,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            for (let key in res.rows) {
              this.coreRule.push({ id: '' + res.rows[key].id, specName: res.rows[key].specName })
            }
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
    }
  }
</script>

<style scoped>
  .selectCol {
    overflow: hidden;
    text-align: left;
    display: inline-block;
    width: 300px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>