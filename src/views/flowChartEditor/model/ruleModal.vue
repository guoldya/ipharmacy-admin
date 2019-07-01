<template>
  <div>
    <a-form>
      <a-form-item label="规则"
                   :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 19 }"
      >
        <a-select
          showSearch
          allowClear
          optionLabelProp="title"
          @search="handleSearch"
          :defaultActiveFirstOption="false"
          :showArrow="false"
          :filterOption="false"
          @change="handleChange"
          labelInValue
          placeholder="请选择药品"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
          <a-select-option :value='op.id' v-for="(op,index) in dataSource" :key="op.id"
                           :title="op.name">
            <a-row>
                {{op.name}}
            </a-row>
            <a-row>
              <a-col :span="6" style="opacity: 0.6">
                规则：<span  v-html="typeFormat(op.type)"></span>
              </a-col>
              <a-col :span="6" style="opacity: 0.6">
                类型：<span  v-html="classFormat(op.type2)"></span>
              </a-col>
            </a-row>
            <a-divider style="margin: 8px 0 0 0;"/>
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'
  export default {
    props:{
      handleChange:Function
    },
    name: 'ruleModal',
    data() {
      this.handleSearch = debounce(this.handleSearch, 800)
      return {
        api: {
          coreRuleTypePage: '/sys/coreRule/selectPage'
        },
        dataSource: [],
        fetching:false,
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData(params = {}) {
        params.typeId = -1
        params.offset = 0
        params.pageSize = 50;
        this.fetching = true;
        this.$axios({
          url: this.api.coreRuleTypePage,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.dataSource = res.rows;
            this.fetching = false;
          } else {
            this.warn(res.msg);
            this.fetching = false;
          }
        }).catch(err => {
          this.error(err);
          this.fetching = false;
        })
      },
      handleSearch(value){
        this.getData({name:value})
      },
      typeFormat(data) {
        let levelText
        this.enum.rulesType.forEach(item => {
          if (data == item.id) {
            levelText = item.text
            return
          }
        })
        return levelText
      },
      classFormat(data){
        let levelText
        this.enum.ruleClassification.forEach(item => {
          if (data == item.id) {
            levelText = item.text
            return
          }
        })
        return levelText
      }
    }
  }
</script>

<style scoped>

</style>