# Java发送邮件

## 代码:

```java
public class SendEmailUtil {

    // 发送方
    private static final String from = "发送方的邮箱地址";
    // 接收方
    private static final String to = "接受放的邮箱地址";
    // 发送方 登录用户名
    private static final String username = "登录名";
    // 发送方 邮箱授权码 不是对应的登录密码
    private static final String authorizationCode = "授权码";

    public static boolean sendMail(String emailMsg) {

        // 定义properties对象，设置环境信息
        Properties properties = new Properties();

        /*
         * mail.smtp.host ：指定连接的邮件服务器的主机名。如：163邮箱就填写smtp.163.com
         * 若在本地测试的话，需要在本地安装smtp服务器
         */
        properties.setProperty("mail.smtp.host", "smtp.qq.com");

        // mail.smtp.auth：指定客户端是否要向邮件服务器提交验证
        properties.setProperty("mail.smtp.auth", "true");

        /*
         * mail.transport.protocol：指定邮件发送协议：smtp。smtp：发邮件；pop3：收邮件
         * mail.store.protocol:指定邮件接收协议
         */
        properties.setProperty("mail.transport.protocol", "smtp");

        // 获取session对象
        Session session = Session.getInstance(properties);

        // 当设置为true，JavaMail AP就会将其运行过程和邮件服务器的交互命令信息输出到console中，用于JavaMail的调试
        session.setDebug(true);
        try {

            // 创建邮件对象
            MimeMessage message = new MimeMessage(session);

            // 设置邮件发送方
            message.setFrom(new InternetAddress(from));

            // 设置邮件发送的主题<邮件标题>
            message.setSubject("邮件发送设置");

            // 设置邮件发送的内容
            message.setContent(emailMsg, "text/html;charset=utf-8");
            Transport transport = session.getTransport();

            // 如果是自己搭建的邮箱服务器 可以用下面这个
//            transport.connect("yourselfIP", 123, username, authorizationCode);
            transport.connect(username,authorizationCode);
            transport.sendMessage(message, new Address[]{new InternetAddress(to)});
            transport.close();
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static void main(String[] args) {
        System.out.println("开始发送");
        sendMail("仅仅是用于邮件测试");
        System.out.println("发送完成");
    }
}
```

## 授权码获取方式:

### qq邮箱:

进去QQ邮箱-->设置-->账号-->进行设置如下图

![image-20200930140358189](/images/image-20200930140358189.png)

点击开启,并且需要发送一条校验短信,就可以获取授权码了,我这里是已经开启过后的图

### 163邮箱:

进去163邮箱-->设置-->POP3/SMTP/IMAP-->设置如下图

![image-20200930140921351](/images/image-20200930140921351.png)

