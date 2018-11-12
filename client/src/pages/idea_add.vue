<template>
	<div class="IdeaAddPage VkPage">
		<form @submit.prevent="onSubmit">
			<div class="fields-row">
				<div class="label">Заголовок</div>
				<input v-model="title" class="title-field" />
			</div>
			<div class="fields-row">
				<div class="label">Текст</div>
				<textarea v-model="text" class="text-field"></textarea>
			</div>
			<div class="action-block">
				<button type="submit">Создать тему</button>
			</div>
		</form>
	</div>
</template>

<script>
	import gate from '../modules/gate'

	export default {
		data () {
			return {
				title: '',
				text: '',
			};
		},
		methods: {
			async onSubmit () {
				const query = {
					title: this.title,
					description: this.text,
					parentIdea: null,
					type: 1,
				};

				const result = await gate.ask('/ideas', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: JSON.stringify(query),
				});
				console.log(result);

				const id = result._id;
				this.$router.push(`/idea/${id}`);
			}
		},
	};
</script>

<style scoped lang="less">
	@import-once "../styles/variables";

	.IdeaAddPage {
		.label {
			display: block;
			margin: 18px 0 12px;
			font-weight: 500;
			color: #222;
		}

		.title-field,
		.text-field {
			border: 1px solid #d3d9de;
			border-radius: 2px;
			overflow: hidden;
			outline: none;
			width: 100%;
			padding: 5px 9px 7px;
			background: #fff;
			color: #000;
		}
		.text-field {
			height: 230px;
			resize: none;
		}

		.action-block {
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			margin-top: 15px;
		}
	}
</style>
