<template>
  <div class="patientsHome">
    <a-card>
      <a-row>
        <span class="titleText font-bold fontSize36">刘港</span>
        <span class="titleText margin-left-20">
            <a-tag
              class="tagStyle"
              :color="'#40a9ff'"
              :key="1"
            >91084654</a-tag>
            <a-tag
              class="tagStyle"
              :color="'#40a9ff'"
              :key="2"
            >肝</a-tag>
            <a-tag
              class="tagStyle"
              :color="'#58C7CF'"
              :key="3"
            >肾</a-tag>
            <a-tag
              class="tagStyle"
              :color="'#B497EE'"
              :key="4"
            >心</a-tag>
          </span>
      </a-row>
      <a-row class="fontSize16">
        <span>男</span>
        <a-divider type="vertical"/>
        <span>35岁</span>
        <a-divider type="vertical"/>
        <span>皮肤科 5病区/2床</span>
        <a-divider type="vertical"/>
        <span>诊断：过敏性皮炎</span>
        <a-divider type="vertical"/>
        <span>护士：胡清/黄晶锐</span>
        <a-divider type="vertical"/>
        <span>入院日期：2019-08-05</span>
        <a-divider type="vertical"/>
      </a-row>
    </a-card>
    <a-row :gutter="6" class="margin-top-5">
      <a-col :span="12">
        <el-collapse value="1">
          <el-collapse-item style="background-color: #fafafafa"   name="1">
            <template slot="title">
              <a-col span="12" class=" fontSize16 font-bold "><span class="rounds">查房记录</span></a-col>
              <a-col span="10" style="text-align: right;margin-left: 10px;">
                <i class="iconfont action action-add" @click="addClick"/>
                <i class="iconfont action action-diandiandian margin-left-20" @click="addClick"/>
              </a-col>
            </template>
              <a-spin tip="加载中..." :spinning="spinning">
                <el-table
                  highlight-current-row
                  :data="dataSource"
                  style="width: 100%;height: 390px"
                >
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
                      <span v-else class="opacity8">{{scope.row[item.value]}}</span>
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
          </el-collapse-item>
        </el-collapse>
      </a-col>
      <a-col :span="12">
        <el-collapse value="1">
          <el-collapse-item style="background-color: #fafafafa"   name="1">
            <template slot="title">
              <a-col span="12" class=" fontSize16 font-bold "><span class="rounds">问题医嘱</span></a-col>
              <a-col span="10" style="text-align: right;margin-left: 10px;">
                <i class="iconfont action action-diandiandian margin-left-20" @click="addClick"/>
              </a-col>
            </template>
          <a-spin tip="加载中..." :spinning="issueSpinning">
            <el-table
              highlight-current-row
              :data="issueDataSource"
              style="width: 100%;height: 390px"
            >
              <el-table-column
                v-for="item in issueColumns"
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
              hideOnSinglePage
              :total="issueTotal"
              showSizeChanger
              v-model="issueCurrent"
              class="pnstyle"
              :defaultPageSize="10"
              :pageSizeOptions="['10', '20','50']"
              @showSizeChange="issueSizeChange"
              @change="issuePageChange"
              size="small"
            ></a-pagination>
          </a-spin>
          </el-collapse-item>
        </el-collapse>
      </a-col>
    </a-row>
    <a-row :gutter="5" class="margin-top-5">
      <a-col :span="12">
        <el-collapse value="1">
          <el-collapse-item style="background-color: #fafafafa"   name="1">
            <template slot="title">
              <a-col span="12" class=" fontSize16 font-bold "><span class="rounds">用药指导</span></a-col>
              <a-col span="10" style="text-align: right;margin-left: 10px;">
                <i class="iconfont action action-add" @click="addClick"/>
                <i class="iconfont action action-diandiandian margin-left-20" @click="addClick"/>
              </a-col>
            </template>
          <a-spin tip="加载中..." :spinning="guideSpinning">
            <el-table
              highlight-current-row
              :data="guideDataSource"
              style="width: 100%;height: 390px"
            >
              <el-table-column
                v-for="item in guideColumns"
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
              hideOnSinglePage
              :total="guideTotal"
              showSizeChanger
              v-model="guideCurrent"
              class="pnstyle"
              :defaultPageSize="10"
              :pageSizeOptions="['10', '20','50']"
              @showSizeChange="guideSizeChange"
              @change="guidePageChange"
              size="small"
            ></a-pagination>
          </a-spin>
          </el-collapse-item>
        </el-collapse>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        spinning: false,
        dataSource: [
          {updateTime:'2018:12:11',enter:'张三',user:'刘港吃鸡'}
        ],
        current: 1,
        total: 1,
        columns: [
          { title: '查房日期', value: 'updateTime', width: 130 },
          { title: '查房医生', value: 'enter', width: 130 },
          { title: '内容', value: 'user' }
        ],
        issueSpinning: false,
        issueDataSource: [],
        issueTotal: 1,
        issueCurrent: 1,
        issueColumns: [
          { title: '药品名称', value: 'updateTime', width: 130 },
          { title: '问题类别', value: 'enter', width: 130 },
          { title: '标记时间', value: 'user' }
        ],
        guideSpinning:false,
        guideDataSource: [],
        guideTotal: 1,
        guideCurrent: 1,
        guideColumns: [
          { title: '药品名称', value: 'updateTime', width: 130 },
          { title: '问题类别', value: 'enter', width: 130 },
          { title: '标记时间', value: 'user' }
        ],

      }
    },
    methods: {
      sizeChange() {
      },
      pageChange() {
      },

      issueSizeChange() {
      },
      issuePageChange() {
      },

      guideSizeChange(){},
      guidePageChange(){},

      addClick(event){
        console.log(1122);
        this.stopBubbling(event);
      },
      stopBubbling(e){
        e = window.event || e;
        if (e.stopPropagation) {
          e.stopPropagation();      //阻止事件 冒泡传播
        } else {
          e.cancelBubble = true;   //ie兼容
        }
      }
    }
  }
</script>

<style lang="less">
  .fontSize16 {
    font-size: 16px;
  }

  .fontSize24 {
    font-size: 24px;
  }

  .fontSize36 {
    font-size: 36px;
  }

  .tagStyle {
    font-size: 16px;
  }

  .ant-divider-vertical {
    margin: 0px 12px;
  }

  .checkRecord {
    .ant-card-body {
      padding: 0px;
    }
  }

  .issueOrders {
    .ant-card-body {
      padding: 0px;
    }
  }
  /*.el-collapse-item__header.is-active{*/
  /*  background: #fafafafa;*/
  /*}*/
  /*.el-collapse-item__header{*/
  /*  background: #fafafafa;*/
  /*}*/
  .patientsHome{
    .el-table th{
      background-color: #ffffff!important;
      opacity: 0.8;
    }
  }
  .el-collapse-item__arrow{
    font-size: 20px;
    margin: 0 20px 0 auto;
  }
  .rounds{
    padding-left:20px;
  }
</style>