$(function () {
    var layer = layui.layer;
    var form = layui.form;
    //定义加载文章分类的方法
    initCate();
    // 初始化文本编译器
    initEditor();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }
                // 调用模板引擎
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //要记得调用
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });
    //获取用户选择的图片
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        //看用户有没有选择图片
        if (files.length === 0) {
            return
        }
        //根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);

        //为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 文章的发布状态
    var art_state = '已发布';
    //为存为草稿绑定事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    });

    //为表单绑定提交事件 
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //快速创建一个formDate对象
        var fd = new FormData($(this)[0]);

        fd.append('state', art_state);
        // fd.forEach(function (i, item) {
        //     // console.log(item, i);
        //     // 索引和值
        // });

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                // 发起 ajax 数据请求
                publishArticle(fd);
            })
    })

    // 定义发表ajax请求的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果提交的是formDate格式的数据,必须添加配置项 
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!');
                }
                layer.msg('发布文章成功!');
                location.href = '/article/art_list.html';
            }
        })
    }

})