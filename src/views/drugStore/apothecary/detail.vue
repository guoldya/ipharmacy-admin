<template>
  <div class="yaoshi">
    <a-card>
      <header>
        <h3 class="returns"><返回</h3>
        <div class="does">
          <a-button type="primary">保存</a-button>
          <a-button>取消</a-button>
        </div>
      </header>
      <a-divider />
      <h2>基础信息</h2>
       <a-divider style="margin: 10px 0;"/>
    </a-card>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // 查询数据

    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios({
            url: this.api.updt,
            method: 'post',
            data: values
          })
            .then(res => {
              if (res.code == '200') {
                this.$message.info('保存成功!')
                this.backTo()
              } else {
                this.$message.error('保存失败!')
                this.warn(res.msg)
              }
            })
            .catch(err => {
              this.error(err)
            })
        }
      })
    },
    backTo() {
      this.$router.push({
        name: 'dataEngindex'
      })
    },
    confirm(e) {},
    handlesColor(data) {
      if (data) {
        this.listData.levelColor = data
      }
    }
  }
}
</script>
<style lang='less'>
.yaoshi {
  header {
    h3 {
      margin-top: 6px;
      font-size: 17px;
    }
    height: 25px;
    .returns {
      float: left;
    }
    .does {
      float: right;

      :nth-child(2) {
        margin-left: 20px;
      }
    }
  }
}
</style>