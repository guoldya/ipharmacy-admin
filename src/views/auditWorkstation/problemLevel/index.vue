<template>
    <div>
      <a-spin :spinning="loading" tip="加载中...">
        <el-table
          :data="loadData" border
          :highlight-current-row="true">
          <el-table-column v-for="item in columns" :show-overflow-tooltip="true" :key="item.dataIndex" :label="item.title"
                           :prop="item.dataIndex" :width="item.width" :align="item.align">
            <template slot-scope="props">
                  <span v-if="item.dataIndex == 'status'">
                      <a-badge :status="props.row.status == 0? 'default':'processing'"
                               :text="props.row.status==0?'停用':'启用'"/>
                  </span>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          showSizeChanger
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
    </div>
</template>

<script>
  export default {
    name: 'index'
  }
</script>

<style scoped>

</style>