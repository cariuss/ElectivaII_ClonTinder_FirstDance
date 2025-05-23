import request from "./request"

const MODULE_PATH = "messages"

export const getMessages = async (matchId) => {
    return await request(
        "get",
        `${MODULE_PATH}`,
        true,
        {},
        `${matchId}`,
        {},
        {}
    )
}