<template>
  <div class="allContent">
    <a-card>
      <Searchpanel ref="searchPanel" :list="list" :choose="choose">
        <div slot="control">
          <a-button type="primary" @click="search" style="margin-right: 5px">查询</a-button>
          <a-button class @click="resetForm" style="margin-right: 10px">重置</a-button>
        </div>
      </Searchpanel>
    </a-card>
    <a-card class="margin-top-5">
      <a-button type="primary" @click="adds(true)" style="margin-right:5px">新增</a-button>
      <a-spin tip="加载中..." :spinning="spinning">
        <el-table
          highlight-current-row
          class="margin-top-10"
          :data="dataSource"
          border
          style="width: 100%"
        >
          <el-table-column fixed="right" label="操作" :width="180" align="center" v-if="true">
             <template slot-scope="scope">
            <opcol :items="items" :more="false" :data="scope.row"></opcol>
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
              <span v-if="item.value == 'status'">
                <a-badge v-if="scope.row.status == '1'" status="default" text="创建" />
                <a-badge v-else-if="scope.row.status == '2'" status="warning" text="筛选中" />
                <a-badge v-else-if="scope.row.status== '3'" status="processing" text="筛选完成" />
              </span>
              <span class="updateBtn inHospitalNo" v-else-if="item.value==='percentageComplete'">123</span>

              <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination

          :total="total"
          showSizeChanger
          v-model="current"
          class="pnstyle"
          :defaultPageSize="10"
          :pageSizeOptions="['10', '20','50']"
          @showSizeChange="pageChangeSize"
          @change="pageChange"
          size="small"
        ></a-pagination>
      </a-spin>
    </a-card>
  </div>
</template>
<script>
  export default {
    name: 'index',
    data() {
      return {
        api: {
          selectPageUrl: 'sys/reviewAuditlevel/selectPage',
          updateStatusUrl: 'sys/reviewAuditlevel/update'
        },
        spinning: false,
        dataSource: [{percentageComplete:'ww'}],
        total: null,
        current: 1,
        columns: [
          { title: '监护等级', value: 'planScope', width: 90, format: this.taskScope, align: 'center' },
          { title: '类别', value: 'name', width: 80 },
          { title: '患者位置', value: 'extractionsNumber', width: 100, align: 'right' },
          { title: '住院号', value: 'percentageComplete', width: 130 },
          { title: '患者姓名', value: 'rationalPercentage', width: 100, align: 'right' },
          { title: '性别', value: 'filterStartTime', width: 70 },
          { title: '年龄', value: 'filterEndTime', width: 70 },
          { title: '入院时间', value: 'updateTime', width: 130 },
          { title: '入院诊断', value: 'enter', },
          { title: '患者状态', value: 'u3ser', width: 100, align: 'center' },
          { title: '记录人', value: 'user', width: 100, align: 'center' },
          { title: '会诊时间', value: 'enterTime', width: 130 },
        ],
        searchData: {},
        items: [
          { text: '查看', showtip: false, click: this.adds },
          { text: '删除', color: '#ff9900', showtip: true, tip: '确认删除吗？', click: this.delete}
        ]
      }
    },
    computed: {
      choose() {
        return { isshow: false, isextend: true }
      },
      list() {
        return [
          {
            name: '患者位置',
            dataField: 'address',
            type: 'select',
            dataSource: this.enum.Statuslist,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '患者状态',
            dataField: 'admitNum',
            type: 'select',
            dataSource: this.enum.Statuslist,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '监护等级',
            dataField: 'level',
            type: 'select',
            dataSource: this.enum.Statuslist,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '患者',
            dataField: 'patientName',
            type: 'text'
          },
          { name: '会诊时间', dataField: 'updateTime', type: 'range-picker' },
        ]
      }
    },
    mounted() {
      // this.getData();
    },
    methods: {
      // 查询
      search() {
        this.searchData = this.$refs.searchPanel.form.getFieldsValue()
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = this.pageSize
        params.offset = 0
        this.getData(params)
      },
      // 重置
      resetForm() {
        this.searchData = {}
        this.$refs.searchPanel.form.resetFields()
        this.getData({ pageSize: this.pageSize, offset: 0 })
      },
      getData(params = {}) {
        this.loading = true
        if (params.offset == 0) {
          this.current = 1
        }
        this.$axios({
          url: this.api.selectPageUrl,
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
      },
      //新增
      adds(val) {
        this.$router.push({
          name: 'consultationRecordDetail',
        })
        if(typeof(val)==='boolean'){
          window.sessionStorage.setItem('childPage', JSON.stringify('add'));
        }else{
          window.sessionStorage.setItem('childPage', JSON.stringify('look'));
          this.$router.push({
            query:{id:'1'}
          })
        }
      },
      pageChange(page, pageSize) {
        let params = this.searchData
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
        this.getData(params)
      },
      pageChangeSize(page, pageSize) {
        let params = this.searchData
        this.pageSize = pageSize
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
        this.getData(params)
      },
      //启用停用
      user(data) {
        let params = {}
        if (data.status == 1) {
          params.status = '0'
        } else {
          params.status = '1'
        }
        params.id = data.id;
        this.$axios({
          url: this.api.updateStatusUrl,
          method: 'post',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.success(res.msg)
              let dataList =  this.searchData;
              dataList.offset = (this.current-1)*this.pageSize;
              dataList.pageSize = this.pageSize;
              this.getData(dataList)
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

<style  lang='less'>
  .userModel-p {
    text-align: center;
  }
  .allContent {
    .ant-card-bordered {
      border: 0px;
    }
    .ant-card-body {
      padding: 8px 32px;
    }
    .tables {
      margin-top: 15px;
    }
    .ant-col-xxl-6 {
      display: block;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 33%;
      height: 35px;
    }
    .renwu {
      font-size: 18px;
      font-weight: bold;
      height: 20px;
      color: black;
    }
  }
</style>