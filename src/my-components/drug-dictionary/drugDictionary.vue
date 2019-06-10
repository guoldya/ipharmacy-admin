<template>
  <div>
  <a-button type="primary" :disabled="dictionary.disable" @click="addDictionary">新增药品</a-button>
  <a-spin tip="加载中..." :spinning="loading">
    <el-table
      ref="table"
      :data="dictionary.drugDictionaryData"
      border
      class="margin-top-10"
      :highlight-current-row="true"
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
      :defaultPageSize="pageSize"
      :pageSizeOptions="['10', '20','50']"
      @showSizeChange="pageChangeSize"
      @change="pageChange"
      size="small"
    >
    </a-pagination>
    <a-modal
      :title="Modal.title"
      :visible="Modal.visible"
      @ok="handleOk"
      :confirmLoading="Modal.confirmLoading"
      @cancel="handleCancel"
      width="680px"
    >
      <a-form :form="form">
        <a-row>
          <a-col :span="12">
            <a-form-item style="padding-top: 20px" label="药品名称"
                         :label-col="{ span: 6 }"
                         :wrapper-col="{ span: 15 }">
              <a-input v-decorator="[ 'drugName',{rules: [{ required: true, message: '请输入药品名称' }]} ]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item style="padding-top: 20px" label="规格"
                         :label-col="{ span: 6 }"
                         :wrapper-col="{ span: 15 }">
              <a-input v-decorator="[ 'spec',{rules: [{ required: true, message: '请输入规格' }]} ]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item  label="单位"
                          :label-col="{ span: 6 }"
                          :wrapper-col="{ span: 15 }">
              <a-input v-decorator="[ 'unit' ]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生产厂商"
                         :label-col="{ span: 6 }"
                         :wrapper-col="{ span: 15 }">
              <a-input v-decorator="[ 'producedBy' ]">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="拼音码"
                         :label-col="{ span: 6 }"
                         :wrapper-col="{ span: 15 }">
              <a-input v-decorator="[ 'spellCode' ]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="剂型"
                         :label-col="{ span: 6 }"
                         :wrapper-col="{ span: 15 }">
              <a-tree-select
                showSearch
                :treeData="dosageList"
                treeNodeFilterProp="title"
                v-decorator="[ 'dosageForms' ]">
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="状态"
                         :label-col="{ span: 6 }"
                         :wrapper-col="{ span: 15 }">
              <a-select v-decorator="[ 'status' ]">
                <a-select-option :value='op.id' v-for="(op,index) in this.enum.status" :key="index">
                  {{op.text}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="成分"
                         :label-col="{ span: 6 }"
                         :wrapper-col="{ span: 15 }">
              <a-select
                mode="tags"
                showSearch
                v-decorator="[ 'dicDrugcompositionVOList' ]">
                <a-select-option :value='op.id' v-for="(op,index) in this.enum.status" :key="index">
                  {{op.text}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-spin>
  </div>
</template>

<script>
  export default {
    name: 'drugDictionary',
    props:{
      dictionary:{
        Object
      },
    },
    data() {
      return {
        api: {
          dicDrugSelectPage: 'sys/dicDrug/selectPage',
          selectDosageList:'sys/dicBase/selectTitlesList',
        },
        loading: false,
        pageSize: 10,
        items: [
          {text:'编辑', showtip: false, click: this.edits },
          {text:'启用',color:'#2D8cF0',showtip:true,tip:'确认启用吗？',click:this.changeStatus,status:'1'},
          {text:'停用',color:'#ff9900',showtip:true,tip:'确认停用吗？',click:this.changeStatus,status:'0'},
        ],
        columns: [
          { title: '药品编码', value: 'drugCode', align: 'right', width: 80 },
          // { title: '品种编码', value: 'varietyCode' },
            { title: '药品名称', value: 'drugName' },
          { title: '规格', value: 'spec',width:120 },
          { title: '单位', value: 'unit',width:100 },
          { title: '生产厂商', value: 'producedBy' },
          { title: '拼音码', value: 'spellCode', width: 100,},
          { title: '剂型', value: 'dosageFormsStr', width: 100,align:'center' },
          { title: '状态', value: 'status', align: 'center', width: 100,}
        ],
        Modal:{
          title:'',
          visible:false,
          confirmLoading:false,
        },
        dosageList:[],
        form: this.$form.createForm(this),
      }
    },
    mounted(){
      this.getDosageList();
    },
    methods: {
      pageChangeSize() {

      },
      pageChange() {

      },
      addDictionary(){
        this.Modal.visible = true;
        this.Modal.title = '新增药品';
      },
      edits(data){
        // this.editData = data;
        console.log(data);
        setTimeout(()=>{
          this.form.setFieldsValue({
            dosageForms: data.dosageForms,
            drugName: data.drugName,
            producedBy:data.producedBy,
            spec:data.spec,
            spellCode:data.spellCode,
            status:data.status,
            unit:data.unit,
          })
        },0)
        this.Modal.visible = true;
        this.Modal.title = '编辑药品';
      },
      handleOk(){
        this.Modal.visible = false;
      },
      handleCancel(){
        this.Modal.visible = false;
      },
      //获取剂型列表
      getDosageList(){
        let params = {};
        params.codeClass = 1;
        this.$axios({
          url: this.api.selectDosageList,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              let indexData = this.dealAllStartTree(res.rows);
              this.dosageList = this.recursiveNodeTree(indexData, 'undefined');
            } else {
              this.warn(res.msg);
            }
          })
          .catch(err => {
            this.error(err);
          })
      },
      //处理模型字段
      dealAllStartTree(list){
        let indexData = {}
        for (let key in list) {
          let children = indexData[list[key].parentId]
          if (children instanceof Array) {
            children.push({
              title:list[key].name,
              value:''+list[key].id,
              key:list[key].id,
              id:list[key].id,
            })
          } else {
            children = [{
              title:list[key].name,
              value:''+list[key].id,
              key:list[key].id,
              id:list[key].id,
            }]
          }
          indexData[list[key].parentId] = children
        }
        return indexData;
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
      },
    }
  }
</script>

<style >
  .ant-select-tree-dropdown {
    max-height: 300px !important;
  }

</style>