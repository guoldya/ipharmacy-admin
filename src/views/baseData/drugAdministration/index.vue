<template>
  <a-card>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-button class="margin-top-10" type="primary" @click="addClass">新增</a-button>
      <a-spin tip="加载中..." :spinning="loading">
        <el-table
          ref="table"
          :data="tableData"
          border
          class="margin-top-10"
          :highlight-current-row="true"
          @row-click="checkRol"
        >
          <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
            <template slot-scope="scope">
              <opcol :items="items" :more="false" :data="scope.row" :filterItem="['status']"></opcol>
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
              <!--<span v-else-if="item.value=='limitedNum'">-->
          <!--<a-badge :showZero="true" :count="scope.row.limitedNum"-->
                   <!--:numberStyle="{backgroundColor: '#1694fb',cursor: 'pointer'}"/>-->
          <!--</span>-->
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
    <a-button class="margin-top-10" type="primary" @click="addDrug">新增</a-button>
      <a-spin tip="加载中..." :spinning="spinLoading">
        <el-table
          class="margin-top-10"
          :data="drugData" border
          :highlight-current-row="true">
          <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
            <template slot-scope="scope">
              <opcol :items="items2" :more="false" :data="scope.row"></opcol>
            </template>
          </el-table-column>
          <el-table-column v-for="item in columns2" :show-overflow-tooltip="true" :key="item.value" :label="item.title"
                           :prop="item.value" :width="item.width" :align="item.align">
            <template slot-scope="props">
              <span>{{props.row[item.value]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          showSizeChanger
          showQuickJumper
          :total="total1"
          class="pnstyle"
          :defaultPageSize="pageSize"
          :pageSizeOptions="['10', '20','50']"
          @showSizeChange="drugPageChangeSize"
          @change="drugPageChange"
          size="small"
        >
        </a-pagination>
      </a-spin>
      <a-modal
        :title="addModal.title"
        :visible="addModal.visible"
        @ok="addOk"
        :confirmLoading="addModal.confirmLoading"
        @cancel="addCancel"
        class="ruleModal"
        width="680px"
        :maskClosable="false"
      >
        <a-form :form="form">
              <a-form-item style="padding-top: 20px" label="名称"
                           :label-col="{ span: 5 }"
                           :wrapper-col="{ span: 15 }">
                <a-input v-decorator="[ 'specName',{rules: [{ required: true, message: '请输入名称' }]} ]"/>
              </a-form-item>
              <a-form-item label="备注"
                           :label-col="{ span: 5 }"
                           :wrapper-col="{ span: 15 }">
                <a-textarea v-decorator="[ 'remark' ]"/>
              </a-form-item>
            <a-form-item label="状态"
                         :label-col="{ span: 5 }"
                         :wrapper-col="{ span: 15 }">
              <a-radio-group v-decorator="[ 'status' ]">
                <a-radio :value='op.id' v-for="(op,index) in status" :key="index">
                  {{op.text}}
                </a-radio>
              </a-radio-group>
            </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
        title="新增药品"
        :visible="Modal.visible"
        @ok="handleOk"
        :maskClosable="false"
        @cancel="handleCancel"
        width="600px"
      >
        <span>选择药品:</span>
        <a-select style="width: 500px" class="margin-left-5 margin-top-10"
                  showSearch
                  allowClear
                  mode="multiple"
                  optionLabelProp="title"
                  :defaultActiveFirstOption="false"
                  :showArrow="false"
                  :filterOption="false"
                  @search="handleSearch"
                  @change="handleChange"
                  placeholder="药品可多选"
        >
          <a-select-option
            v-for="(item,index) in this.drugAllList"
            :value='item.drugCode'
            :key="index"
            :title="item.drugName"
            :producedBy="item.producedBy"
            :spec="item.spec"
            :spellCode="item.spellCode"
          >
            <a-row>
              <a-col>
                {{item.drugName}}
              </a-col>
            </a-row>
            <a-row>
              <a-col style="opacity: 0.6">
                生产厂商：{{item.producedBy}}
              </a-col>
            </a-row>
            <a-divider style="margin: 8px 0 0 0;"/>
          </a-select-option>
        </a-select>
      </a-modal>
    </a-card>
</template>

<script>
  import debounce from 'lodash/debounce'
  export default {
    name: 'ruleMgt',
    data() {
      this.handleSearch = debounce(this.handleSearch, 800)
      return {
        api: {
          coreSelectPage: 'sys/coreGroupingSpec/selectPage',
          specDrugPageById: 'sys/dicDrug/selectGroupSpecDrugPage',
          coreUpdateStatus:"sys/coreGroupingSpec/updateStatus",
          dicDrugSelectList:'sys/dicDrug/selectDrugListByKeywordAndWithOutCurrentDrug',
          specUpdate:'sys/coreGroupingSpec/update',
          coreGroupingInsert:'sys/coreGroupingSpecDetail/insert',
          coreGroupingSpecDetailDelete:'sys/coreGroupingSpecDetail/delete',

    },
        loading: false,
        spinLoading:false,
        tableData: [],
        drugData: [],
        drugAllList:[],
        columns: [{ title: '编码', value: 'id', width: 80, align: 'right' },
          { title: '名称', value: 'specName' },
          { title: '备注', value: 'remark' },
          { title: '更新人', value: 'updateName', width: 100 },
          { title: '更新时间', value: 'updateTime', width: 150 },
          { title: '状态', value: 'status', width: 100, align: 'center', },
        ],
        columns2: [{ title: '药品编码', value: 'drugCode', width: 80, align: 'right' },
          { title: '药品名称', value: 'drugName' },
          { title: '拼音码', value: 'spellCode',  },
          { title: '生产厂商', value: 'producedBy',  },
          { title: '规格', value: 'spec' },
        ],
        items: [
          {text:'编辑', showtip: false, click: this.edits },
          {text:'启用',color:'#2D8cF0',showtip:true,tip:'确认启用吗？',click:this.changeStatus,status:'1'},
          {text:'停用',color:'#ff9900',showtip:true,tip:'确认停用吗？',click:this.changeStatus,status:'0'},
        ],
        items2:[
          {text:'删除',color:'#ff9900',showtip:true,tip:'确认删除吗？',click:this.deleteDrug},
        ],
        Modal:{
          visible:false,
        },
        addModal:{
          title:'',
          visible:false,
          confirmLoading:false,
          isNew:true,
        },
        editData:{},
        selectDrugData:[],
        classData:{},
        status: [
          { id: 0, text: '停用' },
          { id: 1, text: '启用' }
        ],
        form: this.$form.createForm(this),
        total: null,
        total1:null,
        pageSize: 10
      }
    },
    mounted() {
      this.getData();
    },
    computed: {
      list() {
        return [
          {
            name: '名称',
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
      search() {
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = 10
        params.offset = 0
        this.getData(params)
      },
      //重置
      resetForm() {
        this.$refs.searchPanel.form.resetFields()
        this.getData({ pageSize: 10, offset: 0 })
      },
      //获取网格数据
      getData(params={}) {
        this.loading = true;
        this.$axios({
          url: this.api.coreSelectPage,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.loading = false;
            this.tableData = this.$dateFormat(res.rows,['updateTime']);
            this.total = res.total;
          } else {
            this.loading = false;
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.loading = false;
            this.error(err)
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
      //编辑按钮事件
      edits(data) {
        // this.$router.push({
        //   name: 'drugAdminDetail',
        //   params:{id:data.id}
        // })
        this.addModal.isNew = false;
        this.addModal.visible = true;
        this.addModal.title = '编辑分类';
        this.editData = data;
        setTimeout(()=>{
          this.form.setFieldsValue({
            specName: data.specName,
            remark: data.remark,
            status:data.status,
          })
        },0)
      },
      //添加分类
      addClass() {
        // this.$router.push({
        //   name: 'drugAdminDetail',
        //   params: {id:0},
        // })
        this.form.resetFields();
        this.addModal.visible = true;
        this.addModal.title = '新增分类';
        this.addModal.isNew = true;
      },
      //
      //启用停用
      changeStatus(data){
        let params = {}
        if (data.status == '1') {
          params.status = '0'
        } else {
          params.status = '1'
        }
        params.id = data.id
        console.log(params)
        this.$axios({
          url: this.api.coreUpdateStatus,
          method: 'post',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              if (data.status == '1') {
                this.success('停用成功')
              } else {
                this.success('启用成功')
              }
              this.getData()
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

      checkRol(data){
        this.classData = data;
        this.getDrugList();
        this.getClassDrugData();
      },
      getClassDrugData(params={}){
        params.id = this.classData.id;
        this.$axios({
          url: this.api.specDrugPageById,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.drugData = res.rows;
              this.total1 = res.total;
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      //获取药品list
      getDrugList(){
        let params = {keyword:'',id:this.classData.id};
        this.$axios({
          url: this.api.dicDrugSelectList,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.drugAllList = res.rows;
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      //添加药品按钮
      addDrug(){
        this.selectDrugData = [];
        if (this.classData.id){
          this.Modal.visible = true;
        } else {
          this.warn("请选择药品组");
        }
      },
      //取消分配
      handleCancel(){
        this.Modal.visible = false;
      },
      //确定分配
      handleOk(){
        let params = {};
        params.id = this.classData.id;
        params.drugCodes = this.selectDrugData;
        this.$axios({
          url: this.api.coreGroupingInsert,
          method: 'post',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.success("保存成功!");
              this.Modal.visible = false;
              this.getClassDrugData();
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      addCancel(){
        this.addModal.visible = false;
      },
      addOk(e){
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            if (!this.addModal.isNew){
              values.id = this.editData.id;
            }
            console.log(values,'values');
            this.$axios({
              url: this.api.specUpdate,
              method: 'post',
              data: values
            })
              .then(res => {
                if (res.code == '200') {
                  this.success(res.msg);
                  this.getData();
                } else {
                  this.warn(res.msg)
                }
              })
              .catch(err => {
                this.error(err)
              })
          }
        })
        this.addModal.visible = false;
      },

      handleSearch(value){
        let params = {keyword:value};
        this.$axios({
          url: this.api.dicDrugSelectList,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.drugAllList = res.rows;
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      handleChange(value, option) {
        console.log(value);
        this.selectDrugData = value;
      },
      deleteDrug(data){
        console.log(data,'data');
        let params = {};
        params = {drugId:data.drugCode,id:''+this.classData.id};
        this.$axios({
          url: this.api.coreGroupingSpecDetailDelete,
          method: 'delete',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.success("删除成功!")
              this.getClassDrugData();
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      drugPageChangeSize(page, pageSize) {
        this.getClassDrugData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
      drugPageChange(page, pageSize) {
        this.getClassDrugData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
    }
  }
</script>

<style>

</style>