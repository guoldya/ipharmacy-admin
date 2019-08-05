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
     <a-card  class="margin-top-5">
    <a-button type="primary" @click="adds" style="margin-right:5px" >新增</a-button>
     <a-spin tip="加载中..." :spinning="spinning">
                <el-table
                    highlight-current-row
                    class="margin-top-10"
                    :data="dataSource"
                    border
                    style="width: 100%"
                    @row-click="rowClick"
                >
                    <el-table-column
                        fixed="right"
                        label="操作"
                        :width="180"
                        align="center"
                        v-if="true"
                    >
                        <template slot-scope="scope">
                            <a @click="looks(scope.row)">审查</a>
                            <a @click="looks(scope.row)">查看</a>
                            <a-divider type="vertical" v-if="scope.row.status == 1"/>
                            <a-popconfirm
                                title="确定删除?"
                                @confirm="del(scope.row)"
                                okText="删除"
                                cancelText="取消"
                                v-if="scope.row.status == 1"
                            >
                                <a href="javascript:;">删除</a>
                            </a-popconfirm>
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
                                <a-badge
                                    v-else-if="scope.row.status == '2'"
                                    status="warning"
                                    text="筛选中"
                                />
                                <a-badge
                                    v-else-if="scope.row.status== '3'"
                                    status="processing"
                                    text="筛选完成"
                                />
                                <a-badge
                                    v-else-if="scope.row.status == '4'"
                                    status="processing"
                                    text="分配完成"
                                />
                                <a-badge
                                    v-else-if="scope.row.status == '5'"
                                    status="warning"
                                    text="点评中"
                                />
                                <a-badge
                                    v-else-if="scope.row.status == '6'"
                                    status="success"
                                    text="点评完成"
                                />
                            </span>
                            <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
                            <span v-else-if="item.value == 'percentageComplete'">
                                <el-progress
                                    :text-inside="true"
                                    :stroke-width="15"
                                    :percentage="scope.row.percentageComplete"
                                />
                            </span>
                          <span v-else-if="item.value == 'rationalPercentage' && scope.row.percentageComplete" >
                            {{scope.row.percentageComplete}}%
                          </span>
                            <span v-else>{{scope.row[item.value]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <a-pagination
                    hideOnSinglePage
                    :total="total"
                    showSizeChanger
                    v-model="current"
                    class="pnstyle"
                    :defaultPageSize="10"
                    :pageSizeOptions="['10', '20','50']"
                    @showSizeChange="sizeChange"
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
      api: {}
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
          type: 'text'
        },
        {
          name: '审核状态',
          dataField: 'status',
          type: 'select',
          dataSource: this.enum.Statuslist,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '监护级别',
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
        { name: '记录时间', dataField: 'updateTime', type: 'range-picker' },
          {
          name: '关注情况',
          dataField: 'situation',
          type: 'text'
        },
          {
          name: '带教学员',
          dataField: 'student',
          type: 'text'
        },
      ]
    }
  },

  created() {},

  mounted() {},
  destroyed() {},
  methods: {
    // 查询
    search() {},
    // 重置
    resetForm() {},
    //新增
    adds(){

    }
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