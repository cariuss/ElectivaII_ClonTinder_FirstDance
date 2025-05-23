import request from './request';

export const login = async (email, password) => {

    return await request(
        'post',
        'login',
        false,
        {},
        '',
        {
            email: email,
            password: password
        },
        {}
    );
};
