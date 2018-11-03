
import React from 'react'
import Page from '../../components/page'
import gate from '../../modules/gate'

export default class Screen extends React.Component {
    constructor () {
        super();
        this.state = {
            me: null,
            search: '',
        };
    }

    async componentDidMount () {
        const me = await gate.ask('/users/me');
        this.setState({me});

        if ('undefined' !== typeof window) {
            this.setState({search: window.location.search.split('&hash=')[0] + '&hash='});
        }
    }

    render () {
        const {me, search} = this.state;
        const vkInfo = me && me.vkInfo || {};

        return (
            <Page>
                <a href={'/vkapp' + search}>вернуться</a>
                <h3>{vkInfo.first_name} {vkInfo.last_name}</h3>
                <img src={vkInfo.photo_100} />
            </Page>
        );
    }
}
