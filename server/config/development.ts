
import {merge} from 'lodash'
import base from './default'

export default merge({
    environment: 'development',
    mongoose: 'mongodb://localhost:27017/props-and-cons-development',
}, base);
