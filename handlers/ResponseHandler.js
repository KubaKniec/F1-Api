const responseHandler = (req, res, next) => {
    res.success = (data) => res.status(200).json(data); // 200 OK
    res.notFound = (message) => res.status(404).json({ error: message || "Not Found" });
    res.serverError = (message) => res.status(500).json({ error: message || "Internal Server Error" });
    next();
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.serverError("An unexpected error occurred.");
};

export { responseHandler, errorHandler };