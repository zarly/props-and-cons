<template>
	<div class="IdeaPage VkPage">
		<div class="anch" @click="$router.push('/ideas')">к списку тем</div>
		<div v-if="idea">
			<div class="title" v-text="idea.title"></div>
			<div class="description" v-text="idea.description"></div>
			<div class="created-area">
				<a v-text="idea.author.name" class="anch" :href="authorUrl" target="_blank"></a>,
				<span v-text="datetime" class="hint"></span>
			</div>
			<div class="actions row">
				<button @click="vote(3)" class="option">
					Голосовать За
				</button>
				<button @click="vote(4)" class="option">
					Голосовать Против
				</button>
				<button @click="vote(2)" class="option">
					Пропустить
				</button>
			</div>
			<div class="stats row">
				<div class="stat-box">
					<div class="count" v-text="idea.votesPlus"></div>
					<div class="label">поддержали</div>
				</div>
				<div class="stat-box">
					<div class="count" v-text="idea.votesMinus"></div>
					<div class="label">возразили</div>
				</div>
				<div class="stat-box">
					<div class="count" v-text="idea.skips"></div>
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
			<!--<div v-text="idea"></div>-->
		</div>
	</div>
</template>

<script>
	import gate from '../modules/gate'
	import {renderDatetime} from '../modules/decorators'

	export default {
		props: ['id'],
		data () {
			return {
				initPromise: this.fetch(),
				idea: null,
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
				const val = idea.votesPlus / (idea.votesPlus + idea.votesMinus);
				if (val >= 0) {
					return Math.round(100 * val) + '%';
				} else {
					return '-';
				}
			},
			relevance () {
				const {idea} = this;
				const val = (idea.votesPlus + idea.votesMinus) / (idea.votesPlus + idea.votesMinus + idea.skips);
				if (val >= 0) {
					return Math.round(100 * val) + '%';
				} else {
					return '-';
				}
			}
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
			}
		}

		.stats {
			margin-top: 10px;

			.stat-box {
				width: 100px;
				height: 100px;
				text-align: center;

				.count {
					font-size: 40px;
					color: #222;
				}
			}
		}
	}
</style>
