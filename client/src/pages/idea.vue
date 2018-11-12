<template>
	<div class="IdeaPage VkPage">
		<div class="anch" @click="$router.push('/ideas')">к списку тем</div>
		<div v-if="idea">
			<h2 v-text="idea.title"></h2>
			<p v-text="idea.description"></p>
		</div>
	</div>
</template>

<script>
	import gate from '../modules/gate'

	export default {
		props: ['id'],
		data () {
			return {
				initPromise: this.fetch(),
				idea: null,
			};
		},
		methods: {
			async fetch () {
				this.idea = await gate.ask(`/ideas/${this.id}`);
			}
		},
	};
</script>

<style scoped lang="less">
	@import-once "../styles/variables";

	.IdeaPage {
	}
</style>
