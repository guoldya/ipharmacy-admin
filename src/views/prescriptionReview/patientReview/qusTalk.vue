<template>
  <div>
    <span class="dealP">问题描述</span>
    <span v-for="ta in tagsData ">
      <a-tag
        v-if="ta.status == true"
        class="checkTag tagStyle"
        :style="{'background':ta.levelColor, 'color':'#fff'}"
        @click="checkableChange(ta)"
      >{{ta.auditName }}</a-tag>
      <a-tag
        v-else-if="ta.status == false"
        class="checkTag tagStyle"
        :style="{'background':'#fff', 'color':ta.levelColor}"
        @click="checkableChange(ta)"
      >{{ta.auditName }}</a-tag>
    </span>
    <span>
      <a-tag class="checkTag tagStyle aTag1" v-if="checkedAll" @click="handleChange">全部</a-tag>
      <a-tag class="checkTag tagStyle aTag2" v-else @click="handleChange">全部</a-tag>
    </span>
    <a-card
      class="margin-top-10 antCard"
      v-for="(op,index) in rightData "
        v-if="op.status"
      :style="{'borderColor':op.borderColor}"
      :key="index"
    >
      <a-tag class="tagStyle" :color="op.levelColor">{{op.auditName }}</a-tag>
      <span :style="{fontWeight:'bold'}">{{op.auditClass}}</span>
      <span class="marLeft10">
        <i class="iconfont action action-yaopin1" style="color: #2eabff" />
        {{op.drugName}}
      </span>
      <div :rows="3" :maxRows="4" read-only class="textArea">
        <a-tag>问题</a-tag>
        <span class="opacity8">{{op.auditDescription}}</span>
      </div>
      <div :rows="3" :maxRows="4" read-only>
        <a-tag>描述</a-tag>
        {{op.audSuggest}}
      </div>
      <!-- <div class="subscript" v-if="op.reviewStatus == 1">已审核</div> -->
    </a-card>
  </div>
</template>
<script>
export default {
  props: {
    visidId: {
      type: String
    },
    submitNos: {
      type: String
    }
  },
  // watch: {
  //   visidId: function() {
  //     this.getDetailData({ visId: this.visidId, submitNo: this.submitNos, reviewResouce: 2 })
  //   }
  // },

  data() {
    return {
      api: {
        selectWithReviewId: '/sys/reviewTemplate/selectReviewTemplateWithReviewId',
        selectReviewTemplateDetail: 'sys/reviewTemplate/selectReviewTemplateDetail',
        reviewTemplateUpdate: 'sys/reviewTemplate/update',
        selectWithVisId: 'sys/reviewOrderissue/selectInterventionRecordWithVisId',
        // baseData: 'sys/reviewOrderissue/selectReviewOrderissueDetail',
        selectOutDetail: 'sys/reviewOrderissue/selectOrderissueListMaxSubmitNoByVisIdAndPrescNum'
      },
      loading: false,
      templateText: '',
      tagsData: [],
      rightData: [],
      reviewTemplates: [],
      checkedAll: true,
      recordList: [],
      templateTags: [],
      problemType: '',
      form: this.$form.createForm(this),
      Modal: {
        visible: false
      },
      auditStatus: true,
      baseDatas: [],
      prescOrderId: ''
    }
  },
  mounted() {
    let arr=[]
  if(this.$store.state.prescNumStr){
     arr=this.$store.state.prescNumStr.split(',')
  }
    this.getDetailData({
      visId: this.visidId,
      prescNumList:arr,
      planScope: JSON.parse(sessionStorage.getItem('patinRew')).planScope
    })
    // this.getRecord({ visId: this.visidId, submitNo: this.submitNos })
    // this.getTemplate({ visId: this.visidId, submitNo: this.submitNos })
  },
  methods: {
    // 传值给父组件
    onChangs(e) {
      this.$emit('adoptMessage', e.target.value)
    },
    // 左右互动
    clickTagsCard(data) {
      for (let key in this.rightData) {
        if (this.rightData[key].problemId == data.problemId) {
          this.rightData[key].borderColor = '#1890ff'
        } else {
          this.rightData[key].borderColor = '#d9d9d9'
        }
      }
      this.prescOrderId = data.prescOrderId
      this.$emit('listStatus', data)
      this.$store.state.faData = data
      this.levelColor = data.levelColor
      this.rightData.push()
    },
    // 渲染颜色
    //  tableRowStyle({ row, rowIndex }) {
    //   if (this.prescOrderId == row.clinicPrescId) {
    //     return { background: 'rgb(' + this.convertHexToRGB(this.levelColor).join(',') + ',0.3)' }
    //   }
    // },
    // 基础数据
    basedata(params = {}) {
      params.reviewResouce = 2
      this.$axios({
        url: this.api.baseData,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //右边预判情况基础数据
    getDetailData(params = {}) {
      this.$axios({
        url: this.api.selectOutDetail,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            if (res.data) {
              console.log('ttt')
              this.leftData = res.data
              this.rightData = this.leftData.reviewOrderissueVOList
              this.tagsData = this.leftData.levelTotalsList
              this.dealTagsData(this.tagsData)
              this.deal(this.rightData)
              // this.$emit('listStatus', 'ddddd')
              // this.leftData.clinicPrescVOList.forEach((item, index) => {
              //   if (item.auditingStatus !== '1') {
              //     this.auditStatus = false
              //   }
              // })
              this.$emit('saveStatus', this.auditStatus)
            }
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 配置状态状态控制显示
    dealTagsData(data) {
      for (let key in data) {
        data[key].status = true
      }
    },
    // 数据处理
    deal(data) {
      for (let key in data) {
        data[key].status = true
        data[key].borderColor = '#d9d9d9'
        let list = data[key].reviewTemplateList
        for (let i in list) {
          list[i].bgColor = '#d9d9d9'
          if (list[i].titles.length > 5) {
            list[i].updateTitles = list[i].titles.substr(0, 5) + '...'
          } else {
            list[i].updateTitles = list[i].titles
          }
        }
      }
    },
    // 右边预判情况树形结构数据
    getTemplate(params = {}) {
      this.$axios({
        url: this.api.selectWithReviewId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.reviewTemplates = res.rows
            if (this.reviewTemplates.length > 0) {
              this.problemType = this.reviewTemplates[0].tabooId
              this.getTemplateDetail()
            }
            this.reviewTemplates.push({ tabooId: '-1', tabooTitle: '----通用----' })
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 选择树形结构再次获取具体数据；
    getTemplateDetail() {
      let params = {}
      params.tabooClass = this.problemType
      this.$axios({
        url: this.api.selectReviewTemplateDetail,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.templateTags = res.rows
            this.dealTemplateTags(this.templateTags)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //选择结构的事件过程
    selectTemp(data) {
      this.problemType = data
      this.getTemplateDetail()
    },
    // 数据的拼接
    dealTemplateTags(data) {
      for (let i in data) {
        data[i].bgColor = '#d9d9d9'
        if (data[i].titles.length > 5) {
          data[i].updateTitles = data[i].titles.substr(0, 5) + '...'
        } else {
          data[i].updateTitles = data[i].titles
        }
      }
    },
    //button点击事件模板的存储；
    saveTemplate() {
      if (this.$util.trim(this.templateText) ==null) {
        setTimeout(() => {
          this.form.setFieldsValue({ titles: this.templateTitle, reviewTemplate: this.templateText, templetType: '1' })
        }, 100)
        this.Modal.visible = true
      } else {
        this.warn('请输入审核意见')
      }
    },
    //  点击
    tagsClick(pd) {
      let list = this.templateTags
      for (let i in list) {
        if (list[i].id == pd.id) {
          list[i].bgColor = '#2eabff'
        } else {
          list[i].bgColor = '#d9d9d9'
        }
      }
      this.templateText = pd.reviewTemplate
      this.$emit('upchange', this.templateText)
      this.templateTitle = pd.titles
      this.rightData.push()
    },
    //模板的提交
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios({
            url: this.api.reviewTemplateUpdate,
            method: 'post',
            data: values
          })
            .then(res => {
              if (res.code == '200') {
                this.success(res.msg)
                this.getTemplateDetail()
                this.Modal.visible = false
              } else {
                this.warn(res.msg)
              }
            })
            .catch(err => {
              this.error(err)
            })
        }
      })
    },
    // 模板取消编辑
    handleCancel() {
      this.Modal.visible = false
    },
    // 筛选等级，匹配下面的数据；
    checkableChange(data) {
      for (let key in this.rightData) {
        if (this.rightData[key].auditLevel == data.auditLevel) {
          this.checkedAll = false
          this.rightData[key].status = true
        } else {
          this.rightData[key].status = false
        }
      }
      for (let key in this.tagsData) {
        if (data.auditLevel == this.tagsData[key].auditLevel) {
          this.tagsData[key].status = true
        } else {
          this.tagsData[key].status = false
        }
      }
      this.rightData.push()
    },
    // 刷新筛选等级
    handleChange(checked) {
      let data = this.rightData
      for (let key in data) {
        data[key].status = true
      }
      for (let key in this.tagsData) {
        this.tagsData[key].status = true
      }
      this.checkedAll = true
    },
    // 右边干预记录
    getRecord(params = {}) {
      this.$axios({
        url: this.api.selectWithVisId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.recordList = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    }
  }
}
</script>
<style scoped lang='less'>
.dealRight {
  .ant-card {
    position: relative;
    overflow: hidden;
  }
  .subscript {
    color: white;
    height: 30px;
    width: 100px;
    position: absolute;
    right: -25px;
    top: 9px;
    text-align: center;
    line-height: 30px;
    /* font-family: ""; */
    background-color: #8a8a8a;
    -moz-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
}
</style>

    

