<template>
    <a-row :gutter="20">
        <a-col class="countFor" :span="7">
            <div class="cardOne">
                <div class="picStyle extractCritique"></div>
                <div class="countText">
                    <p
                        class="countStyle"
                        :style="{color:countList[0].colors}"
                    >{{countList[0].itemCount}}</p>
                    <span class="countItem opacity6">{{countList[0].item}}</span>
                </div>
            </div>
        </a-col>
        <a-col :span="1">
            <a-divider type="vertical" style="height:80px"></a-divider>
        </a-col>
        <a-col class="countFor" :span="7">
            <div class="cardOne">
                <div class="picStyle comment"></div>
                <div class="countText">
                    <p
                        class="countStyle"
                        :style="{color:countList[1].colors}"
                    >{{countList[1].itemCount}}</p>
                    <span class="countItem opacity6">{{countList[1].item}}</span>
                </div>
            </div>
        </a-col>
        <a-col :span="1">
            <a-divider type="vertical" style="height:80px"></a-divider>
        </a-col>
        <a-col class="countFor" :span="7">
            <div class="cardOne">
                <div class="picStyle issueReview"></div>
                <div class="countText">
                    <p
                        class="countStyle"
                        :style="{color:countList[2].colors}"
                    >{{countList[2].itemCount}}</p>
                    <span class="countItem opacity6">{{countList[2].item}}</span>
                </div>
            </div>
        </a-col>
    </a-row>
</template>

<script>
import countTo from '@/components/count-to'
export default {
    components: {
        countTo
    },
    name: 'count-text',
    props: {
        countList: {
            type: Array,
            required: true
        }
    }
}
</script>

<style scoped>
.divInfo span {
    margin-left: 10px;
}

.countFor {
    text-align: center;
    margin-bottom: 4px;
    margin: 0 auto;
}
.countFor .cardOne {
    width: 220px;
    height: 80px;
    margin: 0 auto;
}

.countStyle {
    font-size: 36px;
    font-weight: 500;
    margin-top: -12px;
    margin-bottom: -6px;
}
.countFor .countText {
    margin-left: 10px;
    margin-top: 10px;
    float: left;
}
.countFor .countItem {
    font-size: 20px;
}
.picStyle {
    height: 80px;
    width: 80px;
    float: left;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
}
.comment {
    background-image: url('~@/assets/reviewPic/comments.png');
}
.extractCritique {
    background-image: url('~@/assets/reviewPic/extractCritique.png');
}
.issueReview {
    background-image: url('~@/assets/reviewPic/issueReview.png');
}
</style>