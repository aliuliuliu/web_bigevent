var form = layui.form;
// ---------------------- 获取真实的分类，渲染到下拉框的位置 -----
$.ajax({
    url: '/my/category/list',
    success: function(res) {
        // console.log(res)
        var htmlStr = template('tpl-category', res);
        $('select').html(htmlStr);
        // 渲染下拉框之后，需要调用layui的form模块的render方法进行更新一次
        form.render('select');
    }
});

// ---------------------- 初始化富文本编辑器 -------------------
// initEditor();
tinymce.init({

    selector: 'textarea',
    //方向从左到右
    directionality: 'ltr',
    //语言选择中文
    // language: 'zh_cn',
    //高度为400
    height: 300,
    statusbar: false,
    width: '100%',
    //工具栏上面的补丁按钮
    plugins: [
        'advlist autolink link image lists charmap preview hr anchor pagebreak spellchecker',
        'searchreplace wordcount visualblocks visualchars code insertdatetime nonbreaking',
        'save table contextmenu directionality template paste textcolor',
        'codesample'
    ],
    //工具栏的补丁按钮
    toolbar: 'insertfile undo redo | \
       styleselect | \
       bold italic | \
       alignleft aligncenter alignright alignjustify | \
       bullist numlist outdent indent | \
       image | \
       preview | \
       forecolor emoticons |\
       codesample fontsizeselect',
    //字体大小
    fontsize_formats: '10pt 12pt 14pt 18pt 24pt 36pt',
    //按tab不换行
    nonbreaking_force_tab: true
    //   imageupload_url: '/user/submit-image'
})

// ---------------------- 封面图片的处理 -----------------------
// 1. 实现基本的剪裁效果
var $image = $('#image');
var option = {
    // 宽高比
    aspectRatio: 400 / 280,
    // 指定预览的容器
    preview: '.img-preview'
};
$image.cropper(option);


// 2. 点击 选择封面 按钮，能够选图片
$('button:contains("选择封面")').on('click', function() {
    $('#file').trigger('click');
})

// 3. 当选择了图片之后，能够把剪裁区的图片更换
$('#file').on('change', function() {
    if (this.files.length > 0) {
        // 找文件对象
        var fileObj = this.files[0];
        // 创建预览的url
        var url = URL.createObjectURL(fileObj);
        // 更换剪裁区的图片（销毁之前的剪裁区 --> 更换图片 --> 重新生成剪裁区）
        $image.cropper('destroy').attr('src', url).cropper(option);
    }
})









// --------------------------  完成最终的添加文章 ------------------------
// 表单提交事件 --> 阻止默认行为 --> 收集表单数据 --> ajax提交
$('form').on('submit', function(e) {
    e.preventDefault();
    // FormData是根据表单各项的name属性值收集数据的
    var data = new FormData(this);
    // 获取富文本编辑器的内容，设置到FormData中
    data.set('content', tinyMCE.activeEditor.getContent());
    // 剪裁图片，把剪裁的结果追加到FormData中
    var canvas = $image.cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    });
    // 把canvas转换成 文件对象
    canvas.toBlob(function(blob) {
        // console.log(blob);
        data.append('cover_img', blob);

        // Ajax提交
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: data,
            // 提交的是FormData对象，所以必须加下面两项
            processData: false,
            contentType: false,
            success: function(res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    // 添加成功，跳转到文章列表页
                    location.href = './list.html';
                }
            }
        });

        // 检测 FormData中有哪些值
        // data.forEach(function (value, key) {
        //     console.log(key, value)
        // });
    });
})