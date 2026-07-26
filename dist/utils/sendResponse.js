const sendResponse = async (res, data) => {
    res.status(data.status).json({
        success: data.success,
        status: data.status,
        message: data.message,
        total: data.total,
        data: data.data,
        meta: data.meta,
        error: data.error
    });
};
export default sendResponse;
