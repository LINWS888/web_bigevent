$(function () {
    // 初始化用户信息
    let layer = layui.layer;
    initUserInfo();


    // 表单验证
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6)
                return '昵称长度必须在 1-6个字符之间';

            // 调用form.val('form中的lay-filter的值',object对象) 快速为表单赋值
            form.val('formUserInfo', res);
        }
    })

    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: "GET",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
            }
        })
    }

    // 重置表单的数据
    $("#btnReset").on('clcik', function (e) {
        // 阻止表单重置默认行为，（默认会全部清空，但是用户名称不用清空）
        e.preventDefault();
        // 只要初始化用户信息用就行了
        initUserInfo();

    })


    // 更新表单(通过表单的submit事件，而不是submit按钮的事件)
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 快速填写数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败');
                }
                layer.msg("更新用户信息成功");


                // 然后需要更改左侧的欢迎 *** 改为昵称而不是名称
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();   // window代表的是iframe这个窗口，.parent就是index页面，里面的js有个getUserInfo()方法，获取用户信息

            }
        })
    })
})


