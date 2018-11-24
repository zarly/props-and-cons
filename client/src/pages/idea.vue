<template>
	<div class="IdeaPage VkPage">
		<div v-if="!idea" class="anch" @click="$router.push('/ideas')">&lt; список тем</div>
		<div v-if="idea">
			<div class="breadcrumbs">
				<span class="anch" @click="$router.push('/ideas')">
					<span v-if="!idea.parentIdeas || !idea.parentIdeas.length">&lt;</span>
					список тем
				</span>
				<template v-for="par in idea.parentIdeas">
					&gt;
					<span class="anch" v-text="par.title" @click="$router.push('/idea/' + par._id)"></span>
				</template>
			</div>
			<div class="title h1" v-text="idea.title"></div>
			<div class="description" v-text="idea.description"></div>
			<div class="created-area">
				<a v-text="idea.author.name" class="anch" :href="authorUrl" target="_blank"></a>,
				<span v-text="datetime" class="hint"></span>
			</div>
			<div class="actions row" v-if="!this.idea.myVote || this.revote">
				<button @click="vote(3)" class="option" :class="{active: this.idea.myVote === 3}">
					Голосовать За
				</button>
				<button @click="vote(2)" class="option" :class="{active: this.idea.myVote === 2}">
					Пропустить
				</button>
				<button @click="vote(4)" class="option" :class="{active: this.idea.myVote === 4}">
					Голосовать Против
				</button>
			</div>
			<div class="revote anch" v-if="this.idea.myVote && !this.revote" @click="onClickRevote">переголосовать</div>
			<div class="stats row" v-if="this.idea.myVote">
				<!--<div class="stat-box">-->
					<!--<div class="count" v-text="acceptance"></div>-->
					<!--<div class="label">одобрение</div>-->
				<!--</div>-->
				<div class="stat-box plus" :class="{active: this.idea.myVote === 3}">
					<div class="count" v-text="idea.votesPlusCount"></div>
					<div class="label">поддержали</div>
				</div>
				<div class="stat-box neutral" :class="{active: this.idea.myVote === 2}">
					<div class="count" v-text="idea.skipsCount"></div>
					<div class="label">пропустили</div>
				</div>
				<div class="stat-box minus" :class="{active: this.idea.myVote === 4}">
					<div class="count" v-text="idea.votesMinusCount"></div>
					<div class="label">возразили</div>
				</div>
				<!--<div class="stat-box">-->
					<!--<div class="count" v-text="relevance"></div>-->
					<!--<div class="label">актуальность</div>-->
				<!--</div>-->
			</div>
			<section>
				<div class="row">
					<div class="half-area plus">
						<div class="h1">Аргументы За<span v-if="idea.ideasPlusCount" v-text="' (' +idea.ideasPlusCount + ')'"></span></div>
						<ArgumentInDetails v-for="child in idea.ideasPlus" :idea="child" :key="child._id"></ArgumentInDetails>
						<button class="add-btn" @click="$router.push(`/idea-add?type=3&parent=${idea._id}`)">Добавить</button>
					</div>
					<div class="half-area minus">
						<div class="h1">Аргументы Против<span v-if="idea.ideasMinusCount" v-text="' (' +idea.ideasMinusCount + ')'"></span></div>
						<ArgumentInDetails v-for="child in idea.ideasMinus" :idea="child" :key="child._id"></ArgumentInDetails>
						<button class="add-btn" @click="$router.push(`/idea-add?type=4&parent=${idea._id}`)">Добавить</button>
					</div>
				</div>
				<!--<div class="anch">загрузить ещё...</div>-->
			</section>
			<section class="comments-area">
				<div class="h1">Комментарии<span v-if="idea.commentsCount" v-text="' (' +idea.commentsCount + ')'"></span></div>
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
		watch: {
			id () {
				this.initPromise = this.fetch();
			}
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
				this.revote = false;
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
				padding: 15px 8px;
				border-radius: 4px;
				border: @grey-border;
				background-repeat: no-repeat no-repeat;
				background-size: 36px;
				background-position: 8px 21px;

				&.plus {
					background-image: url('../../static/icons/baseline-thumb_up-24px.svg');
				}

				&.neutral {
					background-image: url('../../static/icons/baseline-thumbs_up_down-24px.svg');
				}

				&.minus {
					background-image: url('../../static/icons/baseline-thumb_down-24px.svg');
				}

				&.active {
					background-color: #f0f2f5;
				}

				.count {
					font-size: 36px;
					text-align: right;
					color: #222;
				}

				.label {
					margin-top: 10px;
				}
			}
		}

		.half-area {
			width: 49%;
			border-radius: 4px;
			margin-top: 10px;
			padding: 10px;
			position: relative;

			&.plus {
				background: #eeffee;
				border: 1px solid #ded;
			}

			&.minus {
				background: #ffeeee;
				border: 1px solid #edd;
			}

			.h1 {
				margin: 0 0 10px;
			}

			.anch {
				display: block;
			}

			.add-btn {
				position: absolute;
				top: 10px;
				right: 10px;
			}
		}

		.comments-area {
			.h1 {
				margin: 20px 0 10px;
			}

			.anch {
				display: block;
			}
		}
	}
</style>
