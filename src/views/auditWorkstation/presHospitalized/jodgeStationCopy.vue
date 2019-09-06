<template>
  <div>

      <div class="dealRight">
        <a-tabs defaultActiveKey="1" size="small" class="width-100">
          <a-tab-pane tab="预判情况" key="1">
            <!-- <span class="dealP">问题描述</span>
            <span v-for="ta in tagsData " style="float: right">
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
            </span> -->
            <!-- <span style="float: right">
              <a-tag
                class="checkTag tagStyle aTag1"
                v-if="checkedAll"
                style
                @click="handleChange"
              >全部</a-tag>
              <a-tag class="checkTag tagStyle aTag2" v-else @click="handleChange">全部</a-tag>
            </span> -->
            <a-card
              class="margin-top-10 antCard"
              @click="clickTagsCard(op)"
              v-for="(op,index) in rightData "
              v-if="op.status"
              :style="{'borderColor':op.borderColor}"
              :key="index"
            >
              <a-tag class="tagStyle" :color="op.levelColor">{{op.auditName }}</a-tag>
              <span :style="{fontWeight:'bold'}">{{op.auditClass}}</span>
              <span class="marLeft10">
                <i class="iconfont action action-yaopin1" style="color: #2eabff"/>
                {{op.drugName}}
              </span>
              <div :rows="3" :maxRows="4" read-only class="textArea">
                <a-tag>问题</a-tag>
                <span class="opacity8">{{op.auditDescription}}</span>
              </div>
              <div :rows="3" :maxRows="4" read-only>
                <a-tag>建议</a-tag>
                {{op.audSuggest}}
              </div>
            </a-card>

            <div class="margin-top-10">
              <p class="dealP margin-top-10" style="float: left">驳回意见：</p>
              <a-button type="primary" class="saveButton" size="small" @click="saveTemplate()">存为模板</a-button>
              <a-select
                class="saveButton"
                size="small"
                style="width: 150px"
                @change="selectTemp"
                v-model="problemType"
              >
                <a-select-option
                  :value="op.tabooId"
                  v-for="(op,index) in reviewTemplates"
                  :key="index"
                >{{op.tabooTitle}}</a-select-option>
              </a-select>
              <a-tooltip placement="top" :key="index" v-for="(tt,index) in templateTags">
                <template slot="title" style="width: 100px">{{tt.titles}}</template>
                <a-tag
                  class="problemTag saveButton"
                  v-if="index<7 && tt.bgColor == '#2eabff'"
                  :key="index"
                  @click="tagsClick(tt)"
                  color="#2eabff"
                >{{tt.updateTitles}}</a-tag>
                <a-tag
                  class="problemTag saveButton"
                  v-else-if="index<7"
                  :key="index"
                  @click="tagsClick(tt)"
                >{{tt.updateTitles}}</a-tag>
              </a-tooltip>
              <a-dropdown :trigger="['hover']">
                <a-menu slot="overlay">
                  <a-menu-item
                    v-for="(gd,index) in templateTags"
                    @click="tagsClick(gd)"
                    v-if="index>=7"
                    :key="index"
                  >{{gd.updateTitles}}</a-menu-item>
                </a-menu>
                <a v-if="templateTags.length>7" class="margin-left-5 saveButton">
                  更多
                  <a-icon type="down"/>
                </a>
                <a v-else></a>
              </a-dropdown>
              <a-textarea :rows="4" v-model="templateText" @change='onChangs'  @onblur='onBlur' class="texts"></a-textarea>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="干预记录" key="2">
            <a-timeline style="margin-top: 20px;margin-left: 10px">
              <a-timeline-item v-for="(rd,index) in recordList" class="timelineItem" :key="index">
                <a-icon
                  v-if="index+1 == recordList.length"
                  slot="dot"
                  type="clock-circle-o"
                  style="font-size: 16px;"
                />
                <p>
                  <a-tag>{{rd.eventPerson}}</a-tag>
                  {{rd.eventTime}}
                </p>
                <p>
                  <span class="font-bold">{{rd.event}}:</span>
                  <span>{{rd.eventText}}</span>
                </p>
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
        </a-tabs>
      </div>

     <a-modal
      title="另存为模板"
      :visible="Modal.visible"
      @ok="handleOk"
      @cancel="handleCancel"
      width="600px"
    >
      <a-form :form="form">
        <a-form-item label="分类" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-select
            v-decorator="[ 'tabooClass',  {rules: [{ required: true,message: '请选择分类'  }]}  ]"
            placeholder="请选择分类"
          >
            <a-select-option
              :value="op.tabooId"
              v-for="(op,index) in reviewTemplates"
              :key="index"
            >{{op.tabooTitle}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-select
            v-decorator="[ 'templetType',  {rules: [{ required: true,message: '请选择类型'  }]}  ]"
            placeholder="请选择类型"
          >
            <a-select-option
              :value="op.id"
              v-for="(op,index) in this.enum.templateType"
              :key="index"
            >{{op.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标题" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="[ 'titles',  {rules: [{ required: true,message: '请输入标题'  }]}  ]"></a-input>
        </a-form-item>
        <a-form-item label="内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-textarea
            v-decorator="[ 'reviewTemplate',  {rules: [{ required: true,message: '请输入内容'  }]}  ]"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
// import { selectOutDetail } from '@/api/login'
export default {
 props: {
    visData: {
      Object
    },
  },
  data() {
    return {
      api: {
        selectWithReviewId: '/sys/reviewTemplate/selectReviewTemplateWithReviewId',
        selectReviewTemplateDetail: 'sys/reviewTemplate/selectReviewTemplateDetail',
        reviewTemplateUpdate: 'sys/reviewTemplate/update',
        selectWithVisId: 'sys/reviewOrderissue/selectInterventionRecordWithVisId',
         DetailData: 'sys/reviewOrderissue/selectReviewOrderissueDetail'
        //reviewOrderissue/selectHospitalLeadVisIdAndLagVisId
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
      }
    }
  },
  mounted() {
    this.getDetailData()
    this.getRecord()
    this.getTemplate()
  },
  methods: {
    onChangs(e){
     console.log(e.target.value)
     this.$emit('adoptMessage',e.target.value)
    },
    onBlur(value){
console.log(value)
    },
    //右边预判情况基础数据
    getDetailData() {
      console.log('dddddd')
      let params = { visid: this.visData.visId, submitNo: this.visData.submitNo, clinicPrescNum: '',reviewResouce:2 }
      this.$axios({
        url: this.api.DetailData,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.leftData = res.data
            this.rightData =res.rows
            // this.tagsData = this.leftData.levelTotalsList
            // this.dealTagsData(this.tagsData)
            // this.deal(this.rightData)
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
      //data.push()
    },
    // 右边预判情况树形结构数据
    getTemplate() {
      let params = { visId:this.visData.visId }
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
      if (this.$util.trim(this.templateText) !=null) {
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
      this.$emit('upchange',this.templateText)
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
    getRecord() {
      let params = { visid:this.visData.visId }
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
<style>
.texts{
  margin-top: 10px;
}
</style>



