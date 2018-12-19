
import fetch from 'node-fetch';
import { URL } from 'url';

const access_token = process.env.ACCESS_TOKEN;

export async function delay (timimg: number) {
    return new Promise(resolve => setTimeout(resolve, timimg));
}

export async function execute (code: string) { // https://vk.com/dev/execute
    return await method('execute', {code});
}

export async function method (method: string, params: any = {}) : Promise<any> {
    await delay(350);
    // console.log(method, params);

    const url = new URL(`https://api.vk.com/method/${method}`);
    url.searchParams.append('v', '5.52');
    url.searchParams.append('access_token', access_token);

    Object.keys(params).forEach((key: string) => url.searchParams.append(key, params[key]));

    console.debug(url.href);
    const res = await fetch(<any>url);
    const json = await res.json();

    if (json.response) {
        return json.response;
    } else {
        console.error(json);
        throw json.error;
    }
}

export function extendLimit (fn: Function, BATCH = 100) {
    return async function (method: string, params: any) {
        const OFFSET = params.offset || 0;
        const COUNT = params.count || Infinity;

        let data = await fn(method, Object.assign({}, params, {count: BATCH, offset: OFFSET}));
        let items = data.items;
        const count = data.count;

        if (count <= BATCH) {
            return {items, count};
        }

        for (let i = BATCH; i < count; i += BATCH) {
            if (items.length >= COUNT) break;

            data = await fn(method, Object.assign({}, params, {count: BATCH, offset: OFFSET + items.length}));
            items = items.concat(data.items);
        }

        return {
            items: items.slice(0, Math.min(COUNT, count)), 
            count,
        };
    };
}
