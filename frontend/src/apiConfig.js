export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

//routes
export const API = {
    LOGOUT : `${BACKEND_URL}/logout`,
    SIGN_IN : `${BACKEND_URL}/signin`,
    SIGN_UP : `${BACKEND_URL}/signup`,
    GOOGLE_AUTH : `${BACKEND_URL}/google/auth`,
    AUTH_CHECK : `${BACKEND_URL}/auth`,
}