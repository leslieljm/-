// 1. 表单验证
const form = layui.form;

form.verify({
    //我们既支持函数式的方式，也支持数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // val：表单的值
    samePwd: (val) => {
        if (val === $("[name=oldPwd]").val()) return "新旧密码不能相同！";
    },
    rePwd: (val) => {
        if (val !== $("[name=newPwd]").val()) return "两次密码不一致！";
    },
});

$('.layui-form').submit(function(e) {
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '/my/updatepwd',
        data: form.val('formPassword'),
        success: res => {
            const {status, message} = res
            layer.msg(message)
            if (status !== 0) return
            $('#resetBtn').click()
            // 用原生js里的reset()方法重置
            $('.layui-form')[0].reset()
        }
    })
})