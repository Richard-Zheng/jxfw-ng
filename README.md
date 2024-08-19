# jxfw-ng

使用方法：

登录教务系统，在地址栏手动输入（不能直接粘贴，必须手打） `javascript:`，然后粘贴下面这段代码：

```js
xhr = new XMLHttpRequest();xhr.open('GET', 'https://richard-zheng.github.io/jxfw-ng/index.html');xhr.responseType = 'xml';xhr.send();xhr.onload = function() {document.open();document.write(xhr.response);document.close();};
```

然后回车。

附展开以后的版本：

```js
xhr = new XMLHttpRequest();
xhr.open('GET', 'https://richard-zheng.github.io/jxfw-ng/index.html');
xhr.responseType = 'xml';
xhr.send();
xhr.onload = function() {
  if (xhr.status != 200) { // 分析响应的 HTTP 状态
    alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
  } else { // 显示结果
    document.open();
		document.write(xhr.response);
		document.close();
  }
};
```
