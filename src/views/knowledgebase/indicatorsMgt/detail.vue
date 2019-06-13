<template>
  <a-card>
    <div class="cardHead">
      <a href="#" @click.prevent="backTo">
        <a-icon type="left"></a-icon>返回
      </a>
    </div>
    <a-Row >
      <a-Col :span="6"/>
      <a-Col :span="12">
        <a-Row >
          <a-Col :span="24">
            <h2>基本信息</h2>
            <a-divider/>
            <a-Row class="box">
              <a-Col :span="3" class="textRight">检验指标：</a-Col>
              <a-Col :span="9">{{fromData.indexId}}</a-Col>
              <a-Col :span="3" class="textRight">指标编码：</a-Col>
              <a-Col :span="9">{{fromData.testItemCode}}</a-Col>
            </a-Row>
            <a-Row class="box">
              <a-Col :span="3" class="textRight">指标分类：</a-Col>
              <a-Col :span="9">{{fromData.testItemClass}}</a-Col>
              <a-Col :span="3" class="textRight">指标类型：</a-Col>
              <a-Col :span="9">{{this.testItemTypeFormatter(fromData.testItemType)}}</a-Col>
            </a-Row>
            <a-Row class="box">
              <a-Col :span="3" class="textRight">指标名称：</a-Col>
              <a-Col :span="9">{{fromData.testItemName}}</a-Col>
              <a-Col :span="3" class="textRight">英文名：</a-Col>
              <a-Col :span="9">{{fromData.englishName}}</a-Col>
            </a-Row>
            <a-Row class="box">
              <a-Col :span="3" class="textRight">拼音码：</a-Col>
              <a-Col :span="9">{{fromData.spellcode}}</a-Col>
              <a-Col :span="3" class="textRight">五笔码：</a-Col>
              <a-Col :span="9">{{fromData.wbcode}}</a-Col>
            </a-Row>
          </a-Col>
         <a-Col :span="24" class="margin-top-10" >
            <h2>补充信息</h2>
            <a-divider/>
            <a-Row class="box">
              <a-Col :span="3" class="textRight">单位：</a-Col>
              <a-Col :span="9">{{fromData.unit}}</a-Col>
              <a-Col :span="3" class="textRight">计算项：</a-Col>
              <a-Col :span="9">{{this.isCalcFormatter(fromData.isCalc)}}</a-Col>
             
            </a-Row>
            <a-Row class="box">
             <a-Col :span="3" class="textRight">参考值：</a-Col>
              <a-Col :span="9">{{fromData.limitValue}}</a-Col>
              <a-Col :span="3" class="textRight">参考高值：</a-Col>
              <a-Col :span="9">{{fromData.limitHigh}}</a-Col>
            </a-Row>
            <a-Row class="box">
               <a-Col :span="3" class="textRight">参考低值：</a-Col>
              <a-Col :span="9">{{fromData.limitLow}}</a-Col>
               <a-Col :span="3" class="textRight">结果类型：</a-Col>
              <a-Col :span="9">{{this.resultTypeFormatter(fromData.resultType)}}</a-Col>
              
            </a-Row>
            <a-Row class="box">
              <a-Col :span="3" class="textRight">计算公式：</a-Col>
              <a-Col :span="9">{{fromData.formUla}}</a-Col>
              <a-Col :span="3" class="textRight">隐私项目：</a-Col>
              <a-Col :span="9">{{this.isPrivacyFormatter(fromData.isPrivacy)}}</a-Col>
            </a-Row>
            <a-Row class="box">
              <a-Col :span="3" class="textRight">实验方法：</a-Col>
              <a-Col :span="9">{{fromData.testMethod}}</a-Col>
              <a-Col :span="3" class="textRight"></a-Col>
              <a-Col :span="9"></a-Col>
            </a-Row>
          </a-Col>

         
        </a-Row>
      </a-Col>
    </a-Row>
    
  </a-card>
</template>
<script>
import { reviewAuditlevelUpdate } from '@/api/login'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  components: { ATextarea },
  data() {
    return {
      api: {
        diagnosisMgtupdate: '/sys/dicIcd/update'
      },
      fromData: {},
     
    }
  },

  computed: {},
  mounted() {
    let _this = this
    if (this.$route.query) {
        let data = this.$route.query.row
       this.resultTypeFormatter(data.resultType)
      _this.fromData = {
          englishName: data.englishName,
          indexId: data.indexId,
          isCalc: data.isCalc,
          isPrivacy: data.isPrivacy,
          limitHigh: data.limitHigh,
          limitLow: data.limitLow,
          limitValue: data.limitValue,
          resultType: data.resultType,
          spellcode: data.spellcode,
          testItemCode: data.testItemCode,
          testItemName: data.testItemName,
          testItemCode: data.testItemCode,
          testItemType: data.testItemType,
          unit: data.unit,
          wbcode: data.wbcode,
          testItemClass:data.testItemClass,
          formUla: data.formUla
        }
    }
  },
  methods: {  
    backTo() {
      this.$router.push({
        name: 'indicatorsIndex'
      })
    },
    // 枚举类型
    testItemTypeFormatter(data) {
      let levelText
      this.enum.testItemType.forEach(item => {
        if (Number(data) == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
     // 枚举类型
    resultTypeFormatter(data) {
      let levelText
      this.enum.resultType.forEach(item => {
        if (Number(data) == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
     // 枚举类型
    isCalcFormatter(data) {
      let levelText
      this.enum.isCalc.forEach(item => {
        if (Number(data) == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
    // 枚举类型
    isPrivacyFormatter(data) {
      let levelText
      this.enum.isPrivacy.forEach(item => {
        if (Number(data) == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
   
  },
}
</script>
<style>
.textRight{
  text-align: right;
  color: rgba(0, 0, 0, 0.85);
}
.box
{
  line-height: 20px;
  padding-bottom: 8px;
  padding-top: 8px;
 
}
</style>