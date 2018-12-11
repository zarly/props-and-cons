<template>
	<div class="IconedCounter">
		<SvgIcon class="image" :class="{clickable, active}" :size="parseInt(size, 10)" :src="icon" :style="imageStyle"
				  @click.native="$emit('clickIcon')"></SvgIcon>
		<div class="text" v-text="counter"></div>
	</div>
</template>

<script>
	import SvgIcon from '@/elements/svg_icon.vue';

	export default {
		components: {
			SvgIcon,
		},
		props: {
			counter: {type: Number, 'default': 0},

			icon: {type: Object},
			size: {type: Number, 'default': 16},
			iconShiftX: {type: Number, 'default': 0},
			iconShiftY: {type: Number, 'default': 0},

			clickable: {type: Boolean, 'default': false},
			active: {type: Boolean, 'default': false},
		},
		computed: {
			imageStyle () {
				return {
					top: `${this.iconShiftY}px`,
					left: `${this.iconShiftX}px`,
				};
			},
		},
	}
</script>

<style scoped lang="less">
	@import "../styles/variables";

	.IconedCounter {
		display: flex;
		justify-content: flex-start;
		align-items: center;

		.image {
			position: relative;
			fill: @cl-youtube-grey;

			&:hover {
				fill: @cl-youtube-black;
			}

			&.clickable {
				cursor: pointer;
			}

			&.active {
				opacity: 1;
				fill: @cl-youtube-blue;
			}
		}

		.text {
			margin-left: 2px;
		}
	}
</style>
