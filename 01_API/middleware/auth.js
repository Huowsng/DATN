const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
      console.log("hhahaha")
        const token = req.header("Authorization")
        if (!token) return res.status(401).json({ error: "Unauthorized" })
        console.log("heheh")
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(401).json({ error: "Unauthorized" })

            req.user = user
            next()
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

module.exports = auth