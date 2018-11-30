import express from "express";
import userCtrl from "../controllers/userCtrl.js"
import artilceCtrl from "../controllers/articleCtrl.js"
const getRouter = express.Router()

//获取单个user
getRouter.get('/oneuser', (req, res) => {
    userCtrl.getSomeOne(req, res);
});
// 获取所有user
getRouter.get('/alluser', (req, res) => {
    userCtrl.getAllUser(req, res);
});
//获取单个article
getRouter.get('/onearticle', (req, res) => {
    artilceCtrl.getSomeOne(req, res);
});
//获取all article
getRouter.get('/allarticle', (req, res) => {
    artilceCtrl.getAllArticle(req, res);
});


export default getRouter;