<template>
  <el-table
    ref="multipleTable"
    :data="formatData"
    :row-style="showRow"
    v-bind="$attrs"
    highlight-current-row
    @current-change="currentChange"
  >
    <el-table-column type="selection" align="center" v-if="checkbox" width="55"></el-table-column>
    <el-table-column fixed="right" label="操作" :width="opColWidth" align="center" v-if="isOpcol">
      <template slot-scope="scope">
        <div v-if="(isoperate=='factEng')&&(scope.row.items&&scope.row.items.length>0)&&(scope.row.colType==1)">
          <opcol :items="fliterdata(items)" :more="moreOp" :data="scope.row" :filterItem="['status']"></opcol>
        </div>
        <div v-if="(isoperate=='factEng')&&(scope.row.colType!==1)">
          <opcol :items="items" :more="moreOp" :data="scope.row" :filterItem="['status']"></opcol>
        </div>
        <div v-if="(isoperate=='questionMgt')&&(scope.row.dicType==0)">
          <opcol :items="stopEdit(items)" :more="moreOp" :data="scope.row" :filterItem="['status']"></opcol>
        </div>
        <div v-if="(isoperate=='questionMgt')&&(scope.row.dicType!=0)">
          <opcol :items="items" :more="moreOp" :data="scope.row" :filterItem="['status']"></opcol>
        </div>
        <div v-if="isoperate=='false'">
          <opcol :items="items" :more="moreOp" :data="scope.row" :filterItem="['status']"></opcol>
        </div>
      </template>
    </el-table-column>
    <el-table-column v-if="columns.length === 0" width="150">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span
          class="tree-ctrl"
          v-if="iconShow(0,scope.row)"
          @click="toggleExpanded(scope.$index)"
          style
        >
          <i
            v-if="!scope.row._expanded"
            class="iconfont action action-caretright"
            style="color: #666"
          ></i>
          <i v-else class="iconfont action action-caretdown" style="color: #666"></i>
        </span>
        {{scope.$index}}
      </template>
    </el-table-column>
    <el-table-column
      v-else
      :show-overflow-tooltip="true"
      v-for="(column, index) in columns"
      :key="column.value"
      :label="column.text"
      :width="column.width"
      :align="column.align"
    >
      <template slot-scope="scope">
        <span
          v-for="space in scope.row._level"
          v-if="index == 0"
          class="ms-tree-space"
          :key="space"
        ></span>

        <span
          class="tree-ctrl"
          v-if="iconShow(index,scope.row)"
          @click="toggleExpanded(scope.$index)"
        >
          <i
            v-if="!scope.row._expanded"
            class="iconfont action action-caretright"
            style="color: #666"
          ></i>
          <i v-else class="iconfont action action-caretdown" style="color: #666"></i>
        </span>
        <span v-if="column.value == 'status'">
          <a-badge
            :status="scope.row.status == 0? 'default':'processing'"
            :text="scope.row.status==0?'停用':'启用'"
          />
        </span>

        <!-- //<span v-else-if="column.value == 'clientClass'" v-html="classFormatter(scope.row)"></span> -->
        <span v-else-if="column.format !=null " v-html="column.format(scope.row)"></span>
        <span v-else>{{scope.row[column.value]}}</span>
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>

<script>
/*
 * @param items 操作列展示项
 * @param moreOp 操作列是否展示更多
 * @param opColWidth 操作列的宽度 默认100
 */
import treeToArray from './eval'

export default {
  name: 'treeTable',
  props: {
    isoperate: {
      type: String,
      required: true
    },
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    checkbox: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    moreOp: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isOpcol: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    opColWidth: {
      type: Number,
      default: () => {
        return 100
      }
    },
    filterItem: {
      type: Array,
      default() {
        return []
      }
    },
    currentChange: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      selectData: [],
      item: [{ text: '编辑', showtip: false, click: this.edits }]
    }
  },
  mounted() {},
  computed: {
    // 格式化数据源
    formatData: function() {
      //TODO：直接调用不需要那么多 骚气的操作
      return treeToArray(this.data, true)
    }
  },
  methods: {
    // 过滤要编辑，不要停用启用
    fliterdata(data) {
      let newarr = data.slice(0, 1)
      return newarr
    },
    // 要停用启用不要编辑
     stopEdit(data){
    let newarr = data.slice(1, 3)
      return newarr
     },
    showRow: function(row) {
      const show = row.row.parent ? row.row.parent._expanded && row.row.parent._show : true
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return index === 0 && record.items && record.items.length > 0
    }
    // selectTreeList(val) {
    //   this.selectData = val
    // },
  }
}
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}

.ms-tree-space:before {
  content: '';
}

.processContainer {
  width: 100%;
  height: 100%;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  /* color: #2196f3; */
  margin-left: -14px;
  color: #000000;
  margin-right: 5px;
}
</style>
