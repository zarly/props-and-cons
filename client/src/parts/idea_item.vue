<template>
	<div class="IdeaItem">
		<div v-text="idea.title" class="anch title" @click="navigateToDetails"></div>
		<div class="bottom-line hint">
			<span class="datetime" v-text="datetime"></span>
			<IconedCounter class="counter" size="16" :icon="iconUp"
						   :counter="idea.votesPlus" imageOpacity="0.8" imageShift="-1"></IconedCounter>
			<IconedCounter class="counter" size="16" :icon="iconDown"
						   :counter="idea.votesMinus" imageOpacity="0.8" imageShift="1"></IconedCounter>
			<IconedCounter class="counter answers" size="16" :icon="iconAnswer"
						   :counter="responsesTotal" imageOpacity="0.8"
						   @click.native="navigateToDetails" v-if="responsesTotal"></IconedCounter>
		</div>
	</div>
</template>

<script>
	import {renderDatetime, renderQuantity} from '../modules/decorators'
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
		},
		methods: {
			navigateToDetails () {
				this.$router.push(`/idea/${this.idea._id}`);
			}
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
