
import '../style/_common.less'
import {pd, mg, ft, cl} from '../style/theme'
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
            <div style={{fontFamily: 'Tahoma,Verdana,Arial', fontSize: ft.m, color: cl.dk, ...this.props.style}}>
                {this.props.children}
            </div>
        );
    }
}
