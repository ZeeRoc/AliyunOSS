const AliOssUpload = require('../../utils/signature/AliOSSUpload.js');

// 小程序JS
Page({
    onLoad() {
        AliOssUpload({
            filePath: res.tempFilePaths[0],
            dir: 'chatImg',
            success(e) {
                console.log(e)
            }
        })
    }
})
