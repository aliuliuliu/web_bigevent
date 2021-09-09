// 封装一个函数，获取用户信息，并渲染头像和欢迎语
function getUserInfo() {
    $.ajax({
        url: '/my/user/userinfo',
        // 请求成功后触发 success
        success: function(res) {
            if (res.status === 0) {
                // 1. 设置欢迎你 xx （优先使用 nickname，没有nickname只能使用username）
                var name = res.data.nickname || res.data.username;
                $('.username').text(name);
                // 2. 设置头像(优先使用图片；没有图片只能使用name的第一个字符)
                if (res.data.user_pic) {
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                    $('.user-avatar').hide();
                } else {
                    var first = name.substr(0, 1).toUpperCase();
                    $('.user-avatar').text(first).css('display', 'inline-block');
                }
            }
        }
    });
}
getUserInfo();




// --------------------- 退出 ---------------------
$('#logout').on('click', function(e) {
    e.preventDefault();
    // 询问是否要退出
    layer.confirm('你确定要退出吗？', {
        icon: 3,
        title: '提示'
    }, function(index) {
        // do something
        // 如果确定退出，1. 删除本地存储中的token；2. 跳转到 login.html
        localStorage.removeItem('token');
        location.href = './login.html';

        layer.close(index); // 关闭弹层
    });
})