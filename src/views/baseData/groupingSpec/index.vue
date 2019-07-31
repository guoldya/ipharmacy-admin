<template>
  <div>
    <a-card>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="varietiesSearch">查询</a-button>
          <a-button style="margin-left: 5px" @click="varietiesResetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-button class="margin-top-10" type="primary" @click="addVarieties">新增分组</a-button>
      <a-spin tip="加载中..." :spinning="loading">
        <el-table
          ref="table"
          :data="drugVarietyData"
          border
          class="margin-top-10"
            highlight-current-row
        >"
          <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
            <template slot-scope="scope">
              <opcol :items="items" :more="false" :data="scope.row" :filterItem="['status']"></opcol>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            v-for="item in columns"
            :key="item.value"
            :label="item.title"
            :prop="item.value"
            :width="item.width"
            :align="item.align"
          >
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
          hideOnSinglePage
          :total="total"
          class="pnstyle"
          :defaultPageSize="pageSize"
          :pageSizeOptions="['10', '20','50']"
          @showSizeChange="varietiesPageSize"
          @change="varietiesPageChange"
          size="small"
          v-model="current"
        ></a-pagination>
      </a-spin>
    </a-card>
    <a-modal
      :title="Modal.title"
      :visible="Modal.visible"
      @ok="handleOk"
      :confirmLoading="Modal.confirmLoading"
      @cancel="handleCancel"
      class="ruleModal"
      width="680px"
      :maskClosable="false"
    >
      <a-form :form="form">
            <a-form-item
              style="padding-top: 20px"
              label="名称"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-input
                v-decorator="[ 'specName',{rules: [{ required: true, message: '请输入分组名称' },{max: 16,message:'输入名称过长'}]} ]"
              />
            </a-form-item>
            <a-form-item
              label="备注"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-input
                v-decorator="[ 'remark',{rules: [{max: 125,message:'输入备注过长'}]} ]"
              />
            </a-form-item>
            <a-form-item
              label="状态"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-radio-group v-decorator="[ 'status',{initialValue: '1'}]">
                <a-radio v-for="(op,index) in this.enum.status" :value="op.id" :key="index">{{op.text}}</a-radio>
              </a-radio-group>
            </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        api: {
          selectPage: 'sys/coreGroupingSpec/selectPage',
          updateStatusUrl: 'sys/coreGroupingSpec/updateStatus',
          updateUrl: 'sys/coreGroupingSpec/update'
        },
        loading: false,
        pageSize: 10,
        current: 1,
        items: [
          { text: '编辑', showtip: false, click: this.edits },
          { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.changeStatus, status:'1' },
          { text: '停用', showtip: true, color: '#ff9900', tip: '确认停用吗？', click: this.changeStatus, status:'0' }],
        drugVarietyData: [],
        total: 1,
        columns: [
          { title: '编号', value: 'id', align: 'right', width: 80 },
          { title: '名称', value: 'specName', width: 150  },
          { title: '备注', value: 'remark' },
          { title: '更新人', value: 'updateMan',width:100 },
          { title: '更新时间', value: 'updateTime',width:130 },
          { title: '状态', value: 'status', width: 80, align: 'center' }
        ],
        toxicologyData: [],
        editData: {},
        Modal: {
          title: '',
          visible: false,
          confirmLoading: false,
          isNew:true,
        },
        form: this.$form.createForm(this),
        pageChangeFilter: {}
      }
    },
    mounted() {
      this.getVarietiesData()
    },
    computed: {
      list() {
        return [
          {
            name: '品种名称',
            dataField: 'specName',
            type: 'text'
          },
          {
            name: '状态',
            dataField: 'status',
            type: 'select',
            dataSource: this.enum.status,
            keyExpr: 'id',
            valueExpr: 'text'
          }
        ]
      }
    },
    methods: {
      //搜索
      varietiesSearch() {
        let params = this.$refs.searchPanel.form.getFieldsValue()
        this.pageChangeFilter = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = 10
        params.offset = 0
        this.getVarietiesData(params)
      },
      //重置
      varietiesResetForm() {
        this.current = 1
        this.$refs.searchPanel.form.resetFields()
        this.pageChangeFilter = {}
        this.getVarietiesData({})
      },
      //页码数change事件
      varietiesPageSize(page, pageSize) {
        this.current = 1
        this.pageSize = pageSize
        let params = this.pageChangeFilter
        params.offset = (this.current - 1) * pageSize
        params.pageSize = pageSize
        this.getVarietiesData(params)
      },
      //页码跳转事件
      varietiesPageChange(page, pageSize) {
        let params = this.pageChangeFilter;
        (params.offset = (page - 1) * pageSize), (params.pageSize = pageSize)
        this.getVarietiesData(params)
      },
      getVarietiesData(params = {}) {
        if (params.offset == 0) {
          this.current = 1
        }
        this.loading = true
        this.$axios({
          url: this.api.selectPage,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.loading = false
              this.drugVarietyData = this.$dateFormat(res.rows,['updateTime']);
              this.total = res.total
            } else {
              this.loading = false
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
            this.loading = false
          })
      },
      //添加品种
      addVarieties() {
        this.Modal.visible = true
        this.Modal.title = '新增分组'
        this.Modal.isNew = true
        this.form.resetFields()
      },
      //编辑分组
      edits(data) {
        this.editData = data
        setTimeout(() => {
          this.form.setFieldsValue({
            specName: data.specName,
            remark: data.remark,
            status: ''+data.status,
          })
        }, 0)
        this.Modal.visible = true
        this.Modal.isNew = false
        this.Modal.title = '编辑分组'
      },

      changeStatus(data){
        if (data.status == '1') {
          data.status = '0'
        } else {
          data.status = '1'
        }
        this.$axios({
          url: this.api.updateStatusUrl,
          method: 'post',
          data: {id:data.id,status:data.status}
        })
          .then(res => {
            if (res.code == '200') {
              this.success(res.msg)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },

      //提交添加品种
      handleOk(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            if (!this.Modal.isNew){
              values.id = this.editData.id;
            }
            this.$axios({
              url: this.api.updateUrl,
              method: 'post',
              data: values
            })
              .then(res => {
                if (res.code == '200') {
                  let params = {}
                  params.offset = (this.current - 1) * this.pageSize
                  params.pageSize = this.pageSize
                  this.getVarietiesData(params)
                  this.success(res.msg)
                  this.Modal.visible = false
                } else {
                  this.warn(res.msg)
                }
              })
              .catch(err => {
                this.error(err)
              })
          }
        })

      },
      //取消添加品种
      handleCancel() {
        this.Modal.visible = false
      }
    }
  }
</script>

<style scoped>

</style>