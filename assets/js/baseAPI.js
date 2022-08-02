const baseUrl = 'http://www.liulongbin.top:3007'

// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，会先调用 ajaxPrefilter 这个函数，在这个函数中，可以拿到我们给Ajax提供的配置对象，在发起真正的 Ajax 请求之前，统一拼接请求的根路径 
// 需要先导入这个baseAPI.js文件

$.ajaxPrefilter(option => {
    option.url = baseUrl + option.url  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
})

// ajaxPrefilter()函数接收一个回调函数为参数，回调函数里形参option接收的实参是$.get() 或 $.post() 或 $.ajax()里的参数对象