<template>
  <div>

        <template v-if="!more">
            <div style="display: inline-block" v-for="(op,index) in newItem" :key="index">
                <a v-if="(op.showtip==false)" @click="op.click(data)" :style="{'color':op.color?op.color:'#2D8cF0'}">{{op.text}}</a>
                <a-popconfirm v-if="(op.showtip==true)"
                              :title=op.tip
                              placement="topRight"
                              @confirm=op.click(data)>
                    <a :style="'color:'+op.color">{{op.text}}</a>
                </a-popconfirm>
                <a-divider v-if="(index != newItem.length-1)" type="vertical" />
            </div>
        </template>
        <template v-else>
            <a @click="items[0].click(data)" :style="{'color':items[0].color?items[0].color:'#2D8cF0'}">{{items[0].text}}</a>
            <a-divider type="vertical" />
            <!--<a-dropdown>-->
            <!--<a class="ant-dropdown-link">更多<a-icon type="down" /></a>-->
            <!--<a-menu slot="overlay" @click="handleMenuClick" ref="menu">-->
            <!--<a-menu-item  v-for="(op,index) in items.slice(1)" :key="op.text">-->
            <!--<a-popconfirm-->
            <!--:title=op.tip-->
            <!--@confirm=op.click(data)>-->
            <!--<a :style="'color:'+op.color">{{op.text}}</a>-->
            <!--</a-popconfirm>-->
            <!--</a-menu-item>-->
            <!--</a-menu>-->
            <!--</a-dropdown>-->
            <a-dropdown :trigger="['click']">
                <a class="more">更多<a-icon type="down"/>
                    <a-popconfirm :title="popTitle" @confirm="confirm" class="pop" :visible="visible" @cancel="cancel"></a-popconfirm>
                </a>
                <a-menu slot="overlay" @click="handleMenuClick" ref="menu">
                    <a-menu-item  v-for="(op,index) in newItem.slice(1)" :key="index">
                        <a :style="'color:'+op.color">{{op.text}}</a>
                    </a-menu-item>
                </a-menu>
            </a-dropdown>
        </template>
    </div>
</template>
<script>

    /*
     * items 为显示操作的数据
     * more （true 操作超过2个时）
     * data 为该行数据
     * filterItem 需要过滤掉的操作
     */
    export default {
        props: {
            items: {
                type: Array,
                default() {
                    return []
                }
            },
            more: {
                type: Boolean,
                default() {
                    return false
                }
            },
            data: {
                type: Object,
                default() {
                    return {}
                }
            },
            filterItem: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                visible: false,
                popTitle: '',
                clickItem: []
            }
        },
        computed: {
            newItem() {
                let i, j, len = this.items.length, len1 = this.filterItem.length, newItem = []
                for (i = 0; i < len; i++) {
                    let item = this.items[i], num = 0
                    for (j = 0; j < len1; j++) {
                        if (this.data[this.filterItem[j]] == item[this.filterItem[j]]) {
                            break
                        }

                        num++
                    }
                    if (num == len1) {
                        newItem.push(item)
                    }
                }
                // console.log(newItem)
                return newItem
            }
        },
        mounted() {


        },
        methods: {
            handleMenuClick(e) {
                this.clickItem = this.newItem.slice(1)[e.key]
                if (this.clickItem.showtip) {
                    this.popTitle = this.newItem.slice(1)[e.key].tip
                    this.visible = true
                } else {
                    this.clickItem.click(this.data)
                }
            },
            confirm() {
                this.visible = false
                this.clickItem.click(this.data)
            },
            cancel() {
                this.visible = false
            },
            closePop() {
                this.visible = false
            },
            watchClick() {
                window.removeEventListener('click', this.closePop)
            }
        },
        watch: {
            visible(value) {
                if (value) {
                    window.addEventListener('click', this.closePop)
                } else {
                    window.removeEventListener('click', this.closePop)
                }
            }
        }
    }
</script>
<style>

    .more {
        position: relative;
    }

    .pop {
        position: absolute;
        left: 50%;
        bottom: 50%;
    }

    .pop:before {
        clear: both;
    }
</style>