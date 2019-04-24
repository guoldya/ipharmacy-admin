<template>
  <div>
    <a-row :gutter="8">
      <a-col :xxl="4" :xl="6" :lg="8" :md="8" :sm="12" v-for="(op,index) in items">
        <div class="all">
          <a-row class="arow">
            <a-col class="node p" :span="21">
              {{op.inpatient}}{{op.roomId}}
            </a-col>
            <a-col style=" line-height: 37px;text-align: right;opacity: 0.6;" :span="3">
              <a-icon style="font-size: 26px;" type="profile"/>
            </a-col>
          </a-row>
          <a-row class="arow">
            <a-col class="node col" :span="8">
              今入 {{op.inPeople}}
            </a-col>
            <a-col class="node col" :span="8">
              今出 {{op.outPeople}}
            </a-col>
          </a-row>
          <a-row class="arow detail" @click="op.click(data)">
            <a-col class="node col" :span="21">
              查看详情
            </a-col>
            <a-col class="node col" :span="3">
              <a-icon style="font-size: 1.2em;" type="right-circle"/>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>

  </div>
</template>

<script>
  /**
   *  {inpatient:'',outPeople:number,inPeople:number},
   *
   * inpatient 病区
   *
   * roomId 床位号
   *
   * outPeople 出病房人数
   *
   * inPeople 进病房人数
   *
   * click 查看详情事件
   *
   */
  export default {
    name: 'dynamic',
    props: {
      items: {
        type: Array,
        default() {
          return []
        }
      },
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }
</script>

<style scoped>
  .all {
    background-color: #e6f2f3;
    padding-bottom: 3px;
    border: 1px solid silver;
    margin-bottom: 8px;
    /*margin-left: 6px;*/
    box-shadow: 0px 2px 3px 2px rgba(0, 0, 0, 0.03);
  }

  .all:hover {

  }

  .arow {
    padding: 6px 15px;
  }

  .arow.detail {
    clear: both;
    position: relative;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    opacity: .7;
    color:rgb(104,158,201);
    border-top: 1px solid silver;
    cursor: pointer;
  }

  .arow.detail:hover{
    color: rgb(51, 122, 183);
  }
  .node {
    font-weight: 400;
  }

  .node.p {
    font-family: -webkit-pictograph;
    color: #2ab4c0 !important;
    font-size: 22px;
    text-size-adjust: 100%;
    direction: ltr
  }

  .node.col {
    font-family: "Microsoft YaHei";
    font-size: 14px
  }
</style>