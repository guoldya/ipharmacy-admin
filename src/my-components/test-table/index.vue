<template>
  <a-table :columns="columns" :dataSource="data">
    <a slot="name" slot-scope="text" href="javascript:;">{{text}}</a>
    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
    <span slot="tags" slot-scope="tags">
      <a-tag v-for="tag in tags" color="blue" :key="tag">{{tag}}</a-tag>
    </span>
    <span slot="action" slot-scope="text, record">
      <a href="javascript:;">Invite 一 {{record.name}}</a>
      <a-divider type="vertical" />
      <a href="javascript:;">Delete</a>
      <a-divider type="vertical" />
      <a href="javascript:;" class="ant-dropdown-link">
        More actions <a-icon type="down" />
      </a>
    </span>
  </a-table>
</template>
<script>
  const columns = [{
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' },
  }, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  }, {
    title: 'Address',
    dataIndex: 'address',
    width: "180",
    fixed:"true",
    key: 'address',
  }, {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' },
  }, {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  }];

  const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 12222222222222222222222222222222222222222222222222222222222222 Lake Park11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
    tags: ['nice', 'developer'],
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  }];

  export default {
    name: 'test-table',
    data() {
      return {
        data,
        columns,
      }
    }
  }
</script>