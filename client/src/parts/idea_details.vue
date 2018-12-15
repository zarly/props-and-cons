<template>
	<div class="IdeaDetails">
		<div class="actions">
			<!--div class="edit" @click="edit"></div-->
			<div class="remove" @click="remove" v-if="isAllowedRemove"></div>
		</div>
		<div class="center-part">
			<div v-text="idea.title" v-if="idea.title" class="h2 title"></div>
			<div v-text="idea.description" class="description"></div>
			<div class="message-footer row">
				<div class="area-left">
					<span class="reply anch" @click="$router.push(`/idea-add?type=3&parent=${idea._id}`)">Дополнить</span>
					<span class="reply anch" @click="$router.push(`/idea-add?type=4&parent=${idea._id}`)">Возразить</span>
					<span class="votes-stats">
						<span class="vote-up">
							<span class="arrow" :class="{active: idea.myVote === 3}" @click="vote(3)" title="Голосовать За">&#11014;</span>
							<span class="value" v-text="idea.votesPlusCount"></span>
						</span>
						&nbsp;
						<span class="vote-down">
							<span class="arrow" :class="{active: idea.myVote === 4}" @click="vote(4)" title="Голосовать Против">&#11015;</span>
							<span class="value" v-text="idea.votesMinusCount"></span>
						</span>
					</span>
				</div>
				<div class="area-right hint">
					<a v-text="idea.authorName" class="fio anch hint" :href="idea.authorUrl" target="_blank"></a>,
					<span class="datetime" v-text="idea.prettyCreatedDate" @click="navigateToDetails"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import gate from '../modules/gate'
	import me from '../modules/me'
	import {renderDatetime, renderQuantity} from '../modules/decorators'

	export default {
		props: ['idea'],
		data () {
			return {
				me,
			};
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
			navigateToDetails () {
				this.$router.push(`/idea/${this.idea._id}`);
			},
			async vote (voteType) {
				const newVotes = await gate.vote(this.idea._id, voteType);
				this.idea.votesPlusCount = newVotes.votesPlus;
				this.idea.votesMinusCount = newVotes.votesMinus;
				this.idea.skips = newVotes.skips;
				this.idea.myVote = newVotes.myVote;
			},
			edit () {
				this.$router.push(`/idea-add?idea=${this.idea._id}`);
			},
			async remove () {
				if (!confirm('Вы уверены, что хотите безвозвратно удалить этот пост?')) return;
				await gate.deleteIdea(this.idea._id);
				this.$router.push(`/ideas`);
			},
		}
	}
</script>

<style scoped lang="less">
	@import "../styles/variables";

	.IdeaDetails {
		font-size: 12.5px;
		position: relative;

		.actions {
			display: flex;
			position: absolute;
			top: 1px;
			right: 2px;
			opacity: 0;
			transition: @transition-opacity-hide;

			.edit,
			.remove {
				width: 12px;
				height: 12px;
				cursor: pointer;
				background-repeat: no-repeat;
				background-size: cover;
				opacity: 0.5;
				margin-left: 5px;
			}

			.edit {
				background-image: url('../../static/backgrounds/baseline-edit-24px.svg');
			}

			.remove {
				background-image: url('../../static/backgrounds/baseline-close-24px.svg');
			}
		}
		&:hover .actions {
			opacity: 1;
			transition: @transition-opacity-show;
		}

		.title {
			margin-bottom: 7px;
		}

		.description {
			margin: 0;
		}

		.message-footer {
			margin-top: 7px;

			.reply {
				font-weight: normal;
				margin-right: 5px;
			}

			.votes-stats {
				display: inline-block;
				width: 100px;

				.vote-up .arrow {
					color: @cl-green;
					cursor: pointer;
				}

				.vote-down .arrow {
					color: @cl-red;
					cursor: pointer;
				}

				.arrow {
					opacity: 0.3;

					&.active {
						opacity: 1;
					}
				}
			}
		}
	}
</style>
