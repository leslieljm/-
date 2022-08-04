const form = layui.form;
// 自定义校验规则
form.verify({
    nickname: (val) => {
        if (val.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！";
    },

    email: [/@/, '邮箱格式输入错误']
});

const initUserInfo = () => {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        data: null,
        success: res => {
            const {status, message, data} = res
            if (status !== 0) return layer.msg(message)

            // 使用layui提供的form.val()给表单赋值
            form.val('formUserInfo', data)
        }
    })
}

initUserInfo()

$('#resetBtn').click(function(e) {
    e.preventDefault()  // 阻止reset类型按钮的默认行为
    initUserInfo()
})

$('.layui-form').submit(function(e) {
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '/my/userinfo',
        // 使用layui提供的form.val()获取表单的值
        data: form.val('formUserInfo'),
        success: res => {
            const {status} = res
            if (status !== 0) return layer.msg("更新用户信息失败！")
            layer.msg("更新用户信息成功！");
            // 因为目前在iframe开的dom窗口上，所以window.parent这样去调getUserInfo()方法，而且iframe限制getUserInfo()方法必须用function xxx这样的方式去挂
            window.parent.getUserInfo()
        }
    })
})