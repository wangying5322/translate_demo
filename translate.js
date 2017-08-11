
(function(){
	var text = document.querySelector(".text"),
	 reset = document.querySelector(".reset"),
	 trans = document.querySelector(".trans"),
	 lang = document.querySelector(".lang"),
	 langs = document.querySelector(".langs"),
	 lis = document.querySelectorAll(".langs li"),
	 flag = 0,
	 timer = null,
	 Lang = 'en';//初始化目标语言
	// var langarr = ['中文','英文','粤语','日语','韩语','法语','西班牙语','俄语','波兰语','芬兰语'];
	// var datalang = ['zh','en','yue','jp','kor','fra','spa','ru','pl','fin'];
	function showList(){
		if(flag == 0){
			langs.style.display = 'block';
			flag = 1;
		}else{
			langs.style.display = 'none';
			flag = 0;
		}
	}

	function changeLang(){
		lang.innerHTML = '翻译为：' + this.innerHTML;
		Lang = this.getAttribute('data-lang');
		this.parentNode.parentNode.style.display = 'none';
		translate(Lang);
	}

	// function fn(str){
	// 	var content = document.querySelector(".content");
	// 	content.innerHTML = str.trans_result[0].dst;
	// }
	
	//解决跨域请求
	function createScriptTag(url, data){
		var oScript = document.createElement('script');
		oScript.id = "script1";
		oScript.src = url + '?' + data + '&callback=fn';
		document.body.appendChild(oScript);
	}

	

	//封装jsonp，解析json方式1.for in; (json没有length属性)2.
	function jsonp(opt){
		opt = opt || {};
		opt.method = opt.method || 'POST';
		opt.url = opt.url || '';
		opt.data = opt.data || null;
		opt.dataType = opt.dataType || 'JSONP';
		var params = [];
		for(var key in opt.data){
			params.push(key+'='+opt.data[key]);
		}
		var postData = params.join('&');
		if(opt.dataType === 'JSONP'){
			createScriptTag(opt.url, postData);

		}
	}

	function translate(Lang){
		var url = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
		var appid = '2015063000000001';
		var salt = Date.now();
		var key = '12345678';
		var from = 'auto';
		var to = Lang? Lang :'en';
		console.log(to);
		if(text.value && text.value.length > 0){
			// 正则匹配非法字符
			var pat = /[^a-zA-Z0-9\_\s*\u4e00-\u9fa5]/g;
			var strText = text.value;
			if(pat.test(strText) === true){
				query = strText.replace(pat,'');
				// console.log(str);
			}
			else{
				query = strText;
				// console.log(str);
			}
		}

		var str = appid + query + salt + key;
		var sign = MD5(str);
		// var data = 'q='+ transText + '&from=auto&to=' +lang +'&appid=' +appid+ '&salt='+ salt + '&sign=' +sign;
		jsonp({
			url:'http://api.fanyi.baidu.com/api/trans/vip/translate',
			method:'GET',
			dataType:'JSONP',
			data:{
				q:query,
				appid:appid,
				salt:salt,
				from:from,
				to:to,
				sign:sign
			}
		});
	}

	function init(){
		lang.onclick = showList;

		for( var i =0; i<lis.length; i++){
			lis[i].addEventListener('click', changeLang);
		}

		reset.onclick = function(){
			text.value = "";
		}

		trans.onclick = function(){
			if(text.value == "") return ;
			var script = document.querySelector(".script1");
			if(script){//代表之前已经调用过translate()动态生成过一个<script>了
				script.parentNode.removeChild(script);
			}
			translate(Lang);
		}
		//自动检测
		text.onkeydown = function(){
			clearTimeout(timer);
			var timer = setTimeout(function(){
				var script = document.querySelector(".script1");
				if(script){
					script.parentNode.removeChild(script);
					translate(Lang);
				}else{
					translate(Lang);
				}
			},1000)
		}

	}
	init();
})();

function fn(str){
	// console.log(str);
		var content = document.querySelector(".content");
		content.innerHTML = str.trans_result[0].dst;
	}