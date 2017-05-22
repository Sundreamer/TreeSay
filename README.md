# TreeSay - 树说博客

### 前言

做一个博客网站这个事想了很久了，因为种种原因（主要是懒）一直也没能真正实施，之所以想做博客网站，一方面是因为博客网相对其他类型网站来说要简单一点，另一方面也是为之后写个人博客做准备吧

这个博客是一个多用户的博客系统，在前台是可以注册登录的，之前建博客用的是`WordPress`，个人很喜欢的一个博客系统，虽然`WordPress`很好。但还是想自己写一个。虽然自己写的完全不能跟它比，但自己够用就行了

### 技术栈

- `Node + Express + MySQL + Vue + Vue-router + Webpack`
- `Vue`只是用来做了一个简单的网站后台管理系统

### 安装与使用

- 由于数据库使用了 `MySQL`，所以请确保你的电脑上安装了 `MySQL`，推荐安装 `5.5.*` 的版本，
- 如果对数据库不了解，可以安装一个图形化管理工具，例如 `navicat for mysql`
- 使用项目根目录下的 `treesay.sql`文件来添加数据库及初始的一些数据填充
 
> 1. `git clone git@github.com:Sundreamer/TreeSay.git`
> 2. `cd treesay`
> 3. `npm install`
> 4. `npm start`
> 5. 访问 `http://127.0.0.1:3000/`

### 目前实现的一些功能

- 用户模块
	+ 用户登录与注册
	+ 用户个人信息设置
	+ 用户上传修改头像
	+ 用户个人主页

- 文章模块
	+ 发布新的文章
	+ 喜欢文章（在用户的个人主页中可查看自己喜欢的文章）
	+ 文章详情页

- 评论模块
	+ 文章评论
	+ 评论发送表情
	+ 评论点赞
	+ 评论回复

- 后台管理模块
	+ 用户管理
	+ 文章管理
	+ 评论管理

### 总结

1. 因为这个项目只是用来练手的，所以有些细节部分还是有些瑕疵，比如在用户注册时，用户名跟密码是明文发送的，然后在服务端对密码做了一个简单的加密处理

2. 在做这个项目的过程中，学到了挺多新的东西。也对自己之前所学的东西在运用了一下，所以尽量不使用太多现成的工具库或框架，前台只用了一个 `jQuery` 来简化一些代码

3. 在使用数据渲染页面时，并没有选择使用模板引擎，而是自己写了一个格式化字符串方法加上字符串模板，以此来避免使用字符串连接。效果还可以

4. 使用原生JS写了一个超轻量级的验证插件，支持单验证、验证组、自定义验证方法，方便在进行登录注册时，写一大堆的条件判断语句去验证

### 后续想添加的一些功能

- 自定义个人主页的主题
- 站内信功能
- 实时消息提醒
- 文章分类
- 关注作者
