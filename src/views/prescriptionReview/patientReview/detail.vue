<template>
<a-card>
  <div class="detailPatient">
    <a-col :span="14">
     
    </a-col>
    <a-col :span="10" class="padding-left-5">
        <div class="dealRight">
        <a-tabs defaultActiveKey="1" size="small" class="width-100">
          <a-tab-pane tab="预判情况" key="1">
           <a-card>
               <div class='content'>
                   <header>是否为合理处方</header>
                   <
               </div>
           </a-card>
          </a-tab-pane>
          <a-tab-pane tab="干预记录" key="2">
            
          </a-tab-pane>
        </a-tabs>
      </div>
      <!-- <jodgeStation
        :visidId="visidIdnum"
        :submitNos="submitNos"
        @listStatus="listStatul"
        @adoptMessage="updateData"
        @upchange="updateDatas"
        @saveStatus='saveStatu'
      ></jodgeStation> -->
    </a-col>
  </div>
</a-card>
</template>

<script>

import jodgeStation from '../../auditWorkstation/presHospitalized/jodgeStation'

export default {
  components: {
    jodgeStation,
  },
  name: 'detail',
  data() {
    return {
      
    }
  },
  mounted() {
    this.routerData = this.$route.params
    this.getRecordDelData({ visid: this.$route.params.visId, submitNo: this.$route.params.maxSubmitNo })
    if (this.routerData.isNew == 1) {
      this.turnpage({ visId: this.$route.params.visId, maxSubmitNo: this.$route.params.maxSubmitNo })
    }
  },
  methods: {
   
    

    // 时间格式处理
    timeFormat(data) {
      let times = data.slice(5, 20)
      return times
    },
    // 左右互动
    listStatul(data) {
      this.prescOrderId = data
    },
    saveStatu(data){
this.auditStatus=data
    }
  }
}
</script>

<style  lang="less">
.detailPatient {
    .ant-card-wider-padding .ant-card-body {
    padding: 20px 20px;
}
  .content{
      height: 300px;
      background:#FFFBF1;
          padding-left: 15px;
    padding-top: 20px;
    font-size: 16px;
  }
}

</style>