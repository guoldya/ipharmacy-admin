<template>
    <div class="clearfix">
        <a-upload
                action="/api/sys/upload/image"
                listType="picture-card"
                :fileList="fileList"
                @preview="handlePreview"
                @change="handleChange"
        >
            <div v-if="fileList.length < count">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
            </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>
<script>
    export default {
        props:{
            count:{
                type:Number,
                require:true
            }
        },
        data () {
            return {
                previewVisible: false,
                previewImage: '',
                fileList: [],
                imgArr:[]
            }
        },
        methods: {
            handleCancel () {
                this.previewVisible = false
            },
            handlePreview (file) {
                this.previewImage = file.url || file.thumbUrl
                this.previewVisible = true
            },
            handleChange ({file, fileList}) {
                this.fileList = fileList;
                console.log(file, fileList)
                let imgUrls = []
                fileList.forEach((file,index) => {
                    if (file.response && file.response.code === '200') {
                        imgUrls.push(file.response.fileInfo[0])

                    }
                    if(file.response && file.response.code != '200'&& file.status == 'done'){
                        this.warn('图片上传失败')
                        fileList.splice(index,1)
                        this.fileList = fileList;
                    }
                })
                this.imgArr = imgUrls;
            },
        },
    }
</script>
<style>
    /* you can make up upload button and sample style by using stylesheets */
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>