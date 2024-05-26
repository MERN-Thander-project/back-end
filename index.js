import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from 'cors'
import {
    LoginValidation,
    postCreateValidation,
    registerValidation,
} from "./validations.js";

import {UserController,PostController} from "./controllers/index.js";

import {handleValidationErrors,checkAuth} from "./utils/index.js";
mongoose
    .connect(
        process.env.MONGODB_URI
    )
    .then(() => {
        
        console.log("db ok");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage}); //load

app.use(express.json());
app.use(cors())
app.use("/uploads", express.static("uploads")); //load

app.post(
    "/auth/login",
    LoginValidation,
    handleValidationErrors,
    UserController.login
);
app.post(
    "/auth/register",
    registerValidation,
    handleValidationErrors,
    UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

//load file
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
//crud
app.get("/tags",PostController.getLastTags)
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
    "/posts",
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
    "/posts/:id",
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.update
);
app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("server ok");
});
