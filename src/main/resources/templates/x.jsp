<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>21世纪书店--历史类图书</title>
    <style type="text/css">
        input{
            background:pink;
            border:0px solid #c00;
        }
    </style>
</head>

<body>
<div align="center">
    <h2 align="center">欢迎来到21世纪书店</h2>
    图书分类>>>
    <a href="historyClass.jsp">历史类图书</a>&nbsp&nbsp
    <a href="computerClass.jsp">计算机类图书</a><br>

    <p>***书籍列表***</p>
    <form action="" method="post">
        <input type="text"  name="book" value="《鱼羊野史》&nbsp&nbsp&nbsp&nbsp高晓松&nbsp&nbsp&nbsp 178.1元"  size="40" maxlength="200" readonly>
        <input type="submit" name="add" value="加入购物车" height="2">
    </form>

    <form action="" method="post">
        <input type="text"  name="book" value="《明朝那些事儿》&nbsp&nbsp&nbsp&nbsp当年明月&nbsp&nbsp&nbsp 199.0元"  size="40" maxlength="200" readonly>
        <input type="submit" name="add" value="加入购物车" height="2">
    </form>

    <%
        request.setCharacterEncoding("utf-8");
        //获取要加入购物车的图书名
        String book=request.getParameter("book");
        //获取session
        ArrayList books=(ArrayList)session.getAttribute("books");
        if(books==null){
            books=new ArrayList();
            session.setAttribute("books",books);
        }
        if(book!=null){
            books.add(book);
            out.println("<script type='text/javascript'>alert('加入购物车成功');</script>");
        }
    %>
    <br>
    <input type="button" value="查看我的购物车 " onClick="location.href='cart.jsp'"><br>
</div>
<%@ include file="info.jsp" %>
</body>
</html>