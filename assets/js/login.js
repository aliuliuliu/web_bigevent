// ---------------------- 切换两个盒子的显示和隐藏 ------------------------
// 点击 登录的盒子里面的超链接，让登录盒子隐藏；让注册盒子显示
$('.login a').on('click', function() {
    $('.login').hide().next().show();
})

// 点击 注册的盒子里面的超链接，让登录盒子显示；让注册盒子隐藏
$('.register a').on('click', function() {
    $('.login').show().next().hide();
})



// ----------------------------- 注册功能 ------------------------------
// 找到注册的表单，注册submit事件 --> 阻止默认行为 --> 收集表单数据 --> Ajax提交给接口
$('.register form').on('submit', function(e) {
    e.preventDefault();
    // serialize() √  ||  FormData() ×
    var data = $(this).serialize();
    // console.log(data); // 一定要检查
    $.ajax({
        type: 'POST',
        url: '/api/reguser',
        data: data,
        success: function(res) {
            // console.log(res)
            // 无论成功还是失败，都给出提示
            layer.msg(res.message);
            // alert(res.message);
            // 如果注册成功，清空输入框的值；切换到登录的盒子
            if (res.status === 0) {
                $('.register form')[0].reset();
                $('.login').show().next().hide();
            }
        }
    });
})


// ----------------------- 注册的表单验证 ---------------------
// 1. 必填项不能为空 （三个输入框都需要验证）

// 2. 密码长度6~12位且不能出现空格 （密码、重复密码）
// 3. 两次密码必须一致（重复密码用）

// 使用 form 模块，必须先加载模块 （var 变量 = layui.模块名）
var form = layui.form;
// 调用 form.verify() 方法，自定义验证规则
form.verify({
    // 键（验证规则）：值（验证方法）

    user: [/^[a-zA-Z][a-zA-Z0-9]{1,9}$/, '只能是数字字母，字母开头，2~10位'],
    // 值可以为数组
    // len: ['正则表达式', '验证不通过时的提示']
    len: [/^\S{6,12}$/, '密码长度不对'], // 坑：注意是 {6,12} 不是 {6, 12}

    // 值也可以为函数
    same: function(val) {
        // 形参表示 使用该验证规则的输入框的值，这里 val 表示我们输入的确认密码
        // 找到输入的密码
        var pwd = $('.pwd').val();
        if (pwd !== val) {
            // return '验证不通过时的提示';
            return '两次密码不一致'
        }
    }

});


// ----------------------- 登录功能 ---------------------
$('.login form').on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    // console.log(data);
    $.ajax({
        url: '/api/login',
        type: 'POST',
        data: data,
        success: function(res) {
            console.log(res)
            // 无论成功还是失败，都提示
            layer.msg(res.message);
            if (res.status === 0) {
                // 登录成功，向本地存储中存入token
                localStorage.setItem('token', res.token);
                // 表示登录成功，跳转到index.html
                location.href = './index.html'
            }
        }
    });
})

// 验证用户名
$('#reg_user').on('blur', function() {
    var that = $(this);
    var username = that.val().trim();
    if (username === '') return that.next('span').text('');
    if (!/^[a-zA-Z][a-zA-Z0-9]{1,9}$/.test(username)) return that.next('span').css('color', 'red').text('只能是数字字母，字母开头，2~10位');
    $.ajax({
        url: '/api/checkuser',
        data: {
            username: that.val()
        },
        success: function(res) {
            if (res.status === 1) {
                that.next('span').css('color', 'red').text('用户名已存在');
            } else {
                that.next('span').css('color', 'green').text('用户名可用');
            }
        }
    })
})