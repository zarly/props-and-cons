<template>
	<div class="CommentInDetails">
		<div v-text="idea.title" class="anch title" @click="navigateToDetails"></div>
		<div class="hint">
			<span class="datetime" v-text="datetime"></span>
			<span class="votes-stats">
				<span class="vote-up" @click="vote(3)">
					<span class="arrow" :class="{active: this.idea.myVote === 3}">&#11014;</span>
					<span class="value" v-text="idea.votesPlus"></span>
				</span>
				&middot;
				<span class="value" v-text="idea.skips"></span>
				&middot;
				<span class="vote-down" @click="vote(4)">
					<span class="value" v-text="idea.votesMinus"></span>
					<span class="arrow" :class="{active: this.idea.myVote === 4}">&#11015;</span>
				</span>
			</span>
			<span class="anch responses-stats" v-if="responsesTotal" @click="navigateToDetails">{{responses}}</span>
		</div>
	</div>
</template>

<script>
	import gate from '../modules/gate'
	import {renderDatetime, renderQuantity} from '../modules/decorators'

	export default {
		props: ['idea'],
		computed: {
			datetime () {
				const date = new Date(this.idea.createdAt);
				return renderDatetime(date);
			},
			responsesTotal () {
				return this.idea.commentsCount
					+ this.idea.ideasPlusCount + this.idea.ideasMinusCount
					+ this.idea.alternativesCount + this.idea.implementationsCount;
			},
			responses () {
				const count = this.responsesTotal;
				return renderQuantity(count, 'ответ', 'ответа', 'ответов')
			},
		},
		methods: {
			navigateToDetails () {
				this.$router.push(`/idea/${this.idea._id}`);
			},
			async vote (voteType) {
				const query = {
					ideaId: this.idea._id,
					voteType,
				};
				const newVotes = await gate.ask('/vote', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: JSON.stringify(query),
				});
				this.idea.votesPlus = newVotes.votesPlus;
				this.idea.votesMinus = newVotes.votesMinus;
				this.idea.skips = newVotes.skips;
				this.idea.myVote = newVotes.myVote;
			},
		}
	}
</script>

<style scoped lang="less">
	@import "../styles/variables";

	.CommentInDetails {
		font-size: 12.5px;
		padding: 15px 0;
		margin: 0 20px;

		.title {
			overflow: hidden;
			text-overflow: ellipsis;
			display: block;
		}

		.hint {
			margin-top: 4px;
		}

		.datetime {
			display: inline-block;
			width: 150px;
		}

		.datetime {
			display: inline-block;
			width: 150px;
		}

		.votes-stats {
			display: inline-block;
			width: 100px;

			.vote-up .arrow {
				color: @cl-green;
				cursor: pointer;
			}

			.vote-down .arrow {
				color: @cl-red;
				cursor: pointer;
			}

			.arrow {
				opacity: 0.3;

				&.active {
					opacity: 1;
				}
			}
		}

		.responses-stats {
			display: inline-block;
			width: 100px;
			color: @cl-grey;
			font-weight: normal;
		}
	}
</style>
