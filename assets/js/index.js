$(function () {
    // 调用getUserInfo 获取用户信息
    getUserInfo();


    // 退出按钮（给退出的a链接一个id，然后绑定一个事件，给一个confirm框）
    let layer = layui.layer;
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function (index) {
            // 1.清空token
            localStorage.removeItem('token');
            // 2.重新跳转登录页
            location.href = '/login.html';

            // 关闭confirm询问框，自带的，不能动
            layer.close(index);
        });
    })
})


// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        // 不用写根路径了，必须引入baseAPI
        url: '/my/userinfo',
        method: "GET",


        // headers请求头配置对象，涉及到隐私的部分，必须写请求头,可以在baseAPI里预设值

        // headers: {
        //     // 因为前面失败了，所以直接写
        //     // Authorization: localStorage.getItem('token') || ''

        //     Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK - EA8LNrtMG04llKdZ33S9KBL3XeuBxuI'
        // },

        success: function (res) {
            if (res.statis !== 0) {
                return layer.msg('获取用户信息失败');
            }

            // 成功后，调用renderAvatar 渲染用户的头像和名字信息
            renderAvatar();
        },



        // 可以在baseAPI里全局统一配置
        // 不论成功还是失败，都会调用这个complete函数，用来控制用户访问后台页面的权限
        // complete: function (res) {
        //     console.log(res);
        //     // 在回调函数中，里面有个responseJSON对象responseJSON
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token
        //         localStorage.removeItem('token');
        //         // 2.强制回到登录页面
        //         location.href = '/login.html';
        //     }
        // }

    })
}


// 渲染用户的头像
function renderAvatar(user) {
    // 1.获取用户的名称
    let name = user.nickname || user.username;
    // 2.设置侧边栏  欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);

    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像，并显示
        $('.layui-nav-img').attr('src', user_pic).show();
        // 隐藏文本图片
        $('.text-avatar').hide();
    } else {  // 3.2渲染文本图像
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();  // 得到名字的第一个字符
        $('.text-avatar').html(first).show();
    }


}