$(function () {
    initArtCateList();
    // 1.获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // res.data


                // 通过模板引擎template-web快速填充表格
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    let layer = layui.layer;
    // 这个indexAdd是为了以后关闭弹出层先定义的，layer.open()返回一个index
    let indexAdd = null;

    // 2.为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,   // type为1就是没有确定按钮了（页面层），默认是0（信息框） 
            area: ['500px', '250px'],  // 宽高
            title: "添加文章分类",
            content: $('#dialog-add').html()
        })
    })

    // 3.form的submit事件函数
    // 因为form是动态生成的，不能直接$获取
    // 通过代理的模式绑定form表单的提交事件
    // 不行的：$('#form-add').on('submit', function () {})
    $('body').on('submit', 'form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('新增分类失败');
                }

                // 如果成功的话，重新获取列表的数据
                initArtCateList();
                layer.msg("新增分类成功");

                // 根据索引关闭指定的弹出层
                layer.close(indexAdd);
            }
        })
    })



    // 通过代理的方式，为btn-edit绑定点击事件
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,   // type为1就是没有确定按钮了（页面层），默认是0（信息框） 
            area: ['500px', '250px'],  // 宽高
            title: "修改文章分类",
            content: $('#dialog-edit').html()
        })

        // 获取data-id的属性值id=1，2，3
        let id = $(this).attr('data-id');

        let form = layui.form;

        // 发起请求获取id对应的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // form.val('form的lay-filter属性的值',返回的数据)
                form.val('form-edit', res.data);
            }
        })

    })


    // 通过代理的形式，为修改分类的表单form绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            // 快速获取表单的数据$.serialize()
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新分类数据失败");
                }
                layer.msg('更新数据成功')

                // 手动关闭
                layer.close(indexEdit);
                // 刷新表格数据
                initArtCateList();
            }

        })
    })



    // 通过代理的形式，为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        // 通过id删除
        let id = $(this).attr('data-id');

        // 提示用户是否要删除(用confirm询问框)
        layer.confirm('是否删除', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                method: 'GET',
                url: 'my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer('删除分类成功');
                    layer.close(index);
                    // 刷新列表数据
                    initArtCateList();
                }
            })

        });
    })

})