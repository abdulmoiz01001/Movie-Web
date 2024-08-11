function authMiddleware(req, res, next) {
    // Get the authCookie from cookies
    console.log(req)
    if(req!=undefined){
        const token = req.cookies.token;

        console.log('authMiddleware: authCookie:', token);
    
        // Check if the cookie exists
        if (token) {
            // Proceed to the next middleware or route handler
            next();
        } else {
            // Redirect to home if the cookie is not present
            res.redirect('/');
        }
    }
    
   
}

module.exports = authMiddleware;
