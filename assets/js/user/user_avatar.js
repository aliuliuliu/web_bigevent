$(function () {

    var layer = layui.layer
    let image = $('#image')
    // console.log(image)
    // 设置图片尺寸
    let option = {
        aspectRatio: 1,
        preview: '.img-preview',
    }
    image.cropper(option)

    //为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 为文件选择框绑定  change 事件
    $('#file').on('change', function (e) {
        // 获取用户选择的图片
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }

        //1.拿到用户选择的图片
        var file = e.target.files[0]
        //2.将文件 转化为路径
        var imgURL = URL.createObjectURL(file)
        //3.重新初始化裁剪区域
        image
            .cropper('destroy') //销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(option) //重新初始化裁剪区域
    })
    $('#btnUpload').on('click', function () {
        //1.要拿到用户剪裁之后的头像
        let canvas = image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        })
        let base64 = canvas.toDataURL() //将Canvas  画布上的内容 转化为 base64 格式字符串

        //2.调用接口 把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: base64
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更新头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})