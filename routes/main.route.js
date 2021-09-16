// DEFINE ROUTER
const express = require("express");
const app = express();


const catRoutes = require("./cat.route");
const userRoutes = require("./user.route")
const postRoutes = require("./post.route")
const adminUserRoutes = require("./adminUser.route")

// ALL ROUTES


// app.use("/post", catRoutes);
app.use("/cats", catRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use('/adminUser',adminUserRoutes )




// EXPORT ROUTES
module.exports = app;