
import testing from './testing'
import production from './production'
import development from './development'

let config;
switch (process.env.NODE_ENV) {
    case 'testing':
        config = testing;
        break;
    case 'production':
        config = production;
        break;
    default:
        config = development;
}

export default config;
