
<script>
	export default {
		props: {
			src: {type: Object},
			size: {type: Number, 'default': 24},
		},
		render (h) {
			const zoom = this.size / 24;
			return h(this.src, {
				'style': {
					zoom: zoom,
				},
			});
		},
	}
</script>
