const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: './uploads/attachments',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


function checkFileType(file, cb){
  
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt/;
  
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: Images and documents only!');
  }
}


const multerUpload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, 
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
});

module.exports = multerUpload;