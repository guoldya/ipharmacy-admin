<template>
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
            更多
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
</template>

<script>
  /**
   *
   *
   * expandedKeys 展开的节点keys
   *
   * autoExpandParent 展开节点的父节点
   *
   * gData 树形结构数据
   *
   * onExpand  展开事件
   *
   * onSelect 选择事件
   *
   * pressEnterChange 输入框回车事件
   *
   * onChange 输入框输入值事件
   *
   * searchRule 查询事件
   *
   * newTreeNode 新建树节点事件
   *
   * updateTreeNode 更新树节点事件
   *
   * deleteTreeNode 删除树节点事件
   *
   * disable 禁用
   *
   * searchValue
   */
  export default {
    name: 'treeList',
    props: {
      expandedKeys: {
        type: Array,
        required: true
      },
      autoExpandParent:{
        type: Boolean,
        required: true
      },
      gData:{
        type: Array,
        required: true
      },
      onExpand:{
        type:Function,
        required: true
      },
      onSelect:{
        type:Function,
        required: true
      },
      pressEnterChange:{
        type:Function,
        required: true
      },
      onChange:{
        type:Function,
        required: true
      },
      searchRule:{
        type:Function,
        required: true
      },
      newTreeNode:{
        type:Function,
        required: true
      },
      updateTreeNode:{
        type:Function,
        required: true
      },
      deleteTreeNode:{
        type:Function,
        required: true
      },
      disable:{
        type:Boolean,
        required: true
      },
      searchValue:{
        type:String,
        required:true,
      }
    },
    mounted(){

    },

  }
</script>

<style scoped>
  .treeCol{
    padding-left: 10px;
    line-height: 32px
  }
</style>