<template>
  <div class="IdeasPage">
    Home page
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import IdeaItem from '@/components/idea_item.vue';

@Component({
  components: {
    IdeaItem,
  },
})
export default class Page extends Vue {}
</script>

<style scoped lang="less">
  .IdeasPage {
    background-color: #fafbfc;
    padding: 10px;
  }
</style>
