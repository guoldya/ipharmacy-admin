<template>
  <a-card>
    <a-row class="dicBase">
      <a-col :xl="5" :xxl="5" class="ruleCow">
        <div >
          <a-card title="药品分类">
            <drugClassification
              :onSelect="onSelect"
              :nodeData="nodeData"
              :disable="disable"
              :classification="classification"
            ></drugClassification>
          </a-card>
        </div>
      </a-col>

      <a-col :xl="19" :xxl="19" class="kindDic">
        <div class="kinds">
          <a-card title="药品品种">
            <drugVarieties :variety="variety" :disable="disable" :clickRow="clickRow"></drugVarieties>
          </a-card>
        </div>
        <div class="dic">
          <div title="药品字典" class="margin-top-10">
            <drugDictionary :dictionary="dictionary"></drugDictionary>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import drugClassification from '../base-components/drug-classification/drugClassificationCopy'
import drugVarieties from '../base-components/drug-varieties/drugVarietiesCopy'
import drugDictionary from '../base-components/drug-dictionary/drugDictionaryCopy'

export default {
  components: {
    drugClassification,
    drugVarieties,
    drugDictionary
  },
  name: 'ruleMgt',
  data() {
    return {
      nodeData: {},
      disable: true,
      api: {
        drugVarietyPageId: 'sys/dicDrugcategory/selectDrugVarietyPageByCategoryId',
        dicDrugSelectPage: 'sys/dicDrug/selectPage',
        dicBaseSelectList: 'sys/dicBase/selectClassList',
        differentKinds: 'sys/dicDrugcategory/selectCategoryPageByVarietyCode'
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
        lineData:[]
      },
      toxicologyData: [],
      current: 1
    }
  },
  mounted() {
    this.getDicBase()
    this.getVarietiesData()
  },

  methods: {
    //左侧点击事件
    onSelect(selectedKeys, e) {
      if (e.node.dataRef.categoryType == '1') {
        this.classification.disable = false
      }
      if (e.node.dataRef.categoryType == '2') {
        this.classification.disable = true
      }
      this.nodeData = e.node.dataRef
      console.log(this.nodeData, 'nodeData')
      this.variety.categoryId = e.node.dataRef.key
      if (this.variety.categoryId) {
        this.getVarietiesData({ categoryId: this.variety.categoryId })
        this.dictionary.drugDictionaryData = []
        this.dictionary.disable = true
        this.dictionary.total = 0
      }
      this.disable = false
    },
    getVarietiesData(params = {}) {
      if (params.offset == 0) {
        this.current = 1
      }
      this.$axios({
        url: this.api.drugVarietyPageId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.variety.drugVarietyData = res.rows
            this.variety.total = res.total
            // console.log(this.variety.drugVarietyData[0].linkType)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },

    //品种网格列点击事件
    clickRow(row, event, column) {
      this.varietyCode = row.varietyCode
      this.dictionary.disable = false
      this.dictionary.varietyCode = row.varietyCode
      this.getDictionary({ varietyCode: row.varietyCode })
      this.getlinedurg({varietyCode: row.varietyCode})
    },
    //获得药品字典
    getDictionary(params = {}) {
      this.$axios({
        url: this.api.dicDrugSelectPage,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dictionary.drugDictionaryData = res.rows
            this.dictionary.total = res.total
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 获得关联数据
    getlinedurg(params = {}) {
      this.$axios({
        url: this.api.differentKinds,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dictionary.lineData = res.rows
            console.log(res.rows)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
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

<style lang='less'>
  /*.ruleRow{*/
    .ruleCow {
      padding-right: 5px;
    }
    .dic .ant-card-body {
        padding: 0px !important;
      }
    .kinds .ant-card-body {
      padding: 15px !important;
    }
    .ruleModal .ant-modal-body {
      padding: 4px !important;
    }
    .drugModal .ant-modal-body {
      text-align: right;
    }
    .treeCol {
      padding-left: 10px;
      line-height: 32px;
    }
  /*}*/
</style>