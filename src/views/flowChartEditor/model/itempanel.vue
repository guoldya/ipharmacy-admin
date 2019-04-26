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
            <span class="panel-type-icon"></span>开始节点
          </li>
          <li
            class="getItem"
            data-type="node"
            data-shape="model-rect-attribute"
            data-size="180*70"
            data-color="#1890FF"
          >
            <span class="panel-type-icon"></span>属性节点
          </li>
          <li
            class="getItem"
            data-type="node"
            data-shape="flow-rhombus-if"
            data-size="160*70"
            data-color="#13C2C2"
            data-label="判断节点判断节点判断节点判"
          >
            <span class="panel-type-icon"></span>判断节点
          </li>
          <li
            class="getItem"
            data-type="node"
            data-shape="model-image-branch"
            data-size="80*70"
            data-color="#1890FF"
            data-label="分支节点"
          >
            <span class="panel-type-icon"></span>分支节点
          </li>

          <li
            class="getItem"
            data-type="node"
            data-shape="model-card-conclusion"
            data-size="290*80"
            data-color="#13C2C2"
          >
            <span class="panel-type-icon"></span>结论节点
          </li>
        </ul>
      </div>
</template>

<script>
export default {


}
</script>
<style>

.itempanel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  padding-top: 8px;
  border-right: 1px solid #e6e9ed;
}
.itempanel ul {
  padding: 0px;
  padding-left: 16px;
}
.itempanel li {
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: 160px;
  height: 28px;
  line-height: 26px;
  padding-left: 8px;
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
</style>