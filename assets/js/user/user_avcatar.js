// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

$('#uploadBtn').click(function () {
    // 点击上传时模拟触发点击了type="file"的input框
    $('#file').click()
})

// input框的value值发生改变了就会触发change事件
$('#file').change(function (e) {
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

$('#sendBtn').click(function () {
    // 1、拿到用户裁切之后的头像
    const dataURL = $image.cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
    })
        .toDataURL("image/png");
    // 2、发送 ajax 请求，发送到服务器
    $.ajax({
        type: "POST",
        url: '/my/update/avatar',
        data: {
            avatar: dataURL,
        },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg("更换头像失败！");
            }
            layer.msg("更换头像成功！");
            window.parent.getUserInfo();
        },
    })
})