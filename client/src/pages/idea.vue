<template>
	<div class="IdeaPage VkPage">
		<div class="anch" @click="$router.push('/ideas')">к списку тем</div>
		<div v-if="idea">
			<div class="parent" v-text="idea.parentIdeas"></div>
			<div class="title" v-text="idea.title"></div>
			<div class="description" v-text="idea.description"></div>
			<div class="created-area">
				<a v-text="idea.author.name" class="anch" :href="authorUrl" target="_blank"></a>,
				<span v-text="datetime" class="hint"></span>
			</div>
			<div class="actions row" v-if="!this.idea.myVote || this.revote">
				<button @click="vote(3)" class="option" :class="{active: this.idea.myVote === 3}">
					Голосовать За
				</button>
				<button @click="vote(4)" class="option" :class="{active: this.idea.myVote === 4}">
					Голосовать Против
				</button>
				<button @click="vote(2)" class="option" :class="{active: this.idea.myVote === 2}">
					Пропустить
				</button>
			</div>
			<div class="revote anch" v-if="this.idea.myVote && !this.revote" @click="onClickRevote">переголосовать</div>
			<div class="stats row" v-if="this.idea.myVote">
				<div class="stat-box" :class="{active: this.idea.myVote === 3}">
					<div class="count" v-text="idea.votesPlusCount"></div>
					<div class="label">поддержали</div>
				</div>
				<div class="stat-box" :class="{active: this.idea.myVote === 4}">
					<div class="count" v-text="idea.votesMinusCount"></div>
					<div class="label">возразили</div>
				</div>
				<div class="stat-box" :class="{active: this.idea.myVote === 2}">
					<div class="count" v-text="idea.skipsCount"></div>
					<div class="label">пропустили</div>
				</div>
				<div class="stat-box">
					<div class="count" v-text="acceptance"></div>
					<div class="label">одобрение</div>
				</div>
				<div class="stat-box">
					<div class="count" v-text="relevance"></div>
					<div class="label">актуальность</div>
				</div>
			</div>
			<section>
				<div class="row">
					<div class="half-area">
						<h2>Аргументы За</h2>
						<ArgumentInDetails v-for="child in idea.ideasPlus" :idea="child" :key="child._id"></ArgumentInDetails>
						<button @click="$router.push(`/idea-add?type=3&parent=${idea._id}`)">Добавить</button>
					</div>
					<div class="half-area">
						<h2>Аргументы Против</h2>
						<ArgumentInDetails v-for="child in idea.ideasMinus" :idea="child" :key="child._id"></ArgumentInDetails>
						<button @click="$router.push(`/idea-add?type=4&parent=${idea._id}`)">Добавить</button>
					</div>
				</div>
				<!--<div class="anch">загрузить ещё...</div>-->
			</section>
			<section>
				<div class="row">
					<div class="half-area">
						<h2>Дополнения</h2>
						<ArgumentInDetails v-for="child in idea.implementations" :idea="child" :key="child._id"></ArgumentInDetails>
						<button @click="$router.push(`/idea-add?type=5&parent=${idea._id}`)">Добавить</button>
					</div>
					<div class="half-area">
						<h2>Альтернативы</h2>
						<ArgumentInDetails v-for="child in idea.alternatives" :idea="child" :key="child._id"></ArgumentInDetails>
						<button @click="$router.push(`/idea-add?type=2&parent=${idea._id}`)">Добавить</button>
					</div>
				</div>
				<!--<div class="anch">загрузить ещё...</div>-->
			</section>
			<section class="comments-area">
				<h2>Комментарии</h2>
				<CommentInDetails v-for="child in idea.comments" :idea="child" :key="child._id"></CommentInDetails>
				<button @click="$router.push(`/idea-add?type=1&parent=${idea._id}`)">Добавить</button>
			</section>
			<!--<div v-text="idea"></div>-->
		</div>
	</div>
</template>

<script>
	import gate from '../modules/gate'
	import {renderDatetime} from '../modules/decorators'
	import ArgumentInDetails from '@/components/argument_in_details.vue';
	import CommentInDetails from '@/components/comment_in_details.vue';

	export default {
		components: {
			ArgumentInDetails,
			CommentInDetails,
		},
		props: ['id'],
		data () {
			return {
				initPromise: this.fetch(),
				idea: null,

				revote: false,
			};
		},
		computed: {
			datetime () {
				const date = new Date(this.idea.createdAt);
				return renderDatetime(date);
			},
			authorUrl () {
				return `https://vk.com/id${this.idea.author.vkUid}`
			},
			acceptance () {
				const {idea} = this;
				const val = idea.votesPlusCount / (idea.votesPlusCount + idea.votesMinusCount);
				if (val >= 0) {
					return Math.round(100 * val) + '%';
				} else {
					return '-';
				}
			},
			relevance () {
				const {idea} = this;
				const val = (idea.votesPlusCount + idea.votesMinusCount) / (idea.votesPlusCount + idea.votesMinusCount + idea.skipsCount);
				if (val >= 0) {
					return Math.round(100 * val) + '%';
				} else {
					return '-';
				}
			},
		},
		methods: {
			async fetch () {
				this.idea = await gate.ask(`/ideas/${this.id}`);
			},
			async vote (voteType) {
				const query = {
					ideaId: this.idea._id,
					voteType,
				};
				await gate.ask('/vote', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: JSON.stringify(query),
				});
				await this.fetch();
				this.revote = false;
			},
			onClickRevote () {
				this.revote = true;
			},
		},
	};
</script>

<style scoped lang="less">
	@import "../styles/variables";

	.IdeaPage {
		.title {
			margin-top: 10px;
			font-size: 15px;
			font-weight: 500;
		}

		.description {
			margin-top: 10px;
		}

		.created-area {
			margin-top: 10px;
			text-align: right;
			color: @cl-grey;

			.anch {
				font-weight: normal;
				color: @cl-grey;
			}
		}

		.actions {
			margin-top: 10px;

			.option {
				width: 30%;

				&.active {
					opacity: 0.5;
				}
			}
		}

		.revote {
			text-align: center;
			display: block;
			height: 15px;
			margin-top: -15px;
			font-weight: normal;
		}

		.stats {
			margin-top: 10px;

			.stat-box {
				width: 100px;
				height: 100px;
				text-align: center;
				padding: 17px 0;
				border-radius: 4px;
				border: @grey-border;

				&.active {
					background: #f0f2f5;
				}

				.count {
					font-size: 40px;
					color: #222;
				}
			}
		}

		.half-area {
			width: 50%;

			.anch {
				display: block;
			}
		}

		.comments-area {
			.anch {
				display: block;
			}
		}
	}
</style>
