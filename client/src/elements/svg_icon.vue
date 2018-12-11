
<script>
	export default {
		props: {
			src: String,
			width: {'default': '24px'},
			height: {'default': '24px'},
			size: {type: String},
		},
		render (h) {
			return h('div', {
				'class': 'Image',
				'style': {
					backgroundImage: `url(${this.src})`,
					width: this.size || this.width,
					height: this.size || this.height,
				},
			})
		},
	}
</script>

<style scoped>
	.Image {
		background-position: center center;
		background-repeat: no-repeat no-repeat;
		background-size: cover;
	}
</style>
