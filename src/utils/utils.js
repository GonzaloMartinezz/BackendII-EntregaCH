export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        // El nombre 'jwtCookie' debe coincidir con el que pones en el login
        token = req.cookies['jwtCookie']; 
    }
    return token;
};