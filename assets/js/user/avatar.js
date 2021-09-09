// 1. 实现初始的剪裁效果
// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')

// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options);

// 2. 点击 上传 按钮，能够选择图片
// 选择包含有“上传”两个字的按钮
$('button:contains("上传")').on('click', function() {
    // 触发文件域的单击事件
    $('#file').trigger('click');
})

// 3. 当选择了图片，应该更换剪裁区的图片
$('#file').on('change', function(e) {
    // e.target 表示事件源，是jquery封装好的
    if (this.files.length > 0) {
        // 找到文件对象
        var fileObj = this.files[0];
        // 生成临时的url
        var url = URL.createObjectURL(fileObj);
        // console.log(url);
        // 更换剪裁区的图片 （先销毁剪裁框 --> 更换图片 --> 重新生成剪裁框）
        $image.cropper('destroy').attr('src', url).cropper(options);
    }
})




// 4. 点击 确定 按钮，剪裁图片 --> 发送Ajax请求，完成更换图片
$('button:contains("确定")').on('click', function() {
    // 4.1 先剪裁图片
    var canvas = $image.cropper('getCroppedCanvas', {
        width: 100,
        height: 100
    });
    // canvas 是一个html标签及一套绘图API，也叫做画布
    // canvas.toDataURL(); -- 转成base64格式的字符串
    // canvas.toBlob(); -- 转成文件对象的形式
    var base64 = canvas.toDataURL();
    // console.log(base64)
    $.ajax({
        type: 'POST',
        url: '/my/user/avatar',
        data: {
            avatar: base64
        },
        success: function(res) {
            layer.msg(res.message);
            if (res.status === 0) {
                window.parent.getUserInfo(); // 调用父页面的函数，更新头像
            }
        }
    })
})