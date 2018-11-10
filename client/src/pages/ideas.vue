<template>
  <div class="IdeasPage">
    Home page
  </div>
</template>

<script>
  import IdeaItem from '@/components/idea_item.vue';

  export default {
    components: {
      IdeaItem,
    },
  };
</script>

<style scoped lang="less">
  .IdeasPage {
    background-color: #fafbfc;
    padding: 10px;
  }
</style>
