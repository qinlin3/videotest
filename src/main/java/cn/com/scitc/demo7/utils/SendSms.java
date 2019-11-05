package cn.com.scitc.demo7.utils;

import cn.com.scitc.demo7.controller.HomeController;
import com.aliyuncs.CommonRequest;
import com.aliyuncs.CommonResponse;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.profile.DefaultProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/*
pom.xml
<dependency>
  <groupId>com.aliyun</groupId>
  <artifactId>aliyun-java-sdk-core</artifactId>
  <version>4.0.3</version>
</dependency>
*/
public class SendSms {
    public static void send(String phone,String key) {
        DefaultProfile profile = DefaultProfile.getProfile("cn-hangzhou", "LTAI4FnkWaJPtvQH7pUqabwu", "gPjjidzqHtdK4SwbFMPX0zfq8TmDZm");
        IAcsClient client = new DefaultAcsClient(profile);
        Logger logger = LoggerFactory.getLogger(HomeController.class.getSimpleName());
        //String key = "123";
        CommonRequest request = new CommonRequest();
        request.setMethod(MethodType.POST);
        request.setDomain("dysmsapi.aliyuncs.com");
        request.setVersion("2017-05-25");
        request.setAction("SendSms");
        request.putQueryParameter("RegionId", "cn-hangzhou");
        request.putQueryParameter("PhoneNumbers", "13458196249");
        request.putQueryParameter("SignName", "himea动漫网站");
        request.putQueryParameter("TemplateCode", "SMS_176529601");
        //request.putQueryParameter("TemplateParam", "{\"code\":\"key\"}");
        request.putQueryParameter("TemplateParam", "{code:"+key+"}");
        try {
            CommonResponse response = client.getCommonResponse(request);
            System.out.println(response.getData());
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }
}