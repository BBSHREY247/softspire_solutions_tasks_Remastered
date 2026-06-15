const db = require("../config/db");

const createUser = (
    fullname,
    email,
    password,
    callback
) => {

    const sql =
    "INSERT INTO users(fullname,email,password) VALUES(?,?,?)";

    db.query(
        sql,
        [fullname,email,password],
        callback
    );

};

module.exports = {
    createUser
};