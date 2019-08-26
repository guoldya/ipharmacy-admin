<template>
  <a-card>
    <a-row class="drugSpec">
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
          <drugVarieties
            :variety="variety"
            :disable="disable"
            :clickRow="clickRow"
            @updateDisable="updateDisable"
          ></drugVarieties>
        </a-card>
        <a-card class="margin-top-5" title="药品字典">
          <drugDictionary :dictionary="dictionary"  :defaultPage="defaultPage" @updateDefaultPage="updatePage" ></drugDictionary>
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
          drugVarietyPageId: 'sys/dicDrugvariety/selectPage',
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
          loading: false
        },
        toxicologyData: [],
        current: 1,
        defaultPage:0,
      }
    },
    mounted() {
      this.getDicBase()
      this.getVarietiesData()
    },
 
    methods: {
      updateDisable(data){
        this.disable = data;
        this.dictionary.drugDictionaryData = []
        this.dictionary.total = 0
        this.dictionary.loading = false
        this.dictionary.disable = true
        this.dictionary.varietyCode = null
      },
      updatePage(data){
        this.defaultPage = data.defaultPage
      },
      getVarietiesData(params = {}) {
         if(params.offset==0){
          this.current=1
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
        this.defaultPage = 10
        this.varietyCode = row.varietyCode
        this.dictionary.disable = false
        this.dictionary.varietyCode = row.varietyCode
        this.getDictionary({ varietyCode: row.varietyCode })
      },
      getDictionary(params = {}) {
        this.dictionary.loading = true
        this.$axios({
          url: this.api.dicDrugSelectPage,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.dictionary.drugDictionaryData = res.rows
              this.dictionary.total = res.total
              this.dictionary.loading = false
            } else {
              this.warn(res.msg)
              this.dictionary.loading = false
            }
          })
          .catch(err => {
            this.error(err)
            this.dictionary.loading = false
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
      },
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

  .drugSpec .ant-card-body {
    padding: 15px !important;
  }

  .ruleModal .ant-modal-body {
    padding: 4px !important;
  }

  .drugModal .ant-modal-body {
    text-align: right;
  }
</style>