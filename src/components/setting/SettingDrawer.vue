<template>
    <div class="setting-drawer" ref="settingDrawer">
        <a-drawer
                width="300"
                placement="right"
                :closable="false"
                @close="onClose"
                :visible="visible"
                :getContainer="() => $refs.settingDrawer"
                :style="{}"
        >
            <div class="setting-drawer-index-content">

                <div :style="{ marginBottom: '24px' }">
                    <h3 class="setting-drawer-index-title">整体风格设置</h3>

                    <div class="setting-drawer-index-blockChecbox">
                        <a-tooltip>
                            <template slot="title">
                                暗色菜单风格
                            </template>
                            <div class="setting-drawer-index-item" @click="handleMenuTheme('dark')">
                                <img src="https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg"
                                     alt="dark">
                                <div class="setting-drawer-index-selectIcon" v-if="navTheme === 'dark'">
                                    <a-icon type="check"/>
                                </div>
                            </div>
                        </a-tooltip>

                        <a-tooltip>
                            <template slot="title">
                                亮色菜单风格
                            </template>
                            <div class="setting-drawer-index-item" @click="handleMenuTheme('light')">
                                <img src="https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg"
                                     alt="light">
                                <div class="setting-drawer-index-selectIcon" v-if="navTheme !== 'dark'">
                                    <a-icon type="check"/>
                                </div>
                            </div>
                        </a-tooltip>
                    </div>
                </div>

                <div :style="{ marginBottom: '24px' }">
                    <h3 class="setting-drawer-index-title">主题色</h3>

                    <div style="height: 20px">
                        <a-tooltip class="setting-drawer-theme-color-colorBlock" v-for="(item, index) in colorList"
                                   :key="index">
                            <template slot='title'>
                                {{ item.key }}
                            </template>
                            <a-tag :color="item.color" @click="changeColor(item.color)">
                                <a-icon type="check" v-if="item.color === primaryColor"></a-icon>
                            </a-tag>
                        </a-tooltip>

                    </div>
                </div>
                <a-divider/>

                <div :style="{ marginBottom: '24px' }">
                    <h3 class="setting-drawer-index-title">导航模式</h3>

                    <div class="setting-drawer-index-blockChecbox">
                        <a-tooltip>
                            <template slot="title">
                                侧边栏导航
                            </template>
                            <div class="setting-drawer-index-item" @click="handleLayout('sidemenu')">
                                <img src="https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg"
                                     alt="sidemenu">
                                <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'sidemenu'">
                                    <a-icon type="check"/>
                                </div>
                            </div>
                        </a-tooltip>

                        <a-tooltip>
                            <template slot="title">
                                顶部栏导航
                            </template>
                            <div class="setting-drawer-index-item" @click="handleLayout('topmenu')">
                                <img src="https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg"
                                     alt="topmenu">
                                <div class="setting-drawer-index-selectIcon" v-if="layoutMode !== 'sidemenu'">
                                    <a-icon type="check"/>
                                </div>
                            </div>
                        </a-tooltip>
                    </div>
                    <div :style="{ marginTop: '24px' }">
                        <a-list :split="false">
                            <a-list-item>
                                <a-tooltip slot="actions">
                                    <template slot='title'>
                                        该设定仅 [顶部栏导航] 时有效
                                    </template>
                                    <a-select size="small" style="width: 80px;" :defaultValue="contentWidth"
                                              @change="handleContentWidthChange">
                                        <a-select-option value="Fixed">固定</a-select-option>
                                        <a-select-option value="Fluid" v-if="layoutMode !== 'sidemenu'">流式
                                        </a-select-option>
                                    </a-select>
                                </a-tooltip>
                                <a-list-item-meta>
                                    <div slot="title">内容区域宽度</div>
                                </a-list-item-meta>
                            </a-list-item>
                            <a-list-item>
                                <a-switch slot="actions" size="small" :defaultChecked="fixedHeader"
                                          @change="handleFixedHeader"/>
                                <a-list-item-meta>
                                    <div slot="title">固定 Header</div>
                                </a-list-item-meta>
                            </a-list-item>
                            <a-list-item>
                                <a-switch slot="actions" size="small" :disabled="!fixedHeader"
                                          :defaultChecked="autoHideHeader" @change="handleFixedHeaderHidden"/>
                                <a-list-item-meta>
                                    <div slot="title"
                                         :style="{ textDecoration: !fixedHeader ? 'line-through' : 'unset' }">下滑时隐藏
                                        Header
                                    </div>
                                </a-list-item-meta>
                            </a-list-item>
                            <a-list-item>
                                <a-switch slot="actions" size="small" :disabled="(layoutMode === 'topmenu')"
                                          :defaultChecked="fixSiderbar" @change="handleFixSiderbar"/>
                                <a-list-item-meta>
                                    <div slot="title"
                                         :style="{ textDecoration: layoutMode === 'topmenu' ? 'line-through' : 'unset' }">
                                        固定侧边菜单
                                    </div>
                                </a-list-item-meta>
                            </a-list-item>
                          <a-list-item>
                            <a-switch slot="actions" size="small"
                                      :defaultChecked="multiPage" @change="handleMultipage"/>
                            <a-list-item-meta>
                              <div slot="title">
                                多页卡模式
                              </div>
                            </a-list-item-meta>
                          </a-list-item>
                          <a-list-item>
                            <a-switch slot="actions" size="small"
                                      :defaultChecked="transition" @change="handleTransition"/>
                            <a-list-item-meta>
                              <div slot="title">
                                页面过渡动画
                              </div>
                            </a-list-item-meta>
                          </a-list-item>
                          <a-list-item>
                            <a-button
                              @click="doClearLockPass"
                              icon="sync"
                              spin
                              block
                            >清除锁屏密码</a-button>
                          </a-list-item>
                        </a-list>
                    </div>
                </div>
                <a-divider/>

                <div :style="{ marginBottom: '24px' }">
                    <h3 class="setting-drawer-index-title">其他设置</h3>
                    <div>
                        <a-list :split="false">
                            <a-list-item>
                                <a-switch slot="actions" size="small" :defaultChecked="colorWeak"
                                          @change="onColorWeak"/>
                                <a-list-item-meta>
                                    <div slot="title">色弱模式</div>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </div>
                </div>
                <a-divider/>
              <div :style="{ marginBottom: '24px' }">
                <p>当前版本：{{productInfo}}</p>
                <p>{{copyright}}</p>
              </div>
            </div>
            <div class="setting-drawer-index-handle" @click="toggle">
                <a-icon type="setting" v-if="!visible"/>
                <a-icon type="close" v-else/>
            </div>
        </a-drawer>
    </div>
</template>

<script>
    import DetailList from '@/components/tools/DetailList'
    import SettingItem from '@/components/setting/SettingItem'
    import { updateTheme, updateColorWeak, colorList } from '@/components/tools/setting'
    import { mixin, mixinDevice } from '@/utils/mixin'
    import config from '@/config/defaultSettings'
    import setting from '@/setting.js'
    export default {
        components: {
            DetailList,
            SettingItem
        },
        mixins: [mixin, mixinDevice],
        data() {
            return {
                visible: true,
                colorList,
                productInfo: setting.releases.name + ' ' + setting.releases.version  ,
                copyright:process.env.VUE_APP_COPYRIGHT,
            }
        },
        watch: {},
        mounted() {
            const vm = this
            setTimeout(() => {
                vm.visible = false
            }, 16)
          this.$debuger.warning(this.primaryColor,'主题颜色')


            // 当主题色不是默认色时，才进行主题编译
            if (this.primaryColor !== config.primaryColor) {
                updateTheme(this.primaryColor)
            }
            if (this.colorWeak !== config.colorWeak) {
                updateColorWeak(this.colorWeak)
            }
        },
        methods: {
            doClearLockPass()
            {
              this.$store.dispatch('preference/clearLockPass')
            },
            showDrawer() {
                this.visible = true
            },
            onClose() {
                this.visible = false
            },
            toggle() {
                this.visible = !this.visible
            },
            onColorWeak(checked) {
                this.$store.dispatch('preference/ToggleWeak', checked)
                this.$store.dispatch('preference/save')
                updateColorWeak(checked)
            },
            handleMenuTheme(theme) {
                this.$store.dispatch('preference/ToggleTheme', theme)
                this.$store.dispatch('preference/save')
            },
            handleLayout(mode) {
              // if (mode =='sidemenu'){
              //   $('.page-header[data-v-6740ec88]').css("padding","0 32px");
              // }else {
              //   $('.page-header[data-v-6740ec88]').css("padding","16px 32px 0");
              // }
                this.$store.dispatch('preference/ToggleLayoutMode', mode)
                // 因为顶部菜单不能固定左侧菜单栏，所以强制关闭
              this.$store.dispatch('preference/save')
                this.handleFixSiderbar(false)
              console.log('handleLayout',mode)
            },
            handleContentWidthChange(type) {
                this.$store.dispatch('preference/ToggleContentWidth', type)
                this.$store.dispatch('preference/save')
            },
            changeColor(color) {
                if (this.primaryColor !== color) {
                    this.$store.dispatch('preference/ToggleColor', color)
                    this.$store.dispatch('preference/save')
                    updateTheme(color)
                }
            },
            handleFixedHeader(fixed) {
                this.$store.dispatch('preference/ToggleFixedHeader', fixed)
              this.$store.dispatch('preference/save')
            },
            handleFixedHeaderHidden(autoHidden) {
                this.$store.dispatch('preference/ToggleFixedHeaderHidden', autoHidden)
              this.$store.dispatch('preference/save')
            },
            handleFixSiderbar(fixed) {
                if (this.layoutMode === 'topmenu') {
                    this.$store.dispatch('preference/ToggleFixSiderbar', false)
                  this.$store.dispatch('preference/save')
                    return
                }

                this.$store.dispatch('preference/ToggleFixSiderbar', fixed)
              this.$store.dispatch('preference/save')
            },
          handleMultipage(multipage) {
            this.$store.dispatch('preference/ToggleMultipage', multipage)
            this.$store.dispatch('preference/save')

          },
          handleTransition(transition)
          {
            this.$store.dispatch('preference/ToggleTransition', transition)
            this.$store.dispatch('preference/save')
          }
        }
    }
</script>

<style lang="less" scoped>
    .setting-drawer-index-content {
        .setting-drawer-index-blockChecbox {
            display: flex;
            .setting-drawer-index-item {
                margin-right: 16px;
                position: relative;
                border-radius: 4px;
                cursor: pointer;
                img {
                    width: 48px;
                }
                .setting-drawer-index-selectIcon {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 100%;
                    padding-top: 15px;
                    padding-left: 24px;
                    height: 100%;
                    color: #1890ff;
                    font-size: 14px;
                    font-weight: 700;
                }
            }
        }
        .setting-drawer-theme-color-colorBlock {
            width: 20px;
            height: 20px;
            border-radius: 2px;
            float: left;
            cursor: pointer;
            margin-right: 8px;
            padding-left: 0px;
            padding-right: 0px;
            text-align: center;
            color: #fff;
            font-weight: 700;
            i {
                font-size: 14px;
            }
        }
    }

    .setting-drawer-index-handle {
        position: absolute;
        top: 240px;
        background: #1890ff;
        width: 48px;
        height: 48px;
        right: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        pointer-events: auto;
        z-index: 1001;
        text-align: center;
        font-size: 16px;
        border-radius: 4px 0 0 4px;
        i {
            color: rgb(255, 255, 255);
            font-size: 20px;
        }
    }
</style>