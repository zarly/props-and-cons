
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
        const {me, search} = this.state;
        const vkInfo = me && me.vkInfo || {};

        return (
            <div>
                <a href={'/vkapp' + search}>вернуться</a>
                <h3>{vkInfo.first_name} {vkInfo.last_name}</h3>
                <img src={vkInfo.photo_100} />
                <script src="/static/yandex-metrika.js"></script>
            </div>
        );
    }
}
