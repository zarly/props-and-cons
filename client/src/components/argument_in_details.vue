<template>
	<div class="ArgumentInDetails">
		<div class="actions">
			<!--div class="edit" @click="edit"></div-->
			<div class="remove" @click="remove" v-if="isShowRemove"></div>
		</div>
		<div class="left-part">
			<a class="author-photo" :href="idea.authorUrl" target="_blank" :style="{'background-image': 'url(' + idea.authorPhoto + ')'}"></a>
		</div>
		<div class="center-part">
			<div class="message-header">
				<a v-text="idea.authorName" class="anch fio" :href="idea.authorUrl" target="_blank"></a>
				<span class="datetime hint" v-text="idea.prettyCreatedDate" @click="navigateToDetails"></span>
			</div>
			<div v-text="idea.description" class="description"></div>
			<div class="message-footer">
				<span class="reply anch" @click="$router.push(`/idea-add?type=3&parent=${idea._id}`)">Дополнить</span>
				<span class="reply anch" @click="$router.push(`/idea-add?type=4&parent=${idea._id}`)">Опровергнуть</span>
				<span class="votes-stats">
					<span class="vote-up">
						<span class="arrow" :class="{active: this.idea.myVote === 3}" @click="vote(3)" title="Голосовать За">&#11014;</span>
						<span class="value" v-text="idea.votesPlus"></span>
					</span>
					&nbsp;
					<span class="vote-down">
						<span class="arrow" :class="{active: this.idea.myVote === 4}" @click="vote(4)" title="Голосовать Против">&#11015;</span>
						<span class="value" v-text="idea.votesMinus"></span>
					</span>
					&nbsp;
					<span class="answers" v-if="idea.responsesTotal" @click="$router.push(`/idea/${idea._id}`)" title="Читать комментарии">
						<span class="arrow">&#9993;</span>
						<span class="value" v-text="idea.responsesTotal"></span>
					</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	import gate from '../modules/gate'
	import me from '../modules/me'
	import {sendParams} from '../modules/stats'
	import {renderDatetime, renderQuantity} from '../modules/decorators'

	export default {
		props: ['idea'],
		data () {
			return {
				me,
			};
		},
		computed: {
			isShowRemove () {
				return this.idea.isAllowedRemove(this.me.user);
			},
		},
		methods: {
			navigateToDetails () {
				this.$router.push(`/idea/${this.idea._id}`);
			},
			async vote (voteType) {
				const newVotes = await gate.vote(this.idea._id, voteType);
				this.idea.votesPlus = newVotes.votesPlus;
				this.idea.votesMinus = newVotes.votesMinus;
				this.idea.skips = newVotes.skips;
				this.idea.myVote = newVotes.myVote;
				sendParams('vote', 'component_argument_in_details', this.voteType, this.idea._id);
			},
			edit () {
				this.$router.push(`/idea-add?idea=${this.idea._id}`);
			},
			async remove () {
				if (!confirm('Вы уверены, что хотите безвозвратно удалить этот пост?')) return;
				await gate.deleteIdea(this.idea._id);
				this.$emit('update');
			},
		}
	}
</script>

<style scoped lang="less">
	@import "../styles/variables";

	@shift-top: 20px;

	.ArgumentInDetails {
		display: flex;
		justify-content: flex-start;
		flex-direction: row;
		font-size: 12.5px;
		margin: @shift-top 0 0;
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

		.left-part {
			margin-right: 10px;

			.author-photo {
				display: block;
				@size: 54px;
				width: @size;
				height: @size;
				outline: none;
				border-radius: @size / 2;
				background-repeat: no-repeat no-repeat;
				background-position: center center;
				background-size: cover;
			}
		}

		.center-part {
			overflow: auto;

			.message-header {
				display: flex;
				justify-content: flex-start;

				.fio {
					overflow: hidden;
					text-overflow: ellipsis;
					display: block;
				}

				.datetime {
					display: inline-block;
					width: 150px;
					margin-left: 5px;
					cursor: pointer;

					&:hover {
						text-decoration: underline;
					}
				}
			}

			.description {
				margin: 6px 0;
			}

			.message-footer {
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

					.answers {
						cursor: pointer;
					}
				}
			}
		}
	}
</style>
