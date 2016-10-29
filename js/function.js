////1.解决获取类名的兼容问题2016.08.04
//class
function getClass(classname,father){
	father=father||document;
	if(father.getElementsByClassName){
		return father.getElementsByClassName(classname);
	}else{		
		var all=father.getElementsByTagName("*");
		var newarr=[];
		for (var i=0;i<all.length;i++) {
			if(checkpre(all[i].className,classname)){
			  newarr.push(all[i]);
			}			
		};
		return newarr;
	}
}

function checkpre(str,classname){
	var arr=str.split(" ");
	for(var i in arr){
		if(arr[i]==classname){
			return true;
		}
	}
	return false;
}




//2.获取对象的属性值
function getStyle(obj,attr){

		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{			
			return getComputedStyle(obj,null)[attr];
		}
	}	




//3.获取元素的兼容函数 2016.8.8
//"#box" ".box" "a"
function $(selecter,father){	
	if(typeof selecter=="string"){//判断属性是属为字符型
		father=father||document;
		selecter=selecter.replace(/^\s*|\s*$/g,"");
		if(selecter.charAt(0)=="."){
			return getClass(selecter.slice(1),father);
		}else if(selecter.charAt(0)=="#"){		
			return document.getElementById(selecter.slice(1));
		}else if(/^[a-z]+\d*$/g.test(selecter)){
			return father.getElementsByTagName(selecter);
		}
	}else if(typeof selecter=="function"){//判断属性是否为函数
		window.onload=function(){
			selecter();
		}
	}
}

//4.获取节点中的子节点 2016.08.10
//father表示父节点
//type "a" 子节点（只有元素节点）
//type "b" 子节点（元素节点和非空的文本节点）
function getChilds(father,type){
	type=type||"a"
	var all=father.childNodes;
	var newarr=[];
	for (var i = 0; i < all.length; i++) {	
		if(type=="a"){
			if(all[i].nodeType==1){
				newarr.push(all[i]);
			}
		}else if(type=="b"){
			if(all[i].nodeType==1 || (all[i].nodeType==3 && all[i].nodeValue.replace(/^\s*|\s*$/g,"")!="")){
				newarr.push(all[i]);
			}
		}	 
	}
	return newarr;
}

//5.获取第一个子节点 2016.08.10
function getFirst(father){
	return getChilds(father)[0];
}

//6.获取最后一个子节点 2016.08.10
function getLast(father){
	var last=getChilds(father).length-1;	
	return getChilds(father)[last];
}

//7.获取指定的子节点 2016.08.10
function getNum(father,num){
	return getChilds(father)[num-1]
}
//8.获取下一个兄弟节点 2016.08.10
function getNext(obj){
	var next=obj.nextSibling;
	if(!next){
			return false;
		}
	while(next.nodeType==3||next.nodeType==8){		
		next=next.nextSibling;
		if(!next){
			return false;
		}
	}
	return next;
}
//9.获取上一个兄弟节点 2016.08.10
function getPre(obj){
	var pre=obj.previousSibling;
	if(!pre){
			return false;
		}
	while(pre.nodeType==3||pre.nodeType==8){		
		pre=pre.previousSibling;
		if(!pre){
			return false;
		}
	}
	return pre;
}

//10.把一个元素插入到某一个元素之后 2016.08.11
function insertAfter(father,nobj,oobj){
	var next=getNext(oobj);
	if(next){
		father.insertBefore(nobj,next);
	}else{
		father.appendChild(nobj)
	}
}
// 将节点插入到指定节点之前
function insertBefore(obj1,obj2){
    var parent=obj2.parentNode;
    return parent.insertBefore(obj1,obj2);
}
//11.绑定事件的兼容函数
function addEvent(obj,event,fun){
	if(obj.attachEvent){
		obj.attachEvent("on"+event,function(){fun.call(obj);});
	}else{
		obj.addEventListener(event,fun,false);
	}
}


//12.兼容鼠标滚轮的函数
function mouseWheel(obj,upfun,downfun){
	if(obj.attachEvent){
		obj.attachEvent("onmousewheel",scrollFn);//IE opera
	}else if(obj.addEventListener){
		obj.addEventListener("mousewheel",scrollFn,false);//chrome,safari -webkit-
		obj.addEventListener("DOMMouseScroll",scrollFn,false);//firefox -moz-
	}

	function scrollFn(e){
		var eve=e||window.event;
		if(eve.preventDefault){
			eve.preventDefault()
		}else{
			eve.returnValue=false;
		}
		var fangxiang=eve.wheelDelta||eve.detail;
		// FF 向上 -3    向下 3
		// IE 向上 120   向下 -120
		// Chrome 向上 120  向下-120
		if(fangxiang==-3||fangxiang==120){
			if(upfun){
				upfun();
			}			
		}
		if(fangxiang==3||fangxiang==-120){
			if(downfun){
				downfun();
			}
		}
	}
}


//15.hover
//判断某个元素是否包含有另外一个元素
 function contains (parent,child) {
  if(parent.contains){
     return parent.contains(child) && parent!=child;
  }else{
    return (parent.compareDocumentPosition(child)===20);
  }
 }

//判断鼠标是否真正的从外部移入，或者是真正的移出到外部；
  function checkHover (e,target) {
   if(getEvent(e).type=="mouseover"){
      return !contains(target,getEvent(e).relatedTarget || getEvent(e).fromElement)&&
    !((getEvent(e).relatedTarget || getEvent(e).fromElement)===target)
   }else{
    return !contains(target,getEvent(e).relatedTarget || getEvent(e).toElement)&&
    !((getEvent(e).relatedTarget || getEvent(e).toElement)===target)
    }
  }
//鼠标移入移出事件
/*
  obj   要操作的对象
  overfun   鼠标移入需要处理的函数
  outfun     鼠标移除需要处理的函数
*/
function hover (obj,overfun,outfun) {
    if(overfun){
      obj.onmouseover=function  (e) {
        if(checkHover(e,obj)){
           overfun.call(obj,[e]);
        }
      }
    }
    if(outfun){
      obj.onmouseout=function  (e) {
        if(checkHover(e,obj)){
           outfun.call(obj,[e]);
        }
      }
    }
}
 function getEvent (e) {
      return e||window.event;
 }
/********************************/

//设置cookies
function setCookie(attr,value,time){
    if(time=undefined){
        document.cookie=attr+"="+value;
    }else{
        var now=new Date();
        time.setTime(now.getTime()+time*1000)
        document.cookie=attr+"="+value+";expires="+now.toGMTString()
    }
}
//获取cookies
function getCookie(val){
    var str=document.cookie;
    var arr=str.split(";");
    for(var i=0;i<arr.length;i++){
        var arrValue=arr[i].split("=");
        if(val==arrValue[0]){
            return arrValue[1];
        }
    }
    return false;
}
//删除cookie
function delCookie(attr){
    var now=new Date();
    now.setTime(now.getTime()-1);
    document.cookie=attr+"=a;expires="+now.toGMTString();
}

 //qukong
 function qukong(str,type){
       var type=type||"b";
       if(type=="r"){
         return str.replace(/^\s*/,"");
       }else if(type=="l"){
          return str.replace(/\s*$/,"");
       }else if(type=="b"){
          return str.replace(/^\s*|\s*$/g,"");
       }else if(type=="all"){
          return str.replace(/\s*/g,"");
       }   
  }


//ajax
function ajax(obj){
    var url=obj.url;
    var type=obj.type||"GET";
    var dataType=obj.dataType||"text";
    var asynch=obj.asynch==undefined?true:obj.asynch;
    var success=obj.success;
    var data="";
    if(obj.data){
        for(var i in obj.data){
            data+=i+"="+obj.data[i]+"&";
        }
        data=data.slice(0,-1);
    }
    
     var ajax=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
     if(type=="GET"){
        ajax.open("GET",url+"?"+data,asynch);
        ajax.send(null);
     }else if(type=="POST"){
        ajax.open("POST",url,asynch);
        ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        ajax.send(data);
     }
     ajax.onreadystatechange=function(){
        if(ajax.readyState==4){
                        if(ajax.status==200){
                                if(success){
                                    if(dataType=="text"){
                        success(ajax.responseText);
                                    }else if(dataType=="xml"){
                                        success(ajax.responseXML);
                                    }else if(dataType=="json"){
                                        // var responseObj=eval("("+ajax.response+")");
                                        // success(responseObj)
                                        success(eval("("+ajax.response+")"));
                                    }
                                }                                                                                          
                        }else if(ajax.status==404){
                            alert("页面未找到")
                        }else{
                            alert("获取错误")
                        }
              }

     }
}
