"use strict";angular.module("matrixApp",["ngCookies","ngResource","ngSanitize","matrixappCoordenas","colorpicker.module","ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/snake",{templateUrl:"views/snake.html",controller:"SnakeCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("matrixApp").controller("MainCtrl",["$scope","coordenadasService",function(a,b){a.movida="hola",a.colors=["fff","000","f00","0f0","00f","88f","f8d","f05","f80","0f8","FFFF00","08f","408","8ff"],a.elcolor="FFFF00",a.listaNombres=[],a.borrar=function(){b.borrar()},a.guardarDibujo=function(){b.copyFbRecord(a.nombreDibujo),$("#configuracion").modal("hide"),a.movida=b.pillarPresets(),a.movida.then(function(b){b.forEach(function(b){a.listaNombres.push(b.name())})})},a.movida=b.pillarPresets(),a.movida.then(function(b){b.forEach(function(b){a.listaNombres.push(b.name())})}),a.seleccionPreset=function(){b.sustituirPreset(a.preset)},a.botonColor=function(b){a.elcolor=b}}]),angular.module("matrixApp").directive("drawing",["coordenadasService","$timeout",function(a,b){return{restrict:"A",link:function(c,d){function e(){for(var a=0;k>=a;a+=20)g.moveTo(.5+a+m,m),g.lineTo(.5+a+m,l+m);for(var b=0;l>=b;b+=20)g.moveTo(m,.5+b+m),g.lineTo(k+m,.5+b+m);g.strokeStyle="ccc",g.stroke()}function f(a){try{return a.offset()}catch(b){}var c=a[0],d=0,e=0,f=document.documentElement||document.body,g=window.pageXOffset||f.scrollLeft,h=window.pageYOffset||f.scrollTop;return d=c.getBoundingClientRect().left+g,e=c.getBoundingClientRect().top+h,{left:d,top:e}}a.on("child_added",function(a){b(function(){n(a)},0)}),a.on("child_changed",function(a){b(function(){n(a)},0)}),a.on("child_removed",function(a){b(function(){o(a)},0)});var g=d[0].getContext("2d"),h=!1,i=20,j=null,k=640,l=320,m=0;e(),d.bind("mousedown",function(){g.beginPath(),h=!0}),d.bind("mousemove",function(b){e();var d=angular.element("#canvas"),g=f(d);if(h){for(var k=Math.floor((b.pageX-g.left)/i),l=Math.floor((b.pageY-g.top)/i),m=null===j?k:j[0],n=null===j?l:j[1],o=Math.abs(k-m),p=Math.abs(l-n),q=k>m?1:-1,r=l>n?1:-1,s=o-p;;){if(a.addCoordenada(m+":"+n,c.elcolor),m===k&&n===l)break;var t=2*s;t>-p&&(s-=p,m+=q),o>t&&(s+=o,n+=r)}j=[k,l]}}),d.bind("mouseup",function(){j=null,h=!1});var n=function(a){var b=a.name().split(":");g.fillStyle="#"+a.val(),g.fillRect(parseInt(b[0])*i,parseInt(b[1])*i,i,i)},o=function(a){var b=a.name().split(":");g.clearRect(parseInt(b[0])*i,parseInt(b[1])*i,i,i)}}}}]),angular.module("matrixappCoordenas",[]).factory("coordenadasService",["$q","$rootScope",function(a,b){var c=a.defer(),d={};d=new Firebase("https://d3interzonas.firebaseio.com/default");var e={};return e=new Firebase("https://d3interzonas.firebaseio.com/presets"),{base:d,on:function(a,b){d.on(a,function(){var a=arguments;b.apply(d,a)})},addCoordenada:function(a,b){d.child(a).set(b)},borrar:function(){d.remove()},copyFbRecord:function(a){d.once("value",function(b){var c=e.child(a);c.set(b.val())})},sustituirPreset:function(a){d.remove();var b=e.child(a);b.once("value",function(a){d.set(a.val())})},pillarPresets:function(){return e.once("value",function(a){b.$apply(function(){c.resolve(a)})}),c.promise}}}]),angular.module("matrixApp").controller("SnakeCtrl",["$scope",function(){}]),angular.module("matrixApp").directive("plasma",["coordenadasService","$interval",function(a,b){return{restrict:"A",link:function(c,d){function e(a,b,c,d){var e=1-c,f=1,g=-2*c,h=0,j=c;for(i(a,b+c,d),i(a,b-c,d),i(a+c,b,d),i(a-c,b,d);j>h;)e>=0&&(j--,g+=2,e+=g),h++,f+=2,e+=f,i(a+h,b+j,d),i(a-h,b+j,d),i(a+h,b-j,d),i(a-h,b-j,d),i(a+j,b+h,d),i(a-j,b+h,d),i(a+j,b-h,d),i(a-j,b-h,d)}{var f=d[0].getContext("2d"),g=20,h=0,i=function(b,c){f.fillStyle="#FFFF00",f.fillRect(parseInt(b)*g,parseInt(c)*g,g,g),a.addCoordenada(b+":"+c,f.fillStyle)};b(function(){a.borrar(),e(17,5,1+h),h++,4==h&&(h=0)},1200)}}}}]);