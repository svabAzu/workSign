import jwt from "jsonwebtoken"

export const authRequierd = (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return res.status(401).json({ message: 'no token auth' })
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid Token" })
            
        req.decoded = decoded
     //   console.log("decoded", decoded)
        
        
        next()
    })

}