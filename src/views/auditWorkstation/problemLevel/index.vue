<template>
    <div>
      <a-spin :spinning="loading" tip="加载中...">
        <el-table
          :data="loadData" border
          :highlight-current-row="true"
          :cell-style="cellStyle">
          <el-table-column v-for="item in columns" :show-overflow-tooltip="true" :key="item.dataIndex" :label="item.title"
                           :prop="item.dataIndex" :width="item.width" :align="item.align">
            <template slot-scope="props">
                  <span v-if="item.dataIndex == 'action'">
                        <a  @click="user(props)">启用</a>
                        <a-divider type="vertical" />
                        <a  @click="ban(props.row)">停用</a>
                        <a-divider type="vertical" />
                     <a @click="edits(props.row)">编辑</a>
                  </span>
                <span v-else-if="item.dataIndex == 'colors'" >
                </span>
              <span v-else>{{props.row[item.dataIndex]}}</span>
            </template>
          </el-table-column>
        </el-table>

        <a-pagination
          showSizeChanger
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
    </div>
</template>

<script>
  export default {
    name: 'index',
    data(){
      return{
        loading:false,
        total:10,
        curent:1,
        pageSize:10,
        columns: [
          {title: '编号',dataIndex: 'id',width:80},
          {title: '等级类型',dataIndex: 'levelType'},
          {title: '问题等级',dataIndex: 'problemLevel',width:100},
          {title: '处理类型',dataIndex: 'createTime'},
          {title: '显示颜色',dataIndex: 'colors',width:100},
          {title: '等级说明',dataIndex: 'editTime'},
          {title: '操作',width: '150px',dataIndex: 'action',align:'center'}
        ],
        colors:'#ffffff',
        loadData:[],
      }
    },
    mounted(){
      this.getData();
    },
    methods:{
      getData(){
        this.loadData = [{id:1,levelType:'系统',status:1,problemLevel:'0级',createTime:'无',colors:'red',editTime:'无'},
          {id:2,levelType:'系统',status:1,problemLevel:'0级',createTime:'无',colors:'yellow',editTime:'无'}];
      },
      pageChangeSize(){

      },
      pageChange(){

      },
      //启用停用
      user(){

      },
      //停用
      ban(data){
      },
      edits(data){

        this.$router.push({
          name: 'problemLevelDetail',
          params:data,
        })
      },

      cellStyle(row){
        if (row.column.label==='显示颜色'){
          return 'backgroundColor:'+row.row.colors
        }
      }
    }
  }
</script>

<style scoped>

</style>