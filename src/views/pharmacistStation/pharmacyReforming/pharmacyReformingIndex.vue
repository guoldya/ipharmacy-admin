<template>
    <div  ref="viewBox" class="pharmacyReformingIndex">
        <detailHeader :userName="userName" :tagList="tagList" :userInfo="userInfo" :diag="diag"></detailHeader>   
        
        <a-card class="margin-top-5 borderNone">
            <div class="disFlex">
                <span class="font-bold fontSize16"><a-icon type="file-text" /> 药物重整</span>
                <span>
                  <a-button @click="backTo"><a-icon type="arrow-left" />返回</a-button>
                  <a-button type="primary" class="margin-left-5" @click="printPreview">打印预览</a-button>
                  <a-button type="primary" class="margin-left-5" @click="handleSubmit">保存</a-button>
              </span>
            </div>
        </a-card>
        <!--startprint-->
        <a-card class="startprint">
            <a-form  class="ant-advanced-search-form" :form="form">
                <div  v-for="(list,i) in content" :key="i+1">
                    <div class="disFlex">
                        <span>
                            <span :class="i>0?'padding-top-22':''" class=" font-bold fontSize16">{{list.title}}</span>
                        </span>
                         <span v-if="i===0">
                            <a-button type="primary"><a-icon type="plus" />添加既往用药</a-button>
                            <a-button class="greenBg margin-left-5"><a-icon type="plus" />添加药物医嘱</a-button>
                        </span>
                    </div>
                    <!-- 单表格 -->
                    <a-spin v-if="list.columns&&i===0" :spinning="loading" tip="加载中...">
                        <el-table class="margin-top-5"
                                :data="list.dataSource"
                                border
                                :highlight-current-row="true" 
                                style="width: 100%">
                            <el-table-column
                                  v-for="item in list.columns"
                                  :show-overflow-tooltip="true"
                                  :key="item.value"
                                  :label="item.title"
                                  :prop="item.value"
                                  :width="item.width"
                                  :align="item.align">
                                  <template  slot-scope="scope">
                                    <span v-if="item.value==='eng7lishName'">
                                        <a-radio-group :defaultValue="scope.row[item.value].radio" name="radioGroup" @change="onColRadioChange">
                                            <a-radio
                                             v-for="(op,i) in item.radioItem" :key="i" :value="op.value">{{op.label}}
                                            </a-radio>
                                        </a-radio-group>
                                        <p></p>
                                        <a-checkbox-group :defaultValue="[scope.row[item.value].check]" v-if="scope.row[item.value].radio==='1'" @change="onChange">
                                            <a-row>
                                                <a-col :class="i>1?'margin-top-5':''"  v-for="(op,i) in item.checkItem" :key="i" :span="12">
                                                    <a-checkbox  :value="op.value">{{op.label}}</a-checkbox>
                                                    <a-input :style="{width:'150px'}"/><!--v-if="scope.row[item.value].radio==i"-->
                                                </a-col>
                                            </a-row>
                                        </a-checkbox-group>
                                    </span>
                                    <span v-else>{{scope.row[item.value]}}</span>
                                  </template>
                            </el-table-column>
                            <el-table-column label="操作" :width="150" align="center" v-if="true">
                                  <template slot-scope="scope">
                                      <opcol :items="items" :more="false" :data="scope.row"></opcol>
                                  </template>
                                </el-table-column>
                        </el-table>
                    </a-spin>
                    <!-- 左右两排表格 -->
                    <a-row v-if="i===1"  class="margin-top-5" :gutter="24" >
                        <a-col v-for="(colItem,i) in list.columns" :key="i"
                              :span="12">
                            <a-form-item :label="colItem.name">
                                <a-spin v-if="list.columns" :spinning="loading" tip="加载中...">
                                    <el-table 
                                            :data="colItem.dataSource"
                                            border
                                            :highlight-current-row="true" 
                                            style="width: 100%">
                                        <el-table-column
                                            v-for="item in colItem.col"
                                            :show-overflow-tooltip="true"
                                            :key="item.value"
                                            :label="item.title"
                                            :prop="item.value"
                                            :width="item.width"
                                            :align="item.align">
                                            <template  slot-scope="scope">
                                                <span class="updateBtn inHospitalNo" v-if="item.value==='no'">123</span>
                                                <span v-else>{{scope.row[item.value]}}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </a-spin>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <!-- 多选框 -->
                    <a-row  class="margin-top-5"  >
                        <a-col v-for="(item,i) in list.checkItem" :key="i"
                              :span="24">
                            <a-form-item :label="item.label"
                                :label-col="{ span: 2 }"
                                :wrapper-col="{ span: 22 }">
                                <a-checkbox-group :options="item.options"   v-decorator="[item.dataField,{initialValue: ['1']}]" @change="onChange" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <!-- 单选框 -->
                    <a-row  class="margin-top-5"   v-if="i!==0">
                        <a-col v-for="(item,i) in list.radioItem" :key="i"
                              :span="24">
                            <a-form-item :label="item.label"
                                :label-col="{ span: i!==0?'4':'2' }"
                                :wrapper-col="{ span:  i!==0?'20':'22' }">
                                <a-radio-group @change="onRadioChange"  v-decorator="[item.val,{initialValue: '1'}]" name="radioGroup">
                                    <a-radio
                                    v-for="(itemRadio,index) in item.options" :key="index" :value="itemRadio.value">{{itemRadio.label}}
                                    </a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <!-- 文本域 -->
                    <a-row v-if="i===2">
                        <a-col :span="24">
                           <a-form-item label="药品备注" :label-col="{ span: 2 }"
                                  :wrapper-col="{ span: 22 }">
                              <a-textarea  v-decorator="[list.dataField]" :autosize="{ minRows: 4}" />
                            </a-form-item>
                        </a-col>
                    </a-row>
            </div>
            </a-form>
        </a-card>
        <!--endprint-->

    </div>
</template>

<script>

  export default {
    name: 'electronicMedicineIndex',
    data(){
      return{
            radioDefaultValue:'2',
            userName:'梁汉文',
            checkedValues:[],
            tagList:[
                {tag:'91084654',color:'#40a9ff'},
                {tag:'肝',color:'#40a9ff'},
                {tag:'肾',color:'#58C7CF'},
                {tag:'心',color:'#B497EE'},

            ],
            userInfo:{
                sex:'男',
                age:'35岁'  ,
                dept:'皮肤科',
                stage:' 5病区/2床',
                docNurse:'胡清/黄晶锐',
                date:'2019-08-05'
            },
            diag:'过敏性皮炎',
            defaultValue:'1',
            defaultValueAllergy:'1',
            loading: false,
            columns: [
                { title: '诊断日期', dataIndex: 'indexId', width: 240, align: 'left' },
                { title: '疾病', dataIndex: 'diag', align: 'left'  },
                { title: '药物', dataIndex: 'engl3ishName', align: 'left', width: 140 },
                { title: '治疗日期', dataIndex: 'testItemName', align: 'left' , width:240},
            ],
            dataSource:[{diag:"抑郁症"}],
            content:[
                {title:'入院前用药评估',dataField:'before',value:'1',
                    columns: [
                        { title: '药品名称', value: 'name', align: 'left' , width: 200},
                        { title: '剂量', value: 'name1', align: 'left', width: 80 },
                        { title: '用药途径', value: 'testItemName', align: 'left', width: 120 },
                        { title: '频次', value: 'englis5hName', align: 'left' , width: 80 },
                        { title: '疗程', value: 'english6Name', align: 'left', width: 80  },
                        { title: '用药错误评估', value: 'eng7lishName', align: 'left' ,
                            radioItem:[
                                {label:'有用药错误',value:'1',dataField:'colsss'},
                                {label:'无用药错误',value:'2',dataField:'colqqq'},
                            ],
                            checkItem:[
                                {label:'患者',value:'1',dataField:'12'},
                                {label:'家属',value:'2',dataField:'34'},
                                {label:'其他',value:'3',dataField:'45'}
                            ],
                        },
                        { title: '药物了解程度评估', value: 'e8nglishName', align: 'left' , width: 140 },
                        { title: '疗效及不良反应评估', value: 'eng9lishName', align: 'left', width: 180  },
                    ],
                    dataSource: [{name:'纳屈肝',eng7lishName:{radio:'1',check:'2'}},{name:'纳屈肝123',eng7lishName:{radio:'2'}}],
                    formItem:[
                        {label:'监护频率',type:'select',val:'ti4me',dataField:'ti5me'},
                        {label:'开始日期',type:'date',val:'date',dataField:'date'}
                    ],
                },
                {title:'入院后医嘱偏差',dataField:'after',value:'2',
                    columns:[{
                        name:'医嘱药物',
                        col: [
                                { title: '药品名称', value: 'name', align: 'left' , width: 200},
                                { title: '剂量', value: 'name1', align: 'left', width: 120 },
                                { title: '用药途径', value: 'testItemName', align: 'left'},
                                { title: '频次', value: 'englishName', align: 'left' , width: 120},
                        ],
                        dataSource: [{name:'纳屈肝456'}],
                        },
                        {
                            name:'重整药物',
                            col: [
                                { title: '药品名称', value: 'name', align: 'left' , width: 200},
                                { title: '剂量', value: 'name1', align: 'left', width: 120 },
                                { title: '用药途径', value: 'testItemName', align: 'left'},
                                { title: '频次', value: 'english12Name', align: 'left' , width: 120},
                            ],
                            dataSource: [{name:'纳屈肝789'}],
                        }
                    ],
                    // checkItem:[
                    //     {label:'信息来源',type:'checked',val:'time',dataField:'target',
                    //         options:[
                    //             {label:'患者',value:'1',dataField:'disease'},
                    //             {label:'家属',value:'2',dataField:'us1age'},
                    //             {label:'其他',value:'3',dataField:'usa2ge'}
                    //         ]
                    //     },
                    // ],
                    radioItem:[
                        {label:'比对结果',type:'radio',val:'ti3me',dataField:'t1arget',
                            options:[
                                {label:'有药物相关问题',value:'1',dataField:'d1isease'},
                                {label:'无药物相关问题',value:'2',dataField:'usage3'},
                            ]
                        },
                        {label:'药物相关问题是否反馈给医生',type:'radio',val:'ti5me',dataField:'ta2rget',
                            options:[
                                {label:'是',value:'1',dataField:'di2sease'},
                                {label:'否',value:'2',dataField:'uesage3'},
                            ]
                        },
                        {label:'如已反馈，医生是否接受',type:'radio',val:'ti7me',dataField:'ta5rget',
                            options:[
                                {label:'是',value:'1',dataField:'di3sease'},
                                {label:'否',value:'2',dataField:'usage3'},
                            ]
                        },
                    ],
                },
                {title:'其他信息',dataField:'ot3her',value:'3',
                    checkItem:[
                        {label:'信息来源',type:'checked',val:'t1ime',dataField:'tar7get',
                            options:[
                                {label:'患者',value:'1',dataField:'dise4ase'},
                                {label:'家属',value:'2',dataField:'usa6ge'},
                                {label:'其他',value:'3',dataField:'u8sage'}
                            ]
                        },
                        {label:'药品管理',type:'checked',val:'date',dataField:'plan',
                            options:[
                            {label:'自带药盒/瓶',value:'1',dataField:'medicalEdu'},
                            {label:'自带用药日记',value:'2',dataField:'other'}
                            ]
                        },
                    ],
                    radioItem:[
                        {label:'药品由何人给予',type:'radio',val:'t3ime',dataField:'tar8get',
                            options:[
                                {label:'患者',value:'1',dataField:'disea5se'},
                                {label:'家属',value:'2',dataField:'1usage'},
                                {label:'其他',value:'3',dataField:'u0sage'}
                            ]
                        },
                    ],
                },
            ],
            form: this.$form.createForm(this),
            formData : {},
            items: [
                { text: '编辑', showtip: false, click: this.edits },
                { text: '删除', color: '#ff9900', showtip: true, tip: '确认删除吗？', click: '' }
            ]
      }
    },
    components:{
    },
    props:{

    },
    mounted(){
        this.form.setFieldsValue(this.formData)

    },
    computed:{
      page(){
        return localStorage.childPage
      }
    },
    methods:{
        printPreview(){
            var bdhtml=this.$refs.viewBox.innerHTML;//获取当前页的html代码  window.document.body.innerHTML
            // var startStr="class='startprint'";//设置打印开始区域 
            // var endStr="<!--endprint-->";//设置打印结束区域 
            // var printHtml=bdhtml.substring(bdhtml.indexOf(startStr)+startStr.length,bdhtml.indexOf(endStr));//从标记里获取需要打印的页面 
            window.document.body.innerHTML= bdhtml;//需要打印的页面  printHtml
            window.print(); 
            window.document.body.innerHTML=bdhtml;//还原界面 
            location.reload();
        },
        onColRadioChange (e) {
            this.radioDefaultValue=e.target.value;
            console.log('checked', e.target.value)
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if(!err){
                    console.log(values)
                }
            })
        },
        onRadioChange ( e) {
            this.defaultValue=e.target.value;
            console.log('radio checked', e.target.value)
        },
        save(e){
        },
        onChange (checkedValues) {
            this.checkedValues=checkedValues;
            console.log('checked = ', checkedValues)
        },
      
        backTo(){
            
        }
    }
  }
</script>

<style scoped lang="less">
    .padding-top-22{
        display: inline-block;
        padding-top: 20px;
    }
</style>