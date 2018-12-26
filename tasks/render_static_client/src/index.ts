
// Шаг 1: Создаём экземпляр Vue
import Vue from 'vue'
import {createRenderer} from 'vue-server-renderer'

const app = new Vue({
	template: `<div>Hello World</div>`
});

// Шаг 2: Создаём рендерер
const renderer = createRenderer();

// с версии 2.5.0+, возвращает Promise если коллбэк не указан:
renderer.renderToString(app).then(html => {
	console.log(html);
}).catch(err => {
	console.error(err);
});
