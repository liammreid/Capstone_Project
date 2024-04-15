const jwt = require('jsonwebtoken');

exports.getToken = (req, res, next) => {
    let doMatch = res.locals.doMatch;
      let user = res.locals.user;
      
      if (doMatch && user) {
        // Generate the jwt
        const token = jwt.sign(
            {
              email: user.email,
              userId: user._id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '24h' }
          );
          res.status(200).json({ message: "Token generated.", data: {token: token, userId: user._id.toString() }});
      } else {
        res.status(403).json({message: "Authentication failed.", data: null});
      }
    }

exports.verifyToken = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretsecret');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
    };

exports.sendStylesJSON = (req, res, next) => {
    const styles = res.locals.styles;

    // Make sure data exists
    if (!styles) {
        // Send an error message
        res.status(500).json({message: 'An error occurred.  No menu data retrieved.', data: null})
    }
    // Send back the data
    res.json({message: "Success!", data: styles});
};

exports.handleError = (error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  }