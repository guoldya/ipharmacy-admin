<template>
  <a-card>
    <a-row class="ruleRow">
      <!-- <a-col :xl="5" :xxl="5">
        <div class="ruleCow">
          <a-card title="药品分类">
            <drugClassification
              :onSelect="onSelect"
              :nodeData="nodeData"
              :disable="disable"
              :classification="classification"
            ></drugClassification>
          </a-card>
        </div>
      </a-col> -->
      <a-col :xl="24" :xxl="24">
        <a-card title="药品品种">
          <Searchpanel ref="searchPanel" :list="list">
            <div slot="control">
              <a-button type="primary" @click="varietiesSearch">查询</a-button>
              <a-button style="margin-left: 5px" @click="varietiesResetForm">重置</a-button>
            </div>
          </Searchpanel>
          <drugVarieties
            :variety="variety"
            :disable="disable"
            :pageChangeSize="varietiesPageSize"
            :pageChange="varietiesPageChange"
            :clickRow="clickRow"
            :currents="current"
          ></drugVarieties>
        </a-card>
        <a-card class="margin-top-5" title="药品字典">
          <drugDictionary :dictionary="dictionary"></drugDictionary>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import drugClassification from '../base-components/drug-classification/drugClassification'
import drugVarieties from '../base-components/drug-varieties/drugVarieties'
import drugDictionary from '../base-components/drug-dictionary/drugDictionary'

export default {
  components: {
    drugClassification,
    drugVarieties,
    drugDictionary
  },
  name: 'ruleMgt',
  data() {
    return {
      // nodeData: {},
      disable: true,
      api: {
        drugVarietyPageId: 'sys/dicDrugcategory/selectDrugVarietyPageByCategoryId',
        dicDrugSelectPage: 'sys/dicDrug/selectPage',
        dicBaseSelectList: 'sys/dicBase/selectClassList'
      },
      classification: {
        disable: false
      },
      variety: {
        drugVarietyData: [],
        total: 0,
        categoryId: null
      },
      dictionary: {
        drugDictionaryData: [],
        total: 0,
        disable: true,
        varietyCode: null,
        loading:false,
      },
      toxicologyData: [],
      current: 1
    }
  },
  mounted() {
    this.getDicBase()
    this.getVarietiesData()
  },
  computed: {
    list() {
      return [
        {
          name: '品种名称',
          dataField: 'drugvarietyCode',
          type: 'text'
        },
        {
          name: '合成药',
          dataField: 'iscompound',
          type: 'select',
          dataSource: this.enum.yesNo,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '毒理分类',
          dataField: 'toxicology',
          type: 'select',
          dataSource: this.toxicologyData,
          keyExpr: 'id',
          valueExpr: 'name'
        }
      ]
    }
  },
  methods: {
    //左侧点击事件
    // onSelect(selectedKeys, e) {
    //   this.classification.disable = true
    //   this.nodeData = e.node.dataRef
    //   this.variety.categoryId = e.node.dataRef.key
    //   if (this.variety.categoryId) {
    //     this.getVarietiesData({ categoryId: this.variety.categoryId })
    //     this.dictionary.drugDictionaryData = []
    //     this.dictionary.disable = true
    //     this.dictionary.total = 0
    //   }
    //   this.disable = false
    // },
    getVarietiesData(params = {}) {
      this.$axios({
        url: this.api.drugVarietyPageId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.variety.drugVarietyData = res.rows
            this.variety.total = res.total
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //页码数change事件
    varietiesPageSize(page, pageSize) {
      this.getVarietiesData({
        offset: (page - 1) * pageSize,
        pageSize: pageSize,
        categoryId: this.variety.categoryId
      })
    },
    //页码跳转事件
    varietiesPageChange(page, pageSize) {
      this.getVarietiesData({
        offset: (page - 1) * pageSize,
        pageSize: pageSize,
        categoryId: this.variety.categoryId
      })
    },
    //搜索
    varietiesSearch() {
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.pageSize = 10
      params.offset = 0
      params.categoryId = this.variety.categoryId
      this.getVarietiesData(params)
    },
    //重置
    varietiesResetForm() {
      this.current = 1
      this.$refs.searchPanel.form.resetFields()
      this.getVarietiesData({ categoryId: this.variety.categoryId })
    },
    //品种网格列点击事件
    clickRow(row, event, column) {
      this.varietyCode = row.varietyCode
      this.dictionary.disable = false
      this.dictionary.varietyCode = row.varietyCode
      this.getDictionary({ varietyCode: row.varietyCode })
    },
    getDictionary(params = {}) {
      this.dictionary.loading = true;
      this.$axios({
        url: this.api.dicDrugSelectPage,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dictionary.drugDictionaryData = res.rows
            this.dictionary.total = res.total
            this.dictionary.loading = false;
          } else {
            this.warn(res.msg);
            this.dictionary.loading = false;
          }
        })
        .catch(err => {
          this.error(err);
          this.dictionary.loading = false;
        })
    },
    getDicBase() {
      let params = {}
      params.codeClass = 39
      this.$axios({
        url: this.api.dicBaseSelectList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.toxicologyData = res.rows
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
.ruleCow {
  padding-right: 5px;
}

.treeCol {
  padding-left: 10px;
  line-height: 32px;
}

.ruleRow .ant-card-body {
  padding: 15px !important;
}

.ruleModal .ant-modal-body {
  padding: 4px !important;
}

.drugModal .ant-modal-body {
  text-align: right;
}
</style>