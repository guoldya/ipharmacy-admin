<template>
    <a-card>
        <a-row :gutter="24">
            <a-col :span="6">
                <a-spin :spinning="loading" tip="加载中...">
                    <a-treeTable
                            :columns="orgColumns"
                            :data="dataSource"
                            ref="orgTable"
                            :isOpcol="false"
                            :currentChange="orgCurrentChange"
                    >
                    </a-treeTable>
                </a-spin>
            </a-col>
            <a-col :span="18">
                <a-button type="primary" @click="addDept" :disabled="deptButton">新增部门</a-button>
                <a-spin :spinning="spinning" tip="加载中...">
                    <a-treeTable
                            class="margin-top-10"
                            :columns="deptColumns"
                            :data="deptData"
                            :opColWidth="150"
                            ref="deptTable"
                            :filterItem="['status']"
                            :items="items"
                            :currentChange="deptCurrentChange"
                    ></a-treeTable>
                </a-spin>
            </a-col>
        </a-row>
        <a-row>
            <a-spin tip="加载中..." :spinning="userLoading">
                <el-table
                        class="margin-top-10"
                        :data="userData"
                        border
                        style="width: 100%"
                >
                    <el-table-column
                            :show-overflow-tooltip="true"
                            :prop="item.prop"
                            :label="item.title"
                            :key="index"
                            v-for="(item,index) in userColumns"
                            :width="item.width"
                            :align="item.align"
                    >
                        <template slot-scope="scope">
                        <span v-if="item.prop == 'status'">
                            <a-badge :status="scope.row.status == 0? 'default':'processing'"
                                     :text="scope.row.status ==0?'停用':'启用'"/>
                        </span>
                          <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
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
        </a-row>
    </a-card>
</template>

<script>
    import treeTable from '@/components/tree-table/treeTable.vue'

    export default {
        name: 'index',
        components: {
            'a-treeTable': treeTable
        },
        data() {
            return {
                api: {
                    orgUrl: '/sys/sysOrgs/selectList',
                    deptUrl:'/sys/sysOrgs/selectDeptsByOrgId',
                    updateUrl:'/sys/sysDepts/update',
                    delDeptUrl:'/sys/sysDepts/delete',
                    orgUserUrl: '/sys/sysDeptpersons/selectPersonsListWithDeptId',
                    updateStatus:'/sys/sysDepts/updateStatus'
                },
                dataSource:[],
                orgColumns:[
                    { text: '机构代码', value: 'orgCode', width: 150 },
                    { text: '名称', value: 'title' }
                ],
                loading:false,
                spinning: false,
                deptColumns: [
                    { text: '部门编码', value: 'code', width: 150 },
                    { text: '部门名称', value: 'title' },
                    { text: '部门类型', value: 'type', align:'center', width:100, format: this.typeFormat },
                    { text: '部门说明', value: 'note' },
                    { text: '创建时间', value: 'createDate', width:150 },
                    { text: '更新时间', value: 'updateDate', width:150 },
                    { text: '状态', value: 'status', align:'center', width:80 }
                ],
                items: [
                    { text: '编辑', showtip: false, click: this.editDept },
                    { text: '删除', showtip: true, color: '#ff9900', tip: '确认删除吗？', click: this.delDept },
                    { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.changeStatus, status:'1' },
                    { text: '停用', showtip: true, color: '#ff9900', tip: '确认停用吗？', click: this.changeStatus, status:'0' }
                ],
                deptData: [],
                userData: [],
                userColumns: [
                    { title: '人员编号', prop: 'code', width: 100 },
                    { title: '姓名', prop: 'name' },
                    { title: '性别', prop: 'sex', align: 'center', width: 100,format:this.sexType },
                    { title: '职称', prop: 'titlesName', width: 100 },
                    { title: '电话', prop: 'phone', width: 120 },
                    { title: '出生日期', prop: 'birthday', width: 150 },
                    { title: '创建日期', prop: 'createDate', width: 150 },
                    { title: '更新日期', prop: 'updateDate', width: 150 },
                    { title: '状态', prop: 'status', align: 'center', width: 100 }
                ],
                userLoading: false,
                total: 0,
                current: 1,
                orgId:null,
                deptId: null,
                deptButton:true
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            editDept(row){
                this.$router.push({
                    name:'deptDetail',
                    params:{ deptId:row.deptId, orgId:row.orgId }
                })
            },
            delDept(row){
                if(row.status == '1'){
                    this.warn('请先停用该部门，再删除!');
                    return;
                }
                this.$axios({
                    url: this.api.delDeptUrl,
                    method: 'delete',
                    data: {deptId:row.deptId}
                }).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!',()=>{

                            this.getDeptData({ orgId:this.orgId });
                        })
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            delUser(row){

            },
            changeStatus(row){
                let params = {};
                params.deptId = row.deptId;
                if(row.status == '1'){
                    params.status = '0'
                }else{
                    params.status = '1'
                }
                this.$axios({
                    url: this.api.updateStatus,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!',()=>{
                            this.getDeptData({ orgId:this.orgId });
                        })
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                        this.error(err)
                    })
            },
            addDept() {
                this.$router.push({
                    name:'deptDetail',
                    params:{ deptId:0, orgId:this.orgId }
                })
            },
            addDeptUser(){
                this.$router.push({
                    name:'deptUserDetail',
                    params:{ id:0 }
                })
            },
            pageChange(page, size) {
                let params = {};
                params.offset = (page - 1) * size;
                params.deptId = this.deptId;
                this.getUserData(params);
            },
            sizeChange(current, size) {
                this.current = 1;
                let params = {};
                params.pageSize = size;
                params.deptId = this.deptId;
                this.getUserData(params);
            },
            orgCurrentChange(val) {
                if (val) {
                    this.orgId = val.orgId;
                    this.deptButton = false;
                    this.getDeptData({ orgId:val.orgId });
                } else {
                    this.deptData = [];
                    this.deptButton = true;
                }
            },
            deptCurrentChange(val){
                if (val) {
                    this.deptId = val.deptId
                    this.getUserData({ deptId:val.deptId, orgId:this.orgId })
                } else {
                    this.userData = []
                }
            },
            typeFormat(row){
                let arr = ['业务类型','系统类型'];
                return arr[row.type - 1]
            },
            setOrgCurrent() {
                this.$refs.orgTable.$refs.multipleTable.setCurrentRow(this.dataSource[0])
            },
            setDeptCurrent() {
                this.$refs.deptTable.$refs.multipleTable.setCurrentRow(this.deptData[0])
            },
            getDataChildren(data, pid) {
                let tree = []
                data.forEach(item => {
                    let row = item
                    if (pid == item.parentId) {
                        row.items = this.getDataChildren(data, item.orgId)
                        tree.push(row)
                    }
                })
                return tree
            },
            getDeptChildren(data, pid) {
                let tree = []
                data.forEach(item => {
                    let row = item
                    if (pid == item.parentId) {
                        row.items = this.getDeptChildren(data, item.deptId)
                        tree.push(row)
                    }
                })
                return tree
            },
            getData(obj = {}) {
                this.loading = true
                this.$axios({
                    url: this.api.orgUrl,
                    method: 'put',
                    data: obj
                }).then(res => {
                    if (res.code == '200') {
                        this.dataSource = this.getDataChildren(res.rows, undefined)
                        this.setOrgCurrent()
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
            getDeptData(obj = {}) {
                this.spinning = true
                this.$axios({
                    url: this.api.deptUrl,
                    method: 'put',
                    data: obj
                }).then(res => {
                    if (res.code == '200') {
                        this.deptData = this.getDeptChildren(this.$dateFormat(res.rows,['createDate','updateDate']), undefined);
                        this.setDeptCurrent();
                        this.spinning = false
                    } else {
                        this.spinning = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                        this.spinning = false
                        this.error(err)
                    })
            },
            getUserData(obj = {}) {
                this.userLoading = true
                let params = {}
                params.pageSize = obj.pageSize || 10
                params.offset = obj.offset || 0
                this.$axios({
                    url: this.api.orgUserUrl,
                    method: 'put',
                    data: obj
                }).then(res => {
                    if (res.code == '200') {
                        this.userData = this.$dateFormat(res.rows,['birthday','createDate','updateDate']);
                        this.total = res.total
                        this.userLoading = false
                    } else {
                        this.userLoading = false
                        this.warn(res.msg)
                    }
                })
                    .catch(err => {
                        this.userLoading = false
                        this.error(err)
                    })
            },
          sexType(data){
            let levelText
            this.enum.sex.forEach(item => {
              if (data.sex == item.id) {
                levelText = item.text
                return
              }
            })
            return levelText
          }
        }
    }
</script>

<style scoped>
    .userModel-p {
        text-align: center;
    }
</style>