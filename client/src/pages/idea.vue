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
			<div class="title h2" v-text="idea.title"></div>
			<div class="description" v-text="idea.description"></div>
			<div class="created-area">
				<a v-text="idea.author.name" class="anch" :href="authorUrl" target="_blank"></a>,
				<span v-text="datetime" class="hint"></span>
			</div>
			<div class="actions row" v-if="!this.idea.myVote || this.revote">
				<button @click="vote(3)" class="option" :class="{active: this.idea.myVote === 3}">
					Голосовать За
				</button>
				<button @click="vote(2)" class="option" :class="{active: this.idea.myVote === 2}">
					Пропустить
				</button>
				<button @click="vote(4)" class="option" :class="{active: this.idea.myVote === 4}">
					Голосовать Против
				</button>
			</div>
			<div class="revote anch" v-if="this.idea.myVote && !this.revote" @click="onClickRevote">переголосовать</div>
			<div class="stats row" v-if="this.idea.myVote">
				<!--<div class="stat-box">-->
					<!--<div class="count" v-text="acceptance"></div>-->
					<!--<div class="label">одобрение</div>-->
				<!--</div>-->
				<div class="stat-box plus" :class="{active: this.idea.myVote === 3}">
					<div class="count" v-text="idea.votesPlusCount"></div>
					<div class="label">поддержали</div>
				</div>
				<div class="stat-box neutral" :class="{active: this.idea.myVote === 2}">
					<div class="count" v-text="idea.skipsCount"></div>
					<div class="label">пропустили</div>
				</div>
				<div class="stat-box minus" :class="{active: this.idea.myVote === 4}">
					<div class="count" v-text="idea.votesMinusCount"></div>
					<div class="label">возразили</div>
				</div>
				<!--<div class="stat-box">-->
					<!--<div class="count" v-text="relevance"></div>-->
					<!--<div class="label">актуальность</div>-->
				<!--</div>-->
			</div>
			<section>
				<div class="hr wide" />
				<div class="row">
					<div class="half-area plus">
						<div class="area-title">
							<span class="h2">Комментарии &laquo;За&raquo;</span>
							<span class="hint count" v-if="idea.ideasPlusCount" v-text="'(' +idea.ideasPlusCount + ')'"></span>
							<button class="add-btn" @click="$router.push(`/idea-add?type=3&parent=${idea._id}`)">Добавить</button>
						</div>
						<ArgumentInDetails v-for="child in idea.ideasPlus" :idea="child" :key="child._id" @update="fetch"></ArgumentInDetails>
					</div>
					<div class="vr main" />
					<div class="half-area minus">
						<div class="area-title">
							<span class="h2">Комментарии &laquo;Против&raquo;</span>
							<span class="hint count" v-if="idea.ideasMinusCount" v-text="'(' +idea.ideasMinusCount + ')'"></span>
							<button class="add-btn" @click="$router.push(`/idea-add?type=4&parent=${idea._id}`)">Добавить</button>
						</div>
						<ArgumentInDetails v-for="child in idea.ideasMinus" :idea="child" :key="child._id" @update="fetch"></ArgumentInDetails>
					</div>
				</div>
				<!--<div class="anch">загрузить ещё...</div>-->
			</section>
			<!--section class="comments-area">
				<div class="h1">Комментарии<span v-if="idea.commentsCount" v-text="' (' +idea.commentsCount + ')'"></span></div>
				<CommentInDetails v-for="child in idea.comments" :idea="child" :key="child._id"></CommentInDetails>
				<button @click="$router.push(`/idea-add?type=1&parent=${idea._id}`)">Добавить</button>
			</section-->
			<!--<div v-text="idea"></div>-->
		</div>
	</div>
</template>

<script>
	import gate from '../modules/gate'
	import {renderDatetime} from '../modules/decorators'
	import ArgumentInDetails from '@/components/argument_in_details.vue';
	import CommentInDetails from '@/components/comment_in_details.vue';

	export default {
		components: {
			ArgumentInDetails,
			CommentInDetails,
		},
		props: ['id'],
		data () {
			return {
				initPromise: this.fetch(),
				idea: null,

				revote: false,
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
				return `https://vk.com/id${this.idea.author.vkUid}`
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
		},
	};
</script>

<style scoped lang="less" src="./idea.less"></style>
