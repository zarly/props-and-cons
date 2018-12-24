<template>
	<div class="IdeaAddPage VkPage">
		<div class="anch" @click="$router.go(-1)">вернуться назад</div>
		<form @submit.prevent="onSubmit" class="form">
			<select class="type-field" v-model="type">
				<option v-for="t in (parentIdea ? childTypes : rootTypes)" :value="t" v-text="typeToTextDict[t]" :key="t"></option>
			</select>
			<div class="parent-info" v-if="parentIdea">
				&nbsp;для&nbsp;
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
	import {sendParams} from '../modules/stats'

	const typeToTextDict = {
		1: 'Комментарий',
		2: 'Альтернатива',
		3: 'Аргумент За',
		4: 'Аргумент Против',
		5: 'Дополнение',

		101: 'Утверждение',
		102: 'Предложение',
		103: 'Вопрос',
		104: 'Категория',
	};

	export default {
		data () {
			const parentId = this.$route.query.parent;
			const ideaId = this.$route.query.idea;
			return {
				initPromise: this.fetchParentIdea(parentId),
				type: parseInt(this.$route.query.type, 10) || (parentId ? 1 : 103),
				parentId: parentId,
				parentIdea: null,
				title: '',
				text: '',

				typeToTextDict,
				rootTypes: [101, 102, 103, 104],
				childTypes: [1, 2, 3, 4, 5],
			};
		},
		computed: {
			typeText () {
				return typeToTextDict[this.type];
			}
		},
		methods: {
			async fetchParentIdea (parentId) {
				if (!parentId) return null;
				this.parentIdea = await gate.getIdea(parentId);
			},
			async fetchIdea (id) { // TODO: implement
				if (!id) return null;
				const idea = await gate.getIdea(id);
				this.title = idea.title;
			},
			async onSubmit () {
				const query = {
					title: this.title,
					description: this.text,
					parentIdea: this.parentId,
					type: this.type,
				};

				const result = await gate.createIdea(query);
				console.log(result);

				const id = result._id;
				this.$router.push(`/idea/${id}`);

				sendParams('comment', 'full', this.type, this.parentId);
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

		.form {
			margin-top: 18px;
		}

		select.type-field {
			border: 1px solid transparent;
			outline: none;
			border-radius: 2px;
			overflow: hidden;
			padding: 1px;
			background: transparent;
			font-size: 24px;
			color: #222;
			display: block;
			cursor: pointer;

			&:active,
			&:hover {
				border: 1px solid #d3d9de;
				background: #fff;
				color: #000;
			}

			& {
				/* Hide arrows for Firefox */
				-moz-appearance: none;
				/* Hide arrows for Chrome */
				-webkit-appearance: none;
			}
			/* Hide arrows for IE10 */
			&::-ms-expand {
				display: none;
			}
		}

		.parent-info {
			color: #222;
			margin: 2px 0 12px;
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
