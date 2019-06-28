<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button class="margin-left-5" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" @click="addUser" class="margin-top-10">添加用户</a-button>
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
                            width="150"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <a @click="edit(scope.row)">编辑</a>
                            <a-divider type="vertical"/>
                            <a-popconfirm title="确认删除吗?" @confirm="delRow(scope.row)">
                                <a class="delColor">删除</a>
                            </a-popconfirm>
                            <a-divider type="vertical"/>
                            <a-popconfirm title="确认启用吗?" @confirm="changeStatus(scope.row,true)" v-if="scope.row.status == '0'">
                                <a>启用</a>
                            </a-popconfirm>
                            <a-popconfirm title="确认停用吗?" @confirm="changeStatus(scope.row,false)" v-else>
                                <a class="delColor">停用</a>
                            </a-popconfirm>
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
                            <a-badge :status="scope.row.status == '0'? 'default':'processing'"
                                     :text="scope.row.status == '0'?'停用':'启用'"/>
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
        <a-modal
                :title="isNew?'添加用户':'编辑用户'"
                v-model="visible"
                okText="提交"
                @ok="submit"
                :confirmLoading="loading"
                @cancel="cancel"
                width=""
                centered
                :maskClosable="false"
        >
            <div style="width: 500px;">
                <a-form :form="form">
                    <a-form-item
                            label="机构"
                            v-bind="formItemLayout"
                    >
                        <!--<a-select-->
                                <!--:disabled="!isNew"-->
                                <!--placeholder="请选择"-->
                                <!--@change="orgChange"-->
                                <!--v-decorator="[-->
                                <!--'orgId',-->
                                <!--{rules: [{ required: true, message: '请输选择机构' }],initialValue: formData.orgId}-->
                                <!--]"-->
                        <!--&gt;-->
                            <!--<a-select-option :value="item.orgId" v-for="(item,index) in orgData"-->
                                             <!--:key="index">-->
                                <!--{{item.title}}-->
                            <!--</a-select-option>-->
                        <!--</a-select>-->
                        <a-tree-select
                                :disabled="!isNew"
                                @change="orgChange"
                                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                :treeData="orgData"
                                placeholder='请选择...'
                                treeDefaultExpandAll
                                v-decorator="[
                                'orgId',
                                {rules: [{ required: true, message: '请输选择机构' }],initialValue: formData.orgId}
                                ]"
                        >
                        </a-tree-select>
                    </a-form-item>
                    <a-form-item
                            label="部门"
                            v-bind="formItemLayout"
                    >
                        <!--<a-select-->
                                <!--:disabled="!isNew"-->
                                <!--placeholder="请选择..."-->
                                <!--@change="deptChange"-->
                                <!--v-decorator="[-->
                                <!--'deptId',-->
                                <!--{rules: [{ required: true, message: '请输选择所属部门' }],initialValue: formData.deptId}-->
                                <!--]"-->
                        <!--&gt;-->
                            <!--<a-select-option-->
                                    <!--v-for="(item,index) in deptData"-->
                                    <!--:value="item.deptId"-->
                                    <!--:key="index"-->
                            <!--&gt;-->
                                <!--{{item.title}}-->
                            <!--</a-select-option>-->
                        <!--</a-select>-->
                        <a-tree-select
                                :disabled="!isNew"
                                @change="deptChange"
                                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                :treeData="deptData"
                                placeholder='请选择...'
                                treeDefaultExpandAll
                                v-decorator="[
                                'deptId',
                                {rules: [{ required: true, message: '请输选择所属部门' }],initialValue: formData.deptId}
                                ]"
                        >
                        </a-tree-select>
                    </a-form-item>
                    <a-form-item
                            label="人员"
                            v-bind="formItemLayout"
                    >
                        <a-select
                                :disabled="!isNew"
                                placeholder="请选择..."
                                v-decorator="[
                                'personId',
                                {rules: [{ required: true, message: '请输选择所属部门' }],initialValue: formData.personId}
                                ]"
                        >
                            <a-select-option
                                    v-for="(item,index) in personData"
                                    :value="item.personId"
                                    :key="index"
                            >
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label="账号"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'account',
                                {rules: [{ required: true, message: '请输入账号' },{ max:20,message:'最多20个字' }],initialValue: formData.account}
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            label="密码"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="若不填，后台将生成默认密码"
                                v-decorator="['password',{rules:[{ max:30,message:'最多30个字' }],initialValue: formData.password}]"/>
                    </a-form-item>
                    <a-form-item
                            label="状态"
                            :required="true"
                            v-bind="formItemLayout"
                    >
                        <a-radio-group v-decorator="['status',{initialValue: formData.status}]">
                            <a-radio value="1">启用</a-radio>
                            <a-radio value="0">停用</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        data(){
            return{
                api:{
                    orgUrl: '/sys/sysOrgs/selectList',
                    deptUrl:'/sys/sysOrgs/selectDeptsByOrgId',
                    personUrl:'/sys/sysDeptpersons/selectPersonsListWithDeptId',
                    userUrl:'/sys/sysUser/selectPage',
                    updateUrl:'/sys/sysUser/update',
                    delUrl:'/sys/sysUser/delete'
                },
                spinning:false,
                dataSource:[],
                columns: [
                    { title: '账号', prop: 'account' },
                    { title: '姓名', prop: 'username' },
                    { title: '机构', prop: 'orgTitle' },
                    { title: '部门', prop: 'deptTitle', width:150 },
                    { title: '编辑人', prop: 'updateUser', width: 120 },
                    { title: '编辑时间', prop: 'updateTime', width: 150 },
                    { title: '状态', prop: 'status', align: 'center', width: 100 }
                ],
                total:0,
                current:1,
                isNew:true,
                visible:false,
                loading:false,
                form: this.$form.createForm(this),
                formItemLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 12 },
                },
                formData:{
                    status:'1'
                },
                orgData:[],
                deptData:[],
                personData:[]
            }
        },
        components:{

        },
        computed: {
            list() {
                return [
                    { name: '账号', dataField: 'account', type: 'text' },
                    { name: '姓名',  dataField: 'username', type: 'text' },
                    { name: '机构',  dataField: 'orgTitle', type: 'text' },
                    { name: '部门',  dataField: 'deptTitle', type: 'text' }
                ]
            }
        },
        mounted(){
            this.getData();
            this.getOrgData();
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
                this.isNew = true;
                this.form.resetFields();
                this.formData = { status:'1' };
                this.visible = true;
            },
            edit(row){
                this.isNew = false;
                this.getDeptData(row.orgId);
                this.getPersonData(row.deptId);
                this.formData = row;
                this.visible = true;
            },
            cancel(){
                this.visible = false
            },
            submit(){
                this.loading = true;
                this.form.validateFields((err, values) => {
                    if(!err){
                        let params = values , len = this.personData.length;
                        for (let i=0;i<len; i++){
                            if(this.personData[i].personId == values.personId){
                                params.userName = this.personData[i].name;
                                break;
                            }
                        }
                        if(!this.isNew){
                            params.userId = this.formData.userId
                        }
                        this.$axios({
                            url: this.api.updateUrl,
                            method: 'post',
                            data: params
                        }).then(res => {
                            if (res.code == '200') {
                                this.success('保存成功!',()=>{
                                    this.getData();
                                    this.visible = false;
                                    this.loading = false;
                                })
                            } else {
                                this.loading = false;
                                this.warn(res.msg);
                            }
                        }).catch(err => {
                            this.loading = false;
                            this.error(err);
                        })
                    }else {
                        this.loading = false;
                    }
                })
            },
            delRow(row){
                if(row.status == '1'){
                    this.warn('请先停用该用户，再删除!');
                    return;
                }
                this.$axios({
                    url: this.api.delUrl,
                    method: 'post',
                    data: { userId:row.userId }
                }).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!',()=>{
                            this.getData();
                        })
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            },
            changeStatus(row,flag){
                let params = {};
                if(flag){
                    params.status = '1';
                }else{
                    params.status = '0';
                }
                params.userId = row.userId;
                this.$axios({
                    url: this.api.updateUrl,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!',()=>{
                            this.getData();
                        })
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
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
            orgChange(val){
                this.getDeptData(val)
            },
            deptChange(val){
                this.getPersonData(val)
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
                        this.dataSource = this.$dateFormat(res.rows,['updateTime']);
                        this.total = res.total;
                        if(!params.offset){
                            this.current = 1
                        }
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
            getOrgData(obj = {}) {
                this.$axios({
                    url: this.api.orgUrl,
                    method: 'put',
                    data: obj
                }).then(res => {
                    if (res.code == '200') {
                        this.orgData = this.getOrgTreeData(res.rows, undefined)
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            },
            getOrgTreeData(data, pid) {
                let tree = [];
                data.forEach(item => {
                    let row = item;
                    row.key = item.orgId;
                    row.value = item.orgId;
                    if (pid == item.parentId) {
                        row.children = this.getOrgTreeData(data, item.orgId)
                        tree.push(row)
                    }
                })
                return tree
            },
            getDeptData(val) {
                this.$axios({
                    url: this.api.deptUrl,
                    method: 'put',
                    data: { orgId:val }
                }).then(res => {
                    if (res.code == '200') {
                        this.deptData = this.getDeptTreeData(res.rows, undefined)
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            },
            getDeptTreeData(data, pid) {
                let tree = [];
                data.forEach(item => {
                    let row = item;
                    row.key = item.deptId;
                    row.value = item.deptId;
                    if (pid == item.parentId) {
                        row.children = this.getDeptTreeData(data, item.deptId)
                        tree.push(row)
                    }
                })
                return tree
            },
            getPersonData(val) {
                this.$axios({
                    url: this.api.personUrl,
                    method: 'put',
                    data: { deptId:val }
                }).then(res => {
                    if (res.code == '200') {
                        this.personData = res.rows;
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            },
        }
    }
</script>