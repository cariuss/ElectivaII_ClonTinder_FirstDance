import request from "./request"

const MODULE_PATH = "swipes"

export const recordSwipe = async (targetUserId, swipeType) => {
    return await request(
        "post",
        `${MODULE_PATH}`,
        true,
        {},
        "",
        {
            targetUserId,
            swipeType
        }
    )
}

export const getSwipesHistory = async () => {
    return await request(
        "get",
        `${MODULE_PATH}/history`,
        true,
        {},
        "",
        {},
        {}
    )
}