import request from "./request"

const MODULE_PATH = "matches"
export const getMatchHistory = async () => {
    return await request(
        'get',
        `${MODULE_PATH}/history`,
        true,
        {},
        "",
        {},
        {}
    )
}