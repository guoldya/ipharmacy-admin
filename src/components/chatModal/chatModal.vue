<template>
  <div>
    <a-modal
      title="张三"
      :visible="visible"
      :maskClosable="false"
      :width="900"
       class="chatModal"
       centered
      :destroyOnClose='true'
    >
     <template slot="footer">
        <a-button key="back" @click="handleCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          发送
        </a-button>
      </template>
      <a-row :gutter="24">
          <a-col :span="16">
              <a-card :bordered='false'>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </a-card>
            <a-divider/>
              <div class="chatInputBorder">
                  <a-textarea autofocus></a-textarea>
              </div>
          </a-col>
          <a-col :span="8" class="rightCol">
              <div >
                <p>性别：男</p>
                <p>年龄：23</p>
                <p>专业：经济学</p>
              </div>
          </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import { selectOutDetail } from '@/api/login'
export default {
    name:"selectDoctorAdvice",
    props: {
       
    },
  data() {
    return {
      loading:false,
      modalData:[],
      visible:false,
      multipleSelection: [],
    }
  },
  computed: {
    },
  mounted() {
  },
  methods: {
   showModal() {
      this.visible = true
    },
    handleCancel(e) {
      this.visible = false
    },
    handleOk(e) {
      console.log(e);
      console.log(this.multipleSelection,'multipleSelection')
      this.visible = false
    },
  }
}
</script>
<style scoped lang='less'>
     .ant-modal .ant-modal-title{
         text-align: center !important
     }
     .chatModal{
         .rightCol{
            height: 252px;
            background-color: #e8e8e8;
         }
         .chatInputBorder{
            .ant-input{
                border:none !important;
                box-shadow: none;
                resize: none
            } 
        }
     }
     

     
    
    
</style>

    

