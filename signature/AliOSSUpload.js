const env = require('./config.js');

const Base64 = require('./Base64.js');

require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');


const upload = function (params) {
  if (!params.filePath || params.filePath.length < 9) {
    wx.showModal({
      title: '图片错误',
      content: '请检查图片路径和格式',
      showCancel: false,
    })
    return;
  }
  // 解决真机和开发工具的兼容问题
  const filePath = params.dir + (params.filePath.indexOf('http://tmp') > -1 ? params.filePath.replace('http://tmp', '') : params.filePath.replace('wxfile://tmp_', '/'))

  const uploadUrl = env.uploadImageUrl;
  const accessKeyId = env.OSSAccessKeyId;
  const policy = getPolicy();
  const signature = getSignature(policy);

  wx.uploadFile({
    url: uploadUrl,
    filePath: params.filePath,
    name: 'file',
    formData: {
      'key': filePath, // 服务利用key找到文件
      'policy': policy,
      'OSSAccessKeyId': accessKeyId,
      'signature': signature,
      'success_action_status': '200',
    },
    success: function (res) {
      if (res.statusCode != 200) {
        if (params.fail) {
          params.fail(res)
        }
        return;
      }
      if (params.success) {
        params.success(filePath);
      }
    },
    fail: function (err) {
      err.wxaddinfo = uploadUrl;
      if (params.fail) {
        params.fail(err)
      }
    },
  })
}

const getPolicy = function () {
  let date = new Date();
  date.setHours(date.getHours() + env.timeout);
  let expire = date.toISOString();
  const policy = {
    "expiration": expire, // 设置该Policy的失效时间
    "conditions": [
      ["content-length-range", 0, 3 * 1024 * 1024] // 设置上传文件的大小限制
    ]
  };

  return Base64.encode(JSON.stringify(policy));
}

const getSignature = function (policyBase64) {
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, env.AccessKeySecret, {
    asBytes: true
  });
  return Crypto.util.bytesToBase64(bytes);
}

module.exports = upload;