<template>
<div>
  <Searchpanel ref="searchPanel" :list="list">
    <div slot="control">
      <a-button type="primary" @click="search">查询</a-button>
      <a-button class="margin-left-5" @click="resetForm">重置</a-button>
    </div>
  </Searchpanel>
  <a-spin :spinning="loading" tip="加载中...">
    <el-table
      class="margin-top-10"
      :data="dataSource"
      border
      :highlight-current-row="true"
      style="width: 100%"
    >
      <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
        <template slot-scope="scope">
          <opcol
            :items="items"
            :more="false"
            :data="scope.row"
          ></opcol>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in columns"
        :show-overflow-tooltip="true"
        :key="item.value"
        :label="item.title"
        :prop="item.value"
        :width="item.width"
        :align="item.align"
      >
        <template slot-scope="scope">
          <span v-if="item.format !=null" v-html="item.format(scope.row)"></span>
          <span v-else>{{scope.row[item.value]}}</span>
        </template>
      </el-table-column>
    </el-table>

    <a-pagination
      showSizeChanger
      showQuickJumper

      :total="total"
      class="pnstyle"
      :pageSize="pageSize"
      :pageSizeOptions="['10', '20','50']"
      @showSizeChange="pageChangeSize"
      @change="pageChange"
      size="small"
      v-model="current"
    ></a-pagination>
  </a-spin>
</div>
</template>

<script>
  export default {
    name: 'drugTable',
    props: {
      moreThanNum: {
        type: Number,
      },
      startDate: {
        type: String,
        required: true
      },
      endDate: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        api: {
          selectPage: 'sys/early/selectRuleWarningDrug',
        },
        loading: false,
        total: null,
        curent: 1,
        pageSize: 10,
        columns: [
          { title: '药品名称', value: 'drugName',},
          { title: '规格', value: 'spec',  width: 200,  },
          { title: '剂型', value: 'dosageForms', align: 'center', width: 200 },
          { title: '生产厂商', value: 'producedBy',  },
          { title: '次数', value: 'total' , align: 'right',width: 100, },
        ],
        items: [
          { text: '详情', showtip: false, click: this.edits },
        ],
        levelColor: '#ffffff',
        dataSource: [],
        current: 1,
        searchData: {}
      }
    },
    computed: {
      list() {
        return [
          {
            name: '药品名称',
            dataField: 'drugName',
            type: 'text',
          },
          {
            name: '生产厂商',
            dataField: 'producedBy',
            type: 'text',
          },
        ]
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      //搜索
      search() {
        this.searchData = this.$refs.searchPanel.form.getFieldsValue()
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = this.pageSize
        params.offset = 0
        this.getData(params)
      },
      //重置
      resetForm() {
        this.searchData = {}
        this.$refs.searchPanel.form.resetFields()
        this.pageSize  =10;
        this.getData({ pageSize: this.pageSize, offset: 0 })
      },
      getData(params = {}) {
        this.loading = true
        if (params.offset == 0) {
          this.current = 1
        }
        params.endDate = this.endDate;
        params.startDate = this.startDate;
        if (this.$util.trim(this.moreThanNum) !=null){
          params.total = ''+this.moreThanNum;
        this.$axios({
          url: this.api.selectPage,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.dataSource = res.rows
              this.total = res.total
              this.loading = false
            } else {
              this.loading = false
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.loading = false
            this.error(err)
          })
        }else{
          this.loading = false
        }

      },
      pageChange(page, pageSize) {
        let params = this.searchData
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
        this.getData(params)
      },
      pageChangeSize(page, pageSize) {
        this.pageSize = pageSize;
        let params = this.searchData
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
        this.getData(params)
      },
      edits(data){
        this.$router.push({
          name: 'detailProblemIndex',
          params: { drugCode: data.drugCode,startDate:this.startDate,endDate:this.endDate }
        })
      },
      //枚举
      levelFormatter(data) {
        let levelText
        this.enum.levelType.forEach(item => {
          if (Number(data.levelType) == item.id) {
            levelText = item.text
            return
          }
        })
        return levelText
      },
      handleFormatter(data) {
        let levelText
        this.enum.handleType.forEach(item => {
          if (Number(data.handleType) == item.id) {
            levelText = item.text
            return
          }
        })
        return levelText
      }
    },
    watch:{
//观察option的变化
      moreThanNum: {
        handler(newVal, oldVal) {
         if (oldVal != newVal){
           this.getData()
         }
        },
        deep: true //对象内部属性的监听，关键。
      },
      startDate: {
        handler(newVal, oldVal) {
          if (oldVal != newVal){
            this.getData()
          }
        },
        deep: true //对象内部属性的监听，关键。
      },
      endDate: {
        handler(newVal, oldVal) {
          if (oldVal != newVal){
            this.getData()
          }
        },
        deep: true //对象内部属性的监听，关键。
      }
    }
  }
</script>

<style scoped>

</style>