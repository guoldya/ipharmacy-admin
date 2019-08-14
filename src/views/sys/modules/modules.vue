<template>
    <div>
        <a-card>
            <a-spin tip="加载中..." :spinning="spinning">
                <a-treeTable
                        :columns="columns"
                        :data="dataSource"
                        :isOpcol="false"
                        :currentChange="()=>{return null}"
                        :isoperate="'false'"
                ></a-treeTable>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
    import treeTable from '@/components/tree-table/treeTable.vue'
    export default {
        components: {
            'a-treeTable': treeTable
        },
        data(){
            return{
                spinning:false,
                dataSource:[],
                columns:[
                    { text:'编码', value:'moduleId',width:200 },
                    { text:'模块名称', value:'moduleName' },
                    { text:'PATH', value:'path',width:200 },
                    { text:'状态', value:'status',align:'center',width:100 }
                ],
                api:{
                    moduleUrl:'/sys/sysModules/selectList'
                }
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            getDataChildren(bdata, pid) {
                var items = []
                for (var key in bdata) {
                    var item = bdata[key]
                    if (pid == item.parentId) {
                        item.items = this.getDataChildren(bdata, item.moduleId)
                        items.push(item)
                    }
                }
                return items
            },
            getData() {
                this.spinning = true;
                this.$axios({
                    url: this.api.moduleUrl,
                    method: 'put',
                    data: {}
                }).then(res => {
                        if (res.code == '200') {
                            this.dataSource = this.getDataChildren(res.rows, '&');
                            this.spinning = false
                        } else {
                            this.spinning = false
                            this.warn(res.msg)
                        }
                    }) .catch(err => {
                        this.spinning = false
                        this.error(err)
                    })
            },
        }
    }
</script>