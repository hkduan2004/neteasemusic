import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
import '@/assets/layout.css'
import store from '@/store/store'
import axios from 'axios'
import api from "@/api";
import vconsole from 'vconsole'
axios.defaults.timeout = 5000;// 默认5s超时
axios.defaults.baseURL = 'http://192.168.48.53:3000/v1/';
//axios.defaults.withCredentials=true;// 请求带上cookie
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(function(config) { // 这里的config包含每次请求的内容
    var url = config.url;
    var c = store.state.user||'123';
    c=c.account?c:'123'
    if(config.params&&config.params.auth&&c=='123'){
    		// 需要登录验证的url 需带params.auth=true
    		router.push({name:'login'});
    		console.error("需先登录")
    		return Promise.reject({"msg":'需先登录'});
    }
    config.url = url;
    return config;
}, function(err) {
    return Promise.reject(err);
});
axios.interceptors.response.use((res) => {
    if (res.data.code === 301) {
    	console.log('未登录')
    }
    else if (res.data.code !== 200) {
       console.log('返回数据不正常')
    }
    return res
}, (error) => {
    console.log('promise error:' + error)
    return Promise.reject(error)
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Mint);
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    async mounted() {
    	await this.$store.dispatch("localuser");
    	await this.$store.dispatch('getlike');
    	window.onscroll = () => {
			this.$store.commit("scroll",window.pageYOffset)
		}
    }
})
Vue.filter('playcount', function (v) {
	if(!v)return "";
	return v < 1e4 ? v : ((v / 1e4).toFixed(0) + '万')
})
Vue.filter('dateM', function (v) {
	v = new Date(v);
	var y = v.getFullYear() == new Date().getFullYear() ? '' : v.getFullYear() + "-";
	var m = v.getMonth() + 1;
	m = m > 9 ? m : ('0' + m);
	var d = v.getDate();
	d = d > 9 ? d : ('0' + d);
	return y + m + "-" + d
})
Vue.filter('dateS', function (v) {
	v = new Date(v);
	var m = v.getMinutes();
	m = m > 9 ? m : ('0' + m);
	var s = v.getSeconds();
	s = s > 9 ? s : ('0' + s);
	return m + ':' + s
})
Vue.filter('time', function (date) {
	if(!date) return '';
	date = new Date(date);
	var m=date.getMonth()+1;
	m=m>9?m:`0${m}`;
	var d=date.getDate();
	d=d>9?d:`0${d}`;
	return date.getFullYear() + '-' + m + '-' + d
});
Vue.filter("btdto",function(v){
		v=new Date(v);
		var m=v.getMonth()+1;var d=v.getDate();
		var xz="魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m*2-(d<"102223444433".charAt(m-1)- -19)*2,2);
		return xz+'座'
})