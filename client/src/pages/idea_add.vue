<template>
	<div class="IdeaAddPage VkPage">
		<div class="anch" @click="$router.go(-1)">вернуться назад</div>
		<form @submit.prevent="onSubmit">
			<div class="parent-info" v-if="parentIdea">
				<span class="type" v-text="typeText"></span>&nbsp;для&nbsp;
				<span class="anch parent-preview" v-text="parentIdea.title || parentIdea.description" @click="$router.push('/idea/' + parentIdea._id)"></span>
			</div>
			<div class="fields-row" v-if="!parentIdea">
				<div class="label">Заголовок</div>
				<input v-model="title" class="title-field" maxlength="200" />
			</div>
			<div class="fields-row">
				<div class="label">Текст</div>
				<textarea v-model="text" class="text-field" maxlength="2000"></textarea>
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
			const parentId = this.$route.query.parent;
			const ideaId = this.$route.query.idea;
			return {
				initPromise: this.fetchParentIdea(parentId),
				type: parseInt(this.$route.query.type, 10) || 1,
				parentId: parentId,
				parentIdea: null,
				title: '',
				text: '',
			};
		},
		computed: {
			typeText () {
				const dict = {
					1: 'Комментарий',
					2: 'Альтернатив',
					3: 'Аргумент За',
					4: 'Аргумент Против',
					5: 'Дополнение',
				};
				return dict[this.type];
			}
		},
		methods: {
			async fetchParentIdea (parentId) {
				if (!parentId) return null;
				this.parentIdea = await gate.ask(`/ideas/${parentId}`);
			},
			async fetchIdea (id) {
				if (!id) return null;
				const idea = await gate.ask(`/ideas/${id}`);
				this.title = idea.title;
			},
			async onSubmit () {
				const query = {
					title: this.title,
					description: this.text,
					parentIdea: this.parentId,
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

		.parent-info {
			color: #222;
			margin: 18px 0 12px;
			font-weight: 500;
			display: flex;
			white-space: nowrap;
			
			.parent-preview {
				font-weight: normal;
				display: inline-block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				max-width: 100%;
			}
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
