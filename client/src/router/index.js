import Vue from 'vue'
import Router from 'vue-router'
import Ideas from '../pages/ideas.vue'
import Idea from '../pages/idea.vue'

Vue.use(Router);

const router = new Router({
	routes: [
		{
			path: '/',
			name: 'root',
			component: Ideas
		},
		{
			path: '/ideas',
			name: 'ideas',
			component: Ideas
		},
		{
			path: '/idea/:id',
			name: 'idea',
			component: Idea,
			props: true
		},
		{
			path: '/idea-add',
			name: 'idea-add',
			component: () => import(/* webpackChunkName: "idea-add" */ '../pages/idea_add.vue')
		},
		{
			path: '/settings',
			name: 'settings',
			component: () => import(/* webpackChunkName: "settings" */ '../pages/settings.vue')
		},
		{
			path: '/demo',
			name: 'demo',
			component: () => import(/* webpackChunkName: "demo" */ '../pages/demo.vue')
		},
	]
});

router.afterEach((to, from) => {
	// Отправляем параметры визита, топорный метод, но временно норм
	try {
		var params = {};
		var app, user, community, realm, referrer;
		var match_api_id = location.search.match(/api_id=([0-9]+)/);
		var match_viewer_id = location.search.match(/viewer_id=([0-9]+)/);
		var match_group_id = location.search.match(/group_id=([0-9]+)/);
		var match_user_id = location.search.match(/user_id=([0-9]+)/);
		var match_referrer = location.search.match(/referrer=([0-9]+)/);
		app = match_api_id && match_api_id[1];
		user = match_viewer_id && match_viewer_id[1];
		community = (match_group_id && match_group_id[1] && ('g' + match_group_id[1])) || (match_user_id && match_user_id[1] && ('u' + match_user_id[1]));
		realm = 'vk:' + (app || 'common') + ':' + (community || 'common');
		referrer = match_referrer && match_referrer[1];

		params = {};
		params[realm || '-'] = {};
		params[realm || '-'][user || '-'] = {};
		params[realm || '-'][user || '-'][referrer || '-'] = {};
		params[realm || '-'][user || '-'][referrer || '-'][location.hash] = {};
		params[realm || '-'][user || '-'][referrer || '-'][location.hash]['navigate'] = {};
		params[realm || '-'][user || '-'][referrer || '-'][location.hash]['navigate'][(from && (from.name || from.fullPath)) || '-'] = {
			count: 1
		};

		if (window.yaCounter45281769) {
			window.yaCounter45281769.params(params);
		} else { // первая навигация, до загрузки метрики
			setTimeout(() => { window.yaCounter45281769.params(params); }, 1000);
		}
	} catch (e) {
		console.error(e);
	};
});

export default router;
