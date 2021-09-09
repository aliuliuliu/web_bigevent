var form = layui.form;
// 加载layui 的分页模块
var laypage = layui.laypage;

// 分页获取文章列表的请求参数
var data = {
    pagenum: 1, // 页码值，比如2，将获取到第2页的数据
    pagesize: 2, // 每页有多少条数据，比如5，表示每页5条数据
    // cate_id: 1,
    // state: '已发布'
}

// ------------------ 获取文章并渲染到表格中 ------------------
function renderArticle() {
    $.ajax({
        url: '/my/article/list',
        data: data,
        success: function(res) {
            console.log(res);
            // 使用模板引擎，渲染数据
            var htmlStr = template('tpl-article', res);
            $('tbody').html(htmlStr);
            // ajax请求成功之后，才能得到文章总数
            showPage(res.total);
        }
    });
}

renderArticle();


// 封装分页函数
function showPage(t) {
    // 执行一个laypage实例
    laypage.render({
        elem: 'page', // 注意，这里的 test1 是 ID，不用加 # 号
        count: t, // 数据总数，从服务端得到
        limit: data.pagesize, // 每页显示多少条
        curr: data.pagenum, // 当前页
        limits: [2, 3, 5, 10],
        groups: 5, // 连续出现的页码个数
        // prev: '上一篇',
        // next: '上一篇',
        // first: '首页',
        // last: '尾页'
        layout: ['limit', 'prev', 'page', 'next', 'count', 'skip'],
        // 1. 生成页码的时候会自动调用一次；2. 另外切换分页时调用的函数
        jump: function(obj, first) {
            // obj包含了当前分页的所有参数，比如：
            // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
            // console.log(obj.limit); // 得到每页显示的条数

            // 首次不执行
            // console.log(first); // 生成页码的时候，first=true; 切换分页的时候，first=undefined
            if (!first) {
                //do something
                data.pagenum = obj.curr; // 切换到第几页，就把ajax请求参数中的的pagenum改为几
                data.pagesize = obj.limit;
                renderArticle();
            }
        }
    });
}


// ------------------- 筛选 --------------------------------
// 获取真实的分类，渲染到下拉框的位置
$.ajax({
    url: '/my/category/list',
    success: function(res) {
        var htmlStr = template('tpl-category', res);
        $('select').eq(0).html(htmlStr);
        // 更新渲染
        form.render('select');
    }
});

$('#search').on('submit', function(e) {
    e.preventDefault();
    // 获取下拉框的两个值
    var category = $('#category').val();
    var state = $('#state').val();
    // console.log(category, state)
    category ? data.cate_id = category : delete data.cate_id;
    state ? data.state = state : delete data.state;

    // 重置页码为第 1 页
    data.pagenum = 1;
    // 发请求获取数据，并渲染
    renderArticle();
})