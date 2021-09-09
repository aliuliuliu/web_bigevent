var form = layui.form;
// ------------------- 数据回填 ---------------------
function renderUser() {
    $.ajax({
        url: '/my/user/userinfo',
        success: function(res) {
            console.log(res)
            if (res.status === 0) {
                // $('input[name=username]').val(res.data.username);
                // $('input[name=nickname]').val(res.data.nickname);
                // $('input[name=email]').val(res.data.email);
                // $('input[name=id]').val(res.data.id);

                // form.val('表单', 值);
                // 如下所示:  user是form标签的lay-filter属性值
                // res.data对象的属性 必须 和 表单各项的name属性值 相同。才能完成赋值。
                form.val('user', res.data);
            }
        }
    });
}
renderUser();



// --------------------- Ajax请求，完成用户信息的更新 --------------------

$('form').on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serialize(); /** 设置username禁用状态 */
    // console.log(data);
    $.ajax({
        type: 'POST',
        url: '/my/user/userinfo',
        data: data,
        success: function(res) {
            // console.log(res)
            layer.msg(res.message);
            if (res.status === 0) {
                // 修改成功，更新 index.html 页面中昵称
                // 调用父页面的函数，重新渲染即可
                window.parent.getUserInfo();
            }
        }
    })
})


$('button[type=reset]').on('click', function(e) {
    e.preventDefault();
    renderUser();
})