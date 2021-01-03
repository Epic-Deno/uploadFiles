/*
 * @Description: Powered By Fantastic Artwork Vue.js @ Evan You.
 * @Version: 2.0
 * @Autor: PONY ZHANG
 * @Date: 2021-01-03 22:36:47
 * @LastEditors: PONY ZHANG
 * @LastEditTime: 2021-01-03 23:34:05
 * @motto: 「あなたに逢えなくなって、錆びた時計と泣いたけど…」
 * @topic: # Carry Your World #
 */
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const createFolder = (folder) => { 
    try { 
        fs.accessSync(folder);
     } catch(e) { 
         fs.mkdirSync(folder);
      }
 };

 const uploadFolder = "/Users/zhangzhen/learns/node/uploadFiles/public/files"

 createFolder(uploadFolder);

 const app = express();

 app.use(express.static('public'));
 
 //跨域设置
 app.all("*",(request, response, next) => {
     response.header("Access-Control-Allow-Origin", "http://127.0.0.1:8081");
     response.header("Access-Control-Allow-Origin", 'Content-Type, Content, Content-Type, Content-Length, Authorization, Accept, X-Requested-with');
     response.header(
        "Access-Control-Allow-Origin",
        "PUT,POST,GET,DELETE,OPTIONS"
     );
     response.header("Content-Type", "application/json;charset=utf-8");
     next();
 });

 const fileFilter = (req, file, cb) => {
     const acceptableMime = ["image/jpeg", "image/png", "image/jpg", "image/gif", "aplication/zip", "aplication/x-zip-compressed"];
     //限制类型
     //null是固定写法
     if(acceptableMime.indexOf(file.mimetype) != -1) {
         cb(null, true); // 通过上传
     } else { 
         cb(null, false); //禁止上传
         cb(new Error('文件类型错误'));
      }
 }

 const storage = multer.diskStorage({
     //设置上传图片服务器位置
     destination: (req, file, cb) => { 
         cb(null, uploadFolder);
      },
      //设置上传文件的保存名称
      filename: (req, file, cb) => {
          //获取后缀名称
          let exName = file.originalname.slice(file.originalname.lastIndexOf("."));
          //获取名称
          let fileName = Date.now();
          //组合名称
          let finalName = fileName+exName; 
          console.log(finalName);
          cb(null, finalName)
      },
 });

 const limits = {
     fileSize: 1024*1024
 }

 const imageUploader = multer({
     storage,
     fileFilter,
     limits
 }).single("file"); //文件上传预定name

 app.post("/upload", (req, res) => { 
     imageUploader(req, res, (err) => { 
        if(err instanceof multer.MulterError) {
            //发生错误的时候
            console.log("MulterError");
            if(err.code === "LIMIT_FILE_SIZE") { 
                res.send({
                    success: false,
                    desc: "File too large",
                    result: null,
                });
                return;
             } 
        } else if(err) {
            //发生错误
            console.log("eror");
            res.send({
                success: false,
                desc: "文件类型错误",
                result: null,
            });

            return;
        }
        const { originalname, mimetype, size, filename } = req.file;
        //一切正常
        res.send({
            success: true,
            des: 'upload successfully',
            result: { 
                originalname, mimetype, size,
                path: `http://127.0.0.1:8081/files/${filename}`
             }
        });
    })
  });

  app.listen(8081, () => {
      console.log("服务启动成功！")
  });
 