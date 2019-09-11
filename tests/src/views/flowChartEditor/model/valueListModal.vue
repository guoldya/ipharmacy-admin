<template>
  <div>
    <a-modal
      :title="title"
      @ok="ok"
      :confirmLoading="loading"
      @cancel="cancel"
      :width="550"
      :visible="visibled"
      class="valueListModal"
    >
        <el-table
          class=" width-100"
          :data="dataSource.slice((current-1)*pageSize,current*pageSize)"
          ref="table"
          height="375"
        >
          <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
            <template slot-scope="scope">
              <opcol :items="items" :more="false" :data="scope.row" ></opcol>
            </template>
          </el-table-column>
          <el-table-column
            :prop="item.value"
            :label="item.title"
            :key="index"
            v-for="(item,index) in columns"
            :width="item.width"
            :align="item.align"
            :formatter="item.formatter"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="props">
              <span>{{props.row[item.value]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          :total="total"
          class="pnstyle"
          :pageSize="pageSize"
          @change="pageChange"
          size="small"
          v-model="current"
        ></a-pagination>
      </a-modal>
  </div>
</template>

<script>
  export default {
    props: {
      visibled: Boolean,
      cancel: Function,
      ok:Function,
      fullData:Object,
      initialized:Object,
      assertValList:Array,
      title:String,
    },
    name: 'ruleModal',
    data() {
      return {
        api:{
          pageUrl:'sys/coreRuleNode/selectColSqlValuePage',
          delUrl:'sys/coreRuleNode/deleteCoreRuleColValues',
          coreRuleNodeSelectColId:'/sys/coreRuleNode/selectColId',
        },
        loading:false,
        dataSource:[],
        columns:[
          { title: '编码', value: "key", align: 'right',width:100 },
          { title: '名称', value: "title"},
        ],
        items: [{ text: '移除', showtip: true, tip: '确认移除吗？',click: this.del },],
        pageSize:10,
        current:1,
        total:0,
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData(params={}){
        // params.display = this.initialized.display;
        params.id = this.initialized.itemId;
        params.val = this.initialized.val;
        // params.parentId = this.initialized.parentId;
        params.valueList = this.assertValList;
        this.$axios({
          url: this.api.pageUrl,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.dataSource = [];
              for (let key in res.rows) {
                this.dataSource.push(
                  {  key:res.rows[key][this.initialized.val],title:res.rows[key][this.initialized.display]}
                )
              }
              this.total=res.total;
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      pageChange(page, pageSize) {
        console.log(this.dataSource,'2233')
        let params = {}
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
      },
      del(data){
        let params = {};
        params.coreRuleNodeId = this.fullData.id;
        params.value  = data.key;
        for(let i in this.assertValList){
          if (data.key == this.assertValList[i]){
            this.assertValList.splice(i,1);
          }
        }
        for (let ii in this.dataSource){
          if (data.key == this.dataSource[ii].key){
            this.dataSource.splice(ii,1);
          }
        }
        this.total=this.dataSource.length
        this.$emit( 'assertValListUpdate',true);
        this.$forceUpdate()
      }
    }
  }
</script>

<style>
  .valueListModal  .ant-modal-body{
    padding: 0px !important;
  }
</style>