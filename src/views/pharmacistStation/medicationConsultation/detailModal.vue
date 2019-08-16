<template>
  <div class="detailModal">
    <a-modal
      title="用药咨询"
      :visible="visible"
      @cancel="handleCancel"
      :maskClosable="false"
      :width="800"
    >
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form :form="form">
          <a-row>
             <a-col  v-for="(list,i) in formItem" :key="i" :span="list.span" >
                <a-form-item :label="list.label"
                :label-col="{ span:list.span==='8'?'9':'3' }"
                :wrapper-col="{ span: list.span==='8'?'15':'21' }">
                    <span v-if="list.type==='input'">
                        <a-input :defaultValue='modalData[list.val]'/>
                    </span>
                    <a-textarea  :defaultValue='modalData[list.val]' v-if="list.type==='textarea'"/>
                    <a-radio-group :defaultValue='modalData[list.val]' name="radioGroup" v-if="list.type==='radio'">
                        <a-radio v-for="(item,index) in list.radioItem" :key="index" :value="item.value">{{item.name}}</a-radio>                            
                    </a-radio-group>
                    <span v-if="list.type==='checkbox'">
                            <a-checkbox-group :defaultValue='[modalData[list.val]]'>
                              <a-checkbox
                                v-for="(op,index) in list.options"
                                :value="op.value"
                                :key="index"
                              >{{op.label}}</a-checkbox>
                            </a-checkbox-group>
                        </span>
                </a-form-item>
            </a-col>
        </a-row>       
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { selectOutDetail } from '@/api/login'
export default {
    name:"detailModal",
    props: {
        modalData: {
        type: Object,
        default:{}
        },
    },
  data() {
    return {
      form: this.$form.createForm(this),
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
    }
  },
  
  mounted() {
   console.log(this.modalData)
  },
  methods: {
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
</style>

    

