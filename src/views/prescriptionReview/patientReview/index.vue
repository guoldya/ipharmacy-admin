<template>
  <div class="allContent">
    <a-card>
      <detail-list>
        <detail-list-item term="任务名称">
          <span class="opacity8 renwu">点评方案一</span>
        </detail-list-item>
        <detail-list-item term="任务范围">
          <span class="opacity8">门诊</span>
        </detail-list-item>
        <detail-list-item term="点评方案">
          <span class="opacity8">方案一，方案二</span>
        </detail-list-item>
        <detail-list-item term="抽取规则">
          <span class="opacity8">等间抽取500份,各个科室平均抽取50份</span>
        </detail-list-item>
        <detail-list-item term="处方时间" v-if="id==1">
          <span class="opacity8">2018-4-12~2019-3-4</span>
        </detail-list-item>
        <detail-list-item term="出院时间" v-else-if="id==2">
          <span class="opacity8">2018-4-12~2019-3-4</span>
        </detail-list-item>
      </detail-list>
    </a-card>
    <a-card class="margin-top-5">
      <Searchpanel ref="searchPanel" :list="list" :choose="choose">
        <div slot="control">
          <a-button type="primary" @click="search" style="margin-right: 5px">查询</a-button>
          <a-button class @click="resetForm" style="margin-right: 10px">重置</a-button>
        </div>
      </Searchpanel>
    </a-card>
    <a-card class="margin-top-5">
      <a-button type="primary">自动点评</a-button>
      <a-spin tip="加载中..." :spinning="loading" class="tables">
        <el-table
          ref="multipleTable"
          class="multipleEl"
          :data="dataSource"
          border
          style="width: 100%"
          highlight-current-row
        >
          <el-table-column
            :prop="item.prop"
            :label="item.title"
            :key="index"
            v-for="(item,index) in columns"
            :width="item.width"
            :align="item.align"
            :formatter="item.formatter"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
            <span v-if="item.prop == 'status'">
             {{scope.row.status}}
            </span>
           <span v-else-if="item.prop == 'prescDate'">
              {{changeTime(scope.row.prescDate)}}
            </span>
           <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" width="140" align="center">
            <template slot-scope="props">
              <a @click="looks(props.row)">点评</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定通过?"
                @confirm="passSingle(props.row)"
                okText="通过"
                cancelText="取消"
                placement="topRight"
              >
                <a>查看</a>
              </a-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          showSizeChanger
          showQuickJumper
          :total="total"
          class="pnstyle"
          v-model="current"
          :defaultPageSize="10"
          @showSizeChange="clientSizeChange"
          @change="PageChange"
          size="small"
        ></a-pagination>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  components: {
    DetailList,
    DetailListItem
  },
  name: 'index',
  data() {
    return {
      api: {
        getbase: 'sys/reviewInfo/selectReviewRecordDetail',
        selectform: 'sys/reviewFilter/selectReviewFilterPageByPersonId'
      },
       items: [
        { text: '编辑', showtip: false, click: this.edits },
        { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.user, status: '1' },
        { text: '停用', color: '#ff9900', showtip: true, tip: '确认停用吗？', click: this.user, status: '0' }
      ],
      columns: [
        { title: '处方号', prop: 'admitNum', width: 100 },
        { title: '处方日期', prop: 'prescDate', width: 160 },
        { title: '患者', prop: 'patientName', width: 120 },
        { title: '性别', prop: 'patientSex', width: 55,format: this.sexCheck},
        { title: '年龄', prop: 'patientAge', width: 55 },
        { title: '门诊号', prop: 'prescDeptId', width: 80 },
        { title: '科室', prop: 'prescDeptName', width: 100 },
        { title: '医生', prop: 'prescDocName', width: 100 },
        { title: '点评结果', prop: 'submitTime', align: 'left' },
      ],
      loading: false,
      total: 50,
      current: 1,
      dataSource: [
      ],
      id: 1,
      list: [
        {
          name: '点评结果',
          dataField: 'icdName',
          type: 'text'
        },
        {
          name: '处方号',
          dataField: 'icdName',
          type: 'text'
        },
        {
          name: '处方时间',
          dataField: 'icdName',
          type: 'text'
        },
        {
          name: '医生',
          dataField: 'icdName',
          type: 'text'
        },
        {
          name: '科室',
          dataField: 'icdName',
          type: 'text'
        },
        {
          name: '患者',
          dataField: 'icdName',
          type: 'text'
        }
      ]
    }
  },
  computed: {
    choose() {
      return { isshow: false, isextend: true }
    }
    //   list() {
    // return
    //   }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      if (this.id == 2) {
        this.columns = [
          { title: '住院号', prop: 'admitNum', width: 100 },
          { title: '出院日期', prop: 'submitName', width: 90 },
          { title: '患者', prop: 'paint', width: 55 },
          { title: '性别', prop: 'sex', width: 55 },
          { title: '年龄', prop: 'age', width: 55 },
          { title: '住院科室', prop: 'sex', width: 80 },
          { title: '住院医师', prop: 'deptName', width: 100 },
          { title: '点评结果', prop: 'submitTime', align: 'left' }
        ]
        this.list = [
          {
            name: '点评结果',
            dataField: 'icdName',
            type: 'text'
          },
          {
            name: '住院号',
            dataField: 'icdName',
            type: 'text'
          },
          {
            name: '出院时间',
            dataField: 'icdName',
            type: 'text'
          },
          {
            name: '医生',
            dataField: 'icdName',
            type: 'text'
          },
          {
            name: '科室',
            dataField: 'icdName',
            type: 'text'
          },
          {
            name: '患者',
            dataField: 'icdName',
            type: 'text'
          }
        ]
      }
    }
  },

  mounted() {
    this.getformData()
  },
  methods: {
    // 表单数据
    getformData() {
      let params = { pageSize: 10, offset: 0 }
      this.$axios({
        url: this.api.selectform,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dataSource=res.rows
            console.log(this.dataSource)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 搜索数据
    search() {},
    // 重置数据
    resetForm() {},
    // 改变页码
    clientSizeChange() {},
    // 翻页处理
    PageChange() {},
    // 处理时间
    dealtime() {},
    // 处理性别
    dealsex() {},
    // 详情
    //  looks(data) {
    //   console.log(data)
    //   this.$router.push({
    //     name: 'presHospitalizedDetail',
    //     params: { visId: data.visId, maxSubmitNo: data.maxSubmitNo,reviewId:data.reviewId,isNew:1, }
    //   })
    // },
    looks(data) {
      this.$router.push({
        name: 'patientReviewDetail',
        params: { visId: 95488, maxSubmitNo: 1, reviewId: 555, isNew: 1 }
      })
    },
     //过滤时间
    changeTime(time) {
      if(time){
            return time.replace(/(:\d{2})$/, '')
      }
    },
    // 过滤性别
    sexCheck(data){
      console.log(data.patientSex)
      let num=1+Number(data.patientSex)
       return this.enum.completeStatus[num]
      // return 'nan'
    }
  }
}
</script>

<style  lang='less'>
.userModel-p {
  text-align: center;
}
.allContent {
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
  //   .el-table__body-wrapper::-webkit-scrollbar {
  //     width: 10px; // 横向滚动条
  //     height: 15px; // 纵向滚动条 必写
  //   }
  // .el-table__body-wrapper::-webkit-scrollbar-thumb {
  //     background-color: #cccc;
  //    border-radius: 3px;
  //   }
}
</style>