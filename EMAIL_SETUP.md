# Broker邮件转发功能设置说明

## 功能介绍

现在系统已经支持将broker收到的所有消息自动转发到私人邮箱 `xinyiluo2024@gmail.com`。

当以下情况发生时，会自动发送邮件通知：

1. **用户注册** - 新用户注册时发送给broker的消息
2. **NDA提交** - 用户提交NDA表单时发送给broker的消息  
3. **联系表单** - 网站访客通过联系表单发送消息给broker
4. **回调请求** - 网站访客请求回调时发送给broker的消息
5. **用户间消息** - 任何用户直接发送消息给broker

## 环境变量配置

需要在部署平台（Render）添加以下环境变量：

```bash
# 邮件配置
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

## Gmail邮箱设置步骤

### 1. 启用Gmail的两步验证
- 登录 Gmail 账户
- 进入 Google 账户设置
- 选择"安全性"
- 启用"两步验证"

### 2. 生成应用专用密码
- 在Google账户的"安全性"页面
- 点击"应用专用密码"
- 选择"邮件"和设备类型
- 生成16位应用专用密码
- 将此密码用作 `EMAIL_PASSWORD`

### 3. 在Render上配置环境变量
- 登录 Render Dashboard
- 选择后端服务 (business-board-backend)
- 进入 "Environment" 标签
- 添加环境变量：
  ```
  EMAIL_USER = your-gmail-address@gmail.com
  EMAIL_PASSWORD = your-16-digit-app-password
  ```

## 邮件模板

邮件将包含以下信息：
- 消息发送时间（加州时间）
- 发件人姓名和邮箱
- 收件人（broker）姓名
- 消息主题
- 消息内容
- 系统链接（用于查看详细信息）

## 测试功能

部署完成后，可以通过以下方式测试：

1. **注册新用户** - 在网站注册新账户
2. **提交联系表单** - 使用网站联系表单
3. **发送消息** - 登录系统后向broker发送消息

每次操作后，`xinyiluo2024@gmail.com` 应该会收到相应的邮件通知。

## 注意事项

- 邮件发送是异步的，不会影响正常的消息创建流程
- 如果邮件发送失败，会在服务器日志中记录错误，但不会中断系统操作
- 邮件内容支持中英文显示
- 所有时间都按加州时间格式显示

## 排查问题

如果没有收到邮件：

1. 检查Render环境变量是否正确设置
2. 检查Gmail应用专用密码是否有效
3. 查看Render服务器日志中的邮件发送日志
4. 确认 `xinyiluo2024@gmail.com` 的垃圾邮件文件夹 