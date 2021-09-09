// 表单验证
// 1. 长度6~12位，不能有空格 （三个输入框都用）
// 2. 新密码不能和原密码相同 （新密码使用）
// 3. 两次新密码必须一致（确认密码用）

var form = layui.form;

form.verify({
    // 键（验证规则）：值（验证方法）
    len: [/^\S{6,12}$/, '密码长度6~12位且不能有空格'],

    diff: function(val) {
        // val 表示新密码
        // 获取原密码
        var oldPwd = $('input[name=oldPwd]').val();
        if (oldPwd === val) {
            return '新密码不能和原密码相同'
        }
    },

    same: function(val) {
        // val 表示确认密码
        var newPwd = $('input[name=newPwd]').val();
        if (newPwd !== val) {
            return '确认密码和新密码不一致'
        }
    }
});



// ------------------------ 完成修改功能 ---------------------
$('form').on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: '/my/user/updatepwd',
        data: data,
        success: function(res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // $('form')[0].reset();
                // 清除token
                localStorage.removeItem('token');
                window.parent.location.href = '../login.html';
            }
        }
    });
})