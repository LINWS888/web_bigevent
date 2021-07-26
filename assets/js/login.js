$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $(".login-box").hide();
        $('.reg-box').show();
    })

    // 点击去登录的链接
    $('#link_login').on('click', function () {
        $(".login-box").show();
        $('.reg-box').hide();
    })



    var layer = layui.layer;
    //正则验证
    // 1.首先从layui中获取form对象   
    var form = layui.form;   //类似$.each 的格式，就是layui自带的
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 检验两次密码是否一致的规则
        repwd: function (value) {
            // 通过value拿到的是确认密码框的内容，
            // 还需要拿到密码框的内容(通过name 拿到)
            let pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                // 如果判断不一致，就return消息
                return "两次密码不一致";
            }
        }
    });


    // 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        // 先阻止默认提交行为
        e.preventDefault();

        // 再发起一个ajax的post请求
        const data = {
            username: '$(#form_reg [name=username]).val()',
            password: '$(#form_reg [name=password]).val()'
        };
        $.post("/api/reguser",
            data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                    // return console.log(res);
                }
                layer.msg('注册成功，请登录');
                // console.log(res.message);
                // 成功后到登录界面
                // 模拟点击行为
                $('#link_login').click();
            })
    })


    // 监听登录表单事件
    $('#form_login').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 直接获取表单数据，比手动拼接快
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("登陆失败");
                }
                layer.msg('登陆成功');
                location.href = '/index.html';
                console.log(res.token);
            }
        })
    })

})
// $(function () {
//     // 点击“去注册账号”的链接
//     $('#link_reg').on('click', function () {
//         $('.login-box').hide()
//         $('.reg-box').show()
//     })

//     // 点击“去登录”的链接
//     $('#link_login').on('click', function () {
//         $('.login-box').show()
//         $('.reg-box').hide()
//     })

//     // 从 layui 中获取 form 对象
//     var form = layui.form
//     var layer = layui.layer
//     // 通过 form.verify() 函数自定义校验规则
//     form.verify({
//         // 自定义了一个叫做 pwd 校验规则
//         pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
//         // 校验两次密码是否一致的规则
//         repwd: function (value) {
//             // 通过形参拿到的是确认密码框中的内容
//             // 还需要拿到密码框中的内容
//             // 然后进行一次等于的判断
//             // 如果判断失败,则return一个提示消息即可
//             var pwd = $('.reg-box [name=password]').val()
//             if (pwd !== value) {
//                 return '两次密码不一致！'
//             }
//         }
//     })

//     // 监听注册表单的提交事件
//     $('#form_reg').on('submit', function (e) {
//         // 1. 阻止默认的提交行为
//         e.preventDefault()
//         // 2. 发起Ajax的POST请求
//         var data = {
//             username: $('#form_reg [name=username]').val(),
//             password: $('#form_reg [name=password]').val()
//         }
//         $.post('http://api-breakingnews-web.itheima.net/api/reguser', data, function (res) {
//             if (res.status !== 0) {
//                 return layer.msg(res.message)
//             }
//             layer.msg('注册成功，请登录！')
//             // 模拟人的点击行为
//             $('#link_login').click()
//         })
//     })

//     // 监听登录表单的提交事件
//     $('#form_login').submit(function (e) {
//         // 阻止默认提交行为
//         e.preventDefault()
//         $.ajax({
//             url: 'http://api-breakingnews-web.itheima.net/api/login',
//             method: 'POST',
//             // 快速获取表单中的数据
//             data: $(this).serialize(),
//             success: function (res) {
//                 if (res.status !== 0) {
//                     return layer.msg('登录失败！')
//                 }
//                 layer.msg('登录成功！')
//                 // 将登录成功得到的 token 字符串，保存到 localStorage 中
//                 localStorage.setItem('token', res.token)
//                 // 跳转到后台主页
//                 location.href = '/index.html'
//             }
//         })
//     })
// })
