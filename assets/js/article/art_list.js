// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
const query = {
    // 一般获取列表数据，都会要带pagenum和pagesize这两个参数
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
};

// 
const initTable = () => {
    $.ajax({
        type: 'GET',
        url: '/my/article/list',
        data: query,
        success: res => {
            // 一般获取列表数据，返回的数据都会包括total，表示总共有多少条数据
            // console.log(res);
            const { status, message, data, total } = res
            if (status !== 0) return layer.msg(message)
            let htmlStr = template('tpl-table', data)
            $('#tb').html(htmlStr)
            // 调用渲染分页的方法
            renderPage(total)
        }
    })
}

initTable()

const laypage = layui.laypage

// 定义渲染分页的方法
function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
        elem: 'pageBox', // 分页容器的 Id
        count: total, // 总数据条数
        limit: query.pagesize, // 每页显示几条数据
        curr: query.pagenum, // 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        // 分页发生切换的时候，触发 jump 回调
        // 触发 jump 回调的方式有两种：
        // 1. 点击页码的时候，会触发 jump 回调
        // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
        jump: function (obj, first) {
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 把最新的页码值，赋值到 q 这个查询参数对象中
            query.pagenum = obj.curr
            // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
            query.pagesize = obj.limit
            // 根据最新的 q 获取对应的数据列表，并渲染表格
            if (!first) {
                initTable()
            }
        }
    })
}

// 定义美化时间的过滤器
template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}

// 定义补零的函数
function padZero(n) {
    return n > 9 ? n : '0' + n
}

const form = layui.form;

// 初始化文章分类的方法(下拉列表)
const initCate = () => {
    $.ajax({
        method: "GET",
        url: "/my/article/cates",
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg("获取分类数据失败！");
            }
            // 调用模板引擎渲染分类的可选项
            var htmlStr = template("tpl-cate", res);
            $("[name=cate_id]").html(htmlStr);
            // 通过 layui 重新渲染表单区域的UI结构。没有双向数据绑定，所以需要通过 layui调用渲染函数
            form.render();
        },
    });
};

initCate();

// 实现筛选的功能
$('#form-search').submit(function (e) {
    e.preventDefault()
    // 获取表单中选中项的值
    query.cate_id = $('[name=cate_id]').val()
    query.state = $('[name=state]').val()
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
})

$('#tb').on('click', '.delete-btn', function () {
    // 通过$('.delete-btn').length得到页面上有几条数据
    let len = $('.delete-btn').length

    let id = $(this).attr('data-id')
    // 利用layui弹出层的询问confirm()方法
    layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
        $.ajax({
            type: 'GET',
            url: '/my/article/delete/' + id,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('删除文章失败！')
                }
                layer.msg('删除文章成功！')
                // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                // 如果没有剩余的数据了,则让页码值 -1 之后,
                // 再重新调用 initTable 方法
                if (len === 1) {
                    // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                    // 页码值最小必须是 1
                    query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1
                }
                initTable()
            }
        })
        layer.close(index)
    })
})