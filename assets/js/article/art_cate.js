// 1. 一进去页面发送get请求获取服务器数据渲染页面
const initArtCateList = () => {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        data: null,
        success: res => {
            const { status, message, data } = res
            if (status !== 0) return layer.msg(message)

            // 调用模板引擎函数
            let htmlStr = template('tpl-table', data)

            $('#tb').html(htmlStr)
        }
    })
}
initArtCateList()

let layerAdd = null  // 把layui的弹出层在全局用变量接收，后面关闭弹出层要用到
// 2. 点击添加文章按钮
$('#addCateBtn').click(function () {
    // 用layui弹出层来写
    layerAdd = layer.open({
        type: 1,
        area: ["500px", "250px"],
        title: "添加文章分类",
        // 我们要的是html结构，所以把script里面的html结构直接获取过来
        content: $('#dialog-add').html()
    });
})

// 3. 点击确认添加按钮，提交表单获取表单值发起POST请求。通过事件委托来写，因为#form-add是后新增的
const form = layui.form
$('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '/my/article/addcates',
        data: form.val('formAdd'),
        success: res => {
            const { status, message } = res
            layerAdd.msg(message)
            if (status !== 0) return
            initArtCateList()
            layer.close(layerAdd)
        }
    })
})

let layerEdit = null
// 4. 编辑功能：点击编辑按钮，出现编辑弹出层
// 因为.btn-edit是模板引擎动态生成的，所以只能用事件委托来绑定事件
$('#tb').on('click', '.btn-edit', function (e) {
    // 用layui弹出层来写
    layerEdit = layer.open({
        type: 1,
        area: ["500px", "250px"],
        title: "添加文章分类",
        // 我们要的是html结构，所以把script里面的html结构直接获取过来
        content: $('#dialog-edit').html()
    });

    // 获取点击的编辑按钮的data-id属性，编辑按钮的data-id属性的属性值为数据的id
    let id = $(this).attr('data-id')
    // 发送get请求，请求点击的编辑按钮的相应的那条数据：把id作为参数发送请求
    $.ajax({
        type: 'GET',
        // 如果接口后是:，说明:后面是url参数，直接拼接上去。不要用查询字符串?+键值对那样去写
        url: '/my/article/cates/' + id,
        success: res => {
            const { status, message, data } = res
            if (status !== 0) return layer.msg(message)
            // 获取对应Id响应回来的数据后给表单赋值
            form.val('formEdit', data)
        }
    })
})

// 点击确认修改，更新文章分类
$('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '/my/article/updatecate',
        data: form.val('formEdit'),
        success: res => {
            const { status, message } = res
            layer.msg(message)
            if (status !== 0) return
            initArtCateList()
            layer.close(layerEdit)
        }
    })
})

// 删除功能：用事件委托来绑定点击事件，因为删除按钮是动态生成的，刚开始获取不到没法在其身上绑事件
$('#tb').on('click', '.btn-delete', function () {
    let id = $(this).attr('data-id')
    // 利用layui弹出层的询问confirm()方法
    layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
        $.ajax({
            type: 'GET',
            url: '/my/article/deletecate/' + id,
            data: null,
            success: res => {
                const { status, message } = res
                if (status !== 0) return layer.msg("删除分类失败！")
                layer.msg("删除分类成功！")
                layer.close(index)
                initArtCateList()
            }
        })
    })
})