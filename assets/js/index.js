// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        data: null,
        /* headers: {
            Authorization: localStorage.getItem('token')
        }, */
        success: res => {
            // console.log(res);
            const {status, data} = res
            // 请求失败不调用renderAvatar()函数
            if (status !== 0) return layui.layer.msg("数据请求失败！")
            renderAvatar(data)
        }
    })
}

const renderAvatar = data => {
    let name = data.nickname || data.username
    // console.log(name);
    // 设置欢迎文本
    $('#welcome').html('欢迎' + name)
    // 如果有头像
    if (data.user_pic !== null) {
        $('.layui-nav-img').attr('src', data.user_pic)
        $('.text-avatar').hide()
    } else {
        // 如果没有头像
        $('.layui-nav-img').hide()
        let firstName = name[0].toUpperCase()
        $('.text-avatar').html(firstName)
    }
}

getUserInfo()

// 点击退出登录按钮
$('#exitBtn').click(function () {
    // 利用layui组件的询问弹出层
    layer.confirm('确定退出？', { icon: 3, title: '提示' }, function (index) {
        //do something
        // 跳转到登陆页面，注意一定要清空本地存储里面的 token
        location.href = '/login.html'
        localStorage.removeItem('token')
        layer.close(index);
    });
})