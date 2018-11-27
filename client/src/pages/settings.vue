<template>
	<div class="SettingsPage VkPage">
		<div v-if="!idea" class="anch" @click="$router.push('/ideas')">&lt; список тем</div>
		<h1>Настройки</h1>
		<div v-if="me && me.vkInfo" class="user-card">
			<img class="user-photo" :src="me.vkInfo.photo_100"/>
			<a class="user-name anch" v-text="me.vkInfo.first_name + ' ' + me.vkInfo.last_name" :href="'https://vk.com/id' + me.vkInfo.id"></a>
		</div>
		<!--<div>{{me}}</div>-->
		<!--<div>{{group}}</div>-->
		<!--<div>{{global}}</div>-->
	</div>
</template>


<script>
	import gate from '../modules/gate'

	export default {
		data () {
			return {
				initPromise: this.fetch(),
				me: null,
				group: null,
				global: null,
			};
		},
		methods: {
			async fetch () {
				const result = await gate.ask('/settings');
				this.me = result.me;
				this.group = result.group;
				this.global = result.global;
			}
		},
	};
</script>

<style scoped lang="less">
	.SettingsPage {
		.user-card {
			display: flex;
			align-items: center;

			.user-photo {
				width: 50px;
				height: 50px;
				border-radius: 25px;
			}

			.user-name {
				padding: 10px;
			}
		}
	}
</style>
