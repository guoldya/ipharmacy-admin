<template>
    <div>
        <a-row :gutter="12">
            <a-col :span="16">
                <a-card :bodyStyle="{padding:'12px 16px'}">
                    <Searchpanel ref="searchPanel" :list="list" :col="12">
                        <div slot="control">
                            <a-button type="primary" @click="search">查询</a-button>
                            <a-button class="margin-left-5" @click="resetForm">重置</a-button>
                        </div>
                    </Searchpanel>
                    <a-spin tip="加载中..." :spinning="spinning">
                        <el-table
                                class="margin-top-10"
                                :data="dataSource"
                                border
                                style="width: 100%"
                                highlight-current-row
                        >
                            <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="80"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <a @click="edit(scope.row)" v-if="scope.row.status === '0'">对码</a>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :show-overflow-tooltip="true"
                                    :prop="item.prop"
                                    :label="item.title"
                                    :key="index"
                                    v-for="(item,index) in columns"
                                    :width="item.width"
                                    :align="item.align"
                            >
                                <template slot-scope="scope">
                                    <span v-if="item.prop == 'status'">
                                        <a-badge :status="scope.row.status == 0? 'default':'processing'"
                                                 :text="scope.row.status ==0?'未对码':'已对码'"/>
                                    </span>
                                    <span v-else>
                                        {{scope.row[item.prop]}}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <a-pagination
                                :total="total"
                                showSizeChanger
                                v-model="current"
                                class="pnstyle"
                                :defaultPageSize="20"
                                :pageSizeOptions="['20', '50','100']"
                                @showSizeChange="sizeChange"
                                @change="pageChange"
                                size="small"
                        >
                        </a-pagination>
                    </a-spin>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card :bodyStyle="{padding:'12px 10px'}">
                    <a-button type="primary" :disabled="disabled" @click="submit" @loading="loading">保存</a-button>
                    <table class="table_dm margin-top-10">
                        <tr>
                            <td class="table_dm_th width_100"></td>
                            <td class="table_dm_th width_200">医院药品</td>
                            <td class="table_dm_th width_200">知识库药品</td>
                        </tr>
                        <tr>
                            <td class="table_dm_td text_bold width_100">药品编码</td>
                            <td class="table_dm_td text_center width_200">
                                <div class="table_dm_td_text">{{NData.drugCode}}</div></td>
                            <td class="table_dm_td text_center width_200">
                                <div class="table_dm_td_text">{{MData.drugCode}}</div></td>
                        </tr>
                        <tr>
                            <td class="table_dm_td text_bold width_100">药品名称</td>
                            <td class="table_dm_td text_center width_200" :title="NData.drugName">
                                <div class="table_dm_td_text">{{NData.drugName}}</div></td>
                            <td class="table_dm_td text_center width_200" :title="MData.drugName">
                                <div class="table_dm_td_text">{{MData.drugName}}</div></td>
                        </tr>
                        <tr>
                            <td class="table_dm_td text_bold width_100">药品剂型</td>
                            <td class="table_dm_td text_center width_200">
                                <div class="table_dm_td_text">{{NData.dosageForms}}</div></td>
                            <td class="table_dm_td text_center width_200">
                                <div class="table_dm_td_text">{{MData.dosageForms}}</div></td>
                        </tr>
                        <tr>
                            <td class="table_dm_td text_bold width_100">药品规格</td>
                            <td class="table_dm_td text_center width_200">
                                <div class="table_dm_td_text">{{NData.spec}}</div></td>
                            <td class="table_dm_td text_center width_200">
                                <div class="table_dm_td_text">{{MData.spec}}</div></td>
                        </tr>
                        <tr>
                            <td class="table_dm_td text_bold">剂量单位</td>
                            <td class="table_dm_td text_center width_200">
                                <div class="table_dm_td_text">{{NData.doseUnit}}</div></td>
                            <td class="table_dm_td text_center width_200">
                                <div class="table_dm_td_text">{{MData.doseUnit}}</div></td>
                        </tr>
                        <tr>
                            <td class="table_dm_td text_bold width_100">生产厂商</td>
                            <td class="table_dm_td text_center width_200" :title="NData.producedBy">
                                <div class="table_dm_td_text">{{NData.producedBy}}</div></td>
                            <td class="table_dm_td text_center width_200" :title="MData.producedBy">
                                <div class="table_dm_td_text">{{MData.producedBy}}</div></td>
                        </tr>
                        <tr>
                            <td class="table_dm_td text_bold width_100">批准文号</td>
                            <td class="table_dm_td text_center width_200">
                                <div class="table_dm_td_text">{{NData.approvalNumber}}</div></td>
                            <td class="table_dm_td text_center width_200">
                                <div class="table_dm_td_text">{{MData.approvalNumber}}</div></td>
                        </tr>
                        <tr>
                            <td class="table_dm_td text_bold width_100">剂量系数</td>
                            <td class="table_dm_td text_center width_200">
                                N：
                                <a-input-number
                                        :min="1"
                                        @change="nchange"
                                        v-model="N"
                                />
                            </td>
                            <td class="table_dm_td text_center width_200">
                                M：
                                <a-input-number

                                        :min="1"
                                        @change="mchange"
                                        v-model="M"
                                />
                            </td>
                        </tr>
                    </table>
                </a-card>
                <a-card class="margin-top-10" title="相似药品" :bodyStyle="{padding:'12px 16px'}">
                    <a-spin tip="加载中..." :spinning="similarSpin">
                        <el-table
                                class="margin-top-10"
                                :data="similarData"
                                border
                                highlight-current-row
                                @current-change="currentChange"
                                style="width: 100%"
                        >
                            <el-table-column
                                    :show-overflow-tooltip="true"
                                    :prop="item.prop"
                                    :label="item.title"
                                    :key="index"
                                    v-for="(item,index) in similarColumns"
                                    :width="item.width"
                                    :align="item.align"
                            >
                            </el-table-column>
                        </el-table>
                        <a-pagination
                                :total="similarTotal"
                                showSizeChanger
                                v-model="similarCurrent"
                                class="pnstyle"
                                :defaultPageSize="10"
                                :pageSizeOptions="['10', '20','50']"
                                @showSizeChange="similarSizeChange"
                                @change="similarPageChange"
                                size="small"
                        >
                        </a-pagination>
                    </a-spin>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                spinning:false,
                dataSource:[],
                columns:[
                    { title: '药品编码', prop: 'drugCode',width:80 },
                    { title: '药品名称', prop: 'drugName' },
                    { title: '剂型', prop: 'dosageForms' },
                    { title: '规格', prop: 'spec' },
                    { title: '厂商', prop: 'producedBy' },
                    { title: '剂量单位', prop: 'doseUnit',width:80,align:'center' },
                    { title: '批准文号', prop: 'approvalNumber' },
                    { title: '对码状态', prop: 'status',width:80,align:'center' },
                ],
                total:0,
                current:1,
                selectData:{},
                disabled:true,
                M:1,
                N:1,
                api:{
                    hisDrugDataUrl:'/biz/hisDrug/selectPage',
                    similarDrugDataUrl:'/biz/hisDrug/selectSimilarDrugPage',
                    mapUrl:''
                },
                NData:{},
                MData:{},
                similarSpin:false,
                similarData:[],
                similarColumns:[
                    { title: '药品编码', prop: 'drugCode',width:80 },
                    { title: '药品名称', prop: 'drugName' },
                    { title: '剂型', prop: 'dosageForms' },
                    { title: '剂量单位', prop: 'doseUnit',width:80,align:'center' },
                    { title: '厂商', prop: 'producedBy' },
                ],
                similarTotal:0,
                similarCurrent:1,
                similarSelectData:{},
                loading:false
            }
        },
        computed: {
            list() {
                return [
                    { name: '药品名称', dataField: 'code', type: 'text' }
                ]
            }
        },
        mounted() {
            this.getData();
        },
        methods:{
            search() {
                let params = this.$refs.searchPanel.form.getFieldsValue();
                this.getData(params)
            },
            resetForm() {
                this.$refs.searchPanel.form.resetFields()
                this.getData()
            },
            pageChange(page, size) {
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.offset = (page - 1) * size;
                this.getData(params)
            },
            sizeChange(current, size) {
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.pageSize = size;
                this.getData(params)
            },
            similarPageChange(page, size) {
                let params = {};
                params.drugName = this.selectData.drugName;
                params.producedBy = this.selectData.producedBy;
                params.offset = (page - 1) * size;
            },
            similarSizeChange(current, size) {
                this.current = 1;
                let params = {};
                params.drugName = this.selectData.drugName;
                params.producedBy = this.selectData.producedBy;
                params.pageSize = size;
            },
            edit(row){
                this.NData = row;
                this.MData = {};
                this.getSimilarData({
                    drugName:row.drugName,
                    producedBy:row.producedBy
                })
            },
            nchange(val){
                if(val>1){
                    this.M = 1
                }
            },
            mchange(val){
                if(val>1){
                    this.N = 1
                }
            },
            currentChange(row){
                if(row){
                    this.MData = row;
                    this.disabled = false
                }else{
                    this.NData = {};
                    this.disabled = true
                }
            },
            submit(){
                this.loading = true;
                let params = {};

                this.$axios({
                    url: this.api.mapUrl,
                    method: 'put',
                    data: params
                }).then(res => {
                    if (res.code == '200') {
                        this.success('对码成功',()=>{
                            this.NData = {};
                            this.MData = {};
                            this.similarData = [];
                            this.getData();
                            this.loading = false;
                        })

                    } else {
                        this.loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.spinning = false;
                    this.error(err);
                })
            },
            getData(obj = {}) {
                this.spinning = true;
                let params = obj;
                params.pageSize = obj.pageSize || 20;
                params.offset = obj.offset || 0;
                this.$axios({
                    url: this.api.hisDrugDataUrl,
                    method: 'put',
                    data: params
                }).then(res => {
                    if (res.code == '200') {
                        this.dataSource = res.rows;
                        this.total = res.total;
                        this.spinning = false;
                    } else {
                        this.spinning = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.spinning = false;
                    this.error(err);
                })
            },
            getSimilarData(obj = {}) {
                this.similarSpin = true;
                let params = obj;
                params.pageSize = obj.pageSize || 10;
                params.offset = obj.offset || 0;
                this.$axios({
                    url: this.api.similarDrugDataUrl,
                    method: 'put',
                    data: params
                }).then(res => {
                    if (res.code == '200') {
                        this.similarData = res.rows;
                        this.similarTotal = res.total;
                        this.similarSpin = false;
                    } else {
                        this.similarSpin = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.similarSpin = false;
                    this.error(err);
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .table_dm {
        border: solid #8ba0bc;
        border-width: 1px 0px 0px 1px;
        font-size: 14px;
    }

    .table_dm_td {
        border: solid #8ba0bc;
        /*border: solid #cfddee;*/
        border-width: 0px 1px 1px 0px;
        text-align: right;
        padding: 5px;
        .table_dm_td_text{
            width:200px;
            text-overflow:ellipsis;
            overflow:hidden;
            white-space:nowrap;
        }
    }
    .width_100{
        width:100px
    }
    .width_200{
        width:200px
    }

    .table_dm_th {
        border: solid #8ba0bc;
        border-width: 0px 1px 1px 0px;
        padding: 0px;
        text-align: center;
        line-height: 25px;
        font-weight: bold;
        background: #e4effa;
    }

    .table_dm_tdh {
        /*font-weight:bold;*/
    }
    .bg_color{
        background-color: #e8eaec;
    }
    .text_center{
        text-align: center;
    }
    .text_bold{
        font-weight: bold;
    }
</style>