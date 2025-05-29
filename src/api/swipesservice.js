import request from "./request"

const MODULE_PATH = "swipes"

export const recordSwipe = async (swipeData) => {
    return await request(
        "post",
        `${MODULE_PATH}`,
        true,
        {},
        "",
        {
            userId: swipeData.userId,
            targetUserId: swipeData.targetUserId,
            swipeType: swipeData.swipeType,
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