
import {merge} from 'lodash'
import base from './default'

export default merge({
    environment: 'testing',
}, base);
