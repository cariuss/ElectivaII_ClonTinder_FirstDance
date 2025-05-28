import request from "./request"

const MODULE_PATH = "users"

export const getProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found. Authentication required.");
        return { success: false, error: "Unauthorized access" };
    }

    return await request(
        "get",
        `${MODULE_PATH}/me`,
        true,
        { Authorization: `Bearer ${token}` }, // ✅ Ahora el token va en los headers
        "",
        {},
        {}
    );
};


export const updateProfile = async (profileData) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found. Authentication required.");
        return { success: false, error: "Unauthorized access." };
    }

    return await request(
        "put",
        "users/profile",
        true, // Usa autenticación
        {},
        "",
        profileData, // ✅ Enviar el objeto directamente
        { Authorization: `Bearer ${token}` } // ✅ Token en los headers
    );
};

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

export const updateAdditionalProfilePhotos = async (files) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("additionalProfilePhotos", file); // ✅ Envía los archivos correctamente
    });

    return await request(
        "patch",
        "profile/additional-photos", // ✅ Asegúrate de que la ruta coincida con el backend
        true,
        {},
        "",
        formData,  // ✅ FormData en lugar de JSON
        { "Content-Type": "multipart/form-data" }  // ✅ Indicar que se envían archivos
    );
};
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

