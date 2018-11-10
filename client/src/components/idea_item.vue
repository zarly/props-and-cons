<template>
  <div class="IdeaItem">
    <div v-text="idea.title"></div>
  </div>
</template>

<script>
export default {
  props: ['idea'],
}
</script>

<style scoped lang="less">
</style>
