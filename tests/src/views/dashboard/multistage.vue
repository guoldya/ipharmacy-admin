<template>
    <div>
        这是首页
        <a-button @click="aaa">跳到详情页</a-button>
    </div>
</template>
<script>
    export default {
        methods:{
            aaa(){
                this.$router.push({
                    name:'muldetaill',
                    params:{id:1}
                })
            }
        }
    }
</script>