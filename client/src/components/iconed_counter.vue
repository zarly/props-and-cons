<template>
	<div class="IconedCounter">
		<DivImage class="image" :size="`${size}px`" :src="icon" :style="imageStyle"></DivImage>
		<div class="text" v-text="counter"></div>
	</div>
</template>

<script>
	import DivImage from '@/elements/div_image.vue';

	export default {
		components: {
			DivImage,
		},
		props: {
			size: {'default': 16},
			icon: {type: String},
			counter: {'default': 0},
			imageShift: {'default': 0},
			imageOpacity: {'default': 1},
		},
		computed: {
			imageStyle () {
				return {
					top: `${this.imageShift}px`,
					opacity: this.imageOpacity,
				};
			},
		},
	}
</script>

<style scoped lang="less">
	.IconedCounter {
		display: flex;
		justify-content: flex-start;
		align-items: center;

		.image {
			position: relative;
		}

		.text {
			margin-left: 2px;
		}
	}
</style>
