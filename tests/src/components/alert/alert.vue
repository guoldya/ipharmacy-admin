<template>
    <div>
      <a-alert class="margin-top-10" type="info" :show-icon="true">
        <div slot="message">
          已选择&nbsp;<a style="font-weight: 600">{{checkNum}}</a>&nbsp;项&nbsp;
          <a style="margin-left: 2px" @click="clearSelect">清空</a>
        </div>
      </a-alert>
    </div>
</template>

<script>
  export default {
    name: 'alert',
    props:{
      checkNum:{
        type:Number,
        required: true
      },
      clearSelect:{
        type:Function,
        required: true
      },
    },
  }
</script>

<style scoped>

</style>