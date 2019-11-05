package cn.com.scitc.demo7.utils;

/*
pom.xml
<dependency>
  <groupId>com.aliyun</groupId>
  <artifactId>aliyun-java-sdk-core</artifactId>
  <version>4.0.3</version>
</dependency>
*/
public class SendSms2 {
    public static void main(String[] args) {
        SendSms.send("13458196249","1024");
        /*DefaultProfile profile = DefaultProfile.getProfile("cn-hangzhou", "LTAI4FnkWaJPtvQH7pUqabwu", "gPjjidzqHtdK4SwbFMPX0zfq8TmDZm");
        IAcsClient client = new DefaultAcsClient(profile);

        CommonRequest request = new CommonRequest();
        request.setMethod(MethodType.POST);
        request.setDomain("dysmsapi.aliyuncs.com");
        request.setVersion("2017-05-25");
        request.setAction("SendSms");
        request.putQueryParameter("RegionId", "cn-hangzhou");
        request.putQueryParameter("PhoneNumbers", "13458196249");
        request.putQueryParameter("SignName", "himea动漫网站");
        request.putQueryParameter("TemplateCode", "SMS_176529601");
        request.putQueryParameter("TemplateParam", "{\"code\":\"11112\"}");
        try {
            CommonResponse response = client.getCommonResponse(request);
            System.out.println(response.getData());
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            e.printStackTrace();
        }*/
    }
}