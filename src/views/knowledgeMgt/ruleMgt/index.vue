<template>
  <a-card>
    <a-row class="ruleRow">
      <a-col :xl="8" :xxl="5">
        <div class="ruleCow">
          <a-card>
            <a-row>
              <a-col :span="13">
                <a-input @pressEnter="pressEnterChange" placeholder="请输入" @change="onChange"/>
              </a-col>
              <a-col class="treeCol" :span="5">
                <a-button size="small" type="primary" @click="searchRule">查询</a-button>
              </a-col>
              <a-col :span="6" class="treeCol">
                <a-dropdown :trigger="['click']">
                  <a-menu slot="overlay">
                    <a-menu-item key="1" @click="newTreeNode">新增</a-menu-item>
                    <a-menu-item key="2" @click="updateTreeNode">编辑</a-menu-item>
                    <a-menu-item key="3" @click="deleteTreeNode">
                      <a-popconfirm
                        title="你确定要删除该分类吗？">删除
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                  <a :disabled="disable">
                    操作
                    <a-icon type="down"/>
                  </a>
                </a-dropdown>
              </a-col>
            </a-row>
            <a-row>
              <a-tree
                class="draggable-tree"
                @expand="onExpand"
                :expandedKeys="expandedKeys"
                :autoExpandParent="autoExpandParent"
                @select="onSelect"
                :treeData="gData"
              >
                <template slot="title" slot-scope="{title}">
              <span v-if="title.indexOf(searchValue) > -1">
                {{title.substr(0, title.indexOf(searchValue))}}
                <span style="color: #f50">{{searchValue}}</span>
                {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
              </span>
                  <span v-else>{{title}}</span>
                </template>
              </a-tree>
            </a-row>
          </a-card>
        </div>
      </a-col>
      <a-col :xl="16" :xxl="19">
        <a-card>
          <Searchpanel ref="searchPanel" :list="list">
            <div slot="control">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
            </div>
          </Searchpanel>
          <a-button class="margin-top-10" type="primary" :disabled="disable" @click="addMdc">添加药品</a-button>
          <a-spin tip="加载中..." :spinning="loading">
            <el-table
              ref="table"
              :data="loadData"
              border
              class="margin-top-10"
              :highlight-current-row="true"
            >
              <el-table-column :show-overflow-tooltip="true" v-for="item in columns" :key="item.prop"
                               :label="item.title" :prop="item.prop" :width="item.width" :align="item.align">
                <template slot-scope="props">
                  <span v-if="item.prop == 'status'">
                     <a-badge v-if="props.row.status == 0" status="default" text="未配置"/>
                     <a-badge v-else-if="props.row.status == 1" status="warning" text="已修改"/>
                     <a-badge v-else-if="props.row.status == 2" status="error" text="已停用"/>
                     <a-badge v-else-if="props.row.status == 3" status="processing" text="已配置，待生效"/>
                     <a-badge v-else-if="props.row.status == 4" status="warning" text="已驳回"/>
                    <a-badge v-else-if="props.row.status == 4" status="success" text="已生效"/>
                  </span>
                  <span v-else-if="item.prop == 'rule'" v-html="ruleType(props.row.rule)"></span>
                  <span v-else-if="item.prop == 'type'" v-html="typeType(props.row.type)"></span>
                  <span v-else-if="item.prop == 'action'">
                                    <span class='editable-row-operations'>
                                        <span>
                                            <a @click="edit(props)">编辑</a>
                                            <a-divider type="vertical"/>
                                            <a-popconfirm title="确定删除?" @confirm="del(props.row)" okText="删除"
                                                          cancelText="取消">
                                                <a href="javascript:;">删除</a>
                                            </a-popconfirm>
                                        </span>
                                    </span>
                                </span>
                  <span v-else>{{props.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
            <a-pagination
              showSizeChanger
              showQuickJumper
              :total="total"
              class="pnstyle"
              :defaultPageSize="pageSize"
              :pageSizeOptions="['10', '20','50']"
              @showSizeChange="pageChangeSize"
              @change="pageChange"
              size="small"
            >
            </a-pagination>
          </a-spin>
        </a-card>
      </a-col>
      <a-modal
        :title="Modal.modalTitle"
        :visible="Modal.visible"
        @ok="handleOk"
        :confirmLoading="Modal.confirmLoading"
        @cancel="handleCancel"
        class="ruleModal"
      >
        <a-form :form="form">
          <a-form-item style="padding-top: 20px" label="分类名称"
                       :label-col="{ span: 5 }"
                       :wrapper-col="{ span: 15 }">
            <a-input v-decorator="[ 'title' ]"/>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        title="添加药品"
        :visible="drugModal.visible"
        @ok="drugOk"
        :confirmLoading="drugModal.confirmLoading"
        @cancel="drugCancel"
        class="drugModal"
      >
        <a-input-search
          placeholder="请输入名称或简码"
          style="width: 200px;"
          @change="searchDrug"
        >

        </a-input-search>
        <el-table
          ref="table"
          :data="drugData"
          border
          class="margin-top-10"
          :highlight-current-row="true"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" v-for="item in column2" :key="item.prop"
                           :label="item.title" :prop="item.prop" :width="item.width" :align="item.align">
            <template slot-scope="props">
              <span>{{props.row[item.prop]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          :total="total"
          class="pnstyle"
          :defaultPageSize="pageSize"
          :pageSizeOptions="['10', '20','50']"
          @showSizeChange="pageChangeSize"
          @change="pageChange"
          size="small"
        >
        </a-pagination>
      </a-modal>
    </a-row>
  </a-card>
</template>

<script>
  import treeList from './treeList.vue'

  export default {
    components: {
      treeList
    },
    name: 'ruleMgt',
    data() {
      return {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        gData: [
          {
            key: '0',
            value: '0',
            scopedSlots: { title: 'title' },
            title: '系统规则',
            children: [
              {
                key: '01',
                value: '0',
                type: '1',
                scopedSlots: { title: 'title' },
                title: '药品',
                children: [
                  {
                    key: '011',
                    value: '0',
                    scopedSlots: { title: 'title' },
                    title: '中成药'
                  },
                  {
                    key: '012',
                    value: '0',
                    scopedSlots: { title: 'title' },
                    title: '西成药'
                  },
                  {
                    key: '013',
                    value: '0',
                    scopedSlots: { title: 'title' },
                    title: '中草药',
                    children: [
                      {
                        key: '0131',
                        value: '0',
                        scopedSlots: { title: 'title' },
                        title: '中药饮片'
                      },
                      {
                        key: '0132',
                        value: '0',
                        scopedSlots: { title: 'title' },
                        title: '防病补虚药'
                      }
                    ]
                  }
                ]
              },
              {
                key: '02',
                value: '0',
                type: '2',
                scopedSlots: { title: 'title' },
                title: '通用'
              }
            ]
          },
          {
            key: '1',
            value: '1',
            scopedSlots: { title: 'title' },
            title: '自定义规则',
            children: [
              {
                key: '11',
                value: '1',
                type: '1',
                scopedSlots: { title: 'title' },
                title: '药品',
                children: [
                  {
                    key: '111',
                    value: '1',
                    type: '1',
                    scopedSlots: { title: 'title' },
                    title: '中成药'
                  },
                  {
                    key: '112',
                    value: '1',
                    type: '1',
                    scopedSlots: { title: 'title' },
                    title: '西成药'
                  },
                  {
                    key: '113',
                    value: '1',
                    type: '1',
                    scopedSlots: { title: 'title' },
                    title: '中草药',
                    children: [
                      {
                        key: '1131',
                        value: '1',
                        type: '1',
                        scopedSlots: { title: 'title' },
                        title: '中药饮片'
                      },
                      {
                        key: '1132',
                        value: '1',
                        type: '1',
                        scopedSlots: { title: 'title' },
                        title: '防病补虚药'
                      }
                    ]
                  }
                ]
              },
              {
                key: '12',
                value: '1',
                type: '2',
                scopedSlots: { title: 'title' },
                title: '通用'
              }
            ]
          }
        ],
        dataList: [],
        loading: false,
        loadData: [{ rule: '1', type: '1', ruleName: '剂型与给药途径匹配性', status: '3', time: '2015-01-01 12:00' }],
        columns: [{ title: '规则', prop: 'rule', width: 90, align: 'center' },
          { title: '类型', prop: 'type', width: 90, align: 'center' },
          { title: '规则名称', prop: 'ruleName' },
          { title: '状态', prop: 'status', width: 140, align: 'center' },
          { title: '生效时间', prop: 'time', width: 150, align: 'right' },
          { title: '操作', prop: 'action', width: 110, align: 'center' }
        ],
        //药品数据和表格title
        drugData: [
          { drugId: '123456', drugName: '阿司匹林', dosage: '颗粒', manufacturer: '肛泰制药' }
        ],
        column2: [{ title: '药品编码', prop: 'drugId', width: 100 },
          { title: '药品名称', prop: 'drugName' },
          { title: '剂型', prop: 'dosage', width: 70 },
          { title: '生成厂家', prop: 'manufacturer', width: 100 }],

        confirmLoading: false,
        total: 10,
        pageSize: 10,
        visible: false,
        values: '',
        selectNode: '',
        disable: true,
        Modal: {
          modalTitle: '新增分类',
          visible: false,
          confirmLoading: false
        },
        drugModal: {
          visible: false,
          confirmLoading: false
        },
        form: this.$form.createForm(this),
        selkeys: null
      }
    },
    mounted() {
      this.getgData()
    },
    computed: {
      list() {
        return [
          {
            name: '规则名称',
            dataField: 'clientId',
            type: 'text'
          },
          { name: '状态', dataField: 'drugName', type: 'select' }

        ]
      }
    },
    methods: {
      //搜索
      search() {
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = 10
        params.offset = 0
        // this.fetchYJSMapData(params)
      },
      //重置
      resetForm() {
        this.$refs.searchPanel.form.resetFields()
        // this.fetchYJSMapData({ pageSize: 10, offset: 0 })
      },

      //查询按下回车的回调
      pressEnterChange(e) {
        this.searchRule()
      },
      //查询
      searchRule() {
        const expandedKeys = this.dataList.map((item) => {
          if (this.values) {
            if (item.title.indexOf(this.values) > -1) {
              return this.getParentKey(item.title, this.gData)
            }
          }
          return null
        }).filter((item, i, self) => item && self.indexOf(item) === i)
        Object.assign(this, {
          expandedKeys,
          searchValue: this.values,
          autoExpandParent: true
        })
      },
      //输入框值改变事件
      onChange(e) {
        this.values = e.target.value
      },
      //树形节点点击事件
      onSelect(selectedKeys, e) {
        this.selkeys = selectedKeys
        this.selectNode = e.node.dataRef
        if (e.node.dataRef.value == '0' || (e.node.dataRef.value == '1' && e.node.dataRef.type != '1')) {
          this.disable = true
        } else {
          this.disable = false
        }
      },
      //树形节点展开事件
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      generateList(data) {

        for (let i = 0; i < data.length; i++) {
          const node = data[i]

          const key = node.key
          const title = node.title
          this.dataList.push({ key, title: title })
          if (node.children) {
            this.generateList(node.children, node.title)
          }
        }
      },
      getParentKey(title, tree) {
        let parentKey
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i]
          if (node.children) {
            if (node.children.some(item => item.title === title)) {
              parentKey = node.key
            } else if (this.getParentKey(title, node.children)) {
              parentKey = this.getParentKey(title, node.children)
            }
          }
        }
        return parentKey
      },
      //获取树形结构数据
      getgData() {
        this.generateList(this.gData)
      },


      //页面数change事件
      pageChangeSize() {

      },
      //页面跳转事件
      pageChange() {

      },

      //新增树节点
      newTreeNode() {
        if (this.selectNode) {
          this.Modal.modalTitle = '新增分类'
          this.Modal.visible = true
        } else {
          this.warn('请选择规则')
        }
      },
      updateTreeNode() {
        setTimeout(() => {
          this.form.setFieldsValue({ title: this.selectNode.title })
        }, 100)
        if (this.selectNode) {
          this.Modal.modalTitle = '编辑分类'
          this.Modal.visible = true
        } else {
          this.warn('请选择规则')
        }
      },
      deleteTreeNode() {
        if (this.selectNode) {
        } else {
          this.warn('请选择规则')
        }
      },
      handleOk() {
        let data = this.form.getFieldsValue()
        this.Modal.visible = false
      },
      handleCancel() {
        this.Modal.visible = false
      },

      addMdc() {
        if (!this.disable) {
          this.drugModal.visible = true
        } else {
          this.warn('请选择规则')
        }
      },
      edit(data) {
        let newPage = this.$router.resolve({
          name: 'flowChartEditor'
        })
        window.open(newPage.href, '_blank')
      },
      drugOk() {
        this.drugModal.visible = false
      },
      drugCancel() {
        this.drugModal.visible = false
      },

      searchDrug(e) {
        console.log(e.target.value)
      },

      //filter
      ruleType(value) {
        if (value == '1') {
          return '系统'
        } else if (value == '2') {
          return '自定义'
        }
      },
      typeType(value) {
        if (value == '1') {
          return '药品规则'
        } else if (value == '2') {
          return '分类规则'
        } else if (value == '3') {
          return '分组规则'
        } else if (value == '4') {
          return '通用规则'
        }
      }
    }
  }
</script>

<style>
  .ruleCow {
    padding-right: 5px;
  }

  .treeCol {
    padding-left: 10px;
    line-height: 32px
  }

  .ruleRow .ant-card-body {
    padding: 24px 20px !important;
  }

  .ruleModal .ant-modal-body {
    padding: 4px !important;

  }

  .drugModal .ant-modal-body {
    text-align: right
  }

</style>