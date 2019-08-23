<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button class="margin-left-5" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" @click="addUser" class="margin-top-10">新增人员</a-button>
            <a-spin tip="加载中..." :spinning="spinning">
                <el-table class="margin-top-10" :data="dataSource" border style="width: 100%">
                    <el-table-column fixed="right" label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <a @click="edit(scope.row)">编辑</a>
                            <a-divider type="vertical" />
                            <a-popconfirm
                                title="确认启用吗?"
                                @confirm="changeStatus(scope.row,true)"
                                v-if="scope.row.status == '0'"
                                placement="topRight"
                            >
                                <a>启用</a>
                            </a-popconfirm>
                            <a-popconfirm
                                title="确认停用吗?"
                                placement="topRight"
                                @confirm="changeStatus(scope.row,false)"
                                v-else
                            >
                                <a class="delColor">停用</a>
                            </a-popconfirm>
                        </template>
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <detail-list :col="4">
                                <detail-list-item term="身份证">{{ props.row.idCard }}</detail-list-item>
                                <detail-list-item term="资格证书号">{{ props.row.certificateNo }}</detail-list-item>
                                <detail-list-item term="电子邮箱">{{ props.row.email }}</detail-list-item>
                                <detail-list-item term="出生日期">{{ props.row.birthday }}</detail-list-item>
                                <detail-list-item
                                    term="处方权"
                                >{{ props.row.prescRight?'有处方权':'无处方权' }}</detail-list-item>
                                <detail-list-item
                                    term="门诊抗菌药物权限"
                                >{{ setAnt(props.row.outpAntibacterial) }}</detail-list-item>
                                <detail-list-item
                                    term="住院抗菌药物权限"
                                >{{ setAnt(props.row.hospAntibacterial) }}</detail-list-item>
                            </detail-list>
<!--                            <detail-list  :col="24">-->
<!--                                <detail-list-item term="个人简介">{{ props.row.personalProfile }}</detail-list-item>-->
<!--                            </detail-list>-->
                          <div class="items">个人简介</div>
                          <div class="content">{{ props.row.personalProfile }}</div>
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
                                <a-badge
                                    :status="scope.row.status == 0? 'default':'processing'"
                                    :text="scope.row.status ==0?'停用':'启用'"
                                />
                            </span>
                            <span v-else-if="item.prop == 'sex'">{{setSex(scope.row.sex)}}</span>
                            <span v-else>{{scope.row[item.prop]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <a-pagination
                    :total="total"
                    showSizeChanger
                    v-model="current"
                    class="pnstyle"
                    :pageSize="pageSize"
                    :pageSizeOptions="['10', '20','50']"
                    @showSizeChange="sizeChange"
                    @change="pageChange"
                    size="small"
                ></a-pagination>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
    data() {
        return {
            api: {
                userUrl: '/sys/sysPersons/selectPage',
                updateUrl: '/sys/sysPersons/updateStatus',
                delUrl: '/sys/sysPersons/delete'
            },
            spinning: false,
            dataSource: [],
            columns: [
                { title: '人员编号', prop: 'code', width: 100 },
                { title: '机构', prop: 'orgTitle' },
                { title: '姓名', prop: 'name' },
                { title: '性别', prop: 'sex', align: 'center', width: 80 },
                { title: '职称', prop: 'titlesName', width: 100 },
                { title: '管理职务', prop: 'mentPositionName', width: 100 },
                { title: '电话', prop: 'phone', width: 120 },
                { title: '创建时间', prop: 'createDate', width: 150 },
                { title: '更新时间', prop: 'updateDate', width: 150 },
                { title: '状态', prop: 'status', align: 'center', width: 80 }
            ],
            searchData:{},
            total: 0,
            current: 1,
            pageSize:10,
        }
    },
    components: {
        DetailList,
        DetailListItem
    },
    computed: {
        list() {
            return [
                { name: '人员编号', dataField: 'code', type: 'text' },
                { name: '姓名', dataField: 'name', type: 'text' },
                {
                    name: '状态',
                    dataField: 'status',
                    type: 'select',
                    keyExpr: 'id',
                    valueExpr: 'text',
                    dataSource: this.enum.status
                }
            ]
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        search() {
            let params = this.$refs.searchPanel.form.getFieldsValue()
            this.searchData = this.$refs.searchPanel.form.getFieldsValue()
            params.pageSize = this.pageSize;
            params.offset = (this.current-1)*this.pageSize;
            this.getData(params)
        },
        //重置
        resetForm() {
            this.current = 1
            this.searchData = {}
            this.$refs.searchPanel.form.resetFields()
            this.pageSize = 10;
            this.getData()
        },
        setSex(val) {
            let sex = ['未知', '男', '女']
            return sex[Number(val)]
        },
        addUser() {
            this.$router.push({
                name: 'userDetail',
                params: { id: 0 }
            })
        },
        edit(row) {
            this.$router.push({
                name: 'userDetail',
                params: { id: row.personId }
            })
        },
        delRow(row) {
            if (row.status == '1') {
                this.warn('请先停用该用户，再删除!')
                return
            }
            this.$axios({
                url: this.api.delUrl,
                method: 'delete',
                data: { personId: row.personId }
            })
                .then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                          let params = this.pageChangeFilter;
                          params.offset = (this.current - 1) * this.pageSize;
                          params.pageSize = this.pageSize;
                            this.getData(params)
                        })
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        changeStatus(row, flag) {
          let params = {}
            if (flag) {
              params.status = '1'
            } else {
              params.status = '0'
            }
            params.personId = row.personId
            this.$axios({
                url: this.api.updateUrl,
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                      this.success(res.msg);
                      let data = this.searchData;
                      data.offset = (this.current - 1) * this.pageSize;
                      data.pageSize = this.pageSize;
                      this.getData(data)
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        setAnt(val) {
            let arr = ['非限制使用级', '限制使用级', '特殊使用级']
            return arr[val - 1]
        },
        pageChange(page, size) {
            let params =  this.searchData
            params.offset = (page - 1) * size
            params.pageSize=size
            this.getData(params)
        },
        sizeChange(current, size) {
            this.current = 1
            let params =  this.searchData
            params.offset = (current - 1) * size
            params.pageSize = size
            this.pageSize = size;
            this.getData(params)
        },
        getData(params = {}) {
            this.spinning = true
          if (params.offset==0){
            this.current = 1;
          }
            this.$axios({
                url: this.api.userUrl,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.dataSource = this.$dateFormat(res.rows, ['createDate', 'updateDate', 'birthday'])
                        this.total = res.total
                        if (!params.offset) {
                            this.current = 1
                        }
                        this.spinning = false
                    } else {
                        this.spinning = false
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.spinning = false
                    this.error(err)
                })
        }
    }
}
</script>
<style lang="less" scoped>
  .items {
    color: rgba(0,0,0,.85);
    display: table-cell;
    line-height: 20px;
    margin-right: 8px;
    /*padding-bottom: 16px;*/
    white-space: nowrap;
    &:after {
      content: ":";
      margin: 0 8px 0 2px;
      position: relative;
      top: -.5px;
    }
  }

  .content {
    color: rgba(0,0,0,.65);
    display: table-cell;
    line-height: 22px;
    padding-bottom: 16px;
    width: 100%;
  }
</style>