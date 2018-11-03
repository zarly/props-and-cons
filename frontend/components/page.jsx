
import React from 'react'
import {init as initMetrika} from '../modules/yandex-metrika'

export default class Page extends React.Component {
    componentDidMount () {
        if ('undefined' !== typeof window) {
            initMetrika();
        }
    }

    render () {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
