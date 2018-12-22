<template>
	<div class="IdeasPage VkPage">
		<div class="row header" v-if="isAdmin">
			<div class="header-left">
				<span class="anch" v-if="isAdmin" @click="$router.push('/settings')">настройки</span>
			</div>
			<div class="header-right">
				<button class="btn-add-new" v-if="isAdmin" @click="$router.push('/idea-add')">Добавить тему</button>
			</div>
		</div>
		<div v-if="ideas && ideas.length">
			<IdeaItem v-for="idea in ideas" :key="idea._id" :idea="idea" class="idea" />
			<div v-if="totalCount > ideas.length" class="load-more-items">
				<button @click="fetchMore">загрузить ещё</button>
			</div>
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
			},
			async fetchMore () {
				const result = await gate.getIdeasList(this.ideas.length);
				this.ideas = this.ideas.concat(result.rows);
				this.totalCount = result.count;
			},
		},
	};
</script>

<style scoped lang="less">
	@import "../styles/variables";

	.IdeasPage {
		.header {
			padding-bottom: 15px;
			margin-bottom: 5px;
			height: auto;

			.header-left .anch {
				font-weight: normal;
			}

			.header-right {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				justify-content: flex-start;
			}
		}

		.idea {
			border-bottom: @grey-border;

			&:last-child {
				border-bottom: 0;
			}
		}

		.load-more-items {
			padding: 15px 20px;
		}

		.no-content {
			text-align: center;
			padding: 50px;
		}
	}
</style>
