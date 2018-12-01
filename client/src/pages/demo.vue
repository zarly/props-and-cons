<template>
	<div class="DemoPage">
		<form>
			<label>
				<input type="radio" value="800px" v-model="width" /> desktop
			</label>
			<label>
				<input type="radio" value="320px" v-model="width" /> mobile
			</label>
		</form>
		<iframe src="#/" :style="{width: width}" />
	</div>
</template>

<script>
	export default {
		data () {
			return {
				width: '800px',
			};
		}
	}
</script>

<style scoped lang="less">
	@import-once "../styles/variables";

	.DemoPage {
		background-color: #edeef0;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;

		iframe {
			width: 800px;
			height: 1000px;
			background-color: #fafbfc;
			border: 1px solid #e7e8ec;
			box-shadow: 0 1px 0 0 #d7d8db, 0 0 0 1px #e3e4e8;
		}
	}
</style>
