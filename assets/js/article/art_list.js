$(function () {
    // 定义一个查询的参数对象，将来发送请求的时候发送到服务器
    let q = {
        pagenum: 1,  // 默认请求第一页的数据
        pagesize: 2, // 默认每页显示两条数据
        cate_id: '', // 文章分类的id
        state: ''   // 文章的发布状态(已发布，未发布)
    };

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var n = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }



    initTable();
    initCate();

    let layer = layui.layer;
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败");
                }

                // 使用模板引擎渲染页面table的数据  
                let htmlStr = template('tpl-table', res.data);
                $('tbody').html(htmlStr);



                // 最后再写分页(当表格渲染完成以后，再分页)
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }



    let form = layui.form;

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败");
                }

                // 调用模板引擎渲染分类的可选项
                // 页面加载的时候，layui.js看到section里面没有可选项，就没有渲染，然后ajax异步获取后，layui.js无法监听到
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                // 调用form.render()方法，通知layui重新渲染表单的UI结构
                form.render();

            }
        })
    }



    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();

        // 把获取到的值填充到q对象中对应的属性
        q.cate_id = cate_id;
        q.state = state;

        // 调用初始化表格方法，重新渲染
        initTable();
    })



    let laypage = layui.laypage;
    // 定义分页的方法
    // total是API接口返回的一个数据
    function renderPage(total) {
        // 调用laypage.render方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 ele 需要的是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,   // limit 每页显示几条数据
            curr: q.pagenum,        // 默认选中哪一页
            limits: [2, 3, 5, 10],  // 这个参数是为下面的layout的limit的可选项改动
            layout: ['count', 'limit', 'pre', 'page', 'next', 'skip'],   // 上一页，下一页


            // 分页发生切换或者每页几条数据的的时候，触发jump回调
            // 触发jump回调会有两种方式：
            // 1.点击页码的时候
            // 2.只要laypage.render()方法，就会触发jump回调（导致jump死循环）
            jump: function (obj, first) {
                // obj.curr  当点击的时候自动获取
                // obj.limit 当点击每页几条数据时自动获取

                // first点击页码，即第一种方式触发jump回调，值为undefined 
                // first第一次进入页面，就是第二种方式触发jump回调，值为true

                // 把obj.curr 的值传递给q.pagenum, 
                q.pagenum = obj.curr;

                // 把最新的条目数赋值到q.pagesize上
                q.pagesize = obj.limit;
                // 根据最新的q，调用initTable() 来请求最新的数据
                // initTable();  这么写jump回调会不断的被触发，一直是pagenume = 1，死循环
                if (!first) {  // 第一种方式触发jump回调,就调用initTable()刷新数据
                    initTable();
                }
            }

        });
    }


    // 通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {

        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 获取到文章的id
            let id = $(this).attr('data-id');

            // 获取删除按钮的个数,用来判断是否  页码-1
            let len = $('.btn-delete').length;

            $.ajax({
                method: 'GET',
                // 这里的id是通过[name=]选择器获取，通过给删除按钮一个data-id={{$value.Id}}属性，然后通过attr获取获取    
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败");
                    }

                    layer.msg("删除文章成功");

                    // bug：如果删除掉了某一页的最后一条数据，此时pagenum还是当前页
                    // 然后调用initTable() 页码值还是上一次的，所以就显示空白了
                    // 解决：判断当前页是否还有数据，如果没有就页码值-1，再渲染数据
                    if (len === 1) {
                        // 如果len的值为1，那么删除完毕后，页面上就没有任何数据了
                        // 注意：页码值最小值为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    // 重新渲染数据
                    initTable();
                }
            })
            layer.close(index);
        });
    })


})