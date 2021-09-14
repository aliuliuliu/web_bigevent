$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义时间梅花过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    //定义补零的方法
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    //定义一个查询的参数对象，将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值，默认第一页的数据
        pagesize: 2,//默认每页显示几条数据
        cate_id: '',//文章分类的id
        state: ''//文章发布的状态
    }

    initTable();
    initCate();

    //获取文章表格数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                // 使用模板引擎
                // layer.msg('获取文章列表成功！');
                // console.log(res.data);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }

        });
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败!');
                }
                //调用模板
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单区域的ul结构
                form.render();
            }
        })
    }

    // 为删选绑定事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取表单中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        console.log(cate_id);
        console.log(state);
        // 添加到 查询q
        q.cate_id = cate_id;
        q.state = state;
        //重新渲染表格数据
        initTable();
        // console.log(q);

    })


    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用这个方法渲染分页 
        laypage.render({
            elem: 'pageBox',
            //注意，这里的是 ID，不用加 # 号, 
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页显示多少数据 
            curr: q.pagenum,//设置默认选择的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7],
            //发生更换时触发jump函数 
            //点击页码的时候触发，
            //只要调用render函数就触发
            jump: function (obj, first) {
                // console.log(first);
                // 为ture则是方式2触发的
                // console.log(obj.curr);
                //把最新的页码给q
                q.pagenum = obj.curr;
                //最新的条目数传递过去;
                q.pagesize = obj.limit;
                //根据最新值渲染表格
                if (!first) {
                    //判断是第二方法触发的 
                    initTable();
                }
            }
        })
    }


    // 通过代理的方式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        //是否删除
        var len = $('.btn-delete').length;
        //获取删除按钮的个数
        // console.log(len);
        var id = $(this).attr('date-id');
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    //数据删除完全后看看还有没有数据
                    if (len == 1) {
                        //删除完毕页面上没有数据了;
                        // 页面值最小是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    });
});