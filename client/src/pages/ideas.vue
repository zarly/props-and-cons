<template>
  <div class="IdeasPage VkPage">
    <div class="row">
        <div class="header-left">
            <span class="anch crumb" v-text="groupName"></span>
        </div>
        <div class="header-right">
            <button class="btn-add-new" @click="$router.push('/idea-add')">Добавить тему</button>
        </div>
    </div>
    <div>
      <IdeaItem v-for="idea in ideas" :key="idea._id" :idea="idea" />
    </div>
  </div>
</template>

<script>
  import gate from '../modules/gate'
  import IdeaItem from '@/components/idea_item.vue';

  export default {
    components: {
      IdeaItem,
    },
    data () {
      return {
        initPromise: this.fetch(),
        groupName: 'Название группы',
        ideas: [],
        totalCount: 0,
      };
    },
    methods: {
      async fetch () {
        const result = await gate.ask('/ideas');
        this.ideas = result.rows;
        this.totalCount = result.count;
      }
    },
  };
</script>

<style scoped lang="less">
.IdeasPage {
    .header-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-start;

        .btn-add-new {
          margin-top: 12px;
        }
    }

    .items {
        margin-top: 16px;
    }
}
</style>
