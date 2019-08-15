<template>
    <div class="select" ref="sel">
        <a-select mode="multiple" :defaultValue="['a1', 'b2']" placeholder="请选择"  style="width: 420px"
        @dropdownVisibleChange="dvc" >
              <a-select-option v-for="item in selecteds" :key="item.key">
                  {{item.title}}
                  </a-select-option>
              <div slot="dropdownRender" slot-scope="menu">
      </div>
        </a-select>
        <div
            class="content"
            style="width: 420px"
            :class="{'bottom' : position == 'bottom', 'top' : position == 'top'}"
            v-show="show && values.length"
            ref="content">
            <a-tree
                multiple
                :autoExpandParent="false"
                :treeData="treeData"/>
        </div>

    </div>
</template>
<script>
export default {

    name : 'comSelect',
    data(){
        return{
            selecteds:[],
            show : false,
        }
    },
    props : {
        
      treeData:{
        type:Array
      },
        values : {
            type : Array,
            default(){
                return []
            }
        },
        value : {
            
        },
        placeholder:{
            type : String,
            default : '请选择'
        },
    },
    mounted(){
    },
    methods:{
        dvc(open){
            if(!this.show&&open){
            this.show = open;
        this.computePos();
            document.addEventListener('click', this.handleBodyClick)
            }
            console.log(open,"dvc");
        },
        handleBodyClick(e){
            console.log(e);
          if(this.$refs.sel && this.$refs.sel.contains(e.target)){
                // 如果是子元素则阻止事件捕获
            }else{
             document.removeEventListener('click', this.handleBodyClick)
               this.show =false;
            }
        },
        getElementTop(element){
            var actualTop = element.offsetTop;
　　　　         var current   = element.offsetParent;
    　　　　 while (current !== null){
                actualTop += current.offsetTop;
                current = current.offsetParent;
    　　　　 }
　　　　        return actualTop;
        },

        // 计算选择框是往上弹出还是往下弹出
        computePos(){

            let elHeight       = this.$refs.sel.offsetHeight;
            let absPos            = this.getElementTop(this.$refs.sel);
            let contentHeight = this.values.length*40;

            let docScrollHei  = document.body.scrollTop 
                || document.documentElement.scrollTop || 0;

            let docHeight =  document.documentElement.clientHeight
                || document.body.clientHeight || 0;

            if((elHeight+absPos+contentHeight-docScrollHei)>docHeight){
                this.position = 'top';
            }else{
                this.position = 'bottom';
            }
        },
       
    }
}
</script>

<style scoped >

.select{
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
}

.content{
    width: 100%;
    max-height: px(300);
    overflow-y: scroll;
    border-radius: 4px;
    margin-top: 2px;
    position: absolute;
    left: 0;
    background-color: white;
    box-shadow: 0 0 20px 2px #ccc;
    z-index: 2;
}
.content::-webkit-scrollbar {display: none;}

.bottom{
    top: 100%;
}
.top{
    bottom: 125%;
}

</style>