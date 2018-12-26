<template>
	<div class="IdeaDetails">
		<div class="actions">
			<!--div class="edit" @click="edit"></div-->
			<div class="remove" @click="remove" v-if="isShowRemove"></div>
		</div>
		<div class="center-part">
			<div v-text="idea.title" v-if="idea.title" class="h2 title"></div>
			<UserTextViewer :text="idea.description" class="description"></UserTextViewer>
			<div class="message-footer row">
				<div class="area-left row">
					<template v-if="idea.type === 103">
						<span class="reply anch" @click="$router.push(`/idea-add?type=1&parent=${idea._id}`)">Ответить</span>
					</template>
					<template v-else>
						<span class="reply anch" @click="$router.push(`/idea-add?type=3&parent=${idea._id}`)">Дополнить</span>
						<span class="reply anch" @click="$router.push(`/idea-add?type=4&parent=${idea._id}`)">Опровергнуть</span>
					</template>
					<span class="votes-stats">
						<IconedCounter :size="16" :icon="iconUp" @clickIcon="vote(3)" :clickable="true" :active="idea.myVote === 3"
									   :counter="idea.votesPlusCount" :iconShiftY="-1" title="Голосовать За"></IconedCounter>
						<IconedCounter :size="16" :icon="iconDown" @clickIcon="vote(4)" :clickable="true" :active="idea.myVote === 4"
									   :counter="idea.votesMinusCount" :iconShiftY="1" title="Голосовать Против"></IconedCounter>
						<IconedCounter class="share" :size="16" :icon="iconShare" @clickIcon="showShareDialog" :clickable="true" :hideZero="true"
									   :counter="0" :iconShiftY="1" title="Позвать друзей"></IconedCounter>
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
	import {sendParams} from '../modules/stats'
	import {renderDatetime, renderQuantity} from '../modules/decorators'
	import UserTextViewer from '@/components/user_text_viewer.vue';
	import IconedCounter from '@/components/iconed_counter.vue';
	import iconUp from '../../static/icons/baseline-thumb_up-24px.svg';
	import iconDown from '../../static/icons/baseline-thumb_down-24px.svg';
	import iconShare from '../../static/icons/baseline-share-24px.svg';

	export default {
		components: {
			IconedCounter,
			UserTextViewer,
		},
		props: ['idea'],
		data () {
			return {
				iconUp,
				iconDown,
				iconShare,

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
				this.idea.votesPlusCount = newVotes.votesPlus;
				this.idea.votesMinusCount = newVotes.votesMinus;
				this.idea.skips = newVotes.skips;
				this.idea.myVote = newVotes.myVote;
				sendParams('vote', 'idea_details', this.voteType, this.idea._id);
			},
			edit () {
				this.$router.push(`/idea-add?idea=${this.idea._id}`);
			},
			async remove () {
				if (!confirm('Вы уверены, что хотите безвозвратно удалить этот пост?')) return;
				await gate.deleteIdea(this.idea._id);
				this.$router.push(`/ideas`);
				sendParams('delete_idea', 'idea_details', '-', this.idea._id);
			},
			showShareDialog () {
				sendParams('share_idea', 'idea_details', '-', this.idea._id);

				const match_api_id = location.search.match(/api_id=([0-9]+)/);
				const match_group_id = location.search.match(/group_id=([0-9]+)/);
				const match_user_id = location.search.match(/user_id=([0-9]+)/);

				const app = match_api_id && match_api_id[1];
				const community = (match_group_id && match_group_id[1] && ('_-' + match_group_id[1])) || (match_user_id && match_user_id[1] && ('_' + match_user_id[1]));

				const link = `https://vk.com/app${app}${community || ''}?ad_id=idea_${this.idea._id}_share`;
				prompt('Чтобы позвать сюда своих друзей, скопируйте и отправьте им эту ссылку, на стене или в личных сообщениях:', link);
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
				display: flex;
				justify-content: flex-start;
				align-items: center;
				max-width: 150px;
				margin-left: 20px;

				.IconedCounter {
					margin-top: -1px;
					margin-right: 10px;

					&.share {
						margin-top: -2px;
						margin-right: 0;
						margin-left: 15px;
					}
				}
			}
		}
	}
</style>
