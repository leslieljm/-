// 1. 点击注册/登录按钮，切换注册/登录盒子
$('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
})

$('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
})



const form = layui.form
const layer = layui.layer
// 2. 表单验证：利用layUI的表单验证(内置模块里)
form.verify({
    //layui既支持函数式的方式，也支持数组的形式，自己选择去定义自己的内容。写完以后在input框用lay-verify属性来控制
    repass: value => {//value：表单的值、item：表单的DOM对象
        // [name=password 为属性选择器
        const psd = $('.reg-box [name=password').val()
        if (psd !== value) return '两次密码不一致'
    },

    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [
        /^[\S]{6,12}$/
        , '密码必须6到12位，且不能出现空格'
    ]
});

// 3. 点击注册按钮发送POST请求
$('#form_reg').on('submit', function (e) {
    // 阻止默认提交行为
    e.preventDefault()

    const data = $(this).serialize()

    $.ajax({
        type: 'POST',
        url: '/api/reguser',
        data,
        success: res => {
            const { message, status } = res
            if (status !== 0) return layer.msg(message)
            $('#link_login').click()
        }
    })
})

// 3. 点击登录按钮发送POST请求
$('#form_login').on('submit', function(e) {
    e.preventDefault()

    const data = $(this).serialize()  // serialize()方法是根据name属性去抓的数据，一定要和接口要求的一致

    $.ajax({
        type: 'POST',
        url: '/api/login',
        data,
        success: res => {
            const {status, message, token} = res

            if (status !== 0) return layer.msg(message) 

            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem('token', token)
            // 跳转到主页
            location.href = '/index.html'
        }
    })
}) 