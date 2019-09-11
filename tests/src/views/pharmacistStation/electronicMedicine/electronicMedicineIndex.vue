<template>
    <div class="electronicMedicineIndex">
        <detailHeader :userName="userName" :tagList="tagList" :userInfo="userInfo" :diag="diag"></detailHeader>   
        
        <a-card class="margin-top-5 borderNone">
            <div class="electronicMedicine">
                <span class="font-bold fontSize16"><a-icon type="file-text" /> 电子药历</span>
                <span>
                  <a-button @click="backTo"><a-icon type="arrow-left" />返回</a-button>
                  <a-button type="primary">打印预览</a-button>
                  <a-button type="primary" @click="save">保存</a-button>
              </span>
            </div>
        </a-card>
        <a-card
        style="width:100%"
        :tabList="tabListNoTitle"
        :activeTabKey="noTitleKey"
        @tabChange="key => onTabChange(key, 'noTitleKey')"
        >
            <medicineHomePage v-if="noTitleKey === '1'" ref="medicineHomePage"></medicineHomePage>  
            <p v-if="noTitleKey === '2'">app content</p>
            <p v-else-if="noTitleKey === '3'">project content</p>
        </a-card>
    </div>
</template>

<script>
import medicineHomePage from './medicineHomePage'

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
        medicineHomePage,
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
        save(e){
            //medicineHomePage页面调用 保存接口方法
           this.$refs.medicineHomePage.save(e);
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
       
        .electronicMedicine{
            display: flex;
            justify-content: space-between;
            align-items: center;
            span:last-child button:not(:first-child){
                margin-left: 8px;
            }
        }
    }
</style>