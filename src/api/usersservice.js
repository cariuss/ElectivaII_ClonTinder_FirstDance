import request from "./request"

const MODULE_PATH = "users"

export const getProfile = async () => {
    return await request(
        "get",
        `${MODULE_PATH}/me`,
        true,
        {},
        "",
        {},
        {}
    )
}

export const updateProfile = async (name, age, gender, bio, preferences, location, profilePhoto) => {
    return await request(
        "put",
        `${MODULE_PATH}/profile`,
        true,
        {},
        "",
        {
            name, age, gender, bio,
            preferences, location, profilePhoto
        }
    )
}

export const updatePhoto = async (profilePhoto) => {
    return await request(
        "patch",
        `${MODULE_PATH}/profile/photo`,
        true,
        {},
        "",
        {
            profilePhoto
        },
        {}
    )
}

export const updateAdditionalProgilePhotos = async (additionalProfilePhotos) => {
    return await request(
        "patch",
        `${MODULE_PATH}`,
        true,
        {},
        "",
        {
            additionalProfilePhotos
        },
        {}
    )
}

export const getPotentialMatches = async (lastId) => {
    return await request(
        "get",
        `${MODULE_PATH}/potential-matches`,
        true,
        {},
        "",
        { lastId },
        {}
    )
}

