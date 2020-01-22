const JWTService = require('./JWTService')

let options = {
    issuer: "Authorizaxtion/Resource/This server",
    subject: "iam@user.me",
    audience: "Client_Identity" // this should be provided by client
};

module.exports = {
    generateToken(user)
    {
        let payload = {
            phone: user.phone
        }
        
        return JWTService.sign(payload, options);
    },
    verifyToken(token)
    {
        return JWTService.verify(token, options);
    }
}