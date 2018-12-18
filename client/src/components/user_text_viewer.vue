<template>
	<div class="UserTextViewer">
		<div class="line" v-for="(line, index) in lines" :key="index + ':' + line" v-text="line"></div>
	</div>
</template>

<script>
	export default {
		props: ['text'],
		computed: {
			lines () {
				return (this.text || '').split('\n');
			},
		},
	}
</script>

<style scoped lang="less">
	.UserTextViewer {
		.line {
			min-height: 12px;
		}
	}
</style>
