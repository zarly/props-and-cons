
import React from 'react'

export default class Page extends React.Component {
    constructor () {
        super();
        this.state = {
            me: null,
            search: '',
        };
    }

    async componentDidMount () {
        await fetch('/api/ping');
        const res = await fetch('/api/users/me');
        const me = await res.json();
        this.setState({me});

        if ('undefined' !== typeof window) {
            this.setState({
                search: window.location.search
            });
        }
    }

    render () {
        const {search} = this.state;

        return (
            <div>
                <a href={'/vkapp/profile' + search}>профиль пользователя</a>
                <h1>Идеи</h1>
                <script src="/static/yandex-metrika.js"></script>
            </div>
        );
    }
}
