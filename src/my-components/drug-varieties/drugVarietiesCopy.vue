<template>
  <div>
    <a-button class="margin-top-10" type="primary" :disabled="disable" @click="addVarieties">添加品种</a-button>
    <a-spin tip="加载中..." :spinning="loading">
      <el-table
        ref="table"
        :data="variety.drugVarietyData"
        border
        class="margin-top-10"
        :highlight-current-row="true"
        @row-click="clickRow"
      >
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
        :total="variety.total"
        class="pnstyle"
        :defaultPageSize="pageSize"
        :pageSizeOptions="['10', '20','50']"
        @showSizeChange="pageChangeSize"
        @change="pageChange"
        size="small"
      ></a-pagination>
    </a-spin>
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
      <div style="width: 500px;">
        <a-form :form="userForm">
          <a-form-item label="用户" v-bind="formItemLayout">
            <a-select
              mode="multiple"
              placeholder="请选择"
              
            >
              <a-select-option
                :value="item.varietyName"
                v-for="(item,index) in userForData"
                :key="index"
              >{{item.varietyName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
      <!-- <span>选择药品:</span>
      <a-select mode="multiple" style="width: 100%" @change="handleChange" placeholder="Please select">
    <a-select-option v-for="item in drugAllList" :key="item.index">{{item.varietyName}}</a-select-option>
      </a-select>-->
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'drugVarieties',
  props: {
    disable: {
      Boolean
    },
    variety: {
      Object
    },
    pageChangeSize: {
      Function
    },
    pageChange: {
      Function
    },
    clickRow: {
      Function
    }
  },
  data() {
    return {
      api: {
        drugVarietyPageId: 'sys/dicDrugcategory/selectDrugVarietyPageByCategoryId',
        dicBaseSelectList: 'sys/dicBase/selectClassList',
        drugVarietyIdUpdate: 'sys/dicDrugvariety/update',
        getDrugList: 'sys/dicDrugvariety/selectListBykeyword'
        // dicDrugvariety/selectListBykeyword
      },
      loading: false,
      pageSize: 10,
      items: [{ text: '编辑', showtip: false, click: this.edits }],
      columns: [
        { title: '品种编码', value: 'varietyCode', align: 'right', width: 80 },
        { title: '品种名称', value: 'varietyName' },
        { title: '英文名称', value: 'engName' },
        { title: '拼音码', value: 'spellCode' },
        { title: '合成药标志', value: 'iscompound', align: 'center', width: 100, format: this.iscompoundFormat },
        { title: '药品类型', value: 'drugIndicator', align: 'center', width: 100, format: this.drugIndicatorFormat },
        { title: '毒理分类', value: 'toxicology', align: 'center', width: 120, format: this.toxicologyFormat }
      ],
      toxicologyData: [],
      editData: {},
      Modal: {
        title: '',
        visible: false,
        confirmLoading: false
      },
      drugAllList: [{ varietyName: 'ddd' }],
      userForm: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 13 }
      },
      userForData: []
    }
  },
  mounted() {
    this.getDicBase()
  },
  // computed: {
  //   filteredOptions() {
  //     return OPTIONS.filter(o => !this.selectedItems.includes(o))
  //   }
  // },
  methods: {
    filtered(data) {
      return data.filter(o => !this.selectedItems.includes(o))
    },
    // 选择框数据
    handleChange(selectedItems) {
      this.selectedItems = selectedItems
    },
    //获取树形表数据
    getVarietiesData(params = {}) {
      params.categoryId = this.variety.categoryId
      this.loading = true
      this.$axios({
        url: this.api.drugVarietyPageId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.loading = false
            this.variety.drugVarietyData = res.rows
            this.variety.total = res.total
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
    addVarieties(params = {}) {
      this.Modal.visible = true
      this.Modal.title = '新增品种'
      params = { keyword: '' }
      this.$axios({
        url: this.api.getDrugList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.userForData = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //编辑品种
    edits(data) {
      this.editData = data
      console.log(data)
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
          values.dicId = this.variety.categoryId
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
                this.getVarietiesData()
                this.success(res.msg)
              } else {
                this.warn(res.msg)
              }
            })
            .catch(err => {
              this.error(err)
            })
        }
      })
      this.Modal.visible = false
    },
    //取消添加品种
    handleCancel() {
      this.Modal.visible = false
    },
    // 提交输入框内容
    handleSearch(value) {
      let params = { keyword: value, id: this.classData.id }
      this.$axios({
        url: this.api.dicDrugSelectList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.drugAllList = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 里面值改变
    handleChange(value, option) {
      console.log(value)
      this.selectDrugData = value
    }
  }
}
</script>

<style scoped>
</style>