<template>
	<div class="IdeaItem">
		<div v-text="idea.title" class="anch title" @click="navigateToDetails"></div>
		<div class="bottom-line hint">
			<span class="datetime" v-text="idea.prettyUpdatedDate"></span>
			<IconedCounter class="counter" :size="16" :icon="iconUp" @clickIcon="vote(3)" clickable :active="idea.myVote === 3"
						   :counter="idea.votesPlus" :iconShiftY="-1"></IconedCounter>
			<IconedCounter class="counter" :size="16" :icon="iconDown" @clickIcon="vote(4)" clickable :active="idea.myVote === 4"
						   :counter="idea.votesMinus" :iconShiftY="1"></IconedCounter>
			<IconedCounter class="counter answers" :size="16" :icon="iconAnswer" @click.native="navigateToDetails"
						   :counter="idea.responsesTotal" v-if="idea.responsesTotal"></IconedCounter>
		</div>
	</div>
</template>

<script>
	import {renderDatetime, renderQuantity} from '../modules/decorators'
	import gate from '../modules/gate'
	import {sendParams} from '../modules/stats'
	import IconedCounter from '@/components/iconed_counter.vue';
	import iconUp from '../../static/icons/baseline-thumb_up-24px.svg';
	import iconDown from '../../static/icons/baseline-thumb_down-24px.svg';
	import iconAnswer from '../../static/icons/baseline-question_answer-24px.svg';

	export default {
		components: {
			IconedCounter,
		},
		props: ['idea'],
		data () {
			return {
				iconUp,
				iconDown,
				iconAnswer,
			};
		},
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
				sendParams('vote', 'idea_item', this.voteType, this.idea._id);
			},
		}
	}
</script>

<style scoped lang="less">
	@import "../styles/variables";

	.IdeaItem {
		font-size: 12.5px;
		padding: 15px 0;
		margin: 0 20px;

		.title {
			overflow: hidden;
			text-overflow: ellipsis;
			display: block;
		}

		.bottom-line {
			margin-top: 4px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
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
		}

		.responses-stats {
			display: inline-block;
			width: 100px;
			color: @cl-grey;
			font-weight: normal;
		}

		.counter {
			width: 50px;

			&.answers {
				cursor: pointer;
			}
		}
	}
</style>
