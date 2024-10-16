const jwt = require("jsonwebtoken");

const generateToken = (id, isAdmin,role) => {
  return jwt.sign(
    { id, isAdmin, role },
    process.env.JWT /*{
    expiresIn: "30d",
  }*/
  );
};



module.exports = generateToken;
