import jwt from 'jsonwebtoken';

export const generateToken = (id, res) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('jwt', token ,{
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: false
    })

    return token;
}