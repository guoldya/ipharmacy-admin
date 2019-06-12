<template>
  <a-card>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-button class="margin-top-10" type="primary" @click="classCode">添加分类</a-button>
      <a-spin tip="加载中..." :spinning="loading">
        <el-table
          ref="table"
          :data="loadData"
          border
          class="margin-top-10"
          :highlight-current-row="true"
          @row-click="clickRow"
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
    <a-card class="margin-top-10 codeClass" title="字典值域">
      <a-spin tip="加载中..." :spinning="codeLoading">
        <a-treeTable
          :columns="columns2"
          :data="baseData"
          :items="items2"
          :opColWidth="110"
          :moreOp="false"
          :isOpcol="isOpcol"
        >
        </a-treeTable>
      </a-spin>
    </a-card>
  </a-card>
</template>

<script>
  import treeTable from '@/components/tree-table/treeTable.vue'
  export default {
    name: 'ruleMgt',
    components: {
      'a-treeTable': treeTable
    },
    data() {
      return {
        api: {
          dicDrugSelectList: 'sys/dicBase/selectClassList',
          dicBaseclassList:'sys/dicBaseclass/selectList',
          baseClassPage:'sys/dicBaseclass/selectPage',
        },
        loading: false,
        codeLoading: false,
        loadData: [],
        baseData: [],
        columns: [
          { title: '分类编码', value: 'id',align:'right',width:80 },
          { title: '分类名称', value: 'name' },
          { title: '标准代码', value: 'standardCode' },
          { title: '分类类型', value: 'classType', align: 'center', width: 100 , format:this.classTypeFormat },
          { title: '备注', value: 'remark' },
        ],
        items: [
          {text:'编辑', showtip: false, click: this.edits,classType:'1' },
        ],
        items2: [
          {text:'编辑', showtip: false, click: this.edits },
          {text:'启用',color:'#2D8cF0',showtip:true,tip:'确认启用吗？',click:this.changeStatus,status:'1'},
          {text:'停用',color:'#ff9900',showtip:true,tip:'确认停用吗？',click:this.changeStatus,status:'0'},
        ],
        columns2: [
          { text: '编码', value: 'code', width: 150 },
          { text: '字典名称', value: 'name', width: 80  },
          { text: '编码值', value: 'codeValues' },
          { text: '拼音码', value: 'spellCode' },
          { text: '备注', value: 'remark' },
          { text: '状态', value: 'status', align: 'center', width: 100 },
        ],
        isOpcol:true,
        total: null,
        curent: 1,
        pageSize: 10,
        baseClassList:[],
      }
    },
    mounted() {
      this.getData();
      this.getBaseClassList();
    },
    computed: {
      list() {
        return [
          {
            name: '分类名称',
            dataField: 'drugName',
            type: 'text'
          },

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
      getData(params = {}) {
        this.loading = true;
        this.$axios({
          url: this.api.baseClassPage,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.loading = false;
              this.loadData = res.rows;
              for (let key in this .loadData){
                if (this .loadData[key].classType == '1'){
                  this.items[0].classType = '1'
                } else{
                  this.items[0].classType = '0'
                }
              }
              this.total = res.total;
            } else {
              this.loading = false;
              this.warn(res.msg);
            }
          })
          .catch(err => {
            this.error(err);
            this.loading = false;
          })
      },

      getTreeData(params = {}){
        this.codeLoading = true;
        this.$axios({
          url: this.api.dicDrugSelectList,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.codeLoading = false;
              this.baseData = this.getDataChildren(res.rows, undefined);
            } else {
              this.codeLoading = false;
              this.warn(res.msg);
            }
          })
          .catch(err => {
            this.error(err);
            this.codeLoading = false;
          })
      },
      getDataChildren(bdata, pid) {
        var items = []
        for (var key in bdata) {
          var item = bdata[key]
          if (pid == item.parentId) {
            item.items = this.getDataChildren(bdata, item.id)
            items.push(item)
          }
        }
        return items
      },
      //获取分类类型列表
      getBaseClassList(){
        this.$axios({
          url: this.api.dicBaseclassList,
          method: 'put',
          data: {}
        })
          .then(res => {
            if (res.code == '200') {
              this.baseClassList = res.rows;
            } else {
              this.warn(res.msg);
            }
          })
          .catch(err => {
            this.error(err);
          })
      },
      //页码数change事件
      pageChangeSize(page, pageSize) {
        this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
      //页码跳转事件
      pageChange(page, pageSize) {
        this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
      edits(data) {
        this.$router.push({
          name: 'drugSpecDetail'
        })
      },
      changeStatus(data){

      },
      //添加分类
      classCode() {
        this.$router.push({
          name: 'detailBaseClass'
          // params:data,
        })
      },
      //点击第一个table列事件
      clickRow(row) {
        console.log(row);
        let params = {};
        params.codeClass = row.id;
        this.getTreeData(params);
        if (row.classType == 1){
          this.isOpcol = false;
        }
      },
      //filter
      classTypeFormat(data){
        let codeText
        this.enum.classType.forEach(item => {
          if (data.classType == item.id) {
            codeText = item.text
            return
          }
        })
        return codeText
      }
    }
  }
</script>

<style >
.codeClass .ant-card-body{
  padding: 0px!important;
}
</style>