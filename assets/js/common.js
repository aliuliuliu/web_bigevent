var baseUrl = 'http://www.itcbc.com:8080';
// var baseUrl = 'http://localhost:8888';

// 下面的函数能够获取到ajax选项，并允许修改
$.ajaxPrefilter(function(options) {
    // 配置Ajax请求的根路径
    options.url = baseUrl + options.url;

    // 判断一下，如果url中有“/my/” ，需要指定headers和complete
    if (options.url.includes('/my/')) {
        // 统一加入headers
        options.headers = {
            // Authorization 是固定写法
            Authorization: localStorage.getItem('token')
        };

        // 请求完成（无论成功还是失败）后触发
        options.complete = function(xhr) {
            // console.log(xhr);
            if (xhr.responseJSON && xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                // 如果满足这个条件，说明用户使用了假token
                // 把假token删除
                localStorage.removeItem('token');
                // 跳转到登录页面
                if (location.href.includes('index.html')) {
                    location.href = './login.html';
                } else {
                    window.parent.location.href = '../login.html';
                }
            }
        }
    }

});