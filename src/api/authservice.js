import request from './request';

const MODULE_PATH = "auth";

export const loginService = async (email, password) => {
    return await request('post', `${MODULE_PATH}/login`, false, {}, "", { email, password }, {});
};

export const registerService = async (email, password) => {
    return await request("post", `${MODULE_PATH}/register`, false, {}, "", { email, password }, {});
};
