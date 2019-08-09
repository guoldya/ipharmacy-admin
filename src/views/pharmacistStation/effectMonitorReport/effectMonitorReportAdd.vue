<template>
    <div class="effectMonitorReportAdd">
        <a-card>
            <a-row>
                <a-col :span="12">不良反应监测及上报</a-col>
                <a-col :span="12" class="txtRight">
                    <div>
                        <a-button @click="">返回</a-button>
                        <a-button type="primary" class="margin-left-5" @click="">提交</a-button>
                    </div>
                </a-col>
            </a-row>
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
            <a-row>
                <a-col
                v-for="(list,i) in formItem"
                :key="i"
                :span="8"
                >
                <a-form-item :label="list.label">
                    <a-input v-if="list.type==='input'"/>
                    <a-input v-if="list.type==='textarea'" type="textarea"/>
                   <a-radio-group name="radioGroup" v-if="list.type==='radio'" :defaultValue="1">
                        <a-radio v-for="(item,index) in list.radioItem" :key="index" :value="item.value">{{item.name}}</a-radio>
                    </a-radio-group>
                     <a-date-picker @change="onChange" v-if="list.type==='date'"/>
                </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col
                v-for="(list,i) in formItemTextarea"
                :key="i"
                :span="24"
                >
                <a-form-item :label="list.label">
                    <a-input v-if="list.type==='textarea'" type="textarea"/>
                </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        </a-card>
    </div>
</template>

<script>
  export default {
    name: 'effectMonitorReportAdd',
    data(){
      return{
          expand: false,
        form: this.$form.createForm(this),
        formItemTextarea:[
           {label:'不良反应表现（包括临床检验）',type:'textarea'},
            {label:'不良反应处理情况',type:'textarea'},
        ],
        formItem:[
            {label:'紧急情况',type:'radio',radioItem:[{value:'1',name:'紧急'},{value:'2',name:'一般'}]},
            {label:'报告编号',type:'input'},
            {label:'报告日期',type:'date'},
            {label:'患者姓名',type:'input'},
            {label:'患者性别',type:'radio',radioItem:[{value:'1',name:'男'},{value:'2',name:'女'}]},
            {label:'患者年龄',type:'input'},
            {label:'民族',type:'input'},
            {label:'体重(kg)',type:'input'},
            {label:'家族药品不良反应',type:'radio',radioItem:[{value:'1',name:'有'},{value:'2',name:'无'},{value:'3',name:'不祥'}]},
            {label:'患者类型',type:'radio',radioItem:[{value:'1',name:'住院'},{value:'2',name:'门急诊'}]},
            {label:'住院号/就诊卡号',type:'input'},
            {label:'工作单位',type:'input'},
            {label:'电话',type:'input'},
            {label:'既往药品不良反应',type:'radio',radioItem:[{value:'1',name:'有'},{value:'2',name:'无'},{value:'3',name:'不祥'}]},
            {label:'原患疾病',type:'input'},
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
    }
    .ant-advanced-search-form {
        // padding: 24px;
        // background: #fbfbfb;
        // border: 1px solid #d9d9d9;
        // border-radius: 6px;
    }

    .ant-advanced-search-form .ant-form-item {
        display: flex;
        }

    .ant-advanced-search-form .ant-form-item-control-wrapper {
        flex: 1;
    }
    /deep/.ant-advanced-search-form .ant-form-item-label label {
        width: 206px;
        display: inline-block;
    }
</style>