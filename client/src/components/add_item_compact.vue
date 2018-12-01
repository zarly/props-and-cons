<template>
	<div class="AddItemCompact">
		<textarea class="text" v-model="text" placeholder="Написать комментарий..." :class="{active: focus}"
			@focus="expand" @blur="collapse"></textarea>
		<div class="actions" v-if="focus">
			<!-- <span class="anch" @click="$router.push(`/idea-add?type=${type}&parent=${parent._id}`)">полная форма ответа</span> -->
			<button @click="send">Отправить</button>
		</div>
	</div>
</template>

<script>
	import gate from '../modules/gate'

	export default {
		props: [
			'parent',
			'type',
		],
		data () {
			return {
				focus: false,
				text: '',
			};
		},
		methods: {
			expand () {
				this.focus = true;
			},
			collapse () {
				setTimeout(() => {
					this.focus = false;
				}, 1000)
			},
			async send () {
				const query = {
					description: this.text,
					parentIdea: this.parent._id,
					type: this.type,
				};

				const result = await gate.ask('/ideas', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: JSON.stringify(query),
				});

				this.$emit('update');
			},
		}
	}
</script>

<style scoped lang="less">
	@import "../styles/variables";

	.AddItemCompact {
		.text {
			vertical-align: top;
    		overflow: auto;
			border: @grey-border;
			border-radius: 4px;
			outline: none;
			word-wrap: break-word;
			font-size: 12.5px;
			width: 100%;
			height: 32px;
			padding: 7px 10px;
			transition: all 0.3s;
			resize: none;

			&.active {
				padding: 7px 10px;
				height: 80px;
				transition: all 0.3s;
			}
		}

		.actions {
			margin-top: 5px;
			text-align: right;
		}
	}
</style>
