$(function () {
    let layer = layui.layer;
    let form = layui.form;
    // 初始化富文本编辑器
    initEditor();


    initCate();
    // 加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败');
                }

                // 调用模板引擎
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                // 表单调用模板引擎后一定要记得调用form.render()重新渲染
                form.render();
            }
        })
    }

    // 图片裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    // 选择封面的功能
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })


    // 监听coverFile的 change事件,获取用户选择文件类表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        let files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return;
        }

        // 根据文件,创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options);      // 重新初始化裁剪区域
    })



    // 将form表单上传服务器
    // 首先要处理数据
    let art_state = "已发布";
    // 为存为草稿按钮绑定事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })


    // 将裁剪的图片对象变为blob对象
    let cover_img = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
        })


    // 为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 基于form表单,快速创建一个formData对象(ajax里的知识)
        let fd = new FormData($(this)[0]);

        // 将文章的发布状态存到fd中
        fd.append('state', art_state);
        // 将文章封面追加到fd中
        fd.append(cover_img);



        // 最后发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/articel/add',
            data: fd,
            // 如果向服务器提交的是formData的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("发布文章失败");
                }
                layer.msg("发布文章成功");

                // 然后重新跳转到文章列表页面
                location.href = '/article/art_list.html';
            }

        })
    })


})