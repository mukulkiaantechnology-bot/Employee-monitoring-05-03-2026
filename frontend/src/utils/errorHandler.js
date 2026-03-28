/**
 * Global Error Handler Utility
 * Maps technical backend errors to user-friendly messages.
 */

export const getErrorMessage = (error) => {
    // 1. Handle case where error is a simple string
    if (typeof error === 'string') return error;

    // 2. Extract backend custom message (Highest Priority)
    const backendMessage = error.response?.data?.message || error.response?.data?.error;
    if (backendMessage) return backendMessage;

    // 3. Handle Axios specific errors
    if (error.code === 'ERR_NETWORK') {
        return "Unable to connect. Please check your internet connection.";
    }
    
    if (error.code === 'ECONNABORTED') {
        return "The request timed out. Please try again later.";
    }

    // 4. Map HTTP Status Codes
    const status = error.response?.status;
    
    switch (status) {
        case 400:
            return "Invalid request. Please check your input.";
        case 401:
            return "Invalid email or password.";
        case 403:
            return "You don't have permission to perform this action.";
        case 404:
            return "The requested data was not found.";
        case 409:
            return "This record already exists.";
        case 422:
            return "Validation failed. Please check your inputs.";
        case 500:
            return "Internal server error. Our team is working on it.";
        case 502:
        case 503:
        case 504:
            return "Server is currently unavailable. Please try again later.";
        default:
            // 5. Safe Fallback
            return error.message || "Something went wrong. Please try again.";
    }
};
