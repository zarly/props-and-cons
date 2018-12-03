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
			size: {type: Number, 'default': 16},
			icon: {type: String},
			counter: {type: Number, 'default': 0},
			imageShift: {type: Number, 'default': 0},
			imageOpacity: {type: Number, 'default': 1},
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
