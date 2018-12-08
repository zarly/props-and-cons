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
			datetime () {
				const date = new Date(this.idea.createdAt);
				return renderDatetime(date);
			},
			authorUrl () {
				return this.idea.author && `https://vk.com/id${this.idea.author.vkUid}`;
			},
			acceptance () {
				const {idea} = this;
				const val = idea.votesPlusCount / (idea.votesPlusCount + idea.votesMinusCount);
				if (val >= 0) {
					return Math.round(100 * val) + '%';
				} else {
					return '-';
				}
			},
			relevance () {
				const {idea} = this;
				const val = (idea.votesPlusCount + idea.votesMinusCount) / (idea.votesPlusCount + idea.votesMinusCount + idea.skipsCount);
				if (val >= 0) {
					return Math.round(100 * val) + '%';
				} else {
					return '-';
				}
			},
			isAllowedRemove () {
				return this.idea && this.idea.author && 
					this.me && this.me.user &&
					(this.idea.author._id === this.me.user._id ||
						[2, 3, 4].indexOf(this.me.user.role) !== -1);
			},
		},
		methods: {
			async fetch () {
				this.idea = await gate.ask(`/ideas/${this.id}`);
				this.revote = false;
			},
			async vote (voteType) {
				const query = {
					ideaId: this.idea._id,
					voteType,
				};
				await gate.ask('/vote', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: JSON.stringify(query),
				});
				await this.fetch();
				this.revote = false;
			},
			onClickRevote () {
				this.revote = true;
			},
			async remove () {
				if (!confirm('Вы уверены, что хотите безвозвратно удалить этот пост?')) return;
				const result = await gate.ask(`/ideas/${this.idea._id}`, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'DELETE',
				});
				this.$router.push(`/ideas`);
			},
		},
	};
</script>

<style scoped lang="less" src="./idea.less"></style>
