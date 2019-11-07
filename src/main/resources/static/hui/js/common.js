var JK = {
	//初始化前端js
	'Home': {
		'Url': document.URL,
		'Tpl': 'defalut',
		'Channel': '',
		'GetChannel': function ($sid){
			if($sid == '1') return 'vod';
			if($sid == '2') return 'news';
			if($sid == '3') return 'special';
		},	
		'Js': function() {
			//获取频道名
			this.Channel = this.GetChannel(Sid);
			//搜索默认关键字
			if($("#wd1").length>0){ 
				//改变action目标地址
				if(Sid == '2'){
					$key = '输入关键字';
					$('#search_form').attr('action', Root+'index.php?s=news-search');
				}else{
					$key = '输入影片名称或演员名称';
				}
				//默认搜索框关键字
				if($('#wd1').val() == ''){
					$('#wd1').val($key).css('color','#ccc');
				}
				//搜索框获得焦点
				$('#wd1').focus(function(){
					if($('#wd1').val() == $key){
						$('#wd1').val('').css('color','#666');
					}
				});
				//搜索框失去焦点
				$('#wd1').blur(function(){
					if($('#wd1').val() == ''){
						$('#wd1').val($key).css('color','#ccc');
					}
				});
			}
			//加入收藏夹
			$("#fav").click(function(){
				var url = window.location.href;					 
				try{
					window.external.addFavorite(url,document.title);
				}catch(err){
					try{
						window.sidebar.addPanel(document.title, url,"");
					}catch(err){
						alert("请使用Ctrl+D为您的浏览器添加书签！");
					}
				}
			});
			//幻灯片左右按钮
			$("#focus").hover(
				function(){$("#focus #focus-prev, #focus #focus-next").show();},
				function(){$("#focus #focus-prev, #focus #focus-next").hide();}
			);
			//判断输入字数
			$("#gb_content").keyup(function(){
				var len = $(this).val().length;
				if(len > 200){
					$(this).val($(this).val().substring(0,200));
				}
				var num = 200 - len;
				$(".remain").html("还可以输入<em>"+num+"</em>个字");
			});
			$("#guestbook").submit( function () {
				if($('#gb_content').val().length>200){
					$('#gb_tips').html('您的留言信息过长，请删减一些！');
					return false;
				}
				if($('#gb_content').val() == '在这里可以留下您的宝贵意见，最多200个字。'){
					$('#gb_content').select();
					$('#gb_tips').html('请输入留言信息！');
					return false;
				}
				if($('#gb_code').val() == ''){
					$('#gb_tips').html('请输入验证码！');
					return false;
				}		
			});
			//首页TAB切换
            $("span.tab").hover(function(){
				var eq = $(this).index();
				$(this).addClass("curr");
				$(this).siblings("span.tab").removeClass("curr");
				$(this).parents(".wrap").find("ul.v_list").addClass("hid");
				$(this).parents(".wrap").find(".v_list:eq("+eq+")").removeClass("hid");
            });  
		}
	},
	//监听评论操作事件
	'Comment1': {
		'Show': function($ajaxurl) {
			if($("#Comment").length>0){
				$.ajax({
					type: 'get',
					url: $ajaxurl,
					timeout: 5000,
					error: function(){
						$("#Comment").html('<div style="margin:10px 25px;">评论加载失败，请刷新...</div>');
					},
					success:function($html){
						$("#Comment").html($html);
						$("#comment_content").keyup(function(){
							var len = $(this).val().length;
							if(len > 200){
								$(this).val($(this).val().substring(0,200));
							}
							var num = 200 - len;
							$(".remain").html("还可以输入<em>"+num+"</em>个字");
						});
					}
				});
			}
		},
		'Post': function(){
			if($("#comment_content").val() == '在这里可以发表您的个人看法，最多200个字。'){
				$('#comment_tips').html('请先发表您的评论观点！');
				return false;
			}
			if($('#cm_code').val() == ''){
				$('#comment_tips').html('请输入验证码！');
				return false;
			}	
			var $data = "cm_sid="+Sid+"&cm_cid="+Id+"&cm_content="+$("#comment_content").val()+"&cm_code="+$("#cm_code").val();
			$.ajax({
				type: 'post',
				url: Root+'index.php?s=Cm-insert',
				data: $data,
				dataType:'json',
				success:function($string){
					if($string.status == 1){
						JK.Comment.Show(Root+"index.php?s=Cm-Show-sid-"+Sid+"-id-"+Id+"-p-1");
					}
					$('#comment_tips').html($string.info);
				}
			});
		}
	},
	//监听评分事件
	'Gold1': {
		'Default1': function($ajaxurl){
			if($(".Gold").length>0 || $(".Goldnum").length>0){
				$.ajax({
					type: 'get',
					url: $ajaxurl,
					timeout: 5000,
					dataType:'json',
					error: function(){
						$(".Gold").html('评分加载失败');
					},
					success: function($html){
						JK.Gold.Show($ajaxurl,$html.data,'');
					}
				});			
			}else{
				if($(".Gold").length>0 || $(".Goldnum").length>0){
					JK.Gold.Show($ajaxurl,$(".Goldnum").html()+':'+$(".Golder").html(),'');
				}
			}
		},
		'Show1': function($ajaxurl,$html,$status){
			//去除与创建title提示
			$(".Goldtitle").remove();
			$(".Gold").after('<span class="Goldtitle"></span>');
			$(".Goldtitle").css('margin','0 10px 0 5px');
			if($status == 'onclick'){
				$(".Goldtitle").html('评分成功！');
				$(".Goldtitle").show();
				$status = '';
			}
			//展示星级>评分>评分人
			$(".Gold").html(JK.Gold.List($html.split(':')[0]));
			$(".Goldnum").html($html.split(':')[0]);
			$(".Golder").html($html.split(':')[1]);
			//鼠标划过
			$(".Gold>dd").mouseover(function(){
				$id = $(this).attr('id')*1;
				$(".Goldtitle").html(JK.Gold.Title($id*2));
				$(".Goldtitle").show();
				//刷新星级图标
				$bgurl = $(this).css('background-image');
				for(i=0;i<5;i++){
					if(i>$id){
						$(".Gold>#"+i+"").css({background:$bgurl+" no-repeat -400px -70px"});
					}else{
						$(".Gold>#"+i+"").css({background:$bgurl+" no-repeat -430px -70px"});
					}
				}
			});
			//鼠标移出
			$(".Gold>dd").mouseout(function(){
				//去除title提示	
				$(".Goldtitle").hide();
				//刷新星级图标
				$score = $html.split(':')[0]*1/2;
				$id = $(this).attr('id')*1;
				$bgurl = $(this).css('background-image');
				for(i=0;i<5;i++){
					if(i<Math.round($score)){
						if(i == parseInt($score)){
							$(".Gold>#"+i+"").css({background:$bgurl+" no-repeat -400px -70px"});
						}else{
							$(".Gold>#"+i+"").css({background:$bgurl+" no-repeat -430px -70px"});
						}
					}else{
						$(".Gold>#"+i+"").css({background:$bgurl+" no-repeat -400px -70px"});
					}
				}
			});
			//鼠标点击
			$(".Gold>dd").click(function(){
				$.ajax({
					type: 'get',
					url: $ajaxurl+'-type-'+(($(this).attr('id')*1+1)*2),
					timeout: 5000,
					dataType:'json',
					error: function(){
						$(".Goldtitle").html('评分失败');
					},
					success: function($html){
						if(!$html.status){
							//alert($html.info);
							$(".Goldtitle").html($html.info);
							$(".Goldtitle").show();
						}else{
							JK.Gold.Show($ajaxurl,$html.data,'onclick');
						}
					}
				});
			});
		},
		//星级评分展示
		'List1': function($score){
			var $html = '';
			$score = $score/2;
			for(var i = 0 ; i<5; i++){
				var classname = 'all';
				if(i < $score && i<Math.round($score)){
					if(i == parseInt($score)){
						classname = 'half';
					}
				}else{
					classname = 'none';
				}
				$html += '<dd id="'+i+'" class="'+classname+' pngFix"></dd>';// title="'+this.GoldTitle(i*2)+'"
			}
			return $html;
		},
		//提示信息
		'Title1': function($score){//星级鼠标浮层提示信息
			var array_str = ['很差','一般','不错','很好','力荐'];
			var $score = parseFloat($score);
			if($score < 2.0) return array_str[0];
			if($score>=2.0 && $score<4.0) return array_str[1];
			if($score>=4.0 && $score<6.0) return array_str[2];
			if($score>=6.0 && $score<8.0) return array_str[3];
			if($score>=8.0) return array_str[4];
		}
	},
	//图片延时加载 JK.Lazyload.Box('frame'); <img class="lazy" data-original="{$ppvod.vod_picurl}" src="/images/blank.gif" alt="xx" />
	'Lazyload':{
		'Show': function(){
			$("img.lazy").lazyload({effect : "fadeIn"});
		},
		//指定ID范围内的效果
		'Box': function($id){
			$("img.lazy").lazyload({         
				 container: $("#"+$id)
			});	
		}
	},	
	//搜索联想 JK.Suggest.Show('wd',10,'index.php?s=plus-search-index','index.php?s=vod-search-wd-');
	'Suggest': {
		'Show': function($id,$limit,$ajaxurl,$jumpurl){
			$("#"+$id).autocomplete($ajaxurl, {
				width: 413,
				scrollHeight: 300,
				minChars: 1,
				matchSubset: 1,
				max: $limit,
				cacheLength: 10,
				multiple: true,
				matchContains: true,
				autoFill: false,
				dataType: "json",
				parse:function(obj) {//解释返回的数据，把其存在数组里，返回给要输出的item
					if(obj.status){
						var parsed = [];
						for (var i = 0; i < obj.data.length; i++) {   
							parsed[i] = {
								data: obj.data[i],
								value: obj.data[i].vod_name,
								result: obj.data[i].vod_name//返回的结果显示内容
							};
						}
						return parsed;
					}else{
						return {data:'',value:'',result:''};
					}
				},
				formatItem: function(row,i,max) {
					return row.vod_name;
				},
				formatResult: function(row,i,max) {
					return row.vod_name;//replace(/(<.+?>)/gi, '')
				}
			}).result(function(event, data, formatted) {
				location.href = $jumpurl+encodeURIComponent(data.vod_name);
			});	
		}
	},
	//Cookie JK.Cookie.Set(name,value,days);
	'Cookie': {
		'Set': function(name,value,days){
			var exp = new Date();
			exp.setTime(exp.getTime() + days*24*60*60*1000);
			var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
			document.cookie=name+"="+escape(value)+";path=/;expires="+exp.toUTCString();
		},
		'Get': function(name){
			var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
			if(arr != null){
				return unescape(arr[2]);
				return null;
			}
		},
		'Del': function(name){
			var exp = new Date();
			exp.setTime(exp.getTime()-1);
			var cval = this.Get(name);
			if(cval != null){
				document.cookie = name+"="+escape(cval)+";path=/;expires="+exp.toUTCString();
			}
		}
	},
	//观看历史记录 JK.History.Insert('硝烟背后的战争','',10,1,'','')
	'History': {
		'Json': '',
		'Display': true,
		'List': function($id){
			this.Create($id);
			$('#'+$id).hover(function(){
				JK.History.Show();		
			}, function(){
				JK.History.FlagHide();
			});
		},
		'Clear': function(){
			JK.Cookie.Del('JK_Cookie');
			$('#history_box').html('<div class="history_box_t"><a href="javascript:void(0)" onclick="JK.History.Clear();">清空</a> | <a href="javascript:void(0)" onclick="JK.History.Hide();">关闭</a></div><dl><dd class="hide">已清空观看记录。</dd></dl>');
		},	
		'Show': function(){
			$('#history_box').show();
		},
		'Hide': function(){
			$('#history_box').hide();
		},
		'FlagHide': function(){
			$('#history_box').hover(function(){
				JK.History.Display = false;
				JK.History.Show();
			}, function(){
				JK.History.Display = true;
				JK.History.Hide();
			});
			if(JK.History.Display){
				JK.History.Hide();
			}
		},
		'Create': function($id){
			var jsondata = [];		
			if(this.Json){
				jsondata = this.Json;
			}else{
				var jsonstr = JK.Cookie.Get('JK_Cookie');
				if(jsonstr != undefined){
					jsondata = eval(jsonstr);
				}
			}
			html = '<div class="history_box pngFix" id="history_box">';
			html +='<div class="history_box_t"><a href="javascript:void(0)" onclick="JK.History.Clear();">清空</a> | <a href="javascript:void(0)" onclick="JK.History.Hide();">关闭</a></div><dl class="scroll">';
			if(jsondata.length > 0){
				for($i=0; $i<jsondata.length; $i++){
					html +='<dd><a href="'+jsondata[$i].vodlink+'" title="'+jsondata[$i].vodname+jsondata[$i].vodjiname+'" class="hx_title">'+jsondata[$i].vodname+jsondata[$i].vodjiname+'</a></dd>';
				}
			}else{
				html +='<dd>暂无观看记录。</dd>';
			}
			html += '</dl></div>';
			$('#'+$id).after(html);
			
			var w = $('#'+$id).width();
			var h = $('#'+$id).height();
			var position = $('#'+$id).position();
			$('#history_box').css({'left':position.left,'top':(position.top+h)});
		},	
		'Insert': function(vodname,vodjiname,vodlink,limit,days,cidname,vodpic){
			var jsondata = JK.Cookie.Get('JK_Cookie');
			if(jsondata != undefined){
				this.Json = eval(jsondata);
				//排重
				for($i=0;$i<this.Json.length;$i++){
					if(this.Json[$i].vodname == vodname){
						this.Json.splice($i,1);
					}
				}
				//组合新json
				if(!vodlink){ vodlink = document.URL; }			
				jsonstr = '{video:[{"vodname":"'+vodname+'","vodjiname":"'+vodjiname+'","vodlink":"'+vodlink+'","cidname":"'+cidname+'","vodpic":"'+vodpic+'"},';
				for($i=0; $i<=limit; $i++){
					if(this.Json[$i]){
						jsonstr += '{"vodname":"'+this.Json[$i].vodname+'","vodjiname":"'+this.Json[$i].vodjiname+'","vodlink":"'+this.Json[$i].vodlink+'","cidname":"'+this.Json[$i].cidname+$i+'","vodpic":"'+this.Json[$i].vodpic+'"},';
					}else{
						break;//continue;
					}
				}
				jsonstr = jsonstr.substring(0,jsonstr.lastIndexOf(','));
				jsonstr += "]}";
			}else{
				jsonstr = '{video:[{"vodname":"'+vodname+'","vodjiname":"'+vodjiname+'","vodlink":"'+vodlink+'","cidname":"'+cidname+'","vodpic":"'+vodpic+'"}]}';
			}
			this.Json = eval(jsonstr);
			JK.Cookie.Set('JK_Cookie',jsonstr,days);
		}
	},
	'Scroll': {
		'Set': function() {
			var niceScroll = $('.scroll').niceScroll({
				cursorcolor : '#666',
				cursorwidth : '8px',
				cursoropacitymax : 0.8,
				cursorborder : 0,
				horizrailenabled : false,
				autohidemode : false
			});
			$("div[id^='ascrail']").bind("click",function(e){  
				var ev=e||event;  
				ev.stopPropagation();  
				return false;  
			})
		}
	},
	'DownUrl': {
		'Set': function(str,num) {
			var s,regEx,sDownUrl,fileName;
			var myUrl = "www.51o.net";
			var gurl = new Array();
			s = str.split("###");
			for(var i=0;i<s.length-1;i++){
				gurl = s[i].split("$");
				sDownUrl = ThunderEncode(gurl[1]);
				fileName = getFileName(gurl[1]);
				if(fileName.indexOf("www.")<0){fileName=fileName.replace(/(\w+(-\w+)*).(com|cc|net|org|tv|cn)/g,myUrl);}else{fileName=fileName.replace(/www.(\w+(-\w+)*).(com|cc|net|org|tv|cn)/g,myUrl);}
				document.write('<li><div class="adds"><input type="checkbox" value=\"'+gurl[1]+'\" name="CopyAddr'+num+'" class="'+num+'addr"/><div><a id="'+num+'thUrlid'+i+'" thunderHref="' + sDownUrl + '" onClick="return OnDownloadClick_Simple(this,2)" oncontextmenu="ThunderNetwork_SetHref(this)" href=\"javascript:;\" target=\"_self\" class="dwon'+num+'">'+fileName+'</a></div></div><div class="dwon_y"><a href=\"javascript:;\" onclick=\"kkPlay(\''+gurl[1]+'\',\''+fileName+'\');\" title="迅雷看看" target="_self">迅雷看看</a></div><div class="dwon_xl"><a href=\"http://lixian.vip.xunlei.com/lixian_login.html?referfrom=union&ucid=20369&furl='+gurl[1]+'\" target=\"_black\" title="离线下载">离线下载</a></div></li>');
			}
			
			function getFileName(downurl){
				var resultStr = downurl
				if(resultStr.indexOf("ed2k://|file|")==0){
					var tmpStr = resultStr.split('|');
					if(tmpStr.length>3){
						if(tmpStr[2].length>0){
							resultStr = decodeURIComponent(tmpStr[2]);
						}
					}
					return resultStr;
				}else{
					return resultStr;
				}
			}
		}
	}
}

var kkDapCtrl = null;
function kkGetDapCtrl(){
    if(null == kkDapCtrl){
        try{
            if(window.ActiveXObject){
                kkDapCtrl = new ActiveXObject("DapCtrl.DapCtrl");
            }else{
                var browserPlugins = navigator.plugins;
                for(var bpi = 0; bpi < browserPlugins.length; bpi++){
                    try{
                        if(browserPlugins[bpi].name.indexOf('Thunder DapCtrl') != -1){
                            var e = document.createElement("object");
                            e.id = "dapctrl_history";
                            e.type = "application/x-thunder-dapctrl";
                            e.width = 0;
                            e.height = 0;
                            document.body.appendChild(e);
                            break;
                        }
                    }catch(e){}
                }
                kkDapCtrl = document.getElementById('dapctrl_history');
            }
        }catch(e){}
    }
    return kkDapCtrl;
}
function kkPlay(url, moviename){
	var dapCtrl = kkGetDapCtrl();
	try{
		var ver = dapCtrl.GetThunderVer("KANKAN", "INSTALL");
		var type = dapCtrl.Get("IXMPPACKAGETYPE");
		if(ver && type && ver >= 672 && type >= 2401){
			dapCtrl.Put("SXMP4ARG", '"' + url + '" /title "' + moviename + '" /startfrom "_web_xunbo" /openfrom "_web_xunbo"');
		}else{
			var r = confirm("请先下载安装迅雷看看，点确定进入迅雷看看官网下载。");
			if(r == true){
			window.open("http://www.kankan.com/app/xmp.html");
			}
		}
	}catch(e){
		var r = confirm("请先下载安装迅雷看看，点确定进入迅雷看看官网下载。");
		if(r == true){
			window.open("http://www.kankan.com/app/xmp.html");
		}
	}
}
function CheckAll(num){
	i = num
	var allBox = document.getElementsByName('CopyAddr'+i+'');
	var checked = document.getElementById('allcheck'+i+'').checked;
	for(var k=0;k<allBox.length;k++)
	{
		allBox[k].checked=checked;
	}
}
function CopyToClip(num){
	var addrStr,allBox;
	addrStr='';
	i=num
	allBox=document.getElementsByName('CopyAddr'+i+'');
	for(var k=0;k<allBox.length;k++)
		addrStr+=allBox[k].checked==true?(addrStr==''?allBox[k].value:'\n'+allBox[k].value):'';
		
	if(window.clipboardData&&clipboardData.setData)
	{
		clipboardData.setData("Text", addrStr);
		alert('地址复制成功。请到迅雷新建任务，粘帖地址下载观看。');
	}
	else
	{
		alert('您使用的浏览器不支持复制功能，请使用IE或者开启浏览器兼容模式。');
	}
}
function zhongxz(num){
	var jjjj=0;
	allBox=document.getElementsByName('CopyAddr'+num);
	BatchTasker.BeginBatch(4);
	for(var i=0;i<allBox.length;i++){
		if(allBox[i].checked==true){
			BatchTasker.AddTask(ThunderEncode(allBox[i].value));
			jjjj+=1;
		}
	}
	if(jjjj==0){
		alert("请选择要下载的地址");
	}else{
		BatchTasker.EndBatch();
	}
}

//更换验证码
function reloadcode(){
	$('#safecode').attr('src', Root+'index.php?s=Vcode-Index-time='+new Date());
}

$(document).ready(function(){
	//系统初始化
	JK.Home.Js();
	//延时加载
	JK.Lazyload.Show();	
	//搜索联想
	//JK.Suggest.Show('wd',10,Root+'index.php?s=plus-search-vod',Root+'index.php?s=vod-search-wd-');
	MAC.Suggest.Show('wd',10, SitePath+'inc/ajax.php?ac=suggest&aid='+SiteAid, SitePath+'index.php?m=vod-search-wd-');
	//历史记录
	JK.History.List('history');	
	//评论初始化
	JK.Comment.Show(Root+"index.php?s=Cm-Show-sid-"+Sid+"-id-"+Id+"-p-1");
	//积分初始化
	JK.Gold.Default(Root+'index.php?s=Gold-'+JK.Home.Channel+'-id-'+Id);
	//滚动条加载
	JK.Scroll.Set();
});