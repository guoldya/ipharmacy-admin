<template>
    
       <div id="itempanel" class="itempanel" ref="dom">
        <ul>
          <li
            class="getItem"
            data-shape="flow-circle-start"
            data-type="node"
            data-size="70*70"
            data-color="#FA8C16"
            data-label="开始"
          >
            <div class="start"></div>
          </li>
          <li
            class="getItem"
            data-type="node"
            data-shape="flow-rhombus-if"
            data-size="160*70"
            data-color="#13C2C2"
            data-label="判断节点"
          >
            <div class="rhombusIf"></div>
          </li>
          <li
            class="getItem"
            data-type="node"
            data-shape="model-image-branch"
            data-size="80*70"
            data-color="#1890FF"
            data-label="分支节点"
          >
            <div class="branchs"></div>
          </li>
          <li
            class="getItem"
            data-type="node"
            data-shape="model-rect-attribute"
            data-size="180*70"
            data-color="#1890FF"
          >
            <div class="attributes"></div>
          </li>
          <li
            class="getItem"
            data-type="node"
            data-shape="model-card-conclusion"
            data-size="290*80"
            data-color="#13C2C2"
          >
            <div class="conclusions"></div>
          </li>
        </ul>
      </div>

</template>

<script>
export default {
  data(){
    return{
      disabled:false,
    }
  }

}
</script>
<style>

.itempanel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width:93px;
  padding-top: 8px;
  border-right: 1px solid #e6e9ed;
}
.itempanel ul {
  padding: 0px;
}
.itempanel li {
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  /*width: 160px;*/
  /*height: 28px;*/
  padding-top: 5px;
  padding-bottom: 5px;
  line-height: 26px;
  margin-top: 20px;

  border: 1px solid rgba(0, 0, 0, 0);
  list-style-type: none;
}
.itempanel .panel-type-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  background: url(https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg);
}
.itempanel li:hover {
  background: white;
  border: 1px solid #ced4d9;
  cursor: move;
}
  .itempanel .start{
    width: 93px;
    height: 65px;
    background-size:100%;
    background-position:center;
    background-repeat:no-repeat;
    background-image:url('~@/assets/editorPic/start.png');
  }
  .itempanel .attributes{
    width: 95px;
    height: 36px;
    background-size:100%;
    background-position:center;
    background-repeat:no-repeat;
    background-image:url('~@/assets/editorPic/attribute.png');
  }
  .itempanel .rhombusIf{
    width: 93px;
    height: 65px;
    background-size:100%;
    background-position:center;
    background-repeat:no-repeat;
    background-image:url('~@/assets/editorPic/rhombus-if.png');
  }
.itempanel .branchs{
  width: 93px;
  height: 59px;
  background-size:100%;
  background-repeat:no-repeat;
  background-position:center;
  background-image:url('~@/assets/editorPic/branch.png');
}
.itempanel .conclusions{
  width: 93px;
  height: 35px;
  background-size:100%;
  background-repeat:no-repeat;
  background-position:center;
  background-image:url('~@/assets/editorPic/conclusion.png');
}

.disablePic{
  background-image:url('~@/assets/branchOne.png');
}

</style>