<template>
	<div class="IconedCounter">
		<DivImage class="image" :class="{clickable, active}" :size="`${size}px`" :src="icon" :style="imageStyle"
				  @click.native="$emit('clickIcon')"></DivImage>
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
			clickable: {type: Boolean, 'default': false},
			active: {type: Boolean, 'default': false},
		},
		computed: {
			imageStyle () {
				return {
					top: `${this.imageShift}px`,
//					opacity: this.imageOpacity,
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
			opacity: 0.6;

			&:hover {
				opacity: 1;
			}

			&.clickable {
				cursor: pointer;
			}

			&.active {
				opacity: 1;
			}
		}

		.text {
			margin-left: 2px;
		}
	}
</style>
