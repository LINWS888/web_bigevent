// 注意：每次调用$.geyt()或者$.post()或者$.ajax()都会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
    options.url = "http://api-breakingnews-web.itheima.net" + options.url;
    // console.log(options.url);



    // 要判断是否请求路径中有my的字符串
    // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        };
    }

    // 全局统一挂载一个complete回调函数
    options.complete = function (res) {
        // 可以在baseAPI里全局统一配置
        // 不论成功还是失败，都会调用这个complete函数，用来控制用户访问后台页面的权限
        // 在回调函数中，里面有个responseJSON对象responseJSON
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token');
            // 2.强制回到登录页面
            location.href = '/login.html';
        }

    }
})