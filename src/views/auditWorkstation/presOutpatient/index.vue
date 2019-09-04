<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list" :choose="choose">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-row>
                <a-col :span="10" style="padding-top: 15px">
                    <a-popconfirm
                        v-if="buttonType == 'danger'"
                        title="确定停止审方?"
                        @confirm="buttonClick"
                        okText="确定"
                        cancelText="取消"
                    >
                        <a-button class="margin-left-5" :type="buttonType">{{buttonText}}</a-button>
                    </a-popconfirm>
                    <a-button
                        v-else
                        class="margin-left-5"
                        @click="buttonClick"
                        :type="buttonType"
                    >{{buttonText}}</a-button>
                    <a-button class="margin-left-5" @click="pass" :disabled="disable">批量通过</a-button>
                    <a-popconfirm title="确定批量驳回?" placement="topLeft" @confirm="rejected">
                        <a-button class="margin-left-5" :disabled="disable">批量驳回</a-button>
                    </a-popconfirm>
                  <a-select
                    v-if="disable"
                    style="width: 120px"
                    class="margin-left-5 readOnlyInput"
                    placeholder="刷新频率"
                    @change="rateChange"
                    :disabled="true"
                    defaultValue="10秒"
                  >
                    <a-select-option
                      :value="op.id"
                      v-for="(op,index) in this.enum.refreshRate"
                      :key="index"
                    >{{op.text}}</a-select-option>
                  </a-select>
                    <a-select
                      v-else
                        style="width: 120px"
                        class="margin-left-5"
                        placeholder="刷新频率"
                        @change="rateChange"
                        defaultValue="10秒"
                    >
                        <a-select-option
                            :value="op.id"
                            v-for="(op,index) in this.enum.refreshRate"
                            :key="index"
                        >{{op.text}}</a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="14" class="countCol">
                    <countText :countList="countText"></countText>
                </a-col>
            </a-row>

            <a-spin tip="加载中..." :spinning="loading">
                <el-table
                    ref="multipleTable"
                    class="multipleEl"
                    :data="dataSource"
                    border
                    style="width: 100%"
                    @select="selectBox"
                    @select-all="selectAll"
                >
                    <!--多选框checkbox-->
                    <el-table-column
                        type="selection"
                        width="55"
                        align="center"
                        :show-overflow-tooltip="true"
                    ></el-table-column>
                    <!--状态列-->
                    <!--处方、处方数、患者列-->
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
                            <span v-if="item.prop == 'submitName'">
                                <!-- <a href="">{{props.row[item.prop]}}&nbsp;<a-icon type="message"/></a> -->
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>{{props.row.submitDocPhone}}</span>
                                    </template>
                                    <a href>
                                        {{props.row[item.prop]}}&nbsp;
                                        <a-icon type="message" />
                                    </a>
                                </a-tooltip>
                            </span>
                            <span v-else-if="item.prop == 'orderNo'">
                                <a-popover
                                    placement="topLeft"
                                    @click="mouseHover(props.row)"
                                    trigger="click"
                                >
                                    <template slot="content">
                                        <prescriptionTabs :tabsData="tabsData"></prescriptionTabs>
                                    </template>
                                    <a-tag color="#1694fb">{{props.row.orderNo}}</a-tag>
                                </a-popover>
                            </span>
                            <span v-else-if="item.prop == 'updateTime'">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>{{props.row.updateTime}}</span>
                                    </template>
                                    <span>{{timeFormat(props.row.updateTime)}}</span>
                                </a-tooltip>
                            </span>
                            <span v-else>{{props.row[item.prop]}}</span>
                        </template>
                    </el-table-column>
                    <!--问题tags列-->
                    <el-table-column prop="problem" label="问题" min-width="400">
                        <template slot-scope="props">
                            <a-row
                                v-for="(op,index) in props.row.orderissueVOS"
                                class="problemRow"
                                :key="index"
                            >
                                <a-col :span="2">
                                    <a-tag
                                        :color="op.levelColor"
                                        style="cursor: default;"
                                    >{{op.auditName }}</a-tag>
                                </a-col>
                                <a-col :span="22">
                                    <a-tooltip placement="top" :key="index">
                                        <template slot="title" style="width: 300px">
                                          <span v-if="op.auditClass=='0' || !op.auditClass">
                                            其他分类：{{op.auditDescription}}
                                          </span>
                                          <span v-else>
                                              {{op.auditClass}}：{{op.auditDescription}}
                                          </span>
                                            <br />
                                            描述：{{op.auditSuggest}}
                                        </template>
                                        <div class="multiLineText">
                                            <span class="auditClass" v-if="op.auditClass=='0' || !op.auditClass">其他分类：</span>
                                          <span class="auditClass" v-else>{{op.auditClass}}：</span>
                                            {{op.auditDescription}}
                                            <span
                                                class="auditClass"
                                            >描述：</span>
                                            {{op.auditSuggest}}
                                        </div>
                                    </a-tooltip>
                                </a-col>
                                <a-divider
                                    v-if="index<props.row.orderissueVOS.length-1"
                                    type="horizontal"
                                />
                            </a-row>
                        </template>
                    </el-table-column>
                    <el-table-column prop="action" label="操作" width="140" align="center">
                        <template slot-scope="props">
                            <a @click="looks(props.row)">查看</a>
                            <a-divider type="vertical" />
                            <a-popconfirm
                                title="确定通过?"
                                @confirm="passSingle(props.row)"
                                okText="通过"
                                cancelText="取消"
                            >
                                <a href="javascript:;">通过</a>
                            </a-popconfirm>
                            <a-divider type="vertical" />
                            <a @click="rejectedSingle(props)">驳回</a>
                        </template>
                    </el-table-column>
                </el-table>
                <a-pagination
                    showSizeChanger
                    showQuickJumper
                    :total="total"
                    class="pnstyle"
                    v-model="current"
                    :pageSize="pageSize"
                    :pageSizeOptions="['10', '20','50']"
                    @showSizeChange="clientSizeChange"
                    @change="customerPageChange"
                    size="small"
                ></a-pagination>
            </a-spin>
            <a-modal
                title="驳回理由"
                :visible="Modal.visible"
                @ok="handleOk"
                :confirmLoading="Modal.confirmLoading"
                @cancel="handleCancel"
                width="600px"
                class="modals"
                :maskClosable="false"
            >
                <a-tabs defaultActiveKey="1" size="small" style="width: 550px">
                    <a-tab-pane tab="预判情况" key="1" class="tabPaneLeft">
                        <span class="dealP margin-top-10">问题描述</span>
                        <a-card
                            class="margin-top-10 antCard"
                            v-for="(op,index) in tagsDetailData"
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
                            <div class="subscript" v-if="Number(op.status)===1">已审核</div>
                        </a-card>
                        <div class="margin-top-10">
                            <p class="dealP margin-top-10" style="float: left">审核意见：</p>
                            <a-popconfirm
                                title="确定存为模板?"
                                @confirm="saveTemplate()"
                                okText="确定"
                                cancelText="取消"
                            >
                                <a-button type="primary" class="saveButton" size="small">存为模板</a-button>
                            </a-popconfirm>
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
                                    v-if="index<5 && tt.bgColor == '#2eabff'"
                                    :key="index"
                                    @click="tagsClick(tt)"
                                    color="#2eabff"
                                >{{tt.updateTitles}}</a-tag>
                                <a-tag
                                    class="problemTag saveButton"
                                    v-else-if="index<5"
                                    :key="index"
                                    @click="tagsClick(tt)"
                                >{{tt.updateTitles}}</a-tag>
                            </a-tooltip>
                            <a-dropdown :trigger="['hover']">
                                <a-menu slot="overlay">
                                    <a-menu-item
                                        v-for="(gd,index) in templateTags"
                                        @click="tagsClick(gd)"
                                        v-if="index>=5"
                                        :key="index"
                                    >{{gd.updateTitles}}</a-menu-item>
                                </a-menu>
                                <a v-if="templateTags.length>5" class="margin-left-5 saveButton">
                                    更多
                                    <a-icon type="down" />
                                </a>
                                <a v-else></a>
                            </a-dropdown>
                            <a-textarea :rows="4" v-model="templateText" maxlength="100"></a-textarea>
                        </div>
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
            </a-modal>
        </a-card>
    </div>
</template>
<script>
import countText from '../component/count-text'
import prescriptionTabs from '../component/prescription-tabs'
import { setTimeout } from 'timers'

export default {
    components: {
        countText,
        prescriptionTabs
    },
    data() {
        return {
            api: {
                updateReviewStatus: '/sys/reviewOrderissue/updateReviewOrderissueAndIssuerecodeStatus',
                selectWithReviewId: '/sys/reviewTemplate/selectReviewTemplateWithReviewId',
                selectReviewTemplateDetail: 'sys/reviewTemplate/selectReviewTemplateDetail',
                reviewTemplateUpdate: 'sys/reviewTemplate/update',
                selectTribunalRecordNum: 'sys/reviewOrderissue/selectTribunalRecordNum',
                reviewUpdateStatus: 'sys/reviewPlanorder/updateStatus',
                selectTreeData: 'sys/sysDepts/selectDeptsTreeListNotByOrgId',
                selectWithVisId: 'sys/reviewOrderissue/selectInterventionRecordWithVisId',
                selectOrderDetail: 'sys/reviewOrderissue/selectReviewOrderissueDetail',
                updateReviewList: 'sys/reviewOrderissue/updateReviewOrderissueList',
                selectPlanInPlanCount: 'sys/reviewPlanorder/selectUsingPlanInPlanorderCount',
                orgUrl: '/sys/sysOrgs/selectList',
              selectTribunalRecord:'/sys/reviewOrderissue/selectTribunalRecord',
            },
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 }
            },

            //页头数据
            countText: [],
            //按钮初始化
            buttonText: '开始审方',
            buttonType: 'primary',
            disable: true,
            //初始化多选项
            selections: [],
            //table数据加载
            loading: false,
            dataSource: [],
            columns: [
                { title: '处方号', prop: 'orderNo', width: 100, align: 'center' },
                { title: '处方时间', prop: 'submitTime', width: 140 },
                { title: '机构', prop: 'orgTitle', width: 140 },
              { title: '开单科室', prop: 'deptName', width: 110 },
                { title: '开单医生', prop: 'submitName', width: 90 },
                { title: '门诊号', prop: 'admitNum', width: 120 },
                { title: '患者', prop: 'pname', width: 80 },
                { title: '性别', prop: 'sex', width: 50, align: 'center' },
                { title: '年龄', prop: 'age', width: 60 }
            ],
            //页码初始化
            total: 0,
            current: 1,
            pageSize:10,
            //已分配科室
            dis: false,
            Modal: {
                visible: false,
                confirmLoading: false
            },
            form: this.$form.createForm(this),
            //处方单tabsData
            tabsData: {},
            problemsData: [],
            rateTime: 10000000000,

            problemType: '',
            reviewTemplates: [],
            //初始化定时器
            timeInitialize: null,
            templateTags: [],
            templateText: '',
            tempRowData: {},
            treeDatas: [],
            recordList: [],
            tagsData: [],
            tagsDetailData: [],
            checkedAll: true,
            iconSpin: true,
            openTrialTime: null,
            pageChangeFilter: {},
            orgData: [],
        }
    },
    computed: {
      choose() {
        return { isshow: false, isextend: true }
      },
        list() {
            return [
              { name: '机构', dataField: 'orgId', type: 'tree-select', keyExpr: 'keyword', treeData: this.orgData,onSelect:this.selectTree},
              {
                name: '开单科室',
                dataField: 'admitDept',
                type: 'tree-select',
                keyExpr: 'keyword',
                treeData: this.treeDatas,
              },
              { name: '开单医生', dataField: 'submitName', type: 'text' },
                {
                    name: '患者',
                    dataField: 'pname',
                    type: 'text'
                },
            ]
        }
    },
    mounted() {
        //获取后台数据

        // 获取科室数据
        this.getOpenTrial()
      this.getOrgData()
        this.openTrialTime = setInterval(() => {
            this.getOpenTrial()
        }, 15000)
        setTimeout(() => {
            if (this.iconSpin) {
              let data = this.pageChangeFilter;
              data.pageSize = this.pageSize;
              data.offset = (this.current-1)*this.pageSize
                this.fetchYJSMapData(data)
                this.getCountText()
                this.setTimeRval(10000)
            }
        }, 500)
    },
    destroyed(){
       this.openTrialTime=null
    },
    methods: {
        //判断是否已经开启审方
        getOpenTrial() {
            this.$axios({
                url: this.api.selectPlanInPlanCount,
                method: 'put',
                data: { planScope: 1 }
            })
                .then(res => {
                    if (res.code == '200') {
                        if (res.data == 1) {
                            this.buttonText = '停止审方'
                            this.buttonType = 'danger'
                            this.disable = false
                            this.iconSpin = true
                        } else if (res.data == 0) {
                            this.buttonText = '开始审方'
                            this.buttonType = 'primary'
                            this.disable = true
                            this.iconSpin = false
                            clearInterval(this.timeInitialize)
                        }
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        //获取干预记录数据
        getRecords(params = {}) {
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
        },
        // 科室树形结构
        getTreeseldata(params = {}) {
            this.$axios({
                url: this.api.selectTreeData,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.treeDatas = this.getDataChildren(res.rows, undefined)
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },

      getOrgData(obj = {}) {
        this.$axios({
          url: this.api.orgUrl,
          method: 'put',
          data: obj
        })
          .then(res => {
            if (res.code == '200') {
              this.orgData = this.getOrgTreeData(res.rows, undefined)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      getOrgTreeData(data, pid) {
        let tree = []
        data.forEach(item => {
          let row = item
          row.key = item.orgId
          row.value = item.orgId
          if (pid == item.parentId) {
            row.children = this.getOrgTreeData(data, item.orgId)
            tree.push(row)
          }
        })
        return tree
      },

      selectTree(value){
          console.log(value,'value');
        this.getTreeseldata({orgId:value})
      },
        //搜索
        search() {
            let params = this.$refs.searchPanel.form.getFieldsValue()
            this.pageChangeFilter = this.$refs.searchPanel.form.getFieldsValue()
            params.pageSize = this.pageSize
            params.offset = 0
            if (this.buttonText != '开始审方') {
                this.fetchYJSMapData(params)
            }
        },
        //重置
        resetForm() {
          this.pageSize = 10;
            this.pageChangeFilter = {}
            this.$refs.searchPanel.form.resetFields()
            if (this.buttonText != '开始审方') {
                this.fetchYJSMapData({ pageSize: 10, offset: 0 })
            }
        },

        //翻页事件
        customerPageChange(page, pageSize) {
            let params = this.pageChangeFilter
            params.pageSize = pageSize
            params.offset = (page - 1) * pageSize
            if (this.buttonText != '开始审方') {
                this.fetchYJSMapData(params)
            }
        },
        //更改一页多少数据
        clientSizeChange(current, size) {
            this.current = 1
            this.pageSize = size;
            let params = this.pageChangeFilter
            params.pageSize = size
            params.offset = 0
            if (this.buttonText != '开始审方') {
                this.fetchYJSMapData(params)
            }
        },
        //获取数据
        fetchYJSMapData(params = {}) {
            this.loading = true
            this.$axios({
              url:this.api.selectTribunalRecord,
              method:'put',
              data:params,
            })
                .then(res => {
                    if (res.code == '200') {
                        this.dataSource = this.$dateFormat(res.rows, ['submitTime'])
                        this.total = res.total
                        this.loading = false
                    } else {
                        this.loading = false
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.error(err)
                })
        },
        getCountText() {
            let params = { reviewResouce: 1 }
            this.$axios({
                url: this.api.selectTribunalRecordNum,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.countText = res.rows
                        for (let key in this.countText) {
                            if (this.countText[key].item == '待审核') {
                                this.countText[key].colors = '#32c5d2'
                            } else if (this.countText[key].item == '驳回待确认') {
                                this.countText[key].colors = '#f3c200'
                            } else if (this.countText[key].item == '已通过') {
                                this.countText[key].colors = '#3598dc'
                            } else if (this.countText[key].item == '已驳回') {
                                this.countText[key].colors = '#E6A23C'
                            }
                        }
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        //多选框点击事件
        selectBox(selection, row) {
            //点击后获取这条数据
            this.selections = selection
          console.log(this.selections,'222')
        },
        //全选
        selectAll(selection) {
            this.selections = selection;
            console.log(this.selections,'222')
        },

        //开始审方
        buttonClick() {
            let _this = this
            if (this.buttonText == '开始审方') {
                this.buttonText = '停止审方'
                this.buttonType = 'danger'
                this.disable = false
                let params = { status: '1', planScope: 1, planType: 1 }
                this.$axios({
                    url: this.api.reviewUpdateStatus,
                    method: 'post',
                    data: params
                })
                    .then(res => {
                        if (res.code == '200') {
                            setTimeout(() => {
                                this.fetchYJSMapData()
                                this.getCountText()
                            }, 1000)
                            this.setTimeRval(10000)
                        } else {
                            this.warn(res.msg)
                        }
                    })
                    .catch(err => {
                        this.error(err)
                    })
            } else {
                let params = { status: '0', planScope: 1, planType: 1 }
                this.$axios({
                    url: this.api.reviewUpdateStatus,
                    method: 'post',
                    data: params
                })
                    .then(res => {
                        if (res.code == '200') {
                            clearInterval(_this.timeInitialize)
                            this.buttonText = '开始审方'
                            this.buttonType = 'primary'
                            this.disable = true
                            this.total = null
                            if (res.data > 0) {
                                this.$confirm({
                                    title: '批量通过或者批量驳回！',
                                    okText: '批量通过',
                                    cancelText: '批量驳回',
                                    onOk() {
                                        _this
                                            .$axios({
                                                url: _this.api.updateReviewList,
                                                method: 'put',
                                                data: { reviewVerdict: 1, planScope: 1 }
                                            })
                                            .then(res => {
                                                if (res.code == '200') {
                                                  _this.countText = []
                                                  _this.dataSource = []
                                                    _this.success('批量通过成功');
                                                  _this.getCountText()
                                                } else {
                                                    _this.warn(res.msg)
                                                }
                                            })
                                            .catch(err => {
                                                _this.error(err)
                                            })
                                    },
                                    onCancel() {
                                        _this
                                            .$axios({
                                                url: _this.api.updateReviewList,
                                                method: 'put',
                                                data: { reviewVerdict: 2, planScope: 1 }
                                            })
                                            .then(res => {
                                                if (res.code == '200') {
                                                  _this.countText = []
                                                  _this.dataSource = []
                                                  _this.success('批量驳回成功');
                                                  _this.getCountText()
                                                } else {
                                                    _this.warn(res.msg)
                                                }
                                            })
                                            .catch(err => {
                                                _this.error(err)
                                            })
                                    }
                                })
                            } else {
                                this.success('停止成功！')
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
        //批量通过
        pass() {
            let params = {}
            let reviewIds = []
            if (this.$util.trim(this.selections) == null) {
                this.warn('请选择处方')
                return
            } else {
                for (let key in this.selections) {
                    reviewIds[key] = this.selections[key].reviewId
                }
                params.auditType = '1'
                params.passType = '1'
                params.reviewOpinion = '批量通过'
                params.reviewVerdict = '1'
                params.reviewIds = reviewIds
                this.$axios({
                    url: this.api.updateReviewStatus,
                    method: 'put',
                    data: params
                })
                    .then(res => {
                        if (res.code == '200') {
                          this.success(res.msg)
                            let data = this.pageChangeFilter;
                          data.pageSize = this.pageSize;
                          data.offset = (this.current-1)*this.pageSize
                            this.fetchYJSMapData(data)
                            this.getCountText()
                        } else {
                            this.warn(res.msg)
                        }
                    })
                    .catch(err => {
                        this.error(err)
                    })
            }
        },
        //批量驳回
        rejected() {
            let params = {}
            let reviewIds = []
            if (this.$util.trim(this.selections) ==null) {
                this.warn('请选择处方')
                return
            } else {
                for (let key in this.selections) {
                    reviewIds[key] = this.selections[key].reviewId
                }
                params.auditType = '1'
                params.passType = '1'
                params.reviewOpinion = '批量驳回'
                params.reviewVerdict = '2'
                params.reviewIds = reviewIds
                this.$axios({
                    url: this.api.updateReviewStatus,
                    method: 'put',
                    data: params
                })
                    .then(res => {
                        if (res.code == '200') {
                          this.success(res.msg)
                          let data = this.pageChangeFilter;
                          data.pageSize = this.pageSize;
                          data.offset = (this.current-1)*this.pageSize
                            this.fetchYJSMapData(data)
                            this.getCountText()

                        } else {
                            this.warn(res.msg)
                        }
                    })
                    .catch(err => {
                        this.error(err)
                    })
            }
        },
        //单个通过
        passSingle(data) {
            let params = {}
            params.auditType = '1'
            params.passType = '1'
            params.reviewOpinion = '通过'
            params.reviewVerdict = '1'
            params.reviewIds = []
            params.reviewIds[0] = data.reviewId
            this.$axios({
                url: this.api.updateReviewStatus,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.success(res.msg)
                      let data = this.pageChangeFilter;
                      data.pageSize = this.pageSize;
                      data.offset = (this.current-1)*this.pageSize
                        this.fetchYJSMapData(data)
                        this.getCountText()
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        //单个驳回
        rejectedSingle(data) {
            this.Modal.visible = true
            this.tempRowData = data.row
            this.problemsData = data.row.orderissueVOS
            this.getRecords({ visId: data.row.visId })
            this.getTemplate(data)
            this.getSelectOrderDetail(data)
        },
        //驳回问题详情
        getSelectOrderDetail(data) {
            let params = {}
            params.visId = data.row.visId
            params.submitNo = data.row.maxSubmitNo
            params.clinicPrescNum = data.row.orderNo
            params.reviewResouce =1;
            this.$axios({
                url: this.api.selectOrderDetail,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.tagsDetailData = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        handleChange() {
            for (let key in this.tagsData) {
                this.tagsData[key].status = true
            }
            this.checkedAll = true
        },
        checkableChange(data) {
            for (let key in this.tagsData) {
                if (data.auditLevel == this.tagsData[key].auditLevel) {
                    this.tagsData[key].status = true
                } else {
                    this.tagsData[key].status = false
                }
            }
            this.tagsData.push()
        },
        getTemplate(data) {
            let params = {}
            params.visId = data.row.visId
            params.prescOrderNo = data.row.orderNo
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
        getTemplateDetail(data) {
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
            if (this.$util.trim(this.templateText) == null) {
                this.warn('请输入审核意见')
                return
            } else {
                let params = {}
                params.contents = this.templateText
                params.tabooClass = this.problemType
                params.templetType = '1'
                params.titles = this.templateText.slice(0, 10)
                this.$axios({
                    url: this.api.reviewTemplateUpdate,
                    method: 'post',
                    data: params
                })
                    .then(res => {
                        if (res.code == '200') {
                            this.success(res.msg)
                        } else {
                            this.warn(res.msg)
                        }
                    })
                    .catch(err => {
                        this.error(err)
                    })
            }
        },
        selectTemp(data) {
            this.problemType = data
            this.getTemplateDetail()
        },
        tagsClick(data) {
            let list = this.templateTags
            for (let i in list) {
                if (list[i].id == data.id) {
                    list[i].bgColor = '#2eabff'
                } else {
                    list[i].bgColor = '#d9d9d9'
                }
            }
            this.templateText = data.reviewTemplate
        },
        //弹窗提交 单个驳回
        handleOk() {
            this.problemsData
            let params = {}
            params.auditType = '1'
            params.passType = '1'
          if(this.$util.trim(this.templateText)){
            params.reviewOpinion = this.templateText
          }else{
            params.reviewOpinion = '驳回'
          }
            params.reviewVerdict = '2'
            params.reviewIds = []
            params.reviewIds[0] = this.tempRowData.reviewId
            this.$axios({
                url: this.api.updateReviewStatus,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.success(res.msg)
                        this.Modal.visible = false
                      let data = this.pageChangeFilter;
                      data.pageSize = this.pageSize;
                      data.offset = (this.current-1)*this.pageSize
                        this.fetchYJSMapData(data)
                        this.getCountText()
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        //弹窗取消
        handleCancel() {
            this.Modal.visible = false
        },

        //查看
        looks(data) {
            let objData = {}
            objData = { visId: data.visId, submitNo: data.maxSubmitNo, isNew: 1 }
            window.localStorage.setItem('outpatientData', JSON.stringify(objData))
            this.$router.push({
                name: 'presOutpatientDetail'
            })
        },
        //TODO:处方单数据暂未处理
        mouseHover(data) {
            if (data.diseaseName) {
                this.tabsData.diagnose = data.diseaseName
            }
            if (data.ptype) {
                this.tabsData.costType = data.ptype
            }
            this.tabsData.clinicPrescNum = data.orderNo
            this.tabsData.maxSubmitNo = data.maxSubmitNo
            this.tabsData.visId = data.visId
        },

        getDataChildren(bdata, pid) {
            var items = []
            for (var key in bdata) {
                var item = bdata[key]
                if (pid == item.parentId) {
                    items.push({
                        title: item.title,
                        value: item.deptId,
                        key: item.deptId,
                        children: this.getDataChildren(bdata, item.deptId)
                    })
                }
            }
            return items
        },

        //频率事件
        rateChange(value) {
            clearInterval(this.timeInitialize)
            if (value == 0) {
            } else {
                this.rateTime = value
                this.setTimeRval(this.rateTime)
            }
        },
        //定时器
        setTimeRval(data) {
            this.timeInitialize = setInterval(() => {
              let data = this.pageChangeFilter;
              data.pageSize = this.pageSize;
              data.offset = (this.current-1)*this.pageSize
                this.fetchYJSMapData(data)
                this.getCountText()
              this.selections = [];
            }, data)
        }
    },

    beforeDestroy() {
        if (this.timeInitialize) {
            clearInterval(this.timeInitialize)
        }
        if (this.openTrialTime) {
            clearInterval(this.openTrialTime)
        }
    }
}
</script>
<style scoped>
.divInfo span {
    margin-left: 10px;
}

/*自定义图标样式*/
.myIcon {
    font-size: 22px;
    font-weight: bold;
    padding-top: 40px;
}

/*网格样式*/
.multipleEl {
    margin-top: 10px;
}
.auditClass {
    font-weight: bold;
    color: #000000;
    opacity: 0.9;
}

.multipleEl .has-gutter tr th:nth-child(11) {
    border-right: 0px;
}

.problemRow {
    line-height: 30px;
}

.problemRow .ant-divider-horizontal {
    margin: 0 0;
}

.multipleEl .multiLineText {
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1; /*限制在一个块元素显示的文本的行数*/
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 100%;
    /*text-indent:2em;*/
}

.modals .ant-form-item {
    margin-bottom: 5px;
}

.modals .ant-modal-body {
    padding: 20px 24px;
}

.modals .ant-form-item-control {
    line-height: 30px;
}

.modals .ant-form-item-label {
    line-height: 30px;
}

.modals .ant-tabs-bar {
    margin: 0 0 0px 0;
}

.modals .ant-card-body {
    padding: 10px 21px;
}

.modals .ant-timeline {
    margin-top: 20px;
}

.modals .selectInput {
    line-height: 24px;
    font-size: 14px;
    width: 100%;
}
.countCol{
    margin-top: 10px;
}
.countCol .countStyle {
    margin-top: 0px !important;
}
.countCol .countFor {
    margin-bottom: 0px !important;
}
.saveButton {
    margin-top: 10px;
    margin-left: 10px;
    float: left;
}

.problemTag {
    font-size: 12px;
    margin-left: 7px;
    margin-bottom: 5px;
}
.timelineItem p {
    margin-bottom: 5px;
}

.timelineItem p:nth-child(n + 2) {
    opacity: 0.8;
}

.radioStyle {
    display: block;
    height: 30px;
    line-height: 30px;
}
.tagStyle {
    font-size: 12px;
    /*margin-left: 7px;*/
    margin-bottom: 5px;
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
.dealP {
    font-size: 14px;
    font-weight: bold;
    margin-top: 10px;
}
.icons-list {
    margin-right: 6px;
    font-size: 18px;
}
</style>