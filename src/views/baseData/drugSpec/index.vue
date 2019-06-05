<template>
  <a-card>
    <a-row class="ruleRow">
      <a-col :xl="8" :xxl="6">
        <div class="ruleCow">
          <a-card>
            <drugClassification></drugClassification>
          </a-card>
        </div>
      </a-col>
      <a-col :xl="16" :xxl="18">
        <a-card>
          <Searchpanel ref="searchPanel" :list="list">
            <div slot="control">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
            </div>
          </Searchpanel>
          <a-button class="margin-top-10" type="primary" :disabled="disable" @click="addMdc">添加药品</a-button>
          <a-spin tip="加载中..." :spinning="loading">
            <el-table
              ref="table"
              :data="loadData"
              border
              class="margin-top-10"
              :highlight-current-row="true"
            >
              <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
                <template slot-scope="scope">
                  <opcol :items="items" :more="false" :data="scope.row" :filterItem="['classType']"></opcol>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" v-for="item in columns" :key="item.value"
                               :label="item.title" :prop="item.value" :width="item.width" :align="item.align">
                <template slot-scope="scope">
             <span v-if="item.value == 'status'">
              <a-badge
                :status="scope.row.status == 0? 'default':'processing'"
                :text="scope.row.status==0?'停用':'启用'"
              />
              </span>
                  <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
                  <span v-else>{{scope.row[item.value]}}</span>
                </template>
              </el-table-column>
            </el-table>
            <a-pagination
              showSizeChanger
              showQuickJumper
              :total="total"
              class="pnstyle"
              :defaultPageSize="pageSize"
              :pageSizeOptions="['10', '20','50']"
              @showSizeChange="pageChangeSize"
              @change="pageChange"
              size="small"
            >
            </a-pagination>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
  import drugClassification from '@/my-components/drug-classification/drugClassification'

  export default {
    components: {
      drugClassification
    },
    name: 'ruleMgt',
    data() {
      return {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        dataList: [],
        loading: false,
        loadData: [{ rule: '1', type: '1', drugName: '剂型与给药途径匹配性', status: '3', time: '2015-01-01 12:00' }],
        columns: [
          { title: '药品名称', value: 'drugName' },
          { title: '商品名', value: 'type' },
          { title: '生产厂商', value: 'ruleName' },
          { title: '剂型', value: 'sss', align: 'center' },
          { title: '药品类型', value: 'time' },
          { title: '状态', value: 'status', align: 'center' },
          { title: '操作', value: 'action', align: 'center' }
        ],
        items: [
          { text: '编辑', showtip: false, click: this.edits },
          { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.changeStatus, status: '1' },
          { text: '停用', color: '#E6A23C', showtip: true, tip: '确认停用吗？', click: this.changeStatus, status: '0' }
        ],
        //药品数据和表格title
        drugData: [
          { drugId: '123456', drugName: '阿司匹林', dosage: '颗粒', manufacturer: '肛泰制药' }
        ],
        confirmLoading: false,
        total: 10,
        pageSize: 0,
        visible: false,
        values: '',
        selectNode: '',
        disable: true
      }
    },
    mounted() {
    },
    computed: {
      list() {
        return [
          {
            name: '药品名称',
            dataField: 'drugName',
            type: 'text'
          }

        ]
      }
    },
    methods: {
      //搜索
      search() {
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = 10
        params.offset = 0
        // this.fetchYJSMapData(params)
      },
      //重置
      resetForm() {
        this.$refs.searchPanel.form.resetFields()
        // this.fetchYJSMapData({ pageSize: 10, offset: 0 })
      },

      //页码数change事件
      pageChangeSize(page, pageSize) {
        this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
      //页码跳转事件
      pageChange(page, pageSize) {
        this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },

      handleOk() {
        console.log(this.selkeys, 'this.selkeys')
        console.log(this.selectNode, 'this.selectNode')
        let data = this.form.getFieldsValue()
        this.Modal.visible = false
      },
      handleCancel() {
        this.Modal.visible = false
      },

      addMdc() {
        if (!this.disable) {
          this.drugModal.visible = true
        } else {
          this.warn('请选择规则')
        }
      },
      edits(data) {
        this.$router.push({
          name: 'drugSpecDetail'
        })
      }

      //filter

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