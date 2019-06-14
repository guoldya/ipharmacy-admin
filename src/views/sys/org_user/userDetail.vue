<template>
    <div>
        <a-card>
            <a-spin tip="加载中..." :spinning="spinning">
                <a-form :form="form">
                    <a-row :gutter="24">
                        <a-col :span="col">
                            <a-form-item
                                    label="所属机构"
                            >
                                <!--<a-select-->
                                        <!--@change="orgChange"-->
                                        <!--placeholder="请选择..."-->
                                        <!--v-decorator="[-->
                                <!--'orgId',-->
                                <!--{rules: [{ required: true, message: '请输选择机构' }],initialValue: formData.orgId}-->
                                <!--]"-->
                                <!--&gt;-->
                                    <!--<a-select-option-->
                                            <!--v-for="(item,index) in orgData"-->
                                            <!--:value="item.orgId"-->
                                            <!--:key="index"-->
                                    <!--&gt;-->
                                        <!--{{item.title}}-->
                                    <!--</a-select-option>-->
                                <!--</a-select>-->
                                <a-tree-select
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
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="所属部门"
                            >
                                <!--<a-select-->
                                        <!--mode="multiple"-->
                                        <!--placeholder="请选择..."-->
                                        <!--v-decorator="[-->
                                <!--'deptIds',-->
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
                                        :multiple="true"
                                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                        :treeData="deptData"
                                        placeholder='请选择...'
                                        treeDefaultExpandAll
                                        v-decorator="[
                                            'deptIds',
                                            {rules: [{ required: true, message: '请输选择所属部门' }],initialValue: formData.deptIds}
                                        ]"
                                >
                                </a-tree-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="人员编码"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'code',
                                {rules: [{ required: true, message: '请输入人员编码' },{ max:20,message:'最多20个字' }],initialValue: formData.code}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="姓名"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'name',
                                {rules: [{ required: true, message: '请输入姓名' },{ max:50,message:'最多50个字' }],initialValue: formData.name}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="性别"
                                    :required="true"
                            >
                                <a-radio-group v-decorator="['sex',{initialValue: formData.sex}]">
                                    <a-radio value="1">男</a-radio>
                                    <a-radio value="2">女</a-radio>
                                    <a-radio value="0">未知</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="电话"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'phone',
                                {rules: [{ required: true, message: '请输入联系电话' },
                                {validator:validPhone,}],initialValue: formData.phone}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="电子邮箱"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'email',
                                {rules: [{ required: true, message: '请输入电子邮箱' },{ max:50,message:'最多50个字' }],initialValue: formData.email}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="出生日期"
                            >
                                <a-date-picker
                                        placeholder="请选择..."
                                        v-decorator="[
                                'birthday',
                                {rules: [{ required: true, message: '请选择出生日期' }],initialValue: formData.birthday}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="身份证号"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'idCard',
                                {rules: [{ required: true, message: '请输入身份证号' },{ max:18,message:'最多18个字' }],initialValue: formData.idCard}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="职称"
                            >
                                <a-select placeholder="请选择..." v-decorator="[
                                'titles',
                                {rules: [{ required: true, message: '请输选择职称' }],initialValue: formData.titles}
                                ]"
                                >
                                    <a-select-option
                                            v-for="(item,index) in titleData"
                                            :value="item.id"
                                            :key="index"
                                    >
                                        {{item.name}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="专业技术职务"
                            >
                                <a-select placeholder="请选择..." v-decorator="[
                                'profePosition',
                                {rules: [{ required: true, message: '请输选择专业技术职务' }],initialValue: formData.profePosition}
                                ]"
                                >
                                    <a-select-option
                                            v-for="(item,index) in posData"
                                            :value="item.id"
                                            :key="index"
                                    >
                                        {{item.name}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="管理职务"
                            >
                                <a-select placeholder="请选择..." v-decorator="[
                                'mentPosition',
                                {rules: [{ required: true, message: '请输选择管理职务' }],initialValue: formData.mentPosition}
                                ]"
                                >
                                    <a-select-option
                                            v-for="(item,index) in mentData"
                                            :value="item.id"
                                            :key="index"
                                    >
                                        {{item.name}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="资格证书号"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'certificateNo',
                                {rules: [{ required: true, message: '请输入资格证书号' },{ max:50,message:'最多50个字' }],initialValue: formData.certificateNo}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="处方权"
                                    :required="true"
                            >
                                <a-radio-group v-decorator="['prescRight',{initialValue: formData.prescRight}]">
                                    <a-radio value="1">有处方权</a-radio>
                                    <a-radio value="0">无处方权</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="门诊抗菌药物权限"
                                    :required="true"
                            >
                                <a-radio-group v-decorator="['outpAntibacterial',{initialValue: formData.outpAntibacterial}]">
                                    <a-radio value="1">非限制使用级</a-radio>
                                    <a-radio value="2">限制使用级</a-radio>
                                    <a-radio value="3">特殊使用级</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="住院抗菌药物权限"
                                    :required="true"
                            >
                                <a-radio-group v-decorator="['hospAntibacterial',{initialValue: formData.hospAntibacterial}]">
                                    <a-radio value="1">非限制使用级</a-radio>
                                    <a-radio value="2">限制使用级</a-radio>
                                    <a-radio value="3">特殊使用级</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="col">
                            <a-form-item
                                    label="状态"
                                    :required="true"
                            >
                                <a-radio-group v-decorator="['status',{initialValue: formData.status}]">
                                    <a-radio value="1">启用</a-radio>
                                    <a-radio value="0">停用</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item
                                    label="签名图片"
                            >
                                <Upload :count="1"  ref="upload"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item
                                    label="个人简介"
                            >
                                <a-textarea
                                        placeholder="请输入..."
                                        :autosize="{ minRows: 4 }"
                                        v-decorator="[ 'personalProfile',{rules: [{ max:2000,message:'最多2000个字' }],initialValue: formData.personalProfile}]"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </a-spin>
        </a-card>
        <footer-tool-bar
                :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
        >
            <a-button @click="cancel">取消</a-button>
            <a-button type="primary" @click="submit" :loading="loading" class="margin-left-5">保存</a-button>
        </footer-tool-bar>
    </div>
</template>
<script>
    import Upload from '@/my-components/upload/upload';
    import FooterToolBar from '@/components/FooterToolbar';
    import { mixin, mixinDevice } from '@/utils/mixin';
    import moment from 'moment';
    export default {
        mixins: [mixin, mixinDevice],
        data(){
            return{
                api: {
                    orgUrl: '/sys/sysOrgs/selectList',
                    deptUrl:'/sys/sysOrgs/selectDeptsByOrgId',
                    updateUrl:'/sys/sysPersons/update',
                    detailUrl:'/sys/sysPersons/selectOneDetail',
                    titleUrl:'/sys/dicBase/selectTitlesList',
                    posUrl:'/sys/dicBase/selectTitlesList',
                    mentUrl:'/sys/dicBase/selectTitlesList'
                },
                form:this.$form.createForm(this),
                col:6,
                orgData:[],
                deptData:[],
                titleData:[],
                posData:[],
                mentData:[],
                isNew:true,
                spinning:false,
                formData:{
                    sex:'1',
                    status:'1',
                    prescRight:'0',
                    outpAntibacterial:'1',
                    hospAntibacterial:'1'
                },
                loading:false
            }
        },
        components:{
            Upload,
            FooterToolBar
        },
        mounted(){
            this.getOrgData();
            this.getTitleData();
            this.getPosData();
            this.getMentData();
            this.init();
        },
        methods:{
            init(){
                this.spinning = true;
                let id = this.$route.params.id;
                if(id == 0){
                    this.isNew = true;
                    this.spinning = false;
                }else{
                    this.isNew = false;
                    this.$axios({
                        url: this.api.detailUrl,
                        method: 'put',
                        data: { personId: id }
                    }).then(res => {
                        if (res.code == '200') {
                            let that = this;
                            this.getDeptData(res.data.orgId);
                            this.formData = JSON.parse(JSON.stringify(res.data));
                            this.formData.birthday = moment(res.data.birthday,'YYYY-MM-DD');
                            let obj = {
                                    url: this.$config.img_base_url + res.data.signPic,
                                    status: 'done',
                                    uid: '-1',
                                    name:res.data.signPic,
                                    fileName:res.data.signPic
                                };
                            if(res.data.signPic){
                                setTimeout(()=>{
                                    that.$refs.upload.fileList = [obj];
                                    that.$refs.upload.imgArr = [obj];
                                })
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
                }
            },
            validPhone(rule, value, callback){
                if(value){
                    if (!(/^1[3584679]\d{9}$/.test(value))) {
                        callback('请输入正确的联系电话')
                    }else{
                        callback()
                    }
                }else{
                    callback()
                }
            },
            orgChange(val){
                this.getDeptData(val)
            },
            cancel(){
                this.$router.push({
                    name:'org_user'
                })
            },
            submit(){
                this.loading = true;
                // if(this.$refs.upload.imgArr.length == 0){
                //     this.warn('请上传图片');
                //     return;
                // }
                this.form.validateFields((err, values) => {
                    if (!err){
                        let params = values;
                        if(!this.isNew){
                            params.personId = this.$route.params.id;
                        }
                        params.birthday = values.birthday.format('YYYY-MM-DD');
                        params.signPic = this.$refs.upload.imgArr[0].fileName;
                        this.$axios({
                            url: this.api.updateUrl,
                            method: 'post',
                            data: params
                        }).then(res => {
                            if (res.code == '200') {
                                this.success('保存成功!',()=>{
                                    this.cancel();
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
                    }else{
                        this.loading = false;
                    }
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
            getTitleData() {
                this.$axios({
                    url: this.api.titleUrl,
                    method: 'put',
                    data: { codeClass:'36' }
                }).then(res => {
                    if (res.code == '200') {
                        this.titleData = res.rows;
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            },
            getPosData() {
                this.$axios({
                    url: this.api.posUrl,
                    method: 'put',
                    data: { codeClass:'35' }
                }).then(res => {
                    if (res.code == '200') {
                        this.posData = res.rows;
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            },
            getMentData() {
                this.$axios({
                    url: this.api.mentUrl,
                    method: 'put',
                    data: { codeClass:'37' }
                }).then(res => {
                    if (res.code == '200') {
                        this.mentData = res.rows;
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