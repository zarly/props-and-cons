<template>
	<div class="IdeaItem">
		<div v-text="idea.title" class="anch" @click="navigateToDetails"></div>
		<div class="hint">
			<span v-text="datetime"></span>
			<span v-if="responsesTotal">, {{responses}}</span>
		</div>
	</div>
</template>

<script>
	import {renderDatetime, renderQuantity} from '../modules/decorators'

	export default {
		props: ['idea'],
		computed: {
			datetime () {
				const date = new Date(this.idea.createdAt);
				return renderDatetime(date);
			},
			responsesPlus () {
				return this.idea.ideasPlus && this.idea.ideasPlus.length || 0;
			},
			responsesMinus () {
				return this.idea.ideasMinus && this.idea.ideasMinus.length || 0;
			},
			responsesComment () {
				return this.idea.comments && this.idea.comments.length || 0;
			},
			responsesAlt () {
				return this.idea.alternatives && this.idea.alternatives.length || 0;
			},
			responsesImpl () {
				return this.idea.implementations && this.idea.implementations.length || 0;
			},
			responsesTotal () {
				return this.responsesComment
					+ this.responsesPlus + this.responsesMinus
					+ this.responsesAlt + this.responsesImpl;
			},
			responses () {
				const count = this.responsesTotal;
				return renderQuantity(count, 'ответ', 'ответа', 'ответов')
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

		.hint {
			margin-top: 4px;
		}
	}
</style>
