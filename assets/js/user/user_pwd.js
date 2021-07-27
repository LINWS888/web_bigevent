$(function () {
    let layer = layui.layer;
    // 表单验证
    let form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "两次密码不一致";
            }
        }

    })


    $('.layui-form').on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatePwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败');
                }
                layer.msg("跟新密码成功");

                // 更新完后把表单重置为空的
                // 先把表单加一个[0]转换成DOM元素，然后调用reset()方法
                $('.layui-form')[0].resest();
            }
        })
    })

})