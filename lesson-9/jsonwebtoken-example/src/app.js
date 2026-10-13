import jwt from "jsonwebtoken";
import "dotenv/config";

const {JWT_SECRET} = process.env;

const payload = {
    email: "reviva5584@18lover.com"
};

const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "24h"});
// console.log(token);
const decodeToken = jwt.decode(token);
// console.log(decodeToken);

try {
    const {email} = jwt.verify(token, JWT_SECRET);
    console.log(email);
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJldml2YTU1ODRAMThsb3Zlci5jb20iLCJpYXQiOjE3OTE5MDY4OTMsImV4cCI6MTc5MTk5MzI5M30._GpOJUgUo8zM3n03hNb0JBzAaJGcyePkDg3jGvmnfWC";
    jwt.verify(invalidToken, JWT_SECRET)
}
catch(error) {
    console.log(error.message);
}