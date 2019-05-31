<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button class="margin-left-5" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" @click="addUser">新增用户</a-button>
            <a-spin tip="加载中..." :spinning="spinning">
                <el-table
                        class="margin-top-10"
                        :data="dataSource"
                        border
                        style="width: 100%"
                >
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="120"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <a @click="edit(scope.row)">编辑</a>
                            <a-divider type="vertical"/>
                            <a-popconfirm title="确认删除吗?" @confirm="delRow(scope.row)">
                            <a class="delColor">删除</a>
                            </a-popconfirm>
                            <a-divider type="vertical"/>
                            <a v-if="scope.row.status == '0'" @click="changeStatus(scope.row,true)">启用</a>
                            <a v-else @click="changeStatus(scope.row,false)">停用</a>
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
                                     :text="scope.row.status ==0?'停用':'启用'"/>
                        </span>
                            <span v-else-if="item.prop == 'sex'">
                            <a-badge :status="scope.row.sex == 1? 'default':'processing'"
                                     :text="scope.row.sex ==1?'男':'女'"/>
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
                        :defaultPageSize="10"
                        :pageSizeOptions="['10', '20','50']"
                        @showSizeChange="sizeChange"
                        @change="pageChange"
                        size="small"
                >
                </a-pagination>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                api:{
                    userUrl:''
                },
                spinning:false,
                dataSource:[],
                columns: [
                    { title: '人员编号', prop: 'code', width: 100 },
                    { title: '机构', prop: 'orgName' },
                    { title: '姓名', prop: 'name' },
                    { title: '性别', prop: 'sex', align: 'center', width: 100 },
                    { title: '职称', prop: 'titles', width: 100 },
                    { title: '电话', prop: 'phone', width: 100 },
                    { title: '身份证', prop: 'idCard', width: 100 },
                    { title: '电子邮箱', prop: 'email', width: 100 },
                    { title: '出生日期', prop: 'birthday', width: 100 },
                    { title: '创建日期', prop: 'createDate', width: 150 },
                    { title: '更新日期', prop: 'upgateDate', width: 150 },
                    { title: '状态', prop: 'status', align: 'center', width: 100 }
                ],
                total:0,
                current:1
            }
        },
        computed: {
            list() {
                return [
                    {
                        name: '姓名',
                        dataField: 'name',
                        type: 'text'
                    },
                    {
                        name: '机构代码',
                        dataField: 'orgCode',
                        type: 'text'
                    },
                    {
                        name: '机构类型',
                        dataField: 'orgType',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'text',
                        dataSource: this.enum.orgType
                    },
                    {
                        name: '医院分类',
                        dataField: 'orgClass',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'name',
                        dataSource: this.enumList['33']
                    },
                    {
                        name: '医院等级',
                        dataField: 'orgGrade',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'name',
                        dataSource: this.enumList['34']
                    }
                ]
            }
        },
        mounted(){

        },
        methods:{
            search() {
                let params = this.$refs.searchPanel.form.getFieldsValue();
                this.getData(params)
            },
            //重置
            resetForm() {
                this.$refs.searchPanel.form.resetFields()
                this.getData()
            },
            addUser(){
                this.$router.push({
                    name:'userDetail',
                    params:{ id:0 }
                })
            },
            edit(row){
                this.$router.push({
                    name:'userDetail',
                    params:{ id:row.id }
                })
            },
            delRow(row){

            },
            changeStatus(row,flag){
                let params = {};
                if(flag){
                    params.status = 1;
                }else{
                    params.status = 0;
                }
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
            getData(obj = {}) {
                this.spinning = true;
                let params = {};
                params.pageSize = obj.pageSize || 10;
                params.offset = obj.offset || 0;
                this.$axios({
                    url: this.api.userUrl,
                    method: 'put',
                    data: params
                }).then(res => {
                    if (res.code == '200') {
                        this.dataSource = res.rows;
                        this.spinning = false;
                    } else {
                        this.spinning = false;
                        this.warn(res.msg);
                    }
                })
                    .catch(err => {
                        this.spinning = false;
                        this.error(err);
                    })
            },
        }
    }
</script>