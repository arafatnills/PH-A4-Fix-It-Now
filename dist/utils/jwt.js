import jwt from "jsonwebtoken";
const createToken = (payload, secret, options) => {
    const token = jwt.sign(payload, secret, options);
    return token;
};
const verifyToken = async (token, secret) => {
    try {
        const verifyToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifyToken,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};
export const jwtUtils = {
    createToken, verifyToken
};
