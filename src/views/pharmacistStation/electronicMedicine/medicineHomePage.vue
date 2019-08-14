<template>
    <div class="electronicMedicineIndex">
        <a-form  class="ant-advanced-search-form" :form="form">
            <a-row :gutter="24"  v-for="(list,i) in formItem" :key="i">
                <a-col
                v-for="(list,i) in list.item" :key="i"
                :span="12"
                >
                    <a-form-item :label="list.label" class="unit"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 14 }">
                        <a-date-picker v-decorator="[list.val]" @change="onChange" v-if="list.type==='date'"/>
                        <a-input v-if="list.type==='input'"
                        v-decorator="[list.val,
                            {
                            rules: [list.val==='iphoneNumber'?{min:11,max:11,message:'联系方式长度应等于11',trigger:'blur'}:{}
                                ],
                            }
                        ]" placeholder="请输入..."/>
                        <span class="marginLeft8">{{list.unit}}</span>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col
                v-for="(list,i) in formItemTwo"
                :key="i"
                :span="24"
                >
                <a-form-item :label="list.label" class="wordBreakLabel" :class="list.type==='textarea'||list.type==='table'?'':'unit'"
                 :label-col="{ span: 2 }"
                :wrapper-col="{ span: 22 }">
                    <a-radio-group @change="onRadioChange"  v-decorator="[list.val]" name="radioGroup" v-if="list.type==='radio'&&i===0">
                        <a-radio
                         v-for="(itemRadio,index) in list.radioItem" :key="index" :value="itemRadio.value">{{itemRadio.name}}
                        </a-radio>
                    </a-radio-group>
                    
                    <a-radio-group @change="onAllergyChanege"  v-decorator="[list.val]" name="radioGroup" v-if="list.type==='radio'&i===1">
                        <a-radio
                         v-for="(itemRadio,index) in list.radioItem" :key="index" :value="itemRadio.value">{{itemRadio.name}}
                        </a-radio>
                    </a-radio-group>
                    <a-input
                    v-decorator="[list.val]" v-if="list.type==='textarea'" type="textarea"  :autosize="{ minRows: 4}"
                        :placeholder=list.label
                    />
                    <!-- 不良嗜好 -->
                     <div  v-for="(itemRadio,index) in list.radioItem" :key="index">
                       <div  v-if="i===0 &&defaultValue!== '1'&&defaultValue===itemRadio.value">
                            <a-row :gutter="24">
                                <a-col :span="defaultValue==='4'?'12':'24'" class="unit">
                                    <a-input /> 
                                    <span :style="{width:'19%'}" class="marginLeft8">{{itemRadio.unit}}</span>
                                </a-col>
                                <a-col :span="12" v-if="defaultValue==='4'"  class="unit">
                                    <a-input /> 
                                    <span :style="{width:'19%'}" class="marginLeft8">{{list.radioItem[index-1].unit}}</span>
                                </a-col>
                            </a-row>
                        </div>
                    </div> 

                    <a-spin :spinning="loading" tip="加载中..." v-if="list.type==='table'">
                        <el-table
                            class="margin-top-10"
                            :data="dataSource"
                            border
                            :highlight-current-row="true"
                            style="width: 100%"
                        >
                            <el-table-column
                            v-for="item in columns"
                            :show-overflow-tooltip="true"
                            :key="item.dataIndex"
                            :label="item.title"
                            :prop="item.dataIndex"
                            :width="item.width"
                            :align="item.align"
                            >
                            </el-table-column>
                        </el-table>
                    </a-spin>
                </a-form-item>
                <!-- 过敏史 -->
                <a-form-item :label="list.label" v-if="i===1&&defaultValueAllergy!== '1'" class="allergy"
                 :label-col="{ span: 2 }"
                :wrapper-col="{ span: 22 }">
                 
                    <div>
                        <a-button type="primary"><a-icon type="plus" />添加过敏药</a-button>
                        <a-input
                    v-decorator="[list.allergyMedicine,
                        ]" type="textarea"  :autosize="{ minRows: 4}"
                        :placeholder=list.label
                    />
                    </div>
                </a-form-item>
                
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<script>
import moment from 'moment'
import { setTimeout } from 'timers';
  export default {
    name: 'electronicMedicineIndex',
    data(){
      return{
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
            tabListNoTitle: [
                {key: '1',tab: '药历首页'},
                {key: '2',tab: '入院药学评估'},
                { key: '3',tab: '监护计划'},
                { key: '4',tab: '监护记录'},
                { key: '5',tab: '用药情况记录'},
                { key: '6',tab: '药物治疗总结'},
                { key: '7',tab: '用药教育记录'},
            ],
            key: '1',
            noTitleKey: '1',
            form: this.$form.createForm(this),
            formItem:[
               {item:[ 
                   {label:'出院日期',type:'date',val:'date'},
                    {label:'住院天数',type:'input',val:'day',unit:'天'}]
                },
                {item:[ 
                    {label:'出院或转至',type:'input',val:'outOfHospital'},
                    {label:'联系方式',type:'input',val:'iphoneNumber'}],
                },
                {item:[ 
                    {label:'职业',type:'input',val:'job'},
                    {label:'身高',type:'input',val:'height'}],
                },
                {item:[ 
                    {label:'体重',type:'input',val:'weight'},
                    {label:'体重指数',type:'input',unit:'kg/m',val:'BMI'}],
                },
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
            formData : {},
            dateStrings:null
      }
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
        moment,
        //时间change
        onChange(dates, dateStrings) {
            console.log(dates, dateStrings);
        },
        onRadioChange ( e) {
            this.defaultValue=e.target.value;
            console.log('radio checked', e.target.value)
        },
        onAllergyChanege (e) {
            this.defaultValueAllergy=e.target.value;
            console.log('radio checked', e.target.value)
            
        },
        save(e){
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (values.date) {
                        values.date = values.date.format('YYYY-MM-DD')
                    }
                   console.log(values)
                }
            })
        },
      onTabChange (key, type) {
        console.log(key, type)
        this[type] = key
        },
      
      backTo(){
        
      }
    }
  }
</script>

<style scoped lang="less">
    .electronicMedicineIndex {
        .star{
            float: right;
            font-size: 20px;
            background-color: #DCE5FD;
            padding:6px;
            position: relative;
            top: -25px;
        }
        /deep/.unit .ant-form-item-children,.unit{
            display: flex;
            align-items: center;
        }
        /deep/.wordBreakLabel .ant-form-item-label label{
            white-space: normal;
            word-break: break-all;
            overflow: hidden;
        }
        .electronicMedicine{
            display: flex;
            justify-content: space-between;
            align-items: center;
            span:last-child button:not(:first-child){
                margin-left: 8px;
            }
        }
        /deep/.allergy {
            .ant-form-item-label{
                display:none ;
            }
            .ant-form-item-control-wrapper{
                text-align: right;
                float: right;
            }
        }
    }
</style>