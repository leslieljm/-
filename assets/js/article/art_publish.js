const form = layui.form

// 1. 封装一个函数获取文章分类列表
const renderCatesList = () => {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: res => {
            const { status, message, data } = res
            if (status !== 0) return layer.msg(message)
            // 调用模板引擎，渲染分类的下拉菜单
            let htmlStr = template('tpl-cate', data)
            $('[name=cate_id').html(htmlStr)
            // 一定要记得调用 form.render() 方法 否则看不到页面的变化，因为是单向数据绑定
            form.render();
        }
    })

}
renderCatesList()

// 2. 初始化富文本编辑器
initEditor()

// 3.
// 3.1. 初始化图片裁剪器
var $image = $('#image')

// 3.2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'  // 预览区域
}

// 3.3. 初始化裁剪区域
$image.cropper(options)

// 4. 点击选择封面按钮，模拟点击隐藏的type为file的文本框
$('#chooseImageBtn').click(function () {
    $('#coverFile').click()
})

// 4.1 隐藏的type为file的文本框的value值发生改变了就会触发change事件
$('#coverFile').change(function (e) {
    // console.log(e);
    // 通过e.target.files[0]拿到要上传的文件
    let files = e.target.files  // files为伪数组，files[0]为要上传的文件
    // 没有文件时
    if (files.length === 0) layer.msg('请选择要上传的文件')

    // 1. 拿到用户选择的文件
    let file = files[0]
    // 2. 将文件转化为路径 利用URL.createObjectURL(文件)方法，会得到文件的url
    let imgUrl = URL.createObjectURL(file)
    // console.log(imgUrl);
    // 3. 重新初始化裁剪区域
    $image
        .cropper("destroy") // 销毁旧的裁剪区域
        .attr("src", imgUrl) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
})

let art_state = '已发布'  // 声明为全局变量，方便呆会用

$('#saveBtn').click(function () {
    art_state = '草稿'  // 点击草稿，改变art_state属性(状态)
    console.log(art_state);
    // 点击存为草稿时不会进行表单验证
})

// 点击发布按钮获取表单值，发起`Ajax`请求实现发布文章的功能
$('.layui-form').submit(function (e) {
    e.preventDefault();
    console.log($(this));  // 是一个jquery对象
    let fd = new FormData($(this)[0])  // 把表单传进去    ？？？？？
    fd.append('state', art_state)

    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)
            // 6. 发起 ajax 数据请求
            publishArticle(fd)
        })
})

// 发起`Ajax`请求实现发布文章的功能
function publishArticle(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        // 注意：如果向服务器提交的是 FormData 格式的数据，
        // 必须添加以下两个配置项
        contentType: false,
        processData: false,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('发布文章失败！')
            }
            layer.msg('发布文章成功！')
            // 发布文章成功后，跳转到文章列表页面
            location.href = '/article/art_list.html'
        }
    })
}