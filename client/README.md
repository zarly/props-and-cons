# props-and-cons-client

> Props and cons client

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# Первый запрос в API ВКонтакте

```
method=users.get&user_ids={user_id},{viewer_id}&format=json&v=5.27
```
или
```
method=groups.getById&group_ids={group_id}&format=json&v=5.27
```
или
```
method=execute&code=var users = API.users.get({user_ids: [{user_id},{viewer_id}]});var groups = API.groups.getById({group_ids: [{group_id}]});return [users,groups];&format=json&v=5.27
```
