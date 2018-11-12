<template>
	<div class="IdeaItem">
		<div v-text="idea.title" class="anch" @click="navigateToDetails"></div>
		<div class="hint"></div>
	</div>
</template>

<script>
	export default {
		props: ['idea'],
		methods: {
			navigateToDetails () {
				this.$router.push(`/idea/${this.idea._id}`);
			}
		}
	}
</script>

<style scoped lang="less">
	@import-once "../styles/variables";

	.IdeaItem {
		padding: 0 16px;
	}
</style>
