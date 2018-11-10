
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
        const {className, style} = this.props;
        return (
            <div className={className} style={{fontFamily: 'Tahoma,Verdana,Arial', fontSize: ft.m, color: cl.dk, ...style}}>
                {this.props.children}
            </div>
        );
    }
}
