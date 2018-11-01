
declare module 'passport-custom' {
    import * as passport from 'passport'
    import {Express} from 'express-serve-static-core'

    interface VerifyFunction {
        (
            req: Express.Request,
            done: (error: any, user?: any) => void
        ): void;
    }

    class Strategy extends passport.Strategy {
        constructor (verify: VerifyFunction);

        name: string;
    }
};
