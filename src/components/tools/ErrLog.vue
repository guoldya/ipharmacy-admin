<template>
    <div v-if="logLength > 0">
        <a-tooltip placement="bottom" :title="tooltipContent" :getPopupContainer="getPopupContainer">
    <span @click="viewLog" class="header-err-log">
      <a-badge v-if="logLengthError>0" :count="logLengthError" :overflowCount="10"
               :numberStyle="{backgroundColor: 'red'} ">
        <a-icon style="font-size: 20px; padding: 4px" type="alert"/>
      </a-badge>
       <a-badge v-else :count="logLength" dot :numberStyle="{backgroundColor: 'blue'} ">
        <a-icon style="font-size: 20px; padding: 4px" type="safety"/>
      </a-badge>
    </span>
        </a-tooltip>
        <a-modal
                class="errlog-modal"
                :title="tooltipContent"
                v-model="dialogVisible"
                :getContainer="getContainer"
                :footer="null"
                centered
                width="100%"
        >
            <div>
                <a-button type="danger" @click="handleLogClean">
                    <a-icon type="delete"/>
                    清空
                </a-button>
                <a-button @click="handleLogExport">
                    <a-icon type="file-excel"/>
                    导出Excel
                </a-button>
            </div>
            <error-log-list/>
        </a-modal>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import ErrorLogList from '@/my-components/error-log-list'

    export default {
        name: 'ErrLog',
        components: {
            ErrorLogList
        },
        data() {
            return {
                dialogVisible: false
            }
        },
        computed: {
            ...mapGetters('log', {
                logLength: 'length',
                logLengthError: 'lengthError'
            }),
            tooltipContent() {
                return this.logLength === 0
                    ? '没有日志或异常'
                    : `${this.logLength} 条日志${this.logLengthError > 0
                        ? ` | 包含 ${this.logLengthError} 个异常`
                        : ''}`
            }
        },
        methods: {
            ...mapMutations('log', [
                'clean'
            ]),
            getContainer() {
                return document.body
            },
            getPopupContainer(trigger) {
                return trigger.parentElement
            },
            viewLog() {
                if (this.logLength > 0) {
                    this.dialogVisible = true
                }
            },
            handleLogClean() {
                this.dialogVisible = false
                this.clean()
            },
            handleLogExport() {
                alert('导出')
            }
        }
    }
</script>

<style lang="less">
    .header-err-log {
        display: inline-block;
        transition: all 0.3s;
        span {
            vertical-align: initial;
        }

    }

    .errlog-modal {
        background-color: white;
    }

    .errlog-modal .ant-modal-body .ant-btn {
        margin-right: 8px;
        margin-bottom: 12px;
    }

    .errlog-modal .ant-modal-content {
        border-radius: 0px !important;
        box-shadow: 0 0px 0px rgba(255, 255, 255, 0) !important;
        -webkit-box-shadow: 0 0px 0px rgba(255, 255, 255, 0) !important;
    }

    .ant-modal.errlog-modal {
        height: 100% !important;
        top: 0px !important;
        padding-bottom: 0px !important;
    }

</style>