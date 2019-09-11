<template>
    <div class="pharmacyGuideIndex">
      <a-card>
        <a-row class="blodRow">
          <a-col :span="3">内分泌科：李艳</a-col>
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
              <span class="titleText margin-left-20">
                  <a-tag
                    class="tagStyle"
                    :color="'#40a9ff'"
                    :key="2"
                  >肝</a-tag>
                  <a-tag
                    class="tagStyle"
                    :color="'#58C7CF'"
                    :key="3"
                  >一般</a-tag>
                </span>
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
                <a-menu slot="overlay"  @click="handleMenuClick">
                  <a-menu-item :class="key===item.value?'selectItemBg':''" v-for="(item,index) in pharmacyServiceItem" :key="item.value">{{item.tab}}</a-menu-item>
                </a-menu>
                <span class="marginLeft8">
                {{item.name}} <a-icon type="caret-down" />
              </span>
              </a-dropdown>
            </span>

            <span slot="pharmacyService" slot-scope="item">
              <a-dropdown>
                <a-menu slot="overlay"  @click="handleMenuClick">
                  <a-menu-item :class="key===item.value?'selectItemBg':''" v-for="(item,index) in clinicalItem" :key="item.value">{{item.tab}}</a-menu-item>
                </a-menu>
                <span class="marginLeft8">
                {{item.name}} <a-icon type="caret-down" />
              </span>
              </a-dropdown>
            </span>

            <span slot="studentWork" slot-scope="item">
              <a-dropdown>
                <a-menu slot="overlay"  @click="handleMenuClick">
                  <a-menu-item :class="key+index===item.value?'selectItemBg':''" v-for="(item,index) in studentWorkItem" :key="item.value">{{item.tab}}</a-menu-item>
                </a-menu>
                <span class="marginLeft8">
                {{item.name}} <a-icon type="caret-down" />
              </span>
              </a-dropdown>
            </span>
            <div v-if="key==='tab1'">
              <div class="medicineGuide">
                <span class="font-bold fontSize16"><a-icon type="medicine-box" /> 用药指导</span>
                <span>
               <a-button @click="tableRefresh"><a-icon type="sync" />刷新</a-button>
              <a-button type="primary" @click="addGuide">创建指导</a-button>
              </span>
              </div>
              <a-spin :spinning="loading" tip="加载中...">
                <el-table
                  class="margin-top-10"
                  :data="data"
                  border
                  :highlight-current-row="true"
                  style="width: 100%"
                >
                  <el-table-column fixed="right" label="操作" :width="150" align="center" v-if="true">
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
                    <template  slot-scope="scope">
                      <span class="updateBtn inHospitalNo" v-if="item.value==='no'">123</span>
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
                  v-model="current"
                ></a-pagination>
              </a-spin>
            </div>
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
        data:[{name:'张三'}],
        total: null,
        current: 1,
        pageSize: 10,
        key: 'tab1',
        noTitleKey: 'app',
        tabList: [{
          key: 'tab1',
          tab:'患者主页'
        }, {
          key: 'tab2',
          name: '药学服务',
          scopedSlots: { tab: 'customRender'}
        },
          {
            name: '临床信息',
            key: 'tab3',
            scopedSlots: { tab: 'pharmacyService'}
          },
          {
            name: '学员工作',
            key: 'tab4',
            scopedSlots: { tab: 'studentWork'}
          }],
        pharmacyServiceItem:[{
          tab: '药学服务1',value:'tab2'},
          {tab: '药学服务2',value:'药学服务2',
        }],
        clinicalItem:[{
          tab: '临床信息1',value:'tab3'},
          {tab: '临床信息2',value:'临床信息2',
        }],
        studentWorkItem:[{
          tab: '学员工作1',value:'tab4'},{
          tab: '学员工作2',value:'tab41',
        }],
        loading:false,
        columns: [
          { title: '患者姓名', value: 'name', width: 100, align: 'left'},
          { title: '住院号', value: 'no', align: 'right', width: 100 },
          { title: '性别', value: 'levelName', align: 'left', width: 80 },
          { title: '年龄', value: 'handleType', align: 'right', width: 60},
          { title: '入院时间', value: 'levelDescription',  width: 100, align: 'left'},
          { title: '患者位置', value: 'status1', width: 100, align: 'left' },
          { title: '入院诊断', value: 'status2', align: 'left',width: 120 },
          { title: '指导内容', value: 'status3', align: 'left' },
          { title: '紧急程度', value: 'statu4s', width: 90, align: 'left' },
          { title: '建议类别', value: 'statu5s', width: 90, align: 'left' },
          { title: '指导状态', value: 'statu6s', width: 90, align: 'left' },
          { title: '创建人', value: 'status7', width: 90, align: 'left' },
          { title: '指导时间', value: 'status8', width: 90, align: 'left' },
          { title: '审核状态', value: 'status9', width: 90, align: 'left' },
        ],
        items: [
          { text: '编辑',  showtip: false, click: this.edits, status: '' },
          { text: '删除', color: '#E6A23C', showtip: true, tip: '确认启用吗？', click: this.user, status: '1' },
        ],
      pagination: {},
      }
    },
    methods:{
      handleMenuClick(e) {
        console.log('click', e.key.substring(0, e.key.length - 1));
        this.onTabChange(e.key,'key')
      },
      onTabChange (key, type) {
        console.log(key, type)
        this[type] = key
      },
      tableRefresh(){
        // this.loading=true;
        this.$router.push({
          name: 'pharmacyGuideDetail',
        })
        window.localStorage.setItem('childPage', JSON.stringify('look'))
      },
      addGuide(){
        this.$router.push({
          name: 'pharmacyGuideDetail',
        })
        window.localStorage.setItem('childPage', JSON.stringify('add'));
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
.selectItemBg{
      color: #1890ff;
      opacity: .8;
    }
  .pharmacyGuideIndex {
    
    .inHospitalNo{
      padding: 0 8px
    }
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
          padding: 0 6px;
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