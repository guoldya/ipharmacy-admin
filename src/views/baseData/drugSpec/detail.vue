<template>
  <div class="drugDetail">
    <a-card style="background-color: #f7fcff">
      <a-row>
        <span v-if="drugDetail" class="font-bold fontSize">{{drugDetail.drugNames}}</span>
        <span style="line-height: 36px">
          <a-tag style="cursor: default;"> 保</a-tag>
          <span class="opacity8">国家医保目录（乙类）</span>
        </span>
      </a-row>
      <a-row class="margin-top-10">
        <span v-if="drugDetail">英文名称：{{drugDetail.englishname}}</span>
      </a-row>
    </a-card>
    <a-card class="margin-top-10">
      <a-col :span="4">
        <a-anchor v-if="drugDetail" style="text-align: justify;">
          <a-anchor-link v-if="drugDetail.drugNames" href="#drugName" class="w4" title="药品名称"/>
          <a-anchor-link v-if="drugDetail.composition" href="#composition" class="w4" title="药品成分"/>
          <a-anchor-link v-if="drugDetail.chemicalName" href="#chemicalName" class="w4" title="化学名称"/>
          <a-anchor-link v-if="drugDetail.molecularformula" href="#molecularformula" class="w4" title="分子式"/>
          <a-anchor-link v-if="drugDetail.molecularweight" href="#molecularweight" class="w4" title="分子量"/>
          <a-anchor-link v-if="drugDetail.description" href="#description" class="w4" title="性状"/>
          <a-anchor-link v-if="drugDetail.indications" href="#indications" class="w4" title="适应症"/>
          <a-anchor-link v-if="drugDetail.spec" href="#spec" class="w4" title="规格"/>
          <a-anchor-link v-if="drugDetail.dosage" href="#dosage" class="w4" title="用法用量"/>
          <a-anchor-link v-if="drugDetail.adverseReactions" href="#adverseReactions" class="w4" title="不良反应"/>
          <a-anchor-link v-if="drugDetail.contraindications" href="#contraindications" class="w4" title="禁忌症"/>
          <a-anchor-link v-if="drugDetail.precautions" href="#precautions" class="w4" title="注意事项"/>
          <a-anchor-link v-if="drugDetail.pregnantuse" href="#pregnantuse" class="w4" title="孕妇及哺乳期用药"/>
          <a-anchor-link v-if="drugDetail.childrenuse" href="#childrenuse" class="w4" title="儿童用药"/>
          <a-anchor-link v-if="drugDetail.elderlyuse" href="#elderlyuse" class="w4" title="老年用药"/>
          <a-anchor-link v-if="drugDetail.interactions" href="#interactions" class="w4" title="药物相互作用"/>
          <a-anchor-link v-if="drugDetail.pharmacologicalActions" href="#pharmacologicalActions" class="w4" title="药理毒理"/>
          <a-anchor-link v-if="drugDetail.overdosage" href="#overdosage" class="w4" title="药物过量"/>
          <a-anchor-link v-if="drugDetail.phamacokinetics" href="#phamacokinetics" class="w4" title="药代动力学"/>
          <a-anchor-link v-if="drugDetail.storage" href="#storage" class="w4" title="药品贮藏"/>
          <a-anchor-link v-if="drugDetail.approvalnumber" href="#approvalnumber" class="w4" title="批准文号"/>
          <a-anchor-link v-if="drugDetail.producedby" href="#producedby" class="w4" title="生产企业"/>
        </a-anchor>
      </a-col>
      <a-col :span="18">
        <div v-if="drugDetail.drugNames" id="drugName">
          <a-row>
            <p class="font-bold">药品名称:</p>
            <p>通用名称：{{drugDetail.genericname}}</p>
            <p>英文名称：{{drugDetail.englishname}}</p>
            <p>商品名称：{{drugDetail.drugNames}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.composition" id="composition">
          <a-row>
            <p class="font-bold">药品成分</p>
            <p>{{drugDetail.composition}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.chemicalName" id="chemicalName">
          <a-row>
            <p class="font-bold">化学名称</p>
            <p>{{drugDetail.chemicalName}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.molecularformula" id="molecularformula">
          <a-row>
            <p class="font-bold">分子式</p>
            <p>{{drugDetail.molecularformula}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.molecularweight" id="molecularweight">
          <a-row>
            <p class="font-bold">分子量</p>
            <p>{{drugDetail.molecularweight}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.description" id="description">
          <a-row>
            <p class="font-bold">性状</p>
            <p>{{drugDetail.description}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.indications" id="indications">
          <a-row>
            <p class="font-bold">适应症</p>
            <p>{{drugDetail.indications}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.spec" id="spec">
          <a-row>
            <p class="font-bold">规格</p>
            <p>{{drugDetail.spec}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div  v-if="drugDetail.dosage" id="dosage">
          <a-row>
            <p class="font-bold">用法用量</p>
            <p>{{drugDetail.dosage}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div  v-if="drugDetail.adverseReactions" id="adverseReactions">
          <a-row>
            <p class="font-bold">不良反应</p>
            <p>{{drugDetail.adversereactions}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.contraindications" id="contraindications">
          <a-row>
            <p class="font-bold">禁忌症</p>
            <p>{{drugDetail.contraindications }}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.precautions" id="precautions">
          <a-row>
            <p class="font-bold">注意事项</p>
            <p>{{drugDetail.precautions}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.pregnantuse" id="pregnantuse">
          <a-row>
            <p class="font-bold">孕妇及哺乳期用药</p>
            <p>{{drugDetail.pregnantuse}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.childrenuse" id="childrenuse">
          <a-row>
            <p class="font-bold">儿童用药</p>
            <p>{{drugDetail.childrenuse}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.elderlyuse" id="elderlyuse">
          <a-row>
            <p class="font-bold">老年用药</p>
            <p>{{drugDetail.elderlyuse}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.interactions" id="interactions">
          <a-row>
            <p class="font-bold">相互作用</p>
            <p>{{drugDetail.interactions}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.pharmacologicalActions" id="pharmacologicalActions">
          <a-row>
            <p class="font-bold">药理毒理</p>
            <p>{{drugDetail.pharmacologicalActions}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.overdosage" id="overdosage">
          <a-row>
            <p class="font-bold">药物过量</p>
            <p>{{drugDetail.overdosage}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.phamacokinetics" id="phamacokinetics">
          <a-row>
            <p class="font-bold">药代动力学</p>
            <p>{{drugDetail.phamacokinetics}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.storage" id="storage">
          <a-row>
            <p class="font-bold">药品贮藏</p>
            <p>{{drugDetail.storage}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.approvalnumber" id="approvalnumber">
          <a-row>
            <p class="font-bold">批准文号</p>
            <p>{{drugDetail.approvalnumber}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
        <div v-if="drugDetail.producedby" id="producedby">
          <a-row>
            <p class="font-bold">生产企业</p>
            <p>{{drugDetail.producedby}}</p>
          </a-row>
          <a-divider></a-divider>
        </div>
      </a-col>
    </a-card>
    <footer-tool-bar
      :extra="false"
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <!--<a-button @click="submit" :loading="loading">上一个</a-button>-->
      <!--<a-button @click="submit" class="margin-left-5" :loading="loading">下一个</a-button>-->
      <a-button @click="cancle" class="margin-left-5" :loading="loading">返回</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
  import FooterToolBar from '@/components/FooterToolbar'
  import { mixin, mixinDevice } from '@/utils/mixin'
  export default {
    components: {
      FooterToolBar
    },
    mixins: [mixin, mixinDevice],
    data() {
      return {
        api:{
          dicPackageSelectOne:'/sys/dicPackageinsert/selectOne',
        },
        drugDetail:{},
      }
    },
    mounted() {
      this.getgData()
    },
    methods: {
      getgData() {
        let params = {};
        params.drugCode = this.$route.params.drugCode;
        this.$axios({
          url: this.api.dicPackageSelectOne,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            if (res.data){
              this.drugDetail = res.data;
            }
          } else {
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.error(err)
          })
      },
      //filter
      ruleType(value) {
        if (value == '1') {
          return '系统'
        } else if (value == '2') {
          return '自定义'
        }
      },
      typeType(value) {
        if (value == '1') {
          return '药品规则'
        } else if (value == '2') {
          return '分类规则'
        } else if (value == '3') {
          return '分组规则'
        } else if (value == '4') {
          return '通用规则'
        }
      },
      cancle(){
        this.$router.push({
          name: 'drugSpecIndex'
        })
      }
    }
  }
</script>

<style>
  .drugDetail .fontSize {
    font-size: 24px;

  }
  .drugDetail .font-bold{
    text-align: justify;
  }
  w2{
    letter-spacing:2em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-2）/(2-1)=2em */
    padding-right:-2em; /*同上*/
  }
  .w3{
    letter-spacing:0.5em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-3）/(3-1)=0.5em */
    padding-right:-0.5em; /*同上*/
  }
  .ant-divider-horizontal{
    margin: 18px 0;
  }

</style>