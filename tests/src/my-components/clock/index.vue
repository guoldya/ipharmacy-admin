<template>
  <div class="antui-clock">
    <div class="date">{{state.date}}</div>
    <ul>
      <li class="hours">{{state.hours}}</li>
      <li class="point">:</li>
      <li class="min">{{state.min}}</li>
      <li class="point">:</li>
      <li class="sec">{{state.sec}}</li>
    </ul>
  </div>
</template>

<script>
  const dayNames =
    [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六'
    ];

  const timer =0;

  export default {
    name: 'clock',
    data() {
      return {
        state:
          {
            date:'' ,
            hours:'',
            min:'',
            sec:''
          }
      }
    },
    mounted()
    {
      this.timer =  setInterval(this.formatClock, 1000);
    },
    beforeDestroy:function(){
      if (this.timer) clearInterval(this.timer);
    },

    methods:
      {
        formatClock(render = true)
        {
          const now = new Date()
          const hours = now.getHours()
          const min = now.getMinutes()
          const sec = now.getSeconds()

          const state = {
            date: `${now.getFullYear()} 年 ${now.getMonth()} 月 ${now.getDate()} 日 ${dayNames[now.getDay()]}`,
            hours: hours < 10 ? '0' + hours : hours,
            min: min < 10 ? '0' + min : min,
            sec: sec < 10 ? '0' + sec : sec,
          };
          if (render) this.state = state
        }
      }
  }
</script>

<style lang="less" scoped>
  .antui-clock {
  > .date {
    font-size: 20px;
    letter-spacing: 0.3px;
    text-align: right;
  }
  > ul {
    text-align: right;
    list-style: none;
    margin: 0;
    padding: 0;
  > li {
    display: inline;
    font-family: Roboto;
    font-size: 60px;
    font-weight: 900;
  &.point {
     padding: 0 4px;
     animation: 1s ease 0s normal none infinite flash;
     position: relative;
     top: -5px;
   }
  }
  }
  }

  @keyframes flash{
    0% {opacity:1.0;}
    50% {opacity:0; }
    100% {opacity:1.0;}
  }
</style>