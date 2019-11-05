package cn.com.scitc.demo7.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;

@Controller
public class VideoController {

    @ResponseBody
    @RequestMapping("/getVideoSrc")
    public OutputStream getVideoSrc(HttpServletRequest httpServletRequest,
                                    HttpServletResponse httpServletResponse){
        //1.创建文件对象
        File f = new File("E:/video/src/main/resources/videoes/1.mp4");
        //2.获取文件名称
        String fileName = f.getName();
        //3.导出文件
        String agent = httpServletRequest.getHeader("User-Agent").toUpperCase();
        InputStream fis = null;
        OutputStream os = null;
        try {
            //4.获取输入流
            fis = new BufferedInputStream(new FileInputStream(f.getPath()));
            byte[] buffer;
            buffer = new byte[fis.available()];
            fis.read(buffer);
            httpServletResponse.reset();
            //5.由于火狐和其他浏览器显示名称的方式不相同，需要进行不同的编码处理
            if(agent.indexOf("FIREFOX") != -1){//火狐浏览器
                httpServletResponse.addHeader("Content-Disposition", "attachment;filename="+ new String(fileName.getBytes("GB2312"),"ISO-8859-1"));
            }else{//其他浏览器
                httpServletResponse.addHeader("Content-Disposition", "attachment;filename="+ URLEncoder.encode(fileName, "UTF-8"));
            }
            //6.设置response编码
            httpServletResponse.setCharacterEncoding("UTF-8");
            httpServletResponse.addHeader("Content-Length", "" + f.length());
            //设置输出文件类型
            httpServletResponse.setContentType("video/mpeg4");
            //7.获取response输出流
            os = httpServletResponse.getOutputStream();
            os.flush();
            //8.输出文件
            os.write(buffer);
        }catch(Exception e){
            System.out.println(e.getMessage());
        } finally{
            //关闭流
            try {
                if(fis != null){ fis.close(); }

                if(os != null){ os.flush(); }

                if(os != null){os.close(); }

            } catch (IOException e) {
                System.out.println(e.getMessage());
            }
        }

        return os;
    }


    @RequestMapping("/getVideoBlob_V2")
    public OutputStream getVideoBlob_V2(HttpServletRequest httpServletRequest,
                                        HttpServletResponse httpServletResponse) {

        String httpUrl = "https://wangfang.oss-cn-qingdao.aliyuncs.com/wf_video/videoPath/863E1B126B81B7B60993CC0B9B1EC1EA.mp3";
        // 1.下载网络文件
        URL url = null;
        try {
            url = new URL(httpUrl);
        } catch (MalformedURLException e1) {
            e1.printStackTrace();
        }

        InputStream inStream = null;
        OutputStream outputStream = null;
        try {

            //2.获取链接
            URLConnection conn = url.openConnection();
            //3.输入流
            inStream = conn.getInputStream();
            httpServletResponse.reset();
            httpServletResponse.addHeader("Content-Disposition", "attachment;filename=" + httpUrl);
            //6.设置response编码
            httpServletResponse.setCharacterEncoding("UTF-8");//设置输出文件类型
            httpServletResponse.setContentType("video/mpeg4");
            //7.获取response输出流
            outputStream = httpServletResponse.getOutputStream();
            int byteRead;
            while ((byteRead = inStream.read()) != -1) {
                outputStream.write(byteRead);
            }

        } catch (IOException e) {
            e.printStackTrace();
            System.out.println(e);
        } finally {

            try {
                inStream.close();
                outputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return outputStream;
    }
}