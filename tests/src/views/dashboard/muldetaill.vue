<template>
    <div>
        这是详情页
        {{params}}
        <a-button @click="aaa">跳到首页</a-button>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                params:this.$route.params
            }
        },
        methods:{
            aaa(){
                this.$router.push({
                    name:'mulindex'
                })
            }
        }
    }
</script>