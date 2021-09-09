// ------------------------------ 获取类别，并渲染到页面中 ---------------------
function renderCategory() {
    $.ajax({
        url: '/my/category/list',
        success: function(res) {
            // console.log(res)
            var html = template('tpl-list', res);
            $('tbody').html(html);
        }
    });
}
renderCategory();



// --------------------------------- 删除类别 -------------------------------
$('tbody').on('click', 'button:contains("删除")', function() {
    var id = $(this).data('id'); // 获取id
    // 询问是否要删除
    layer.confirm('确定要删除分类吗？', {
        icon: 3,
        title: '提示'
    }, function(index) {
        // do something
        // 这里写删除的代码
        $.ajax({
            url: '/my/category/delete',
            data: {
                id: id
            },
            success: function(res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    renderCategory();
                }
            }
        });
        layer.close(index);
    });
})


// --------------------------------- 添加类别 -------------------------------
var addIndex;
// 1. 点击 添加类别 按钮，出现弹层
$('button:contains("添加类别")').on('click', function() {
    // 实现弹层
    addIndex = layer.open({
        // 键：值 （基础参数）
        type: 1, // 层的类型，可以改，1 表示页面层
        title: '添加分类',
        content: $('#tpl-add').html(),
        area: ['500px', '250px']
    });
    // 拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。
})

// 2. 点击按钮，表单提交，阻止默认行为，收集数据，ajax提交
// 事件委托的方式注册事件
$('body').on('submit', '#add-form', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    // console.log(data);
    $.ajax({
        type: 'POST',
        url: '/my/category/add',
        data: data,
        success: function(res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // 更新页面数据（保留）
                renderCategory();
                // 关闭弹层
                layer.close(addIndex);
            }
        }
    });
})


// --------------------------------- 编辑类别 -------------------------------
var editIndex;
// 1. 点击 编辑 按钮，出现弹层
$('tbody').on('click', 'button:contains("编辑")', function() {
    // 获取编辑的三个自定义属性
    var data = $(this).data(); // 表示获取标签的全部 data-xxx 属性值
    // console.log(data); // {alias: "kexue", name: "科学", id: 4}
    // 实现弹层
    editIndex = layer.open({
        // 键：值 （基础参数）
        type: 1, // 层的类型，可以改，1 表示页面层
        title: '编辑分类',
        content: $('#tpl-edit').html(),
        area: ['500px', '250px'],
        // 弹层成功之后，触发下面的函数，在函数中，完成数据回填
        success: function() {
            var form = layui.form;
            form.val('edit', data);
        }
    });
    // 拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。
})

$('body').on('submit', '#edit-form', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    // console.log(data);
    $.ajax({
        type: 'POST',
        url: '/my/category/update',
        data: data,
        success: function(res) {
            layer.msg(res.message);
            if (res.status === 0) {
                renderCategory(); // 更新页面数据
                layer.close(editIndex); // 关闭弹层
            }
        }
    });
})

// var id = 145;
// $.ajax({
//     // url: '/my/category/deltecate/:id'
//     url: '/my/category/deltecate/' + id,
//     // data: { data就不需要了 }
// });