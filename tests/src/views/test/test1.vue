<template>
    <div>
      <iframe
        src="http://192.168.0.22:5002/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401556AE9591B6399BF11E83D7A3B7004A0EDF9D7C5D6016052610CE824FE74E5C9A71EE4A19AF913039B7B03AA1EB7BFA51456B5FBCAF282D3E95BEF815198FB049A2475F9F21D08B3422D1A95FC0AD30299A61F03801710C5C8947648890D7B5713E96248E066F0B88675E3516E729EC99EDCBA7E39113F4B6ED45CA526675E9F5B7FF810953B282778523B18A51C0601D5DB31F514E64C225AED42334AE02316BA5FCD7252EC298DCF08CDD2C6ABF2589A46EC33802772A59E144537EB324A3EEEAC9B59BD921134786EF3A9B2B3A080&type=dashboard"
        frameborder="0" height="800"  width="100%" scrolling="no" id="mainIframe" onload="changeFrameHeight()"></iframe>
    </div>
</template>

<script>


    export default {
      methods:{
        changeFrameHeight(){
          var ifm= document.getElementById("mainIframe");
          ifm.height=document.documentElement.clientHeight;
          window.οnresize=function(){
            changeFrameHeight();

          }
        }
      }

    }
</script>

<style>


</style>