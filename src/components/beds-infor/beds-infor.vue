<template>
  <div>
    <a-row :gutter="8">
      <a-col :xxl="4" :xl="6" :lg="8" :md="8" :sm="12" v-for="(op,index) in items">
        <div class="all">
          <a-row class="arow">
            <a-col class="node p" :span="12">
              <span style="color:#1890FF; cursor: pointer;" @click="op.click(op)">{{op.roomId}}床</span><span
              style="font-size: 16px"> {{op.patientId}}</span>
            </a-col>

            <a-col class="node icon" :span="12">
              <a-tag color="#108ee9" v-if="op.attentionType">{{op.attentionType}}</a-tag>
              <a-tooltip v-if="op.AttentionLevel==1" title="关注等级:一级">
                <a-icon @click="op.modalClick()" theme="filled" type="star"  style="color:red"/>
              </a-tooltip>
              <a-tooltip v-else-if="op.AttentionLevel==2" title="关注等级:二级">
                <a-icon @click="op.modalClick()" theme="filled" type="star"  style="color:yellow"/>
              </a-tooltip>
              <a-tooltip v-else-if="op.AttentionLevel==3" title="关注等级:三级">
                <a-icon @click="op.modalClick()" theme="filled" type="star"  style="color:green"/>
              </a-tooltip>
              <a-tooltip v-else-if="op.AttentionLevel==4" title="关注等级:四级">
                <a-icon @click="op.modalClick()" theme="filled" type="star"  style="color:rgb(63,81,181)"/>
              </a-tooltip>
              <a-tooltip v-else title="关注等级:未关注">
                <a-icon @click="op.modalClick()" theme="filled" type="star"/>
              </a-tooltip>
            </a-col>

          </a-row>
          <a-row class="arow">
            <a-col class="node col" :span="18">
              <span @click="op.click(op)">{{op.name}} {{op.sex}} {{op.age}}</span>
            </a-col>
          </a-row>
          <a-row style="padding: 0px 15px;">
            <a-col class="node col" :span="18">
              <span @click="op.click(op)">{{op.disease}}</span>
            </a-col>
          </a-row>
          <a-row class="arow detail">
            <div @click="op.click(op)">
              <a-col class="node col" :span="22">
                {{op.time}}
              </a-col>
              <a-col class="node col" :span="2">
                <a-icon style="font-size: 1.2em;" type="right-circle"/>
              </a-col>
            </div>
          </a-row>
        </div>
      </a-col>
    </a-row>

  </div>
</template>

<script>
  /**
   *  {patientId:'',roomId:'',name:'',sex:'',age:'',disease:'',attentionType:'',AttentionLevel:'',time:'',modalClick:click,click:click,},
   *
   * patientId 病人编号
   *
   * roomId 床位号
   *
   * name 病人姓名
   *
   * sex 病人性别
   *
   * age 病人年龄
   *
   * disease 病症
   *
   * attentionType 关注类别
   *
   * AttentionLevel 关注等级
   *
   * time 时间
   *
   * click 点击查看详情事件
   *
   * modalClick 点击调整关注
   *
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
    },
    data(){
      return{
        text:'',
      }
    },
  }
</script>

<style scoped>
  .all {
    background-color: #ffffff;
    padding-bottom: 3px;
    border: 1px solid silver;
    margin-bottom: 8px;
    /*margin-left: 6px;*/
    box-shadow: 0px 2px 3px 2px rgba(0, 0, 0, 0.03);
  }

  .all:hover {
    background-color: rgb(214, 232, 248);
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
    color: #337ab7;
    border-top: 1px solid silver;
    cursor: pointer;
  }

  .arow.detail:hover {
    color: rgb(51, 122, 183);
  }

  .node {
    font-weight: 400;
  }

  .node.p {
    font-family: -webkit-pictograph;
    color: rgb(142, 157, 170) !important;
    font-size: 22px;
    text-size-adjust: 100%;
    direction: ltr
  }

  .node.col {
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-weight: bold;
    color: #8e9daa;
    cursor: pointer;
    margin-bottom: 8px;
  }

  .node.icon {
    line-height: 37px;
    text-align: right;
    opacity: 0.6;
    font-size: 26px;
    cursor: pointer;
  }

</style>