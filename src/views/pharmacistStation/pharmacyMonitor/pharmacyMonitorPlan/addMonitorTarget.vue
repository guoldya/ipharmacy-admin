<template>
  <div>
    <a-modal
     class="addMonitorTarget"
      title="疗效监测指标"
      :visible="visible"
      @cancel="handleCancel"
      :maskClosable="false"
      :width="800"
      @ok="handleOk"
      :destroyOnClose='true'
    >
      <a-form :form="form">
          <a-tabs :defaultActiveKey="1" @change="callback">
                <a-tab-pane v-for="(list,i) in content" :key="i+1" :tab="list.title">
                    <div>
                        <a-row v-if="i===0">
                            <a-col :span="24">
                                <a-form-item :colon='false' label="选择监护指标" :label-col="{ span: 3 }"
                                  :wrapper-col="{ span: 24 }">
                                    <a-radio-group v-decorator="[list.dataField]" @change="handleSizeChange">
                                        <a-radio-button v-for="(op,index) in list.checkItem" :key="index"  class="margin-top-5" :class="index!==0?'margin-left-10':''" :value="op.value">{{op.label}}</a-radio-button>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>
                        </a-row>
                      
                      <a-row class="ruleRow"  v-if="i===1" :gutter='24'>
                        <a-col :xl="13" :xxl="16">
                            <a-card>
                                <a-form  class="ant-advanced-search-form" :form="formTwo">
                                    <span>化验报告分类</span>
                                    <div>
                                        <a-spin  class="margin-top-5" :spinning="loadingTable" tip="加载中...">
                                            <el-table 
                                                        :data="dataSource"
                                                        border
                                                        :highlight-current-row="true" 
                                                        @selection-change="e => handleSelectionChange(e,list.value)"
                                                        style="width: 100%"
                                                    >
                                                <el-table-column
                                                        type="selection"
                                                        width="55">
                                                </el-table-column>
                                                <el-table-column
                                                        v-for="item in columns"
                                                        :show-overflow-tooltip="true"
                                                        :key="item.value"
                                                        :label="item.title"
                                                        :prop="item.value"
                                                        :width="item.width"
                                                        :align="item.align"
                                                        >
                                                    <template  slot-scope="scope">
                                                        <span class="updateBtn inHospitalNo" v-if="item.value==='no'">123</span>
                                                        <span v-else>{{scope.row[item.value]}}</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </a-spin>
                                    </div>
                                </a-form>
                            </a-card>
                        </a-col>
                        <a-col :xl="11" :xxl="8">
                            <div class="ruleCow">
                                <a-card>
                                    <a-row>
                                        <span>计划监测指标</span>
                                        <a-spin tip="加载中..." :spinning="loading">
                                            <!-- <a-tree
                                            class="draggable-tree"
                                            :treeData="treeData"
                                            :loadData="onLoadData"
                                            @select="onSelect"
                                            :autoExpandParent="false"
                                            @load="expandTree"
                                            :loadedKeys="loadedKeys"
                                            ></a-tree> -->
                                            <!-- 示例 -->
                                             <a-tree
                                                :loadData="onLoadData"
                                                :treeData="treeData"
                                            />
                                        </a-spin>
                                    </a-row>
                                </a-card>
                            </div>
                        </a-col>
                    </a-row>
                  </div>
                </a-tab-pane>
            </a-tabs>      
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { selectOutDetail } from '@/api/login'
export default {
    name:"detailModal",
    props: {
        
    },
  data() {
    return {
        // 示例
        treeData: [
        { title: 'Expand to load', key: '0' },
        { title: 'Expand to load', key: '1' },
        { title: 'Tree Node', key: '2', isLeaf: true },
        ],
        loading:false,
        checked:'',
        loadedKeys: [],
        loadingTable: false,
        form: this.$form.createForm(this),
        formTwo: this.$form.createForm(this),
         visible: false,
        formItem:[
            {label:'咨询科室',type:'input',val:'name',span:"8"},
            {label:'咨询医生',type:'input',val:'user',span:"8"},
            {label:'处理状态',type:'input',val:'iphoneNumber',span:"8"},
            {label:'咨询类别',type:'checkbox',val:'type',span:"24",options:[
              { label: '用法用量', value: '1' },
              { label: '药理作用', value: '2' },
              { label: 'PK/PD', value: '3' },
              { label: '方案疗程', value: '5' },
              { label: '给药途径', value: '6' },
              { label: '联合用药', value: '7' },
              { label: '注意事项', value: '8' },
              { label: '配伍禁忌', value: '9' },
              { label: '相互作用', value: '10' },
              { label: '禁忌症', value: '11' },
              { label: '药品贮藏', value: '12' },
              { label: '治疗进展', value: '12' },
              { label: '药事违规', value: '14' },
              { label: '其他', value: '15' },
            ]},
            {label:'紧急程度',type:'radio',span:"24",val:'radio',radioItem:[
                {value:'1',name:'高'},{value:'2',name:'中'},{value:'3',name:'低'}]
            },
            {label:'住院号',type:'input',val:'na3me',span:"8"},
            {label:'患者姓名',type:'input',val:'o2rg',span:"8"},
            {label:'性别',type:'input',val:'ip4honeNumber',span:"8"},
            {label:'年龄',type:'input',val:'age',span:"8"},
            {label:'入院时间',type:'input',val:'country',span:"8"},
            {label:'入院诊断',type:'input',val:'weight',span:"8"},
            {label:'咨询问题',type:'textarea',val:'badRespond',span:"24"},
            {label:'用药咨询反馈',type:'textarea',val:'response',span:"24"},
        ],

        content:[
            {title:'生命体征',dataField:'curativeEffect',value:'1',
                checkItem:[
                    {label:'体温',value:'1',dataField:'disease'},
                    {label:'脉搏',value:'2',dataField:'usage'},
                    {label:'呼吸',value:'3',dataField:'medicalEdu'},
                    {label:'血压-高',value:'4',dataField:'other'},
                    {label:'血压-低',value:'5',dataField:'other'},
                    {label:'大便',value:'6',dataField:'other'},
                    {label:'入量',value:'7',dataField:'other'},
                    {label:'出量',value:'8',dataField:'other'},
                    {label:'身高',value:'9',dataField:'other'},
                    {label:'体重',value:'10',dataField:'other'},
                    {label:'心率',value:'11',dataField:'other'},
                    {label:'疼痛',value:'12',dataField:'other'},
                ],
            },
            {title:'化验指标',dataField:'safety',value:'2',
                columns: [
                    { title: '类别123', value: 'name', align: 'left' , width: 200},
                    { title: '指标名称', value: 'name1', align: 'left', width: 120 },
                    { title: '条件值', value: 'testItemName', align: 'left', width: 200 },
                    { title: '干预', value: 'englishName', align: 'left' },
                ],
                dataSource: [{name:'纳屈肝123'}],
                formItem:[
                    {label:'监护频率',type:'select',val:'time',dataField:'time'},
                    {label:'开始日期',type:'date',val:'date',dataField:'date'}
                ],
            },
        ],

        columns:[
          { title: '名称', value: "title"},
        ],
        dataSource:[{title:'肾'}]
    
    }
  },
  
  mounted() {
  },
  methods: {
      handleOk(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
              console.log(values,'form')
          }
        })
        this.formTwo.validateFields((err, values) => {
          if (!err) {
              console.log(values,'formTwo')
          }
        })
      },
      //异步加载数据
    onLoadData(treeNode) {
    //   return new Promise(resolve => {
    //     if (treeNode.dataRef.children) {
    //       resolve()
    //       return
    //     }
    //     setTimeout(() => {
    //       let params = {}
    //       params.patientid = treeNode.dataRef.key
    //       this.$axios({
    //         url: this.api.diagnosisMgtTreeList,
    //         method: 'put',
    //         data: params
    //       })
    //         .then(res => {
    //           if (res.code == '200') {
    //             treeNode.dataRef.children = []
    //             for (let i in res.rows) {
    //               let isLeaf = false
    //               if (res.rows[i].isleaf == 1) {
    //                 isLeaf = false
    //               } else {
    //                 isLeaf = true
    //               }
    //               treeNode.dataRef.children.push({
    //                 defcode2: res.rows[i].defcode2,
    //                 icdcode: res.rows[i].icdcode,
    //                 title: res.rows[i].icdname,
    //                 icdtype: res.rows[i].icdtype,
    //                 key: res.rows[i].id,
    //                  isLeaf: isLeaf,
    //                 patientid: res.rows[i].patientid
    //               })
    //             }
    //             this.treeData = [...this.treeData]
    //           } else {
    //             this.warn(res.msg)
    //           }
    //         })
    //         .catch(err => {
    //           this.error(err)
    //         })
    //       resolve()
    //     }, 500)
    //   })
    // 示例
    return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        setTimeout(() => {
          treeNode.dataRef.children = [
            { title: 'Child Node', key: `${treeNode.eventKey}-0` },
            { title: 'Child Node', key: `${treeNode.eventKey}-1` },
          ]
          this.treeData = [...this.treeData]
          resolve()
        }, 1000)
      })
    },
      // 查找事件
    onChange(value) {
       this.loadedKeys = []
    },
      //树形节点点击事件
    onSelect(selectedKeys, e) {
      this.shows = false
      sessionStorage.setItem('patientid', e.node.dataRef.key)
      this.id = e.node.dataRef.key
      let params = { patientid: e.node.dataRef.key }
      this.current = 1
      params.offset = 0
      params.pageSize = this.pageSize
      this.getPageData(params)
    },
    expandTree(loadedKeys, expanded) {
        this.loadedKeys = loadedKeys
    },
    handleSizeChange (e) {
        this.checked = e.target.value
    },
    //tabs
    callback (val) {
        console.log(val)
    },
   showModal() {
      this.visible = true
    },
    handleCancel(e) {
      this.visible = false
    },
  }
}
</script>
<style scoped lang='less'>
    .margin-left-10{
        margin-left: 10px;
    }
</style>

    

