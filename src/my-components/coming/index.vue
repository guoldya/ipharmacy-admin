<template>
  <a-layout class="full-layout coming-soon-page">
    <a-layout-content >
      <div id="wrapper">
        <div class="place_balk_workers">
          <div class="balk_workers" />
          <div class="saw" />
          <div class="balk" />
        </div>
        <div class="title">{{title}}</div>
        <div id="watch">
          <div class="dash days_dash">
            <div class="digit">{{days}}</div>
            <span class="dash_title">天</span>
          </div>
          <div class="dash hours_dash">
            <div class="digit">{{hours}}</div>
            <span class="dash_title">时</span>
          </div>
          <div class="dash minutes_dash">
            <div class="digit">{{minutes}}</div>
            <span class="dash_title">分</span>
          </div>
          <div class="dash seconds_dash">
            <div class="digit">{{seconds}}</div>
            <span class="dash_title">秒</span>
          </div>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
  import moment from 'moment'
  /**
   * 倒计时页面
   * <Coming
   title="精彩即将呈现"
   value={Date.now() + 1000 * 60 * 60 * 24 * 2}
   />
   */

  const countdownId=0;
  export default {
    name: 'coming',
    props: {
      title: {
        type: String,
        default: '精彩即将呈现'
      },
      value:
        {
          type: Number,
          default: Date.now()
        }
    },
    data() {
      return {
        days :'00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      }
    },
    updated()
    {
      this.syncTimer();
    },
    mounted()
    {
      this.syncTimer();
    },
    beforeDestroy:function(){
      this.stopTimer();
    },
    methods:
      {
        stopTimer() {
          clearInterval(this.countdownId)
          this.countdownId = null;
        },
        startTimer () {
          if (this.countdownId) return
          this.countdownId = setInterval(() => this.parseTime(this.value), 500)
        },
        syncTimer()
        {
          const timestamp = moment(this.value).valueOf()
          console.log('timestamp',timestamp)
          if (timestamp >= Date.now()) {
            this.startTimer()
          } else {
            this.stopTimer()
          }
        },
        parseTime(value){
          const target = moment(value)
          const current = moment()
          const diffTime = Math.max(target - current, 0)
          const duration = moment.duration(diffTime, 'milliseconds')

          this.days= this.formatDoubleStr(duration.days())
          this.hours=  this.formatDoubleStr(duration.hours())
          this.minutes= this.formatDoubleStr(duration.minutes())
          this.seconds= this.formatDoubleStr(duration.seconds())
        },
        formatDoubleStr(number)
        {
          return number < 10 ? '0' + number : number;
        }
      }
  }
</script>

<style lang="less" scoped>
  .coming-soon-page {
    background-color: #f0f0f0;
  .title {
    font-size: 26px;
    font-weight: 300;
    text-align: center;
    color: #333;
    line-height: 28px;
    margin: 25px 10px 55px 10px;
  }
  .place_balk_workers {
    width: 437px;
    height: 213px;
    position: relative;
    margin: 90px auto -10px;
  .balk_workers {
    width: 437px;
    height: 213px;
    position: relative;
    background-image: url('./images/workers.png');
    background-repeat: no-repeat;
    background-position: center bottom;
    background-color: transparent;
    background-size: 100%;
    z-index: 3;
  }
  .balk {
    width: 60px;
    height: 23px;
    background-image: url('./images/balk.png');
    background-repeat: no-repeat;
    background-position: center bottom;
    background-color: transparent;
    background-size: 100%;
    position: absolute;
    top: 90px;
    left: 178px;
  }
  .saw {
    width: 325px;
    height: 63px;
    background-image: url('./images/saw.png');
    background-repeat: no-repeat;
    background-position: center bottom;
    background-color: transparent;
    background-size: 100%;
    position: absolute;
    left: 53px;
    top: 68px;
    z-index: 2;
    animation: 1s ease 0s normal none infinite saw;
    animation: saw 1s infinite ease-in-out;
    transform-origin: 85% 65%;
  }
  }
  #watch {
    color: #f6f7f9;
    text-align: center;
  }

  #watch .dash {
    display: inline-block;
    padding: 20px 30px;
    line-height: 72px;
    text-align: center;
    margin: 0 -3px;
  }

  #watch .dash:first-child {
    border-radius: 8px 0px 0px 8px;
    background-color: #0089e9;
  }
  #watch .dash:last-child {
    border-radius: 0px 8px 8px 0px;
    background-color: #00b6f9;
    padding-left: 28px;
    padding-right: 28px;
  }

  #watch .dash:nth-child(2) {
    background-color: #0097f6;
  }
  #watch .dash:nth-child(3) {
    background-color: #00a7f8;
  }

  #watch .dash .digit {
    display: block;
    width: 48px;
    font-size: 44px;
    line-height: 44px;
    height: 38px;
    float: left;
  }

  #watch .dash .digit .top,
  #watch .dash .digit .bottom {
    font-weight: 300;
  }

  #watch .dash span.dash_title {
    font-size: 14px;
    line-height: 16px;
    padding-top: 6px;
    font-weight: 300;
    display: block;
    text-align: center;
    clear: both;
  }
  @keyframes saw {
    0% {
      left: 53px;
    }
    50% {
      left: 72px;
    }
    100% {
      left: 53px;
    }
  }
  }
</style>