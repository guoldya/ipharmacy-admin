<template>
  <div>
    <a-spin tip="加载中..." :spinning="loadings">
      <el-table
        class="margin-top-10"
        :data="dataSource"
        border
        :highlight-current-row="true">
        <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
          <template slot-scope="scope">
            <opcol :items="items" :more="false" :data="scope.row"></opcol>
          </template>
        </el-table-column>
        <el-table-column v-for="item in columns" :show-overflow-tooltip="true" :key="item.value" :label="item.title"
                         :prop="item.value" :width="item.width" :align="item.align">
          <template slot-scope="props">
            <span>{{props.row[item.value]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <a-pagination
        :total="total"
        class="pnstyle"
        :pageSize="pageSize"
        :pageSizeOptions="['10', '20','50']"
        @showSizeChange="pageChangeSize"
        @change="pageChange"
        size="small"
        v-model="curent"
      >
      </a-pagination>
    </a-spin>
  </div>
</template>

<script>
  export default {
    props: {
      pageInPlanData: {
        Array
      },
      reviewPlanPage: {
        Boolean
      },
      planId: {
        String
      },
      totals:{
         Array
      },
      pages:{
        Number
      },
      loading:{
        Boolean
      }
    },
    name: 'assignDoctorIndex',
    data() {
      return {
        api: {
          inPlan: 'sys/reviewPlan/selectPersonsInPlan',
          deleteP: 'sys/reviewPlan/deleteByPlanIdAndPersonId'
        },
        spinning: false,
        loadings:false,
        dataSource: [],
        total: 1,
        curent: 1,
        pageSize: 10,
        columns: [{ title: '工号', value: 'personId', width: 80, align: 'right' },
          { title: '姓名', value: 'name', width: 120 },
          { title: '电话', value: 'phone', width: 130, align: 'right' },
          { title: '科室', value: 'deptName', width: 200 },
          { title: '医院', value: 'orgTitle' }
        ],
        items: [
          { text: '删除', color: '#ff9900', showtip: true, tip: '确认删除吗？', click: this.deletePerson }
        ]
      }
    },
    mounted() {
    },
    watch:{
      totals(){
        this.total=this.totals[1]
        this.curent=this.totals[0]
      },
      loading(){
        this.loadings=this.loading
      },
      pageInPlanData(){
        this.dataSource=this.pageInPlanData
      }

    },
    methods: {
      getData(params = {}) {
        this.loadings = true
        this.$axios({
          url: this.api.inPlan,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.loadings = false
            this.dataSource = res.rows
          } else {
            this.loadings = false
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.loadings = false
            this.error(err)
          })
      },
      deletePerson(data) {
        let params = {}
        params = { planId: this.planId, personId: data.personId }
        this.$axios({
          url: this.api.deleteP,
          method: 'post',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.success('删除成功!')
              let list = {};
              list.offset = (this.current - 1) * this.pageSize
              list.pageSize = this.pageSize;
              list.planId = this.planId;
              this.getData(list)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      pageChange(page, pageSize) {
        let params = {};
        params.offset = (page-1)*pageSize;
        params.pageSize = pageSize;
        params.planId = this.planId;
        this.getData(params)
      },
      pageChangeSize(page, pageSize) {
        this.pageSize = pageSize;
        let params = {};
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize;
        params.planId = this.planId;
        this.getData(params)
      }
    }
  }
</script>

<style scoped>

</style>