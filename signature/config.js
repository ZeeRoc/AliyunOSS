var fileHost = "https://xxxxxxx.oss-cn-xxxxxxx.aliyuncs.com"
var config = {
  //aliyun OSS config
  uploadImageUrl: `${fileHost}`, // 上传的文件夹 
  AccessKeySecret: 'AccessKeySecret',
  OSSAccessKeyId: 'OSSAccessKeyId',
  timeout: 87600 // 文件失效时间
};
module.exports = config