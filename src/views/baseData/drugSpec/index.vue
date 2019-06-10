<template>
  <a-card>
    <a-row class="ruleRow">
      <a-col :xl="8" :xxl="6">
        <div class="ruleCow">
          <a-card title="药品分类">
            <drugClassification
              :onSelect="onSelect"
              :nodeData="nodeData"
              :disable="disable"
            ></drugClassification>
          </a-card>
        </div>
      </a-col>
      <a-col :xl="16" :xxl="18">
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
  import drugClassification from '@/my-components/drug-classification/drugClassification'
  import drugVarieties from '@/my-components/drug-varieties/drugVarieties'
  import drugDictionary from '@/my-components/drug-dictionary/drugDictionary'

  export default {
    components: {
      drugClassification,
      drugVarieties,
      drugDictionary
    },
    name: 'ruleMgt',
    data() {
      return {
        nodeData: [],
        disable: true,
        api: {
          drugVarietyPageId: 'sys/dicDrugcategory/selectDrugVarietyPageByCategoryId',
          dicDrugSelectPage: 'sys/dicDrug/selectPage'
        },
        variety: {
          drugVarietyData: [],
          total: 0,
          categoryId: null
        },
        dictionary: {
          drugDictionaryData: [],
          total: null,
          disable: true
        }
      }
    },
    mounted() {
    },
    computed: {
      list() {
        return [
          {
            name: '品种名称',
            dataField: 'varietyName',
            type: 'text'
          },
          { name: '拼音码', dataField: 'drugName', type: 'text' }

        ]
      }
    },
    methods: {
      //左侧点击事件
      onSelect(selectedKeys, e) {
        console.log(e.node.dataRef)
        this.nodeData = e.node.dataRef
        this.variety.categoryId = e.node.dataRef.key
        if (this.variety.categoryId) {
          this.getVarietiesData({ categoryId: this.variety.categoryId })
        }
        this.disable = false
      },
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
        this.$refs.searchPanel.form.resetFields()
        this.getVarietiesData({ categoryId: this.variety.categoryId })
      },
      //品种网格列点击事件
      clickRow(row, event, column) {
        console.log(row)
        this.varietyCode = row.varietyCode
        this.dictionary.disable = false
        this.getDictionary({ varietyCode: row.varietyCode })
      },
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
    line-height: 32px
  }

  .ruleRow .ant-card-body {
    padding: 24px 20px !important;
  }

  .ruleModal .ant-modal-body {
    padding: 4px !important;

  }

  .drugModal .ant-modal-body {
    text-align: right
  }

</style>