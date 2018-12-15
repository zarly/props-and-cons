
import {users} from '../vk'
import ORM from '../../../server/orm'

const cache : {[index:string]:any} = {};

export async function getAuthorInfo (vkUid: number) {
    let author = cache[vkUid];
    if (author) return author;

    let user = await ORM.User.findOne({vkUid: `${vkUid}`});
    if (!user) {
        const vkUserInfo = await users.getUser(vkUid);
        user = await ORM.User.loginOrRegisterVk(`${vkUid}`, vkUserInfo);
        console.log('user = ', vkUserInfo, user);
    }

    author = user.getAuthorInfo();
    cache[vkUid] = author;
    return author;
}
