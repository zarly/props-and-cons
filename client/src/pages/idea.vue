<template>
	<div class="IdeaPage VkPage">
		<div v-if="!idea" class="anch" @click="$router.push('/ideas')">&lt; список тем</div>
		<div v-if="idea">
			<div class="header breadcrumbs">
				<span class="anch" @click="$router.push('/ideas')">
					<span v-if="!idea.parentIdeas || !idea.parentIdeas.length">&lt;</span>
					список тем
				</span>
				<template v-for="par in idea.parentIdeas">
					&gt;
					<span class="anch" v-text="par.title" @click="$router.push('/idea/' + par._id)" :key="par._id"></span>
				</template>
			</div>
			<div class="content">
				<IdeaDetails :idea="idea" @update="fetch"></IdeaDetails>
			</div>
			<section>
				<div class="hr wide" />
				<div class="row for-half">
					<div class="half-area plus">
						<div class="area-title">
							<span class="h2">Комментарии &laquo;За&raquo;</span>
							<span class="hint count" v-if="idea.ideasPlusCount" v-text="'(' +idea.ideasPlusCount + ')'"></span>
							<button class="add-btn" @click="$router.push(`/idea-add?type=3&parent=${idea._id}`)">Добавить</button>
						</div>
						<ArgumentInDetails v-for="child in idea.ideasPlus" :idea="child" :key="child._id" @update="fetch"></ArgumentInDetails>
						<AddItemCompact class="add-item-compact" @update="fetch" :parent="idea" :type="3"></AddItemCompact>
					</div>
					<div class="vr main" />
					<div class="half-area minus">
						<div class="area-title">
							<span class="h2">Комментарии &laquo;Против&raquo;</span>
							<span class="hint count" v-if="idea.ideasMinusCount" v-text="'(' +idea.ideasMinusCount + ')'"></span>
							<button class="add-btn" @click="$router.push(`/idea-add?type=4&parent=${idea._id}`)">Добавить</button>
						</div>
						<ArgumentInDetails v-for="child in idea.ideasMinus" :idea="child" :key="child._id" @update="fetch"></ArgumentInDetails>
						<AddItemCompact class="add-item-compact" @update="fetch" :parent="idea" :type="4"></AddItemCompact>
					</div>
				</div>
				<!--<div class="anch">загрузить ещё...</div>-->
			</section>
		</div>
	</div>
</template>

<script>
	import gate from '../modules/gate'
	import me from '../modules/me'
	import {renderDatetime} from '../modules/decorators'
	import IdeaDetails from '@/parts/idea_details.vue';
	import ArgumentInDetails from '@/parts/argument_in_details.vue';
	import AddItemCompact from '@/parts/add_item_compact.vue';

	export default {
		components: {
			IdeaDetails,
			ArgumentInDetails,
			AddItemCompact,
		},
		props: ['id'],
		data () {
			return {
				initPromise: this.fetch(),
				idea: null,

				revote: false,

				me,
			};
		},
		watch: {
			id () {
				this.initPromise = this.fetch();
			}
		},
		computed: {
			isAllowedRemove () {
				return this.idea && this.idea.author && 
					this.me && this.me.user &&
					(this.idea.author._id === this.me.user._id ||
						[2, 3, 4].indexOf(this.me.user.role) !== -1);
			},
		},
		methods: {
			async fetch () {
				this.idea = await gate.getIdea(this.id);
				this.revote = false;
			},
			async vote (voteType) {
				await gate.vote(this.idea._id, voteType);
				await this.fetch();
				this.revote = false;
			},
			onClickRevote () {
				this.revote = true;
			},
			async remove () {
				if (!confirm('Вы уверены, что хотите безвозвратно удалить этот пост?')) return;
				await gate.deleteIdea(this.idea._id);
				this.$router.push(`/ideas`);
			},
		},
	};
</script>

<style scoped lang="less" src="./idea.less"></style>
