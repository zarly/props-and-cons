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
