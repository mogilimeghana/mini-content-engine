const healthCheck = (req, res) => {
    res.send("Backend is running!");
};

module.exports = {
    healthCheck
};