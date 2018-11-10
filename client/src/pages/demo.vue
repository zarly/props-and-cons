<template>
  <div class="DemoPage">
    <iframe src="#/" />
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="less">
  .DemoPage {
    background-color: #edeef0;
    padding: 20px;
    display: flex;
    justify-content: center;

    iframe {
      width: 800px;
      height: 1000px;
      background-color: #fafbfc;
      border: 1px solid #e7e8ec;
      box-shadow: 0 1px 0 0 #d7d8db, 0 0 0 1px #e3e4e8;
    }
  }
</style>
