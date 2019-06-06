<template>
  <div>
    <a-row>
      <a-col :span="13">
        <a-input placeholder="请输入"/>
      </a-col>
      <a-col class="treeCol" :span="5">
        <a-button size="small" type="primary">查询</a-button>
      </a-col>
      <a-col :span="6" class="treeCol">
        <a-dropdown :trigger="['click']">
          <a class="more" :disabled="disable">操作
            <a-icon type="down"/>
            <a-popconfirm :title="popTitle" @confirm="confirm" class="pop" :visible="visible"
                          @cancel="cancel"></a-popconfirm>
          </a>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="new" @click="newTreeNode">新增</a-menu-item>
            <a-menu-item key="update" @click="updateTreeNode">编辑</a-menu-item>
            <a-menu-item overlayClassName="" key="enable" v-if="nodeStatus == 0" @click="enableTreeNode">启用
            </a-menu-item>
            <a-menu-item overlayClassName="disableNode" key="disable" v-else-if="nodeStatus == 1"
                         @click="disableTreeNode">停用
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-col>
    </a-row>
    <a-row>
      <a-spin tip="加载中..." :spinning="loading">
        <a-tree
          class="draggable-tree"
          :treeData="gData"
          :loadData="onLoadData"
          @select="onSelect"
        >
        </a-tree>
      </a-spin>
    </a-row>
  </div>
</template>

<script>
  import treeTable from '@/components/tree-table/treeTable.vue'

  export default {
    name: 'drugClassification',
    components: {
      'a-treeTable': treeTable
    },
    data() {
      return {
        api: {
          DrugCategoryList: 'sys/dicDrugcategory/selectList'
        },
        columns: [],
        baseData: [],
        items: [],
        isOpcol: true,
        loading: false,
        disable: true,
        gData: [],
        visible: false,
        popTitle: '',
        clickItem: '',
        nodeStatus: 1
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData(params = { pid: -1 }) {
        this.loading = true
        this.$axios({
          url: this.api.DrugCategoryList,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.loading = false
            this.dealData(res.rows)
            // this.baseData = this.getDataChildren(res.rows, undefined);
          } else {
            this.loading = false
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.error(err)
            this.loading = false
          })
      },
      dealData(data) {
        for (let i in data) {
          let isleaf = false
          if (data[i].isleaf == 1) {
            isleaf = false
          } else {
            isleaf = true
          }
          this.gData.push({
            key: data[i].categoryId,
            title: data[i].categoryName,
            isLeaf: isleaf,
            status: data[i].status
          })
        }
      },
      getDataChildren(bdata, pid) {
        var items = []
        for (var key in bdata) {
          var item = bdata[key]
          if (pid == item.parentId) {
            item.items = this.getDataChildren(bdata, item.id)
            items.push(item)
          }
        }
        return items
      },
      //延迟加载树
      onLoadData(treeNode) {
        return new Promise((resolve) => {
          if (treeNode.dataRef.children) {
            resolve()
            return
          }
          setTimeout(() => {
            let params = {}
            params.pid = treeNode.dataRef.key
            this.$axios({
              url: this.api.DrugCategoryList,
              method: 'put',
              data: params
            }).then(res => {
              if (res.code == '200') {
                treeNode.dataRef.children = []
                for (let i in res.rows) {
                  let isLeaf = false
                  if (res.rows[i].isleaf == 1) {
                    isLeaf = false
                  } else {
                    isLeaf = true
                  }
                  treeNode.dataRef.children.push({
                    key: res.rows[i].categoryId,
                    title: res.rows[i].categoryName,
                    isLeaf: isLeaf,
                    status: data[i].status
                  })
                }
                this.gData = [...this.gData]
              } else {
                this.warn(res.msg)
              }
            }).catch(err => {
              this.error(err)
            })
            resolve()
          }, 500)
        })
      },
      newTreeNode() {

      },
      updateTreeNode() {

      },
      enableTreeNode() {

      },
      disableTreeNode() {

      },
      onSelect(selectedKeys, e) {
        console.log(e.node.dataRef)
        this.nodeStatus = e.node.dataRef.status
        this.disable = false
      },

      //操作点击事件
      handleMenuClick(e) {
        console.log(e.key)
        if (e.key == 'new') {
          this.visible = false
          this.clickItem = 'new'
        } else if (e.key == 'update') {
          this.visible = false
          this.clickItem = 'update'
        } else if (e.key == 'enable') {
          this.visible = true
          this.popTitle = '确认启用？'
          this.clickItem = 'enable'
        } else if (e.key == 'disable') {
          this.visible = true
          this.popTitle = '确认停用？'
          this.clickItem = 'disable'
        }

      },
      cancel() {
        this.visible = false
      },
      confirm() {
        if (this.clickItem == 'new') {
          this.newTreeNode()
        } else if (this.clickItem == 'update') {
          this.updateTreeNode()
        } else if (this.clickItem == 'enable') {
          this.enableTreeNode()
        } else if (this.clickItem == 'disable') {
          this.disableTreeNode()
        }
        this.visible = false
      }
    }
  }
</script>

<style scoped>
  .disableNode {
    color: #2D8cF0
  }
</style>