<template>
	<div class="IdeasPage VkPage">
		<div class="row">
			<div class="header-left">
				<span class="anch" v-if="isAdmin" @click="$router.push('/settings')">настройки</span>
			</div>
			<div class="header-right">
				<button class="btn-add-new" @click="$router.push('/idea-add')">Добавить тему</button>
			</div>
		</div>
		<div v-if="ideas && ideas.length">
			<div class="filter"></div>
			<IdeaItem v-for="idea in ideas" :key="idea._id" :idea="idea" class="idea" />
		</div>
		<div v-else>
			<div class="hint no-content">В сообществе ещё нет тем.</div>
		</div>
	</div>
</template>

<script>
	import me from '../modules/me'
	import gate from '../modules/gate'
	import IdeaItem from '@/parts/idea_item.vue';

	export default {
		components: {
			IdeaItem,
		},
		data () {
			return {
				initPromise: this.fetch(),
//				groupName: 'Название группы',
				ideas: [],
				totalCount: 0,

				me,
			};
		},
		computed: {
			isAdmin () {
				return this.me && this.me.user && [3, 4].indexOf(this.me.user.role) !== -1;
			},
		},
		methods: {
			async fetch () {
				const result = await gate.getIdeasList();
				this.ideas = result.rows;
				this.totalCount = result.count;
			}
		},
	};
</script>

<style scoped lang="less">
	@import "../styles/variables";

	.IdeasPage {
		.header-right {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			justify-content: flex-start;
		}

		.filter {
			border-bottom: @grey-border;
			margin: 15px -@page-margin 5px;
			padding: 0 @page-margin;
		}

		.idea {
			border-bottom: @grey-border;

			&:last-child {
				border-bottom: 0;
			}
		}

		.no-content {
			text-align: center;
			padding: 50px;
		}
	}
</style>
