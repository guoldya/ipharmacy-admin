<template>
    <div id="navigator">
        <div data-status="group-selected" class="panel" id="node_detailpanel">
          <div class="panel-title">导航</div>
          <div class="block-container">
            <div id="minimap" ref="dom"></div>
            <a-slider
              :min="50"
              :max="200"
              v-model="zoomRatio"
              style="float: left; width: 220px;margin: 7px 10px 10px;"
            />
            <a-dropdown>
              <span class="ant-dropdown-link" href="javascript:void(0);">
                {{zoomRatio}}%
                <a-icon type="down"/>
              </span>
              <a-menu slot="overlay" @click="onMenuClick">
                <a-menu-item key="50">
                  <a href="javascript:;">50%</a>
                </a-menu-item>
                <a-menu-item key="100">
                  <a href="javascript:;">100%</a>
                </a-menu-item>
                <a-menu-item key="150">
                  <a href="javascript:;">150%</a>
                </a-menu-item>
                <a-menu-item key="200">
                  <a href="javascript:;">200%</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </div>
</template>
<script>
export default {
  data(){
    return {
      zoomRatio:100
    }
  },
  props:['graphAPI'],
  watch: {
    zoomRatio(newValue) {
      this.graphAPI.zoom(newValue / 100)
    }
  },
   methods: {
    onMenuClick(v) {
      this.zoomRatio = Number(v.key)
    }
   }

}
</script>
<style>

#navigator {
  width: 300px;
  height: 276px;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 3;
}
#navigator .slider {
  margin: 7px 10px 10px;
  float: left;
  width: 220px;
}
#navigator #minimap {
  width: 300px;
  height: 220px;
}
.zoom-dropdown-btn {
  color: rgba(0, 0, 0, 0.45);
  margin-left: 4px;
  line-height: 24px;
  font-weight: 100;
  text-decoration: none;
}

</style>
