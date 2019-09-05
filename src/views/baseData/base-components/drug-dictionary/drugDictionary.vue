<template>
  <div>
    <a-button type="primary" @click="addDictionary" :disabled="dictionary.disable">新增药品</a-button>
    <a-spin tip="加载中..." :spinning="loading">
      <a-spin tip="加载中..." :spinning="dictionary.loading">
        <el-table
          ref="table"
          :data="dictionary.drugDictionaryData"
          border
          class="margin-top-10"
          :highlight-current-row="true"
        >
          <el-table-column fixed="right" label="操作" :width="200" align="center" v-if="true">
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
              <span v-else-if="item.value=='drugName'">
                <a @click="lookDetail(scope.row)">{{scope.row.drugName}}</a>
              </span>
              <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
              <span v-else>{{scope.row[item.value]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          showSizeChanger
          showQuickJumper
          :total="dictionary.total"
          class="pnstyle"
          :pageSize="pageSize"
          :pageSizeOptions="['10', '20','50']"
          @showSizeChange="pageChangeSize"
          @change="pageChange"
          size="small"
          v-model="current"
        ></a-pagination>
      </a-spin>
    </a-spin>
    <a-modal
      :title="Modal.title"
      :visible="Modal.visible"
      @ok="handleOk"
      :confirmLoading="Modal.confirmLoading"
      @cancel="handleCancel"
      width="680px"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-row>
          <a-col :span="12">
            <a-form-item
              style="padding-top: 20px"
              label="药品名称"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <a-input
                v-decorator="[ 'drugName',{rules: [{ required: true, message: '请输入药品名称' },{max: 200,message:'输入药品名称过长'}]} ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              style="padding-top: 20px"
              label="拼音码"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 16}"
            >
              <a-input v-decorator="[ 'spellCode',{rules: [{max:100,message:'输入拼音码过长'}]}  ]"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="规格" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
              <a-input v-decorator="[ 'spec',{rules: [{ required: true, message: '请输入规格' }]} ]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="单位" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
              <a-input
                v-decorator="[ 'unit',{rules: [{ required: true, message: '请输入单位' },{max:10,message:'输入单位过长'}]}  ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="生产厂商" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
              <a-input
                v-decorator="[ 'producedBy',{rules: [{ required: true, message: '请输入生产厂商' },{max:200,message:'输入生产厂商过长'}]}  ]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="剂型" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
              <a-tree-select
                showSearch
                :treeData="dosageList"
                treeNodeFilterProp="title"
                v-decorator="[ 'dosageForms',{rules: [{ required: true, message: '请选择剂型' }]}  ]"
              ></a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="成分(主料)" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
              <a-select
                mode="multiple"
                showSearch
                :filterOption="false"
                @search="mainComposition"
                @change="selectMain"
                @blur="blurComposition"
                v-decorator="[ 'main' ]"
              >
                <a-select-option
                  :value="op.compositionId"
                  v-for="(op,index) in compositionList"
                  :key="index"
                >{{op.compositionName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="成分(辅料)" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
              <a-select
                mode="multiple"
                showSearch
                :filterOption="false"
                @change="selectComposition"
                @search="handleComposition"
                @blur="blurComposition"
                v-decorator="[ 'auxiliary' ]"
              >
                <a-select-option
                  :value="op.compositionId"
                  v-for="(op,index) in compositionList"
                  :key="index"
                >{{op.compositionName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="状态" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
              <a-radio-group v-decorator="[ 'status' ]">
                <a-radio
                  :value="op.id"
                  v-for="(op,index) in this.enum.status"
                  :key="index"
                >{{op.text}}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  name: 'drugDictionary',
  props: ['dictionary', 'defaultPage'],
  data() {
    this.handleComposition = debounce(this.handleComposition, 800)
    this.mainComposition = debounce(this.mainComposition, 800)
    return {
      api: {
        dicDrugSelectPage: 'sys/dicDrug/selectPage',
        selectDosageList: 'sys/dicBase/selectTitlesList',
        dicDrugCompositionList: 'sys/dicDrugcomposition/selectCompositionList',
        selectByDrugCode: 'sys/dicDrug/selectDrugcompositionByDrugCode',
        dicDrugUpdate: 'sys/dicDrug/update',
        statusUpdate: 'sys/dicDrug/updateStatus'
      },
      loading: false,
      pageSize: 10,
      items: [
        { text: '编辑', showtip: false, click: this.edits },
        { text: '编辑说明书', showtip: false, click: this.editInstruct },
        { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.changeStatus, status: '1' },
        { text: '停用', color: '#ff9900', showtip: true, tip: '确认停用吗？', click: this.changeStatus, status: '0' }
      ],
      columns: [
        { title: '药品编码', value: 'drugCode', align: 'right', width: 80 },
        // { title: '品种编码', value: 'varietyCode' },
        { title: '药品名称', value: 'drugName' },
        { title: '规格', value: 'spec', width: 200 },
        { title: '单位', value: 'unit', width: 80, align: 'center' },
        { title: '生产厂商', value: 'producedBy', width: 200 },
        { title: '拼音码', value: 'spellCode', width: 100 },
        { title: '剂型', value: 'dosageFormsStr', width: 100, align: 'center' },
        { title: '状态', value: 'status', align: 'center', width: 80 }
      ],
      Modal: {
        title: '',
        visible: false,
        confirmLoading: false
      },
      dosageList: [],
      compositionList: [],
      form: this.$form.createForm(this),
      editData: {},
      selectMainList: [],
      selectCompositionList: [],
      current: 1,
      isshow: true
    }
  },
  watch:{
    defaultPage(newValue,oldValue) {
      if (newValue == 10){
        this.pageSize = 10;
      }
    }
  },
  mounted() {
    this.getDosageList()
    this.getDrugComposition()
  },
  methods: {
    pageChangeSize(page, pageSize) {
      this.pageSize = pageSize;
      this.getDictionary({
        offset: (page - 1) * pageSize,
        pageSize: pageSize,
        varietyCode: this.dictionary.varietyCode
      })
      let data = {
        defaultPage: this.pageSize
      };
      this.$emit( 'updateDefaultPage',data);
    },
    pageChange(page, pageSize) {
      this.getDictionary({
        offset: (page - 1) * pageSize,
        pageSize: pageSize,
        varietyCode: this.dictionary.varietyCode
      })
    },
    getDictionary(params = {}) {
      if (params.offset == 0) {
        this.current = 1
      }
      this.loading = true
      this.$axios({
        url: this.api.dicDrugSelectPage,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dictionary.drugDictionaryData = res.rows
            this.dictionary.total = res.total
            this.loading = false
          } else {
            this.warn(res.msg)
            this.loading = false
          }
        })
        .catch(err => {
          this.error(err)
          this.loading = false
        })
    },
    addDictionary() {
      this.selectCompositionList = []
      this.Modal.visible = true
      this.Modal.title = '新增药品'
      this.form.resetFields()
      setTimeout(() => {
        this.form.setFieldsValue({
          status: '0'
        })
      }, 0)
    },
    edits(data) {
      this.editData = data
      let main = []
      let auxiliary = []
      this.selectCompositionList = []
      let composition = data.dicDrugcompositionVOList
      if (composition.length > 0) {
        let i = 0,
          j = 0
        for (let key in composition) {
          if (composition[key].compositionStatus == '1') {
            main[i] = composition[key].compositionId
            i += 1
          } else if (composition[key].compositionStatus == '0') {
            auxiliary[j] = composition[key].compositionId
            j += 1
          }
        }
        let params = {}
        params.drugCode = data.drugCode
        params.keyword = ''
        this.$axios({
          url: this.api.selectByDrugCode,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.compositionList = res.rows
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      }
      setTimeout(() => {
        this.form.setFieldsValue({
          dosageForms: data.dosageForms,
          drugName: data.drugName,
          producedBy: data.producedBy,
          spec: data.spec,
          spellCode: data.spellCode,
          status: data.status,
          unit: data.unit,
          main: main,
          auxiliary: auxiliary
        })
      }, 0)
      this.Modal.visible = true
      this.Modal.title = '编辑药品'
    },
    //启用停用
    changeStatus(data) {
      let params = {}
      if (data.status == '1') {
        params.status = '0'
      } else {
        params.status = '1'
      }
      params.drugCode = data.drugCode
      this.$axios({
        url: this.api.statusUpdate,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.success(res.msg)
            let pageFilter = {};
            pageFilter.offset = (this.current-1)*this.pageSize;
            pageFilter.pageSize = this.pageSize;
            pageFilter.varietyCode =  this.dictionary.varietyCode;
            this.getDictionary(pageFilter)
          } else {
            if (data.status == '1') {
              this.warn('停用失败')
            } else {
              this.warn('启用失败')
            }
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.dicDrugcompositionVOList = []
          values.varietyCode = this.dictionary.varietyCode
          if (this.Modal.title == '编辑药品') {
            values.drugCode = this.editData.drugCode
          }
          //住料循环赋值
          for (let key in values.main) {
            values.dicDrugcompositionVOList.push({ compositionId: values.main[key], compositionStatus: '1' })
          }
          //辅料循环赋值
          for (let key in values.auxiliary) {
            values.dicDrugcompositionVOList.push({ compositionId: values.auxiliary[key], compositionStatus: '0' })
          }
          this.$axios({
            url: this.api.dicDrugUpdate,
            method: 'post',
            data: values
          })
            .then(res => {
              if (res.code == '200') {
                this.Modal.visible = false
                setTimeout(() => {
                  let params = {}
                  params.offset = (this.current - 1) * this.pageSize
                  params.pageSize = this.pageSize
                  params.varietyCode = this.dictionary.varietyCode
                  this.getDictionary(params)
                }, 100)
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
    handleCancel() {
      this.Modal.visible = false
    },
    //获取剂型列表
    getDosageList() {
      let params = {}
      params.codeClass = 1
      params.status = '1'
      this.$axios({
        url: this.api.selectDosageList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            let indexData = this.dealAllStartTree(res.rows)
            this.dosageList = this.recursiveNodeTree(indexData, 'undefined')
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //获取成分列表
    getDrugComposition(params = {}) {
      if (this.$util.trim(params.keyword) == null) {
        params.keyword = ''
      }
      this.$axios({
        url: this.api.dicDrugCompositionList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.compositionList = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //辅料查询
    handleComposition(value) {
      this.getDrugComposition({ keyword: value })
    },
    //主料查询
    mainComposition(value) {
      this.getDrugComposition({ keyword: value })
    },
    //失焦回调
    blurComposition(){
      if (this.compositionList.length<49){
        this.getDrugComposition({ keyword: '' })
      }
    },
    //主料选择
    selectMain(value) {
      this.selectMainList = value
      for (let key in this.selectMainList) {
        for (let i in this.selectCompositionList) {
          if (this.selectMainList[key] == this.selectCompositionList[i]) {

            this.warn('主辅料中成分存在重复。')
            this.selectMainList.splice(key, 1)
          }
        }
      }
    },
    selectComposition(value) {
      this.selectCompositionList = value
      for (let key in this.selectCompositionList) {
        for (let i in this.selectMainList) {
          if (this.selectCompositionList[key] == this.selectMainList[i]) {
            this.warn('主辅料中成分存在重复。')
            this.selectCompositionList.splice(key, 1)
          }
        }
      }
    },

    //查看药品说明书
    lookDetail(data) {
      // this.$router.push({
      //   name: 'drugSpecDetail',
      //   params: { drugCode: data.drugCode }
      // })
      let newPage = this.$router.resolve({
        name: 'drugSpecDetail',
        params: { drugCode: data.drugCode }
      })
      window.open(newPage.href, '_blank')
    },
    //编辑说明书
    editInstruct(data) {
      this.$router.push({
        name: 'drugSpecUpdateDetail',
        params: { drugCode: data.drugCode, drugName: data.drugName }
      })
    },
    //处理模型字段
    dealAllStartTree(list) {
      let indexData = {}
      for (let key in list) {
        let children = indexData[list[key].parentId]
        if (children instanceof Array) {
          children.push({
            title: list[key].name,
            value: '' + list[key].id,
            key: list[key].id,
            id: list[key].id
          })
        } else {
          children = [
            {
              title: list[key].name,
              value: '' + list[key].id,
              key: list[key].id,
              id: list[key].id
            }
          ]
        }
        indexData[list[key].parentId] = children
      }
      return indexData
    },
    recursiveNodeTree(indexData, pid) {
      let children = indexData[pid]
      if (children != null && children != undefined) {
        for (let ckey in children) {
          let cnode = children[ckey]
          children[ckey].children = this.recursiveNodeTree(indexData, cnode.id)
        }
      }
      return children
    }
  }
}
</script>

<style>
.ant-select-tree-dropdown {
  max-height: 300px !important;
}
</style>