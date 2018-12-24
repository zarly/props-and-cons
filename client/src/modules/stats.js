
var inSessionCounter = 0;
var startTs = Date.now();

export function sendParams (eventName, param1, param2, param3) {
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
		params[realm || '-'][user || '-'][referrer || '-'][location.hash || '-'] = {};
		params[realm || '-'][user || '-'][referrer || '-'][location.hash || '-'][eventName || '-'] = {};
		params[realm || '-'][user || '-'][referrer || '-'][location.hash || '-'][eventName || '-'][param1 || '-'] = {};
		params[realm || '-'][user || '-'][referrer || '-'][location.hash || '-'][eventName || '-'][param1 || '-'][param2 || '-'] = {};
		params[realm || '-'][user || '-'][referrer || '-'][location.hash || '-'][eventName || '-'][param1 || '-'][param2 || '-'][param3 || '-'] = {
            count: 1,
            index: ++inSessionCounter,
            uptime: Date.now() - startTs,
		};

		if (window.yaCounter45281769) {
			window.yaCounter45281769.params(params);
		} else { // первая навигация, до загрузки метрики
			setTimeout(() => { window.yaCounter45281769.params(params); }, 1000);
		}
	} catch (e) {
		console.error(e);
	};
}
