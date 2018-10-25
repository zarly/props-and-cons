
import {merge} from 'lodash'
import base from './default'

export default merge({
    environment: 'testing',
    mongoose: 'mongodb://localhost:27017/props-and-cons-tesing',
}, base);
