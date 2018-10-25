
import {merge} from 'lodash'
import base from './default'

export default merge({
    environment: 'production',
    mongoose: 'mongodb://localhost:27017/props-and-cons-production',
}, base);
