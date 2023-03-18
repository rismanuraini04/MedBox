const checkId = (req, res, next ) => {
    try {
        const id = req.params.id;
        if (id>4) throw "Your ID is invalid"
        return next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            title: "ID not valid",
            message: error
        })
    }
}

module.exports = {checkId}