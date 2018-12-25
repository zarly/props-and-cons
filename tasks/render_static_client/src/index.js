
// Шаг 1: Создаём экземпляр Vue
import Vue from 'vue'

const app = new Vue({
	template: `<div>Hello World</div>`
});

// Шаг 2: Создаём рендерер
const renderer = require('vue-server-renderer').createRenderer();

// // Шаг 3: Рендерим экземпляр Vue в HTML
// renderer.renderToString(app, (err, html) => {
// 	if (err) throw err;
// 	console.log(html);
// 	// => <div data-server-rendered="true">Hello World</div>
// });

// с версии 2.5.0+, возвращает Promise если коллбэк не указан:
renderer.renderToString(app).then(html => {
	console.log(html);
}).catch(err => {
	console.error(err);
});
