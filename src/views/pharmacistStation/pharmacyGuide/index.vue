<template>
    <div class="pharmacyGuideIndex">
      <a-card>
        <a-row class="blodRow">
          <a-col :span="4">内分泌科：李艳</a-col>
          <a-col :span="2">9110267</a-col>
          <a-col :span="2"> 女</a-col>
          <a-col :span="2">23</a-col>
          <a-col :span="2">15区/1病床</a-col>
          <a-col :span="4">入院日期：2019-06-06</a-col>
          <a-col :span="8">
            <div>
              <span>
                <a-icon type="star" theme="filled" :style="{ color: '#1890ff' }" />
              </span>
              <span class="blueBg">肝</span>
              <span class="greenBg">一般</span>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <a-card class="margin-top-5">
        <div>
          <a-card
            style="width:100%"
            :tabList="tabList"
            :activeTabKey="key"
            @tabChange="key => onTabChange(key, 'key')"
          >
             <span slot="customRender" slot-scope="item">
            <a-dropdown>
              <a-menu slot="overlay" @click="handleMenuClick">
                <a-menu-item   :key="key">{{menuItem[key]}}</a-menu-item>
              </a-menu>
              <span style="margin-left: 8px">
              {{item.key}} <a-icon type="caret-down" />
            </span>
            </a-dropdown>
          </span>

            <div class="medicineGuide">
              <span><a-icon type="medicine-box" /> 用药指导</span>
              <span>
               <a-button @click="tableRefresh"><a-icon type="sync" />刷新</a-button>
              <a-button type="primary">创建指导</a-button>
              </span>
            </div>
            <a-spin :spinning="loading" tip="加载中...">
              <a-table bordered :columns="columns"
                       class="margin-top-10"
                       :dataSource="data"
                       :pagination="pagination"
                       @change="handleTableChange"
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
                </el-table-column>
                <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
                  <template slot-scope="scope">
                    <opcol
                      :items="items"
                      :more="false"
                      :data="scope.row"
                      :filterItem="['status']"
                    ></opcol>
                  </template>
                </el-table-column>

              </a-table>
              <a-pagination
                showSizeChanger
                showQuickJumper
                hideOnSinglePage
                :total="total"
                class="pnstyle"
                :defaultPageSize="pageSize"
                :pageSizeOptions="['10', '20','50']"
                @showSizeChange="pageChangeSize"
                @change="pageChange"
                size="small"
                v-model="current"
              ></a-pagination>
            </a-spin>

          </a-card>
        </div>

      </a-card>
    </div>
</template>

<script>
  export default {
    name: 'index',
    data(){
      return{
        data:[],
        total: null,
        current: 1,
        pageSize: 10,
        key: 'tab1',
        noTitleKey: 'app',
        tabList: [{
          key: 'tab1',
          tab:'患者主页'
        }, {
          key: '药学服务',
          scopedSlots: { tab: 'customRender'}
        },
          {
            key: '临床信息',
            scopedSlots: { tab: 'customRender'}
          },
          {
            key: '学员工作',
            scopedSlots: { tab: 'customRender'}
          }],
        menuItem: {
          tab1: 'content1',
          tab2: 'content2',
          tab3: 'content3',
          tab4: 'content4',
        },
        loading:false,
        columns: [
          { title: '患者姓名', value: 'auditLevel', width: 120, align: 'right'},
          { title: '住院号', value: 'levelType', align: 'center', width: 100 },
          { title: '性别', value: 'levelName', align: 'center', width: 100 },
          { title: '年龄', value: 'handleType', align: 'center', width: 110},
          { title: '入院时间', value: 'levelDescription',  width: 100},
          { title: '患者位置', value: 'status1', width: 100, align: 'center' },
          { title: '入院诊断', value: 'status2', align: 'center',width: 90 },
          { title: '指导内容', value: 'status3', align: 'center' },
          { title: '紧急程度', value: 'statu4s', width: 90, align: 'center' },
          { title: '建议类别', value: 'statu5s', width: 90, align: 'center' },
          { title: '指导状态', value: 'statu6s', width: 90, align: 'center' },
          { title: '创建人', value: 'status7', width: 90, align: 'center' },
          { title: '指导时间', value: 'status8', width: 90, align: 'center' },
          { title: '审核状态', value: 'status9', width: 90, align: 'center' },
        ],
        items: [
          { text: '编辑', showtip: false, click: this.edits },
          { text: '删除', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.user, status: '1' },
        ],
      pagination: {},
      }
    },
    methods:{
      handleMenuClick(e) {
        console.log('click', e);
      },
      onTabChange (key, type) {
        console.log(key, type)
        this[type] = key
      },
      tableRefresh(){
        // this.loading=true;
        this.$router.push({
          name: 'pharmacyGuideDetail'
        })
      },
      handleTableChange(pagination, filters, sorter) {
        // let values = this.getFields();
        // let params = {
        //   offset: (pagination.current - 1) * 10,
        //   pageSize: pagination.pageSize,
        //   orderBy:sorter.field,
        //   sortAsc:sorter.order == 'ascend'?'Y':'N'
        // }
        // this.handleAdd(Object.assign({}, values, params))
      },
      pageChange(page, pageSize) {
        // let params = this.searchData
        // params.offset = (page - 1) * pageSize
        // params.pageSize = pageSize
        // this.getData(params)
      },
      pageChangeSize(page, pageSize) {
        // let params = this.searchData
        // params.offset = (page - 1) * pageSize
        // params.pageSize = pageSize
        // this.getData(params)
      },
    },
  }
</script>

<style scoped  lang="less">
  .pharmacyGuideIndex {
    .medicineGuide{
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:last-child button:last-child{
        margin-left: 8px;
      }
  }
    .ant-card{
      .ant-row{
        font-weight: bold;
        .ant-col-8{
          text-align: right;
        }
        div span{
          margin: 0 6px;
        }
        span:first-child{
          border: 1px solid #1890ff;
          padding: 3px 7px;
        }
        span.blueBg{
          background-color: #1890ff;
          color: #fff;
          padding: 4px 8px;
        }
        span.greenBg{
          background-color: #1890ff;
          color: #fff;
          padding: 4px 8px;
        }
      }
    }
  }
</style>