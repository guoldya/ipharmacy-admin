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
              <opcol :items="items" :more="false" :data="scope.row"></opcol>
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
        <a-row>
          <a-col :span="12">
            <a-form-item
              style="padding-top: 20px"
              label="品种名称"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-input
                v-decorator="[ 'varietyName',{rules: [{ required: true, message: '请输入分类名称' },{max: 255,message:'输入品种名称过长'}]} ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              style="padding-top: 20px"
              label="英文名称"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-input
                v-decorator="[ 'engName',{rules: [{ required: true, message: '请输入英文名称' },{max: 255,message:'输入英文名称过长'}]} ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="拼音码"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-input
                v-decorator="[ 'spellCode',{rules: [{max: 150,message:'输入拼音码过长'}]} ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="药品类型"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-select v-decorator="[ 'drugIndicator',{rules: [{ required: true, message: '请选择药品类型' }]}]">
                <a-select-option
                  :value="op.ID"
                  v-for="(op,index) in this.enum.drugType"
                  :key="index"
                >{{op.TITLE}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="毒理分类"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-select v-decorator="[ 'toxicology' ]">
                <a-select-option
                  :value="op.id"
                  v-for="(op,index) in toxicologyData"
                  :key="index"
                >{{op.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="合成药"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-radio-group v-decorator="[ 'iscompound',{initialValue: '0'} ]">
                <a-radio
                  :value="op.id"
                  v-for="(op,index) in this.enum.yesNo"
                  :key="index"
                >{{op.text}}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
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
          selectPage: 'sys/coreGroupingSpec/selectPage/coreGroupingSpec/selectPage',
          dicBaseSelectList: 'sys/dicBase/selectClassList',
          drugVarietyIdUpdate: 'sys/dicDrugvariety/update'
        },
        loading: false,
        pageSize: 10,
        current: 1,
        items: [{ text: '编辑', showtip: false, click: this.edits }],
        drugVarietyData: [],
        total: 1,
        columns: [
          { title: '编号', value: 'id', align: 'right', width: 80 },
          { title: '名称', value: 'specName', width: 150  },
          { title: '备注', value: 'remark' },
          { title: '更新人', value: 'updateMan',width:100 },
          { title: '更新时间', value: 'updateTime',width:100 },
        ],
        toxicologyData: [],
        editData: {},
        Modal: {
          title: '',
          visible: false,
          confirmLoading: false
        },
        form: this.$form.createForm(this),
        pageChangeFilter: {}
      }
    },
    mounted() {
      this.getDicBase()
      this.getVarietiesData()
    },
    computed: {
      list() {
        return [
          {
            name: '品种名称',
            dataField: 'drugvarietyCode',
            type: 'text'
          },
          {
            name: '合成药',
            dataField: 'iscompound',
            type: 'select',
            dataSource: this.enum.yesNo,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '毒理分类',
            dataField: 'toxicology',
            type: 'select',
            dataSource: this.toxicologyData,
            keyExpr: 'id',
            valueExpr: 'name'
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
              this.drugVarietyData = res.rows
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
        this.Modal.title = '新增品种'
        this.form.resetFields()
      },
      //编辑品种
      edits(data) {
        this.editData = data
        setTimeout(() => {
          this.form.setFieldsValue({
            varietyName: data.varietyName,
            spellCode: data.spellCode,
            iscompound: data.iscompound,
            engName: data.engName,
            drugIndicator: data.drugIndicator,
            toxicology: data.toxicology
          })
        }, 0)
        this.Modal.visible = true
        this.Modal.title = '编辑品种'
      },
      getDicBase() {
        let params = {}
        params.codeClass = 39
        this.$axios({
          url: this.api.dicBaseSelectList,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.toxicologyData = res.rows
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },

      drugIndicatorFormat(data) {
        let codeText
        this.enum.drugType.forEach(item => {
          if (data.drugIndicator == item.ID) {
            codeText = item.TITLE
            return
          }
        })
        return codeText
      },
      iscompoundFormat(data) {
        let dataText
        if (data.iscompound == '1') {
          dataText = '是'
        } else if (data.iscompound == '0') {
          dataText = '否'
        } else {
          dataText = '未知'
        }
        return dataText
      },
      toxicologyFormat(data) {
        let codeText
        this.toxicologyData.forEach(item => {
          if (data.toxicology == item.id) {
            codeText = item.name
            return
          }
        })
        return codeText
      },
      //提交添加品种
      handleOk(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.Modal.title == '编辑品种') {
              values.varietyCode = this.editData.varietyCode
            }
            this.$axios({
              url: this.api.drugVarietyIdUpdate,
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