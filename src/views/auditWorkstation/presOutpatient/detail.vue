<template>
    <div class="detailPres">
        <a-spin tip="加载中..." :spinning="allLoading">
            <a-col :span="14">
                <a-card>
                    <a-row class="margin-top-10">
                        <span class="titleText">{{leftData.patientDeptName}}</span>
                        <span class="font-bold fontSize14 marLeft10">{{leftData.patientName}}</span>
                        &nbsp;&nbsp; {{leftData.patientSex |
                        control_type}}&nbsp;&nbsp;{{leftData.agevalue}}岁
                        <span
                            class="titleText margin-left-5"
                        >
                            <a-tag
                                v-if="leftData.gestationalWeeks"
                                class="tagStyle"
                                :color="'#DD4A68'"
                            >孕{{leftData.gestationalWeeks}}周</a-tag>
                            <a-tag
                                class="tagStyle"
                                :color="'#40a9ff'"
                                v-for=" (op,index) in this.phyStatelist"
                                :key="index"
                            >{{op}}</a-tag>
                        </span>
                        <span v-if="carePatient===true" class="guanzhu" :loading="loading">
                            <a-icon theme="filled" type="star" class="xingxing" />已关注
                        </span>
                    </a-row>
                    <a-divider type="horizontal" class="detailDivider" />
                    <a-row class="patientDetail">
                        <a-col span="4">
                            <span class='font-bold'>体重：</span>   
                            <span class="opacity8">{{leftData.weight}}Kg</span>
                        </a-col>
                        <a-col span="4">
                            <span class='font-bold'>身高：</span>   
                            <span class="opacity8">{{leftData.height}}Cm</span>
                        </a-col>
                        <a-col span="6">
                            <span class='font-bold'>体表面积：</span>   
                            <span class="opacity8">{{leftData.bSA}}㎡</span>
                        </a-col>
                        <a-col span="10">
                            <span class='font-bold'>就诊医生：</span>   
                            <span class="opacity8">
                                <span class="datetime">
                                    {{leftData.attendingDocName}}&nbsp;
                                    <a-icon type="message" />
                                    &nbsp;{{leftData.attendingDocPhone}}
                                </span>
                            </span>
                        </a-col>
                    </a-row>
                    <a-row class="patientDetail">
                        <span class='font-bold'>临床诊断：</span>   
                        <span class="opacity8">{{leftData.diseaseName}}</span>
                    </a-row>
                    <a-row class="patientDetail">
                        <span class='font-bold'>过敏史：</span>   
                        <span class="opacity8">{{leftData.irritabilityNames}}</span>
                    </a-row>
                </a-card>
                <a-card class="cardHeight">
                    <a-tabs defaultActiveKey="1" size="small" class="width-100">
                        <a-tab-pane tab="处方信息" key="1">
                            <div v-for=" (op,index) in leftData.clinicPrescVOList">
                                <a-card class="margin-top-10">
                                    <div v-if="op.auditingStatus == '1'" class="iconTobe"></div>
                                    <div v-if="op.auditingStatus == '2'" class="iconRefused"></div>
                                    <!--<img src="" alt="">-->
                                    <a-row>
                                        <a-col :span="6">
                                            处方号：
                                            <span class="font-bold">{{op.prescNum}}</span>
                                        </a-col>
                                        <a-col :span="6">
                                            开单科室：
                                            <span class="font-bold">{{op.deptName}}</span>
                                        </a-col>
                                        <a-col :span="6">
                                            开单医生：
                                            <span class="font-bold">{{op.prescDocName}}</span>
                                        </a-col>
                                        <a-col :span="6">
                                            时间：
                                            <span class="font-bold">{{dealtime(op.prescDate)}}</span>
                                        </a-col>
                                    </a-row>
                                    <a-row v-if="op.auditingStatus != 0">
                                        <a-col :span="6">
                                            审核状态：
                                            <span
                                                class="font-bold"
                                            >{{op.auditingStatus==1? '通过':'未通过'}}</span>
                                        </a-col>
                                        <a-col :span="6">
                                            审核人：
                                            <span class="font-bold">{{op.reviewDocName}}</span>
                                        </a-col>
                                        <a-col :span="9">
                                            审核时间：
                                            <span class="font-bold">{{dealtime(op.reviewTime)}}</span>
                                        </a-col>
                                    </a-row>
                                  <a-row v-if="op.reviewOpinion">
                                    <a-col>审核意见: <span class="font-bold">{{op.reviewOpinion}}</span> </a-col>
                                  </a-row>
                                    <a-row class="dealRow">
                                        <el-table
                                            class="margin-top-10 width-100"
                                            :data="op.prescVOList"
                                            ref="table"
                                            :row-style="tableRowStyle"
                                        >
                                            <el-table-column
                                                :prop="item.prop"
                                                :label="item.title"
                                                :key="index"
                                                v-for="(item,index) in columns"
                                                :width="item.width"
                                                :align="item.align"
                                                :formatter="item.formatter"
                                                :show-overflow-tooltip="true"
                                            >
                                                <template slot-scope="props">
                                                    <span
                                                        v-if="item.prop == 'name'"
                                                    >{{props.row.name}}&nbsp;&nbsp;{{props.row.spec}}</span>
                                                    <a
                                                        v-else-if="item.prop == 'drugName'"
                                                        @click="drugNameDetail(props.row)"
                                                        v-html="props.row.drugName"
                                                    ></a>
                                                    <span v-else>{{props.row[item.prop]}}</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </a-row>
                                </a-card>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane tab="检查报告" key="2">
                            <detailCheck visidId="1"></detailCheck>
                        </a-tab-pane>
                        <a-tab-pane key="3">
                            <span slot="tab">
                                <a-badge :count="quesNumTotal" :offset="[6,0]">检验报告</a-badge>
                            </span>
                            <DetailTest visidId="1" :setquesNumAll="setquesNumAll"></DetailTest>
                        </a-tab-pane>
                        <a-tab-pane tab="门诊病历" key="4"></a-tab-pane>
                    </a-tabs>
                </a-card>
            </a-col>
            <a-col :span="10" class="padding-left-5">
                <a-card class="cardRight">
                    <div class="dealRight">
                        <a-tabs defaultActiveKey="1" size="small" class="width-100">
                            <a-tab-pane tab="预判情况" key="1">
                                <div class="auditOpinion" v-if="opStatus">
                                    <p class="dealP" style="float: left">审核意见:</p>
                                    <a-button
                                        type="primary"
                                        class="saveButton"
                                        size="small"
                                        @click="saveTemplate()"
                                    >存为模板</a-button>
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
                                    <a-tooltip
                                        placement="top"
                                        :key="index"
                                        v-for="(tt,index) in templateTags"
                                    >
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
                                        <a
                                            v-if="templateTags.length>7"
                                            class="margin-left-5 saveButton"
                                        >
                                            更多
                                            <a-icon type="down" />
                                        </a>
                                        <a v-else></a>
                                    </a-dropdown>
                                </div>
                                <a-textarea :rows="4" maxlength="100" v-model="templateText" v-if="opStatus"></a-textarea>
                                <div class="margin-top-10">
                                    <span class="dealP">问题描述：</span>
                                    <span v-for="(ta,index) in tagsData " class="margin-left-5" :key=index>
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
                                        <a-tag
                                            class="checkTag tagStyle aTag1 margin-left-5"
                                            v-if="checkedAll"
                                            @click="handleChange"
                                        >全部</a-tag>
                                        <a-tag
                                            class="checkTag tagStyle aTag2 margin-left-5"
                                            v-else
                                            @click="handleChange"
                                        >全部</a-tag>
                                    </span>
                                    <a-checkbox style="float:right" @change="onChangeNormal">仅显示未审核</a-checkbox>
                                </div>
                                <a-card
                                    class="margin-top-10 antCard"
                                    @click="clickTagsCard(op)"
                                    v-for="(op,index) in rightData "
                                    v-if="op.status"
                                    :style="{'borderColor':op.borderColor}"
                                    :key="index"
                                >
                                    <a-tag class="tagStyle" :color="op.levelColor">{{op.auditName }}</a-tag>
                                    <span v-if="op.auditClass=='0' || !op.auditClass" :style="{fontWeight:'bold'}">其他分类</span>
                                    <span v-else :style="{fontWeight:'bold'}">{{op.auditClass}}</span>
                                    <span class="marLeft10">
                                        <i
                                            class="iconfont action action-yaopin1"
                                            style="color: #2eabff"
                                        />
                                        {{op.drugName}}
                                    </span>
                                    <div :rows="3" :maxRows="4" class="textArea">
                                        <a-tag>问题</a-tag>
                                        <span class="opacity8">{{op.auditDescription}}</span>
                                    </div>
                                    <div :rows="3" :maxRows="4" class="textArea">
                                        <a-tag>描述</a-tag>
                                        <span class="opacity8">{{op.audSuggest}}</span>
                                    </div>
                                    <div class="subscript" v-if="op.reviewStatus == 1">已审核</div>
                                </a-card>
                            </a-tab-pane>
                            <a-tab-pane tab="干预记录" key="2">
                                <a-timeline style="margin-top: 20px;margin-left: 10px">
                                    <a-timeline-item
                                        v-for="(rd,index) in recordList"
                                        class="timelineItem"
                                        :key="index"
                                    >
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
                </a-card>
            </a-col>
        </a-spin>
        <a-modal
            title="另存为模板"
            :visible="Modal.visible"
            @ok="handleOk"
            @cancel="handleCancel"
            width="600px"
            :maskClosable="false"
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
                    <a-input
                        v-decorator="[ 'titles',  {rules: [{ required: true,message: '请输入标题'  }]}  ]"
                    ></a-input>
                </a-form-item>
                <a-form-item label="内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
                    <a-textarea
                        v-decorator="[ 'reviewTemplate',  {rules: [{ required: true,message: '请输入内容'  }]}  ]"
                    ></a-textarea>
                </a-form-item>
            </a-form>
        </a-modal>

        <a-modal
            title="版本对比"
            :visible="versionModal.visible"
            :footer="null"
            @cancel="versionCancel"
            width="900px"
        >
            <!-- <versionComp :propData="routerData"></versionComp> -->
            <versionCompBeta  :propData="routerData"></versionCompBeta>
        </a-modal>
        <footer-tool-bar
            :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
        >
            <template slot="back">
                <a-button
                    v-if="carePatient"
                    @click="attention"
                    class="margin-left-5"
                    :loading="loading"
                >
                    <a-icon type="star" theme="filled" />取消关注
                </a-button>
                <a-button v-else @click="attention" class="margin-left-5" :loading="loading">
                    <a-icon type="star" />关注患者
                </a-button>
                <a-button
                    @click="versionComp"
                    :disabled="leftData.subNo>1? false:true"
                    class="margin-left-5"
                    :loading="loading"
                >
                    <i type="star" class="iconfont action action-tubiaozhizuomoban-" />
                    <span class="margin-left-5">版本对比</span>
                </a-button>
                <a-button
                    @click="slePatients(previousData)"
                    :disabled="previousData.visId==0? true:false"
                    class="margin-left-5"
                    :loading="loading"
                    v-if="auditStatus"
                >上一患者</a-button>
                <a-button
                    @click="slePatients(nextPerson)"
                    :disabled="nextPerson.visId==0? true:false"
                    class="margin-left-5"
                    :loading="loading"
                    v-if="auditStatus"
                >下一患者</a-button>
            </template>
            <a-button
                @click="cancel"
                v-if="routerData.isNew == 1"
                class="margin-left-5"
                :loading="loading"
            >返回</a-button>
            <a-button
                @click="refuse"
                style="margin-left: 5px"
                :loading="loading"
                v-if="opStatus"
            >驳回</a-button>
            <a-button
                type="primary"
                class="margin-left-5"
                @click="submit"
                :loading="loading"
                v-if="opStatus"
            >通过</a-button>
        </footer-tool-bar>
    </div>
</template>

<script>
import { selectOutDetail } from '@/api/login'
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import versionComp from '../component/version-comparison'
import versionCompBeta from '../component/version-comparison/versionCompBeta'
import detailCheck from '../presHospitalized/detailCheck.vue'
import DetailTest from '../presHospitalized/detailTest.vue'
import { mapActions } from 'vuex'
import { fail } from 'assert'

const DetailListItem = DetailList.Item
export default {
    components: {
        DetailList,
        DetailListItem,
        FooterToolBar,
        versionComp,
        versionCompBeta,
        detailCheck,
        DetailTest
    },
    mixins: [mixin, mixinDevice],
    name: 'detail',
    data() {
        return {
            api: {
                updateReviewStatus: '/sys/reviewOrderissue/updateReviewOrderissueAndIssuerecodeStatus',
                selectWithReviewId: '/sys/reviewTemplate/selectReviewTemplateWithReviewId',
                selectVisId: '/sys/reviewOrderissue/selectInterventionRecordWithVisId',
                selectReviewTemplateDetail: 'sys/reviewTemplate/selectReviewTemplateDetail',
                selectWithVisId: 'sys/reviewOrderissue/selectInterventionRecordWithVisId',
                reviewTemplateUpdate: 'sys/reviewTemplate/update',
                concernedRecord: 'sys/concernedPatient/selectCurrentRecord',
                concernedPatientUpdate: 'sys/concernedPatient/update',
                turnAudit: 'sys/reviewOrderissue/selectLeadVisIdAndLagVisId',
                //reviewOrderissue/selectLeadVisIdAndLagVisId
                selectTestVisId: 'sys/reviewOrderissue/selectClinicTestListByVisId'
            },
            Modal: {
                visible: false
            },
            versionModal: {
                visible: false
            },
            form: this.$form.createForm(this),
            loading: false,
            allLoading: false,
            tags: [],
            templateTitle: '',
            templateText: '',
            problemType: '',
            leftData: {},
            rightData: [],
            tagsData: [],
            reviewTemplates: [],
            templateTags: [],
            recordList: [],
            carePatient: false,
            columns: [
                { title: '序号', prop: 'seqNum', width: 50, align: 'right' },
                { title: '', prop: 'mark', width: 20, align: 'left' },
                { title: '药品', prop: 'drugName' },
                { title: '规格', prop: 'spec', width: 100 },
                { title: '单量', prop: 'dosageStr', width: 80 },
                { title: '总量', prop: 'amountStr', width: 60 },
                { title: '频次', prop: 'frequency', align: 'center', width: 90 },
                { title: '用法', prop: 'useType', width: 100 }
            ],
            problemId: '122',
            checkedAll: true,
            prescOrderId: '',
            levelColor: '',
            visId: null,
            routerData: {},
            phyStatelist: [],
            auditStatus: false,
            previousData: {
                visId: null,
                maxSubmitNo: null
            },
            nextPerson: {
                visId: null,
                maxSubmitNo: null
            },
            quesNumTotal: 0,
            opStatus:true,
        }
    },
    mounted() {
        this.getDetailData()
        this.getTemplate()
        this.getRecord()
        this.getAttention()
        if ( this.routerData.isNew == 1) {
          this.auditStatus = true
            this.getLeadAndLag()
        } else {
            this.auditStatus = false
        }
        this.setquesNumAll()
    },
    methods: {
        ...mapActions('page', ['closeTag']),
        getDetailData() {
            this.visId =  JSON.parse(window.localStorage.getItem('outpatientData')).visId
            this.routerData = JSON.parse(window.localStorage.getItem('outpatientData'))
            this.routerData.reviewResouce = 1;
            this.allLoading = false
            selectOutDetail(this.routerData)
                .then(res => {
                    if (res.code == '200') {
                        this.allLoading = false
                        this.leftData = res.data
                        this.rightData = this.leftData.reviewOrderissueVOList
                        this.tagsData = this.leftData.levelTotalsList
                        this.dealTagsData(this.tagsData)
                        this.deal(this.rightData)
                        if (res.data.physiologicalState) {
                            this.phyStatelist = res.data.physiologicalState.split(',')
                        }
                        this.rightData.forEach((item, index) => {
                            if (item.reviewStatus == '0') {
                                // this.auditStatus = true;
                                this.opStatus = true;
                            }else{
                              // this.auditStatus = false;
                              this.opStatus = false;
                              return
                            }
                        })
                    } else {
                        this.allLoading = false
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.allLoading = false
                    this.error(err)
                })
        },
        // 配置状态状态控制显示
        dealTagsData(data) {
            for (let key in data) {
                data[key].status = true
            }
        },
        deal(data) {
            if (data) {
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
                data.push()
            }
        },
        submit() {
            let params = {}
            params.auditType = '1'
            params.passType = '1'
            if (this.templateText) {
                params.reviewOpinion = this.templateText
            } else {
                params.reviewOpinion = '通过'
            }
            params.reviewVerdict = '1'
            params.reviewIds = []
            let listData = this.leftData.clinicPrescVOList
            for (let key in listData) {
                if (listData[key].auditingStatus == '0') {
                    params.reviewIds.push(listData[key].reviewId)
                }
            }
            this.$axios({
                url: this.api.updateReviewStatus,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.success(res.msg)
                        this.getDetailData()
                        this.getTemplate()
                        this.getRecord()
                        this.getAttention()
                        if (  this.routerData.isNew == 1) {
                          this.auditStatus = true
                            this.getLeadAndLag()
                        } else {
                            this.auditStatus = false
                        }
                      this.$forceUpdate();
                    } else {
                        this.warn(res.msg)
                    }
                    this.setquesNumAll()
                })
                .catch(err => {
                    this.error(err)
                })
        },
        refuse() {
            let params = {}
            params.auditType = '1'
            // params.passType = "1";
            if ($.trim(this.templateText).length>0) {
                params.reviewOpinion = this.templateText
            } else {
                params.reviewOpinion = '驳回'
            }
            params.reviewVerdict = '2'
            params.reviewIds = []
            let listData = this.leftData.clinicPrescVOList
            for (let key in listData) {
                if (listData[key].auditingStatus == '0') {
                    params.reviewIds.push(listData[key].reviewId)
                }
            }
            this.$axios({
                url: this.api.updateReviewStatus,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.success(res.msg)
                        this.getDetailData()
                        this.getTemplate()
                        this.getRecord()
                        this.getAttention()
                        if ( this.routerData.isNew == 1) {
                          this.auditStatus = true
                            this.getLeadAndLag()
                        } else {
                            this.auditStatus = false
                        }
                      this.$forceUpdate();
                    } else {
                        this.warn(res.msg)
                    }
                    this.setquesNumAll()
                })
                .catch(err => {
                    this.error(err)
                })
        },
        tagsClick(pd) {
            // var event = window.event || arguments.callee.caller.arguments[0]
            // if (event.stopPropagation) {
            //   event.stopPropagation()      //阻止事件 冒泡传播
            // } else {
            //   event.cancelBubble = true   //ie兼容
            // }
            let list = this.templateTags
            for (let i in list) {
                if (list[i].id == pd.id) {
                    list[i].bgColor = '#2eabff'
                } else {
                    list[i].bgColor = '#d9d9d9'
                }
            }
            this.templateText = pd.reviewTemplate
            this.templateTitle = pd.titles
            this.rightData.push()
        },
        tableRowStyle({ row, rowIndex }) {
            if (this.prescOrderId == row.clinicPrescId) {
                return { background: 'rgb(' + this.convertHexToRGB(this.levelColor).join(',') + ',0.3)' }
            }
        },
        convertHexToRGB(str) {
            str = str[0] === '#' ? str.slice(1) : str
            str = str.length === 3 ? str.repeat(2) : str
            if (str.length !== 6 || !/^[0-9a-fA-F]{3,6}$/i.test(str)) return 'Invalid data'
            return [parseInt(str[0] + str[1], 16), parseInt(str[2] + str[3], 16), parseInt(str[4] + str[5], 16)]
        },
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
        clickTagsCard(data) {
            this.problemType = data.auditClassNum
            this.getTemplateDetail()
            for (let key in this.rightData) {
                if (this.rightData[key].problemId == data.problemId) {
                    this.rightData[key].borderColor = '#1890ff'
                } else {
                    this.rightData[key].borderColor = '#d9d9d9'
                }
            }
            this.prescOrderId = data.prescOrderId
            this.levelColor = data.levelColor
            this.rightData.push()
        },
        getTemplate() {
            this.$axios({
                url: this.api.selectWithReviewId,
                method: 'put',
                data:  this.routerData
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
        selectTemp(data) {
            this.problemType = data
            this.getTemplateDetail()
        },
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
        //存为模板
        saveTemplate() {
            if ($.trim(this.templateText).length > 0) {
                setTimeout(() => {
                    this.form.setFieldsValue({
                        titles: this.templateTitle,
                        reviewTemplate: this.templateText,
                        templetType: '1'
                    })
                }, 100)
                this.Modal.visible = true
            } else {
                this.warn('请输入审核意见')
            }
        },
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
        handleCancel() {
            this.Modal.visible = false
        },

        //获取记录
        getRecord() {
            this.$axios({
                url: this.api.selectWithVisId,
                method: 'put',
                data:  this.routerData
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
        },
        //开始对比
        versionComp() {
            this.versionModal.visible = true
        },
        //版本对比确认
        versionCancel() {
            this.versionModal.visible = false
        },
        //获取关注患者信息
        getAttention() {
            this.$axios({
                url: this.api.concernedRecord,
                method: 'post',
                data:  this.routerData
            })
                .then(res => {
                    if (res.code == '200') {
                        this.carePatient = res.data
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        //关注患者
        attention() {
            let params = {}
            params.visId = this.leftData.visId
            params.patientId = this.leftData.patientId
            this.$axios({
                url: this.api.concernedPatientUpdate,
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        if (this.carePatient) {
                            this.carePatient = false
                            this.success('取消关注')
                        } else {
                            this.carePatient = true
                            this.success('关注成功')
                        }
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        // 时间格式处理
        dealtime(time) {
            if (time) {
                return time.slice(0, time.lastIndexOf(':'))
            }
        },
        // 更换患者
        slePatients(data) {
          console.log(data,'dag')
            window.localStorage.removeItem('outpatientData')
            window.localStorage.setItem('outpatientData',JSON.stringify({visId:data.visId,submitNo: data.maxSubmitNo,isNew:1}))
            this.getDetailData()
            this.getTemplate()
            this.getRecord()
            this.getAttention()
            if (this.routerData.isNew == 1) {
              this.auditStatus = true
                this.getLeadAndLag()
            } else {
                this.auditStatus = false
            }
            this.setquesNumAll()
        },

        getLeadAndLag() {
            let params = {}
            params.visId = this.visId
            params.maxSubmitNo = this.routerData.submitNo
            this.$axios({
                url: this.api.turnAudit,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        if (res.data) {
                            this.previousData.visId = res.data.lagVisId
                            this.previousData.maxSubmitNo = res.data.lagsubmitno
                            this.nextPerson.visId = res.data.leadVisId
                            this.nextPerson.maxSubmitNo = res.data.leadsubmitno
                        }
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },

        cancel() {
            this.closeTag({
                tagName: 'presOutpatientDetail',
                aimName: 'presOutpatientIndex',
                vm: this
            })
            // this.$router.push({
            //   name: 'presOutpatientIndex'
            // })
        },
        drugNameDetail(data) {
            this.$router.push({
                name: 'drugSpecDetail',
                params: { drugCode: data.drugId }
            })
        },
        //显示异常
        onChangeNormal(e) {
            let data = this.rightData
            if (e.target.checked) {
                for (let key in data) {
                    if (data[key].reviewStatus == '0') {
                        data[key].status = true
                    } else {
                        data[key].status = false
                    }
                }
            } else {
                for (let key in data) {
                    data[key].status = true
                }
            }
            this.rightData.push()
        },
        //获取检验报告异常
        setquesNumAll() {
            this.quesNumTotal = 0;
            this.$axios({
                url: this.api.selectTestVisId,
                method: 'put',
                data: { visid: 1 }
            })
                .then(res => {
                    if (res.code == '200') {
                        for (let key in res.rows) {
                            this.quesNumTotal += Number(res.rows[key].quesNum)
                        }
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        }
    },
    filters: {
        control_type(value) {
            if (value == '2') {
                return '女'
            } else if (value == '1') {
                return '男'
            } else {
                return '未知'
            }
        }
    },

    watch: {
        //监听相同路由下参数变化的时候，从而实现异步刷新
        $route(to, from) {
            //做一些路由变化的响应
            //打开加载动画
            //重新获取数据
            this.getDetailData()
            this.getTemplate()
            this.getRecord()
            this.getAttention()
            if ( this.routerData.isNew == 1) {
              this.auditStatus = true
                this.getLeadAndLag()
            } else {
                this.auditStatus = false
            }
            this.setquesNumAll()
        }
    },
    // beforeDestroy(){
    //        window.localStorage.removeItem('outpatientData')
    // }
}
</script>

<style scoped lang='less'>
.detailPres {
    .ant-card-body {
        padding: 14px 32px;
    }
    .ant-col-xxl-6 {
        display: block;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 33%;
    }
}
.fontSize14 {
    font-size: 18px;
    line-height: 18px;
}

.titleText {
    font-size: 18px;
    font-weight: bold;
    line-height: 18px;
}

.detailDivider {
    margin-bottom: 30px;
    margin-top: 20px;
}
.patientDetail {
    font-size: 14px;
    line-height: 30px;
}

.hiddenOpacity {
    max-width: 460px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.textArea {
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3; /*限制在一个块元素显示的文本的行数*/
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
    /*text-indent: 2em*/
}

.tagStyle {
    font-size: 12px;
    /*margin-left: 7px;*/
    margin-bottom: 5px;
}

.aTag1 {
    background: #2eabff;
    color: #fff;
}

.aTag2 {
    background: #fff;
    color: #2eabff;
}

.saveButton {
    margin-left: 10px;
    float: left;
}

.problemTag {
    font-size: 12px;
    margin-left: 7px;
    margin-bottom: 5px;
}

.cardHeight {
    min-height: 450px;
    margin-top: 5px;
}

.cardHeight .iconTobe {
    width: 183px;
    height: 96px;
    z-index: 3;
    background-image: url('~@/assets/pass.png');
    background-repeat: no-repeat;
    /*background-size: 50% 50%;*/
    position: absolute;
    right: 16%;
    top: 15%;
    opacity: 0.8;
    /*background-repeat:no-repeat;*/
}

.cardHeight .iconRefused {
    width: 183px;
    height: 96px;
    z-index: 3;
    background-image: url('~@/assets/refused.png');
    background-repeat: no-repeat;
    /*background-size: 50% 50%;*/
    position: absolute;
    right: 16%;
    top: 15%;
    opacity: 0.8;
}

.cardRight {
    min-height: 700px;
}
.cardRight .auditOpinion {
        min-height: 54px;
    }

.cardHeight .cardColHeight {
    min-height: 450px;
}

.dealP {
    font-size: 14px;
    font-weight: bold;
}

.dealRow {
    font-size: 14px;
}

.dealRow .dealCol {
    line-height: 25px;
    margin-left: 20px;
}

.dealRow .sizeWeight {
    font-size: 16px;
    font-weight: bold;
}

/*.dealRight .selectInput {*/
/*line-height: 30px;*/
/*}*/

.timelineItem p {
    margin-bottom: 5px;
}

.timelineItem p:nth-child(n + 2) {
    opacity: 0.8;
}

.checkTag {
    border: 1px #d9d9d9 solid;
}

.antCard {
    cursor: pointer;
}

.guanzhu {
    background-color: #0c60ee;
    height: 26px;
    width: 80px;
    display: block;
    border-radius: 5px;
    color: white;
    line-height: 26px;
    text-align: center;
    float: right;
    font-weight: bold;
    i {
        font-size: 20px;
        margin-right: 5px;
    }
}

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
.detilNowrap {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>