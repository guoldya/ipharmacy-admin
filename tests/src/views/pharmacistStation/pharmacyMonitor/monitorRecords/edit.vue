<template>
  <div class="detailModal">
    <!-- <a-modal
      title="编辑监护记录"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
      :maskClosable="false"
      :width="800"
      :destroyOnClose='true'
    > -->
    <a-card>
      <div class="cardHead">
        <a href="#" @click.prevent="backTo">
          <a-icon type="left"></a-icon>
          返回
        </a>
      </div>
      <a-form :form="form">
          <a-row :gutter="24">
             <a-col  v-for="(list,i) in formItem" :key="i" :span="24" >
                <a-form-item :label="list.label" 
                :label-col="{ span:'8' }"
                :wrapper-col="{ span: '8'}">
                    <span v-if="list.type==='input'">
                        <a-input :disabled="i===1&&page===JSON.stringify('add')" v-decorator="[list.val,{initialValue: formData[list.val]}]"/>
                    </span>
                     <a-button v-if="i===1&&page===JSON.stringify('add')" type="primary">读取患者信息</a-button>
                     <a-date-picker  v-if="list.type==='date'"
                     v-decorator="[list.val,{initialValue:formData[list.val]? moment(formData[list.val], dateFormat):null}]"
                          :format="dateFormat"
                        />
                    <a-textarea  v-decorator="[list.val,{initialValue: formData[list.val]}]" v-if="list.type==='textarea'"/>
                </a-form-item>
            </a-col>
        </a-row> 
        <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
            <a-button type="primary" @click="handleSubmit">保存</a-button>
            <a-button class="margin-left-20" @click="backTo">取消</a-button>
          </a-form-item>      
      </a-form>
    </a-card>
    <!-- </a-modal> -->
  </div>
</template>
<script>
import moment from 'moment';
export default {
    name:"monitorRecordsEdit",
    props: {
      // modalData: {
      //   type: Object,
      //   default:{}
      // },
    },
  data() {
    return {
        dateFormat: 'YYYY-MM-DD HH:mm',
      form: this.$form.createForm(this),
      visible: false,
      formItem:[
            {label:'住院号',type:'input',val:'name',span:"8"},
            {label:'患者姓名',type:'input',val:'user',span:"8"},
            {label:'记录时间',type:'date',val:'date',span:"8"},
            {label:'结果分析（疗效、不良反应和执行情况）',type:'textarea',val:'type',span:"24"},
            {label:'药物治疗方案分析',type:'textarea',span:"24",val:'plan'},
            {label:'药师备注',type:'textarea',val:'na3me',span:"8"},
        ],
        formData:{}
    }
  },
  
  mounted() {
    if(this.page===JSON.stringify('add')){
         document.title=document.title.split('监')[0]+'监护记录新增';
    }else if(this.page===JSON.stringify('look')){
        document.title=document.title.split('监')[0]+'监护记录编辑';
    }
   this.getDetailData();
  
  },
  computed:{
      page(){
        return sessionStorage.getItem('childPage')
      }
  },
  methods: {
    moment,
    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    },
    getDetailData(){
      if(this.page===JSON.stringify('look')){
        let data=JSON.parse(sessionStorage.getItem('monitorRecordsData'))
        this.formData=data;
          console.log(data)
      }else
       this.formData.date=""
    },
    handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log(values)
          }
        })
      },
    backTo() {
        this.$router.push({
          name: 'monitorRecordsIndex'
        })
      },
    // handleOk(e) {
    //     console.log(e);
    //     this.visible = false
    // },
    // showModal() {
    //     this.visible = true;
    // },
    // handleCancel(e) {
    //     this.visible = false;
    // },
  }
}
</script>
<style scoped lang='less'>
    // /deep/.ant-col-24 .ant-form-item .ant-form-item-label{
    //   text-align: left
    // }
    //  .ant-col-24 .ant-form-item {
    //   margin-left: 22px;
    // }
</style>

    

