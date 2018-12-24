<template>
	<div class="CommentInDetails">
		<div v-text="idea.title" class="anch title" @click="navigateToDetails"></div>
		<div class="hint">
			<span class="datetime" v-text="idea.prettyCreatedDate"></span>
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
			<span class="anch responses-stats" v-if="idea.responsesTotal" @click="navigateToDetails">{{responses}}</span>
		</div>
	</div>
</template>

<script>
	import gate from '../modules/gate'
	import {sendParams} from '../modules/stats'
	import {renderDatetime, renderQuantity} from '../modules/decorators'

	export default {
		props: ['idea'],
		methods: {
			navigateToDetails () {
				this.$router.push(`/idea/${this.idea._id}`);
			},
			async vote (voteType) {
				const newVotes = await gate.vote(this.idea._id, voteType);
				this.idea.votesPlus = newVotes.votesPlus;
				this.idea.votesMinus = newVotes.votesMinus;
				this.idea.skips = newVotes.skips;
				this.idea.myVote = newVotes.myVote;
				sendParams('vote', 'comment_in_details', this.voteType, this.idea._id);
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
