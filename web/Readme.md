## 电商站备忘录

### 文件目录
+ carMenu/:           包含 顶部导航中`购物车`相关逻辑，用于处理不同页面的跳转处理。
+ login/user.js:      包含 处理用户登录与否的显示逻辑；顶部导航中`在线客服`的跳转地址逻辑。
+ tool-precss/test/   包含 整站的字体图标实例 及 其他相关test示例。

### 备注
1. 修改tool-precss之后,会影响tpl-goods-details模版的css打包编译,需在css末尾手动添加以下代码

	```
	 #if($page_css)
	    #parse("$page_css")
	 #end
	```