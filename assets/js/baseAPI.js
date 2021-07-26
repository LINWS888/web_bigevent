// 注意：每次调用$.geyt()或者$.post()或者$.ajax()都会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
    options.url = "http://api-breakingnews-web.itheima.net" + options.url;
    // console.log(options.url);

})