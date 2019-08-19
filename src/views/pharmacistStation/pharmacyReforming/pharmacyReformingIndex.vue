<template>
    <div class="pharmacyReformingIndex">
        <detailHeader :userName="userName" :tagList="tagList" :userInfo="userInfo" :diag="diag"></detailHeader>   
        
        <a-card class="margin-top-5 borderNone">
            <div class="disFlex">
                <span class="font-bold fontSize16"><a-icon type="file-text" /> 药物重整</span>
                <span>
                  <a-button @click="backTo"><a-icon type="arrow-left" />返回</a-button>
                  <a-button type="primary" class="margin-left-5">打印预览</a-button>
                  <a-button type="primary" class="margin-left-5" @click="save">保存</a-button>
              </span>
            </div>
        </a-card>
        <a-card>
            <a-form  class="ant-advanced-search-form" :form="form">
                <div  v-for="(list,i) in content" :key="i+1">
                    <p :class="i>0?'padding-top-22':''" class=" font-bold fontSize16">{{list.title}}</p>
                    <a-row v-if="i===2">
                        <a-col :span="24">
                           <a-form-item label="药品备注" :label-col="{ span: 2 }"
                                  :wrapper-col="{ span: 22 }">
                              <a-textarea  v-decorator="[list.dataField]" :autosize="{ minRows: 4}" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-spin v-if="list.columns&&i===0" :spinning="loading" tip="加载中...">
                        <el-table 
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
                                    <span class="updateBtn inHospitalNo" v-if="item.value==='no'">123</span>
                                    <span v-else>{{scope.row[item.value]}}</span>
                                  </template>
                            </el-table-column>
                        </el-table>
                    </a-spin>
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
                    <a-row  class="margin-top-5"  >
                        <a-col v-for="(item,i) in list.radioItem" :key="i"
                              :span="24">
                            <a-form-item :label="item.label"
                                :label-col="{ span: 2 }"
                                :wrapper-col="{ span: 22 }">
                                <a-radio-group @change="onRadioChange"  v-decorator="[item.val,{initialValue: '1'}]" name="radioGroup" v-if="list.type==='radio'&&i===0">
                                    <a-radio
                                    v-for="(itemRadio,index) in item.options" :key="index" :value="itemRadio.value">{{itemRadio.name}}
                                    </a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    
            </div>
        </a-form>
        </a-card>
    </div>
</template>

<script>

  export default {
    name: 'electronicMedicineIndex',
    data(){
      return{
            userName:'梁汉文',
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
                { title: '药物', dataIndex: 'englishName', align: 'left', width: 140 },
                { title: '治疗日期', dataIndex: 'testItemName', align: 'left' , width:240},
            ],
            dataSource:[{diag:"抑郁症"}],
            content:[
                {title:'入院前用药评估',dataField:'before',value:'1',
                    columns: [
                        { title: '类别', value: 'name', align: 'left' , width: 200},
                        { title: '指标名称', value: 'name1', align: 'left', width: 120 },
                        { title: '条件值', value: 'testItemName', align: 'left', width: 200 },
                        { title: '干预', value: 'englishName', align: 'left' },
                    ],
                    dataSource: [{name:'纳屈肝'},{name:'纳屈肝123'}],
                    formItem:[
                        {label:'监护频率',type:'select',val:'time',dataField:'time'},
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
                                { title: '频率', value: 'englishName', align: 'left' , width: 120},
                        ],
                        dataSource: [{name:'纳屈肝456'}],
                        },
                        {
                            name:'重整药物',
                            col: [
                                { title: '药品名称', value: 'name', align: 'left' , width: 200},
                                { title: '剂量', value: 'name1', align: 'left', width: 120 },
                                { title: '用药途径', value: 'testItemName', align: 'left'},
                                { title: '频率', value: 'englishName', align: 'left' , width: 120},
                            ],
                            dataSource: [{name:'纳屈肝789'}],
                        }
                    ],
                    formItem:[
                        {label:'监护频率',type:'select',val:'time',dataField:'time'},
                        {label:'开始日期',type:'date',val:'date',dataField:'date'}
                    ],
                },
                {title:'其他信息',dataField:'other',value:'3',
                    checkItem:[
                        {label:'信息来源',type:'checked',val:'time',dataField:'target',
                            options:[
                                {label:'患者',value:'1',dataField:'disease'},
                                {label:'家属',value:'2',dataField:'usage'},
                                {label:'其他',value:'3',dataField:'usage'}
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
                        {label:'药品由何人给予',type:'checked',val:'time',dataField:'target',
                            options:[
                                {label:'患者',value:'1',dataField:'disease'},
                                {label:'家属',value:'2',dataField:'usage'},
                                {label:'其他',value:'3',dataField:'usage'}
                            ]
                        },
                    ],
                },
            ],
            form: this.$form.createForm(this),
            formItem:[
                {label:'出院日期',type:'date',val:'no'},
                {label:'住院天数',type:'input',val:'day',unit:'天'},
                {label:'出院或转至',type:'input',val:'outOfHospital'},
                {label:'联系方式',type:'input',val:'iphoneNumber'},
                {label:'职业',type:'input',val:'job'},
                {label:'身高',type:'input',val:'height'},
                {label:'体重',type:'input',val:'weight'},
                {label:'体重指数',type:'input',unit:'kg/m',val:'BMI'},
            ],
            formItemTwo:[
                {label:'不良嗜好',type:'radio',val:"badHabit",radioItem:[
                    {value:'1',name:'无'},
                    {value:'2',name:'烟',unit:'支/天'},
                    {value:'3',name:'酒',unit:'两/天'},
                    {value:'4',name:'烟与酒',unit:'支/天'}
                    ]
                },
                {label:'过敏史',type:'radio',val:"allergy",allergyMedicine:'',radioItem:[
                    {value:'1',name:'无'},
                    {value:'2',name:'皮试过敏'},
                    {value:'3',name:'一种药物/食物过敏或一般过敏反应'},
                    {value:'4',name:'两种或两种以上药物/食物过敏或严重过敏'}
                    ]
                },
                {label:'家族史',type:'textarea',val:'familyHistory'},
                {label:'既往病史',type:'textarea',val:'medicalHistory'},
                {label:'相关药物治疗史',type:'table',val:'drugTreatment'},
                {label:'病情概况',type:'textarea',val:'illnessSituation'},
                {label:'初步临床诊断及诊断要点',type:'textarea',val:'diagnosticPoint'},
            ],
            formData : {}
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
        onRadioChange ( e) {
            this.defaultValue=e.target.value;
            console.log('radio checked', e.target.value)
        },
        save(e){
        },
        onChange (checkedValues) {
            console.log('checked = ', checkedValues)
        },
      
      backTo(){
        
      }
    }
  }
</script>

<style scoped lang="less">
    .padding-top-22{
            padding-top: 20px;
    }
</style>