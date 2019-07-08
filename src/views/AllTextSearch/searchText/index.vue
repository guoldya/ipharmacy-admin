<template>
  <a-card>
    <header>
      <a-icon type="search" style="color:#1890ff;font-size:20px;" />
      <span class="jiansuo">全文检索</span>
    </header>
    <a-divider />
    <a-row>
      <a-col :span="7"></a-col>
      <a-col :span="8">
        <header></header>
          <a-input-search placeholder="input search text" @search="onSearch" enterButton="Search" size="large" />
      </a-col>
      <a-col :span="9"></a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {
    onSearch(){}
  }
}
</script>

<style scoped>
.jiansuo {
  padding-left: 5px;
  font-size: 20px;
}
</style>