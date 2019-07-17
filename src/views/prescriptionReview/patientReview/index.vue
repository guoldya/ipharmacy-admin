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
          <!--处方、处方数、患者列-->
          <!-- <el-table-column fixed prop="date" label="日期" width="150"></el-table-column> -->
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
            <!-- <template slot-scope="props">
              <span v-if="item.prop == 'sex'">{{dealsex(props.row.sex)}}</span>
              <span v-else-if="item.prop == 'submitTime'">{{dealtime(props.row.submitTime)}}</span>
              <span v-else-if="item.prop == 'submitName'">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{props.row.submitDocPhone}}</span>
                  </template>
                  <a href>
                    {{props.row[item.prop]}}&nbsp;
                    <a-icon type="message" />
                  </a>
                </a-tooltip>
              </span>
              <span v-else>{{props.row[item.prop]}}</span>
            </template>-->
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
          :defaultPageSize="20"
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
      columns: [
        { title: '处方号', prop: 'admitNum', width: 100 },
        { title: '处方日期', prop: 'submitName', width: 90 },
        { title: '患者', prop: 'paint', width: 55 },
        { title: '性别', prop: 'sex', width: 55 },
        { title: '年龄', prop: 'age', width: 55 },
        { title: '门诊号', prop: 'sex', width: 80 },
        { title: '科室', prop: 'pname', width: 100 },
        { title: '医生', prop: 'deptName', width: 100 },
        { title: '点评结果', prop: 'submitTime', align: 'left' }
      ],
      loading: false,
      total: 50,
      current: 1,
      dataSource: [
        {
          submitTime: '完成',
          admitNum: '9527',
          submitName: '2019-3-4',
          deptName: '杨永信',
          pname: '门诊',
          paint: 'xxx',
          sex: '男',
          age: '32'
        },
        {
          submitTime: '完成',
          admitNum: '9527',
          submitName: '2019-3-4',
          deptName: '杨永信',
          pname: '门诊',
          paint: 'xxx',
          sex: '男',
          age: '32'
        },
        {
          submitTime: '完成',
          admitNum: '9527',
          submitName: '2019-3-4',
          deptName: '杨永信',
          pname: '门诊',
          paint: 'xxx',
          sex: '男',
          age: '32'
        }
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
    },
  //   list() {
  // return
  //   }
  },
  created() {
    if(this.$route.query.id){
    this.id=this.$route.query.id
    //console.log(this.$route.query.id)
    if(this.id==2){
      this.columns=[
        { title: '住院号', prop: 'admitNum', width: 100 },
        { title: '出院日期', prop: 'submitName', width: 90 },
        { title: '患者', prop: 'paint', width: 55 },
        { title: '性别', prop: 'sex', width: 55 },
        { title: '年龄', prop: 'age', width: 55 },
        { title: '住院科室', prop: 'sex', width: 80 },
        { title: '住院医师', prop: 'deptName', width: 100 },
        { title: '点评结果', prop: 'submitTime', align: 'left' }
      ]
       this.list=[
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
  },
  methods: {
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
    looks(data) {
      this.$router.push({
        name: 'patientReviewDetail'
      })
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