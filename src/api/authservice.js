import request from './request';

const MODULE_PATH = "auth"

export const login = async (email, password) => {

    return await request(
        'post',
        `${MODULE_PATH}/login`,
        false,
        {},
        '',
        {
            email,
            password
        },
        {}
    );
};

export const register = async (email, password) => {
    return await request(
        "post",
        `${MODULE_PATH}/register`,
        false,
        {},
        '',
        {
            email,
            password
        },
        {}
    )
}