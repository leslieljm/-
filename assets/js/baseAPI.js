const baseUrl = 'http://www.liulongbin.top:3007'

// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，会先调用 ajaxPrefilter 这个函数，在这个函数中，可以拿到我们给Ajax提供的配置对象，在发起真正的 Ajax 请求之前，统一拼接请求的根路径 
// 需要先导入这个baseAPI.js文件

$.ajaxPrefilter(option => {

    // 以/my开头的请求路径，统一需要在请求头中携带 Authorization 身份认证字段
    if (option.url.includes('/my/')) {
        option.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    option.url = baseUrl + option.url  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径

    // 响应拦截器
    // 控制用户的访问权限：用户如果没有登录，是否能够允许用户访问后台主页？肯定是不能的，所以我们需要进行权限的校验，可以利用请求后服务器返回的状态来决定
    // 在调用有权限接口的时候，指定 `complete` 回调函数，这个回调函数不管请求响应成功还是失败都会调用
    // 在回调里面判断 服务器返回的的状态是否等于 1，并且错误的信息是  "身份认证失败"，如果成立，那么就强制用户跳转到登录页
    option.complete = res => {
        // console.log(res);
        // 如果没有登录，
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // console.log('没有token');
            location.href = '/login.html'
        }
    }
})

// ajaxPrefilter()函数接收一个回调函数为参数，回调函数里形参option接收的实参是$.get() 或 $.post() 或 $.ajax()里的参数对象