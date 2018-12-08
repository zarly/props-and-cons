
import * as Sentry from '@sentry/browser'
import Vue from 'vue'
import App from './App'
import router from './router'

Sentry.init({
	dsn: 'https://1884eaa25fe0419c95ef1c866304cba0@sentry.io/1320319',  // TODO: вынести в конфиг
	integrations: [new Sentry.Integrations.Vue({ Vue })],
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
});

(function () {
	const referrerMath = location.search.match('referrer=([^&]*)');
	const referrer = referrerMath && referrerMath[1];
	if (referrer) {
		const refPath = referrer.split('_');
		if (refPath[0] === 'ad' && refPath[1] === 'idea' && refPath[2]) {
			router.push(`/idea/${refPath[2]}`);
		}
	}
})();
