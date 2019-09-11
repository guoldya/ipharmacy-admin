<template>
    <div class="effectMonitorReportAdd">
        <a-card>
            <a-row>
                <a-col :span="12" class="font-bold fontSize16">不良反应监测及上报</a-col>
                <a-col :span="12" class="txtRight">
                    <div>
                        <a-button @click="backTo">返回</a-button>
                        <a-button type="primary" @click="handleSubmit" class="margin-left-5">提交</a-button>
                    </div>
                </a-col>
            </a-row>
            <a-form class="ant-advanced-search-form margin-top-10"
             :form="form" @submit="handleSearch">
                 <a-row>
                    <a-col
                    v-for="(list,i) in formItem"
                    :key="i"
                    :span="8"
                    >
                        <a-form-item :label="list.label"
                        :label-col="{ span: 9 }"
                        :wrapper-col="{ span: 15 }">
                            <a-input v-if="list.type==='input'"
                                v-decorator="[list.val,
                                    {
                                    rules: [list.val==='iphoneNumber'?{min:11,max:11,message:'联系方式长度应等于11',trigger:'blur'}:{}
                                        ],
                                    }
                                ]" placeholder="请输入..."/>
                            <a-input v-if="list.type==='textarea'" type="textarea"/>
                            <a-radio-group  v-decorator="[list.val,{initialValue: '1'}]" name="radioGroup" v-if="list.type==='radio'">
                                <a-radio v-for="(item,index) in list.radioItem" :key="index" :value="item.value">{{item.name}}</a-radio>                            
                            </a-radio-group>
                            <a-date-picker  v-decorator="[list.val]" @change="onChange" v-if="list.type==='date'"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col
                    v-for="(list,i) in formItemTextarea"
                    :key="i"
                    :span="24"
                    >
                        <a-form-item :label="list.label" class="textareaFormItem wordBreakLabel"
                        :label-col="{ span: 3 }"
                        :wrapper-col="{ span: 21 }">
                            <a-input v-decorator="[list.val]" v-if="list.type==='textarea'" type="textarea" :autosize="{ minRows: 4}"/>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <el-table
            class="margin-top-10"
            :data="dataSource"
            border
            :highlight-current-row="true"
            style="width: 100%">
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
            <el-table
                class="margin-top-10"
                :data="dataSourceTwo"
                border
                :highlight-current-row="true"
                style="width: 100%"
            >
                <el-table-column
                v-for="item in columnsTwo"
                :show-overflow-tooltip="true"
                :key="item.dataIndex"
                :label="item.title"
                :prop="item.dataIndex"
                :width="item.width"
                :align="item.align"
                >
                </el-table-column>
            </el-table>
            <a-form class="margin-top-10"
                :form="formTwo"
            >
                <a-form-item
                v-for="(list,i) in formTwoItem" :key="i"
                :label="list.label"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 21 }"
                >
                    <a-radio-group v-decorator="[list.val,{initialValue: '1'}]" name="radioGroup" v-if="list.type==='radio'">
                       <span v-for="(item,index) in list.radioItem" :key="index">
                            <a-radio :value="item.value">{{item.name}}</a-radio>
                            <span  v-if="i===0&&index===4" >表现
                                <a-input v-decorator="[item.value]" class="formInput"/>
                            </span>
                            <span  v-if="i===0&&index===5" >直接原因
                                <a-input v-decorator="[item.value]" class="formInput"/>
                            </span>
                            <span  v-if="i===2&&index===3" >表现
                                <a-input v-decorator="[item.value]" class="formInput"/>
                            </span>
                            <span  v-if="i===2&&index===4" >直接原因
                                <a-input v-decorator="[item.value+index]" class="formInput"/>
                            </span>
                        </span> 
                         <span  v-if="list.val==='work11'" >
                                <span class="font-bold">报告人签名</span>    
                                <a-input v-decorator="[list.label]" class="formInput"/>
                            </span>
                    </a-radio-group>
                    <a-date-picker  v-decorator="[list.val]" @change="onChange" v-if="list.type==='date'"
                        format="YYYY-MM-DD HH:mm"
                        :disabledDate="disabledDate"
                        :disabledTime="disabledDateTime"
                        :showTime="{ defaultValue: moment('00:00:00', 'HH:mm') }"/>
                    <div v-if="list.type==='row'"  class="borderFormItem">
                        <a-row v-for="(item ,i) in list.rowItem" :key="i">
                            <a-col :span="item.span">
                                <span>{{item.label}}</span>
                            </a-col>
                            <a-col :span="item.radioItem[0].span">
                            <a-form-item>
                                <a-radio-group  v-decorator="[item.val,{initialValue: '1'}]" name="radioGroup">
                                    <a-radio v-for="(itemRadio,index) in item.radioItem" :key="index" :value="itemRadio.value">{{itemRadio.name}}</a-radio>
                                    <span  v-if="list.val==='connect'" >
                                        <span class="font-bold">签名</span>    
                                        <a-input v-decorator="[item.value]" class="formInput"/>
                                    </span>
                                </a-radio-group>
                            </a-form-item>
                            </a-col>
                        </a-row>
                    </div>
                    <a-input v-decorator="[list.val]"  class="formInput" v-if="list.type==='input'"/>
                </a-form-item>   
            </a-form>
        </a-card>
    </div>
</template>

<script>
import moment from 'moment';
  export default {
    name: 'effectMonitorReportAdd',
    data(){
      return{
          expand: false,
        form: this.$form.createForm(this),
        formTwo: this.$form.createForm(this),
        formItemTextarea:[
           {label:'不良反应表现（包括临床检验）',type:'textarea',val:'bisj'},
            {label:'不良反应处理情况',type:'textarea',val:'case'},
        ],
        formItem:[
            {label:'医院名称',type:'input',val:'name'},
            {label:'科别',type:'input',val:'org'},
            {label:'电话',type:'input',val:'iphoneNumber'},
            {label:'紧急情况',type:'radio',val:'emer',radioItem:[{value:'1',name:'紧急'},{value:'2',name:'一般'}]},
            {label:'报告编号',type:'input',val:'reportNo'},
            {label:'报告日期',type:'date',val:'date'},
            {label:'患者姓名',type:'input',val:'username'},
            {label:'患者性别',type:'radio',val:'sex',radioItem:[{value:'1',name:'男'},{value:'2',name:'女'}]},
            {label:'患者年龄',type:'input',val:'age'},
            {label:'民族',type:'input',val:'country'},
            {label:'体重(kg)',type:'input',val:'weight'},
            {label:'家族药品不良反应',type:'radio',val:'badRespond',radioItem:[{value:'1',name:'有'},{value:'2',name:'无'},{value:'3',name:'不祥'}]},
            {label:'患者类型',type:'radio',val:'usertype',radioItem:[{value:'1',name:'住院'},{value:'2',name:'门急诊'}]},
            {label:'住院号/就诊卡号',type:'input',val:'no'},
            {label:'工作单位',type:'input',val:'workdept'},
            {label:'既往药品不良反应',type:'radio',val:'agoname',radioItem:[{value:'1',name:'有'},{value:'2',name:'无'},{value:'3',name:'不祥'}]},
            {label:'原患疾病',type:'input',val:'ill'},
            {label:'不良反应类型',type:'input',val:'bad'},
            {label:'发生时间',type:'date',val:'startDate'},

        ],
        columns: [
          { title: '怀疑药品名称', dataIndex: 'indexId', width: 120, align: 'left' },
          { title: '生产厂家', dataIndex: 'name', align: 'left', width: 100 },
          { title: '批号', dataIndex: 'englishName', align: 'right', width: 140 },
          { title: '剂型', dataIndex: 'testItemName', align: 'left' },
          { title: '用药途径', dataIndex: 'testItemClass', width: 120, align: 'left' },
          { title: '日剂量', dataIndex: 'testItemType', width: 80, align: 'left' },
          { title: '用药起止时间', width: 120, dataIndex: 'resultType', align: 'left' },
          { title: '用药原因', dataIndex: 'resultType1', align: 'left' }
        ],
        columnsTwo: [
          { title: '并用药品名称', dataIndex: 'indexId', width: 120, align: 'left' },
          { title: '生产厂家', dataIndex: 'name', align: 'left', width: 100 },
          { title: '批号', dataIndex: 'englishName', align: 'right', width: 140 },
          { title: '剂型', dataIndex: 'testItemName', align: 'left' },
          { title: '用药途径', dataIndex: 'testItemClass', width: 120, align: 'left' },
          { title: '日剂量', dataIndex: 'testItemType', width: 80, align: 'left' },
          { title: '用药起止时间', width: 120, dataIndex: 'resultType', align: 'left' },
          { title: '用药原因', dataIndex: 'resultType1', align: 'left' }
        ],
        dataSource:[],
        dataSourceTwo:[],
        formTwoItem:[
            {label:'不良反应结果',type:'radio',val:'badResult',
                radioItem:[
                    {value:'1',name:'痊愈'},
                    {value:'2',name:'好转'},
                    {value:'3',name:'不详'},
                    {value:'4',name:'未好转'},
                    {value:'5',name:'有后遗症'},
                    {value:'6',name:'死亡'},
                ]
            },
            {label:'死亡时间',type:'date',val:'date'},
            {label:'对原患疾病的影响',type:'radio',val:'affect',
                radioItem:[
                    {value:'1',name:'不明显'},
                    {value:'2',name:'病程延长'},
                    {value:'3',name:'病情加重'},
                    {value:'4',name:'导致后遗症'},
                    {value:'5',name:'导致死亡'},
                ]
            },
            {label:'不良反应分析',type:'row',val:'badAffect',
                rowItem:[
                    {value:'1',label:'1、用药与不良反应的出现有无合理的时间关系？',val:'val1',span:'12',
                        radioItem:[
                        {value:'1',name:'有',span:'12'},
                        {value:'2',name:'无',span:'12'},
                    ]},
                    {value:'2',label:'2、反应是否符合该药已知的不良反应类型？',val:'val2',span:'12',
                        radioItem:[
                        {value:'1',name:'有',span:'12'},
                        {value:'2',name:'否',span:'12'},
                        {value:'3',name:'不明',span:'12'}
                    ]},
                    {value:'3',label:'3、停药或减量后，反应十分消失或减轻？',val:'val3',span:'12',
                        radioItem:[
                        {value:'1',name:'有',span:'12'},
                        {value:'2',name:'否',span:'12'},
                        {value:'3',name:'不明',span:'12'},
                        {value:'4',name:'未停药或减量',span:'12'}
                    ]},
                     {value:'4',label:'4、再次使用可以药物后是否再次出现同样反应？',val:'val4',span:'12',
                        radioItem:[
                        {value:'1',name:'有',span:'12'},
                        {value:'2',name:'否',span:'12'},
                        {value:'3',name:'不明',span:'12'},
                        {value:'4',name:'未再使用',span:'12'}
                    ]},
                     {value:'5',label:'5、反应是否可用并用药物的作用、患者病情的进展、其他治疗的影响来解释？',val:'val5',span:'12',
                        radioItem:[
                        {value:'1',name:'有',span:'12'},
                        {value:'2',name:'否',span:'12'},
                        {value:'3',name:'不明',span:'12'}
                    ]},
                ]
            },
            {label:'关联性评价',type:'row',val:'connect',
                rowItem:[
                    {value:'1',label:'省级不良反应监测机构',val:'val16',span:'8',
                        radioItem:[
                            {value:'11',name:'肯定',span:'16'},
                            {value:'22',name:'很可能',span:'16'},
                            {value:'33',name:'可能',span:'16'},
                            {value:'44',name:'不太可能',span:'16'},
                            {value:'55',name:'未评价',span:'16'},
                            {value:'65',name:'无法评价',span:'16'},
                    ]},
                    {value:'2',label:'国家不良反应监测机构',val:'val27',span:'8',
                        radioItem:[
                            {value:'18',name:'肯定',span:'16'},
                            {value:'28',name:'很可能',span:'16'},
                            {value:'38',name:'可能',span:'16'},
                            {value:'48',name:'不太可能',span:'16'},
                            {value:'58',name:'未评价',span:'16'},
                            {value:'68',name:'无法评价',span:'16'},
                    ]},
                ]
            },
            {label:'其他',type:'input',val:'reportPeople'},
            {label:'报告人职业',type:'radio',val:'work11',
                radioItem:[
                    {value:'1',name:'医生'},
                    {value:'2',name:'药师'},
                    {value:'3',name:'护士'},
                    {value:'4',name:'其他'},
                ]
            },
        ]
      }
    },
    computed: {
        count () {
        return this.expand ? 11 : 7;
        },
    },
    mounted(){
        if(localStorage.childPage===JSON.stringify('look')){
         document.title=document.title+'不良反应监测与报告详情';
        }else if(localStorage.childPage===JSON.stringify('add')){
          document.title=document.title.split('不')[0]+'不良反应监测与报告新增';
        }
    },
    methods:{
        moment,
        backTo(){
            this.$router.push({
            name: 'effectMonitorReportIndex',
            })
        },
        onChange(dates, dateStrings) {
            console.log('From: ', dates[0], ', to: ', dates[1]);
            console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        },
        range(start, end) {
            const result = [];
            for (let i = start; i < end; i++) {
                result.push(i);
            }
            return result;
        },
        disabledDate(current) {
            // Can not select days before today and today
            return current && current < moment().endOf('day');
            },

        disabledDateTime() {
            return {
                disabledHours: () => this.range(0, 24).splice(4, 20),
                disabledMinutes: () => this.range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        },
        handleSubmit (e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                console.log( values,'form');
                }
            });
            this.formTwo.validateFields((err, values) => {
                if (!err) {
                    if (values.date) {
                        values.date = values.date.format('YYYY-MM-DD HH:mm')
                    }
                console.log( values,'formTwo');
                }
            });
            this.$router.push({
                name: 'patientsHomeIndex',
            })
            
        },
         handleSearch  (e) {
            e.preventDefault();
            this.form.validateFields((error, values) => {
                console.log('error', error);
                console.log('Received values of form: ', values);
            });
        },

        handleReset () {
            this.form.resetFields();
        },

        toggle  () {
            this.expand = !this.expand;
        },
        onChange(date, dateString) {
            console.log(date, dateString);
        }
    }
  }
</script>

<style scoped  lang="less">
    .effectMonitorReportAdd{
        .txtRight{
            text-align: right
        }
        .formInput{
            width: 250px;
            margin: 0 12px 0 5px;
        }
        .borderFormItem{
            border: 1px solid #D9D9D9;
            padding: 0 10px;
        }
    }
     /deep/.wordBreakLabel .ant-form-item-label label{
            white-space: normal;
            word-break: break-all;
            overflow: hidden;
    }
    
</style>