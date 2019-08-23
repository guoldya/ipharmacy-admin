<template>
  <div class="detai lCont">
    <a-row>
      <a-col :span="24" class="padding-left-5">
                <detailHeader :userName="userName" :tagList="tagList" :userInfo="userInfo" :diag="diag"></detailHeader>

        <a-card class="margin-top-10">
          <header class="record">
            <a-icon type="export" />患者入院药学评估
          </header>
          <a-divider />
          <h3 class="record">基本信息</h3>
          <a-divider />
          <a-form :form='form'>
            <a-row >
                  <a-col
                  v-for="(list,i) in formItem" :key="i"
                    :span="i>0&&i<6?'12':'24'"
                    >
                    <a-form-item :label="list.label" class="unit"
                    :label-col="{ span:i>0&&i<6?'6':'3' }"
                    :wrapper-col="{ span:i>0&&i<6?'15':'21'  }">
                        
                        <a-radio-group  @change="onAllergyChanege"  v-decorator="[list.label,{initialValue: '1'}]" name="radioGroup" v-if="list.type==='radio'">
                            <a-radio
                            v-for="(itemRadio,index) in list.radioItem" :key="index" :value="itemRadio.value">{{itemRadio.label}}
                            </a-radio>
                        </a-radio-group>

                        <a-date-picker v-decorator="[list.label]" @change="onChange" v-if="list.type==='date'"/>

                        <a-input v-if="list.type==='input'" v-decorator="[list.label]" placeholder="请输入..."/>
                        <span class="marginLeft8">{{list.unit}}</span>
                        <span v-if="list.type==='check'">
                            <a-checkbox-group v-decorator="[list.label,{initialValue: ['1']}]">
                              <a-checkbox
                                v-for="(op,index) in list.checkItem"
                                :value="op.value"
                                :key="index"
                              >{{op.label}}</a-checkbox>
                            </a-checkbox-group>
                        </span>
                        <a-textarea v-if="list.type==='textarea'" :autosize="{ minRows: 2}" v-decorator="[list.label]"/>
                    </a-form-item>
                    
                    <a-form-item v-if="i===16&&defaultValueAllergy!== '13'" class="allergy"
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }">
                  
                      <div>
                          <a-button type="primary"><a-icon type="plus" />添加过敏药</a-button>
                          <a-textarea
                      v-decorator="[defaultValueAllergy
                          ]" type="textarea"  :autosize="{ minRows: 4}"
                          :placeholder=list.label
                      ></a-textarea>
                      </div>
                  </a-form-item>
                </a-col>
            </a-row>
          </a-form>
          <!-- 第二个表单 -->
          <h3 class="record">入院状况评估</h3>
          <a-divider />
          <a-form :form='form'>
            <a-form-item :label-col="{ span:3 }"
                    :wrapper-col="{ span:21 }" v-for="(list,i) in formItemTwo" :key="i" :label="list.label">
                 <a-radio-group @change="onRadioChange" v-decorator="[ list.label,{initialValue: 1}]" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in list.radioItem"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
                <!-- 不良嗜好 -->
                     <div  v-for="(itemRadio,index) in list.radioItem" :key="index">
                       <div  v-if="i===6 &&defaultValue!== 1&&defaultValue===itemRadio.id">
                            <a-row :gutter="24">
                                <a-col :span="6" class="unit">
                                    <a-input v-decorator="[itemRadio.text]"/> 
                                    <span :style="{width:'19%'}" class="marginLeft8">{{itemRadio.unit}}</span>
                                </a-col>
                                <a-col :span="6" v-if="defaultValue===4"  class="unit">
                                    <a-input v-decorator="[list.radioItem[index-1].text]"/> 
                                    <span :style="{width:'19%'}" class="marginLeft8">{{list.radioItem[index-1].unit}}</span>
                                </a-col>
                            </a-row>
                        </div>
                    </div> 
              </a-form-item>
          </a-form>
          
          <h3 class="record">Morisky用药依从性评价</h3>
          <a-divider />
          <!-- 第三个表单 -->
          <a-form>
            <div >
                <a-button  :style="{'float':'right'}" type='primary'>评估标准</a-button>
            </div>
            <div :style="{clear:'both'}"></div>
            <a-form-item :label-col="{ span:3 }"
                    :wrapper-col="{ span:21 }" v-for="(list,i) in formItemThree" :key="i" :label="list.label">
                 <a-radio-group v-decorator="[ list.label,{initialValue: 1}]" buttonStyle="solid">
                  <a-radio
                    v-for="(op,index) in list.radioItem"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>

              </a-form-item>

          </a-form>
          
          <div class="disFlex">
            <span class="record"><h3>疾病因素评估</h3></span>
            <span>
            <a-button type="primary">增加评分项</a-button>
            </span>
          </div>
          <a-divider />
          <!-- 第四个表单 -->
          <div id="components-form-demo-advanced-search" class="enterhosptial">
            <a-form class="ant-advanced-search-form" :form="form">
              <a-form-item label="肝功能" class="texts">
                <a-radio-group v-decorator="[ 'liver']">
                  <a-radio
                    v-for="(op,index) in this.enum.liver"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
                <a-button type="primary" style="float:right">评估标准</a-button>
              </a-form-item>
              <a-form-item label="肾功能" class="texts">
                <a-radio-group v-decorator="[ 'renal']">
                  <a-radio
                    v-for="(op,index) in this.enum.renal"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
                <a-button type="primary" style="float:right">评估标准</a-button>
              </a-form-item>
              <a-form-item label="心功能" class="texts">
                <a-radio-group v-decorator="[ 'heart']">
                  <a-radio
                    v-for="(op,index) in this.enum.heart"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
                <a-button type="primary" style="float:right">评估标准</a-button>
              </a-form-item>
              <a-form-item label="DVT" class="texts">
                <a-radio-group v-decorator="[ 'dvt']">
                  <a-radio
                    v-for="(op,index) in this.enum.dvt"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
                <a-button type="primary" style="float:right">评估标准</a-button>
              </a-form-item>
            </a-form>
          </div>
          <h3 class="record">既往用药评估水平</h3>
          <a-divider />
          <!-- 第五个表单 -->
          <div id="components-form-demo-advanced-search" class="enterhosptial">
            <a-form class="ant-advanced-search-form" :form="form">
              <a-form-item label="适应症" class="texts">
                <a-radio-group v-decorator="[ 'liver']">
                  <a-radio
                    v-for="(op,index) in this.enum.druglevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="用法用量" class="texts">
                <a-radio-group v-decorator="[ 'spec']">
                  <a-radio
                    v-for="(op,index) in this.enum.druglevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="注意事项" class="texts">
                <a-radio-group v-decorator="[ 'warn']">
                  <a-radio
                    v-for="(op,index) in this.enum.druglevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="不良反应" class="texts">
                <a-radio-group v-decorator="[ 'act']">
                  <a-radio
                    v-for="(op,index) in this.enum.druglevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="自我药疗效果" class="texts">
                <a-radio-group v-decorator="[ 'grade']">
                  <a-radio
                    v-for="(op,index) in this.enum.druglevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-row :gutter="24">
                <a-col v-for="item in enddata" :key="item.title" :span="12">
                  <a-form-item :label="`${item.title}`">
                    <a-input
                      v-decorator="[
                `${item.name}`,
                {
                  rules: [{
                    required: !item.require ,
                    message: 'Input something!',
                  }],
                }
              ]"
                      :placeholder="`请输入${item.title}`"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <a-divider />
        </a-card>
      </a-col>
    </a-row>
    <FooterToolBar>
      <a-button @click="backTo" class="margin-left-5">返回</a-button>
      <a-button @click="adds" type="primary" style="margin-left: 5px">新增</a-button>
      <a-button type="primary" class="margin-left-5" @click="handleSubmit">保存</a-button>
    </FooterToolBar>
  </div>
</template>
<script>
import FooterToolBar from '@/components/FooterToolbar'
export default {
  components: {
    FooterToolBar
  },
  name: 'index',
  data() {
    return {
      defaultValue:1,
       defaultValueAllergy:'13',
      form: this.$form.createForm(this),
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
        formItem:[
                   {label:'信息来源',type:'radio',val:'date',
                      radioItem:[
                          {label:'患者',value:'1',dataField:'disease'},
                          {label:'家属',value:'2',dataField:'usage'},
                          {label:'其他',value:'3',dataField:'medicalEdu'}
                      ],
                   },
                    {label:'民族',type:'input',val:'outOfHospital'},
                    {label:'身高',type:'input',val:'iphoneNumber'},
                    {label:'体重',type:'input',val:'weight'},
                    {label:'体重指数',type:'input',unit:'kg/m',val:'BMI'},
                    {label:'体表面积',type:'input',val:'jo3b',unit:'m'},
                    {label:'婚姻状况',type:'radio',val:'date',
                      radioItem:[
                          {label:'未婚',value:'1',dataField:'disease'},
                          {label:'已婚',value:'2',dataField:'usage'},
                          {label:'离异',value:'3',dataField:'medicalEdu'}
                      ],
                   },
                   {label:'医保状况',type:'radio',val:'date',
                      radioItem:[
                          {label:'自费',value:'1',dataField:'d1isease'},
                          {label:'医保',value:'2',dataField:'us2age'},
                          {label:'公费',value:'2',dataField:'us3age'},
                          {label:'其他',value:'3',dataField:'med4icalEdu'}
                      ],
                   },
                   {label:'特殊人群',type:'radio',val:'date',
                      radioItem:[
                          {label:'儿童',value:'1',dataField:'dis66ease'},
                          {label:'老年人',value:'2',dataField:'u67sage'},
                          {label:'妊娠',value:'3',dataField:'med18icalEdu'},
                          {label:'哺乳期',value:'4',dataField:'med2icalEdu'},
                          {label:'育龄妇女',value:'5',dataField:'me34dicalEdu'},
                          {label:'其他',value:'6',dataField:'medic5alEdu'},
                          {label:'无',value:'7',dataField:'medic6alEdu'}
                      ],
                   },
                   {label:'职业',type:'radio',val:'date',
                      radioItem:[
                          {label:'学生',value:'1',dataField:'dis9ease'},
                          {label:'全职',value:'2',dataField:'us8age'},
                          {label:'兼职',value:'3',dataField:'medic3alEdu'},
                          {label:'失业',value:'4',dataField:'medic33alEdu'},
                          {label:'退休',value:'5',dataField:'medic36alEdu'},
                          {label:'家庭主妇',value:'6',dataField:'med7ic3alEdu'},
                      ],
                   },
                   {label:'教育程度',type:'radio',val:'date',
                      radioItem:[
                          {label:'小学',value:'1',dataField:'d1isease'},
                          {label:'初中',value:'2',dataField:'us2age'},
                          {label:'高中（中专）',value:'3',dataField:'me3545dicalEdu'},
                          {label:'本科（大专）',value:'3',dataField:'med764icalEdu'},
                          {label:'硕士及以上',value:'3',dataField:'medica65lEdu'},
                          {label:'未受教育',value:'3',dataField:'medica899lEdu'}
                      ],
                   },
                   {label:'基础疾病',type:'check',val:'date',
                      checkItem:[
                          {label:'高血压',value:'1',dataField:'d1isease'},
                          {label:'冠心病',value:'2',dataField:'us2age'},
                          {label:'心律失常',value:'3',dataField:'me3545dicalEdu'},
                          {label:'心功能不全',value:'4',dataField:'med764icalEdu'},
                          {label:'糖尿病',value:'5',dataField:'medica65lEdu'},
                          {label:'甲状腺疾病',value:'6',dataField:'medica899lEdu'},
                          {label:'CKD',value:'6',dataField:'me为dica899lEdu'},
                          {label:'其他',value:'6',dataField:'medic人a899lEdu'},
                      ],
                   },
                   
                  {label:'入院诊断',type:'textarea',val:'familyHistory'},
                  {label:'主诉',type:'textarea',val:'medicalHistory'},
                  {label:'既往病史',type:'textarea',val:'drugTreatment'},
                  {label:'家族史',type:'textarea',val:'illnessSituation'},
                  {label:'过敏史',type:'radio',val:"allergy",allergyMedicine:'',radioItem:[
                    {value:'13',label:'无'},
                    {value:'1',label:'皮试过敏'},
                    {value:'35',label:'一种药物/食物过敏或一般过敏反应'},
                    {value:'46',label:'两种或两种以上药物/食物过敏或严重过敏'}
                    ]
                  },    
            ],
            formItemTwo:[
                {label:'入院方式',type:'radio',val:"enterHospital",radioItem:[
                      { id: 1, text: '步行' },
                      { id: 2, text: '扶行' },
                      { id: 3, text: '轮椅' },
                      { id: 4, text: '平车' },
                      { id: 5, text: '其他' }
                    ]
                },
                {label:'自理能力',type:'radio',val:"enterHospital",radioItem:[
                      { id: 1, text: '完全自理' }, 
                      { id: 2, text: '部分自理' }, 
                      { id: 3, text: '完全依赖' }
                    ]
                },
                {label:'听力',type:'radio',val:"enterHospital",radioItem:[
                      { id: 1, text: '清晰' },
                      { id: 2, text: '重听' },
                      { id: 3, text: '失聪' },
                      { id: 4, text: '助听器' },
                      { id: 5, text: '其他' }
                    ]
                },
                {label:'语言',type:'radio',val:"enterHospital",radioItem:[
                     { id: 1, text: '正常' }, 
                     { id: 2, text: '失语' }, 
                     { id: 3, text: '含糊不清' },
                     { id: 4, text: '手势语' }
                    ]
                },
                {label:'基本膳食',type:'radio',val:"enterHospital",radioItem:[
                     { id: 1, text: '普食' },
                      { id: 2, text: '半流' },
                      { id: 3, text: '留质' },
                      { id: 4, text: '禁食' },
                      { id: 5, text: '其他' }
                    ]
                },
                {label:'意识',type:'radio',val:"enterHospital",radioItem:[
                      { id: 1, text: '清醒' },
                      { id: 2, text: '嗜睡' },
                      { id: 3, text: '恍惚' },
                      { id: 4, text: '昏迷' },
                      { id: 5, text: '其他' }
                    ]
                },
                {label:'嗜好',type:'radio',val:"enterHospital",radioItem:[
                      { id: 1, text: '无' }, 
                       { id: 3, text: '烟' ,unit:'支/天'},
                      { id: 2, text: '酒' ,unit:'两/天'},
                        { id: 4, text: '烟与酒' ,unit:'支/天'}
                    ]
                },{label:'中心静脉置管',type:'radio',val:"enterHospital",radioItem:[
                      { id: 1, text: '有' }, { id: 2, text: '无' }
                    ]
                },
                {label:'鼻饲',type:'radio',val:"enterHospital",radioItem:[
                     { id: 1, text: '有' }, { id: 2, text: '无' }
                    ]
                },
                {label:'特殊体质',type:'radio',val:"enterHospital",radioItem:[
                      { id: 1, text: '过敏体质' },
                      { id: 2, text: '药物代谢类型' },
                      { id: 3, text: '其他' },
                      { id: 4, text: '无' }
                    ]
                },
            ],
            formItemThree:[
                {label:'服药依从性',type:'radio',val:"enterHospital",radioItem:[
                      { id: 1, text: '好 8分' },
                      { id: 2, text: '皮试过敏' },
                      { id: 3, text: '较差 6分以下' },
                    ]
                },
                {label:'药师干预',type:'radio',val:"enterHospital",radioItem:[
                      { id: 1, text: '无' }, 
                      { id: 2, text: '有' }, 
                      { id: 3, text: '较差 6分以下' }
                    ]
                },
                {label:'重视药物治疗',type:'radio',val:"enterHospital",radioItem:[
                      { id: 1, text: '好' },
                      { id: 2, text: '一般' },
                      { id: 3, text: '较差' },
                    ]
                },
            ]
    }
  },
  computed: {
    formBase() {
      return [
        {
          title: '名族',
          require: true,
          name: 'orgCode'
        },
        {
          title: '身高',
          name: 'orgName'
        },
        {
          title: '体重',
          name: 'simpleCode'
        },
        {
          title: '体重指数',
          require: true,
          name: ''
        },
        {
          title: '体表面积',
          name: 'contacts'
        }
      ]
    },
    enddata() {
      return [
        {
          title: '评估药师',
          require: true,
          name: 'assessment'
        },
        {
          title: '评估时间',
          name: 'assessmentTime'
        }
      ]
    }
  },

  created() {},

  mounted() {},
  destroyed() {},
  methods: {
    onAllergyChanege (e) {
            this.defaultValueAllergy=e.target.value;
            console.log('radio checked', e.target.value)
    },
    onRadioChange ( e) {
            this.defaultValue=e.target.value;
            console.log('radio checked', e.target.value)
    },
    handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log(values);
          }
        })
    },
    backTo(){

    },
    adds(){
      
    }
  }
}
</script>

<style scoped lang='less'>
        /deep/.unit .ant-form-item-children,.unit{
            display: flex;
            align-items: center;
        }
        /deep/.allergy {
            .ant-form-item-control-wrapper{
                text-align: right;
                float: right;
            }
        }
.detailCont {
  .enterhosptial {
    .ant-form-item label {
      margin-left: 15px;
    }
    .ant-radio-button-wrapper:first-child {
      border-radius: 0;
      border-left: 1px solid #d9d9d9;
    }
    .ant-radio-button-wrapper:last-child {
      border-radius: 0;
      // border-left: 1px solid #d9d9d9;
    }
  }
  margin-top: 10px;
  .ant-list {
    margin-top: 10px;
  }
  .ant-list-item {
    padding-left: 25%;
    padding-top: 9px;
    padding-bottom: 9px;
    font-size: 20px;
    cursor: pointer;
  }
  header {
    span:nth-child(1) {
      font-size: 20px;
      padding-right: 20px;
      color: #1890ff;
      font-weight: bold;
    }
  }
  .people {
    margin-top: 15px;
    font-size: 18px;
    margin-bottom: 10px;
  }
  .record {
    font-size: 22px;
    .anticon {
      margin-right: 10px;
    }
  }
  .drugfenxi {
    margin-top: 15px;
  }
  // // 表单样式
  // .ant-advanced-search-form {
  //   padding: 0px 24px 22px 22px;
  //   // background: #fbfbfb;
  //   // border: 1px solid #d9d9d9;
  //   border-radius: 6px;
  // }

  // .ant-advanced-search-form .ant-form-item {
  //   display: flex;
  // }
  // .ant-form-item {
  //   margin-bottom: 10px;
  // }

  // .ant-advanced-search-form .ant-form-item-control-wrapper {
  //   flex: 1;
  // }

  // #components-form-demo-advanced-search {
  //   width: 90%;
  //   margin: 0 auto;
  //   .ant-form {
  //     max-width: none;
  //   }
  // }
  // .ant-form-item-label {
  //   width: 20%;
  // }
  // .texts {
  //   .ant-form-item-label {
  //     width: 10%;
  //   }
  // }
}
</style>