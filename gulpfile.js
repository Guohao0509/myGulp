/*
	coded by Guohao at 2017.9.29
	version 1
	usage
		1. npm install 'packages' include "gulp", "path", "gulp-htmlmin", "gulp-minify-css", "gulp-uglify";
		2. create gulp.config.json if you want configure somthing option to compress code;
		3. input "gulp watch" to start watcher on command line like shell or "gulp compress" to compress code once;
*/

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
// var runSequence = require('run-sequence'); //听说这款产品可以实现gulp异步任务的按顺序执行, 然而并没有什么卵用, 日后研究

var uglify = require('gulp-uglify');//js压缩
var cssMin = require('gulp-minify-css');//css压缩
var htmlMin = require('gulp-htmlmin');//html压缩

//对象extend方法
var extend = function(defaultObj,obj){
	var tmpObj = {};
	for(var key in defaultObj){
		if(typeof obj[key] !== "undefined"){
			tmpObj[key] = obj[key];
		}else{
			tmpObj[key] = defaultObj[key];
		}
	}
	return tmpObj;
};

//通过配置的entry, output, event.path(绝对路径) 计算输出相对路径
var outputPathParser = function(currentPath){
	return config.output + '/' + path.parse(path.relative(config.entry, currentPath)).dir;
};

if(fs.existsSync('./gulp.config.json')){
	var	config = require('./gulp.config.json');
}else{
	config = {
		entry: 'public',
		output: 'build',
		js:{},
		css:{},
		html:{}
	};
}

var defaultConfig = {
	concat: false,
	html: {
		//其中一部分, 其他 https://github.com/kangax/html-minifier#user-content-options-quick-reference
		removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
	},
	css: {
		//没找到
	},
	js: {
		//还在找, 貌似不支持
		mangle: false,//类型：Boolean 默认：true 是否修改变量名
	}
};

//整合之后的配置项
var finalConfig = {
	html: extend(defaultConfig.html, config.html),
	css: extend(defaultConfig.css, config.css),
	js: extend(defaultConfig.js, config.js)
};

//首次启动时检测文件,并获取文件路径做相应的操作
function readFiles(dirPath) {
	//读取dirPath目录下的文件
	fs.readdir(dirPath + '/', function (err, files){
		if(err){
			console.error(err);
			return;
		}
		//对files为文件集合, 包含文件和文件夹
		files.forEach(function(file){
			//完整文件路径
		  	var filePath = path.normalize(dirPath + '/' + file); 
		  	//判读文件是否为文件夹
	 		fs.stat(filePath, function(err, stat){
	 			//如果是文件则进行压缩
			    if(stat.isFile()) {
			    	mainTask(filePath);
			    }
			    //如果是文件夹, 则执行递归, 直达读取到文件
			    if(stat.isDirectory()){
			      	readFiles(filePath + '/');
			    }
		  	});
		});
	});
}

//通过传入的文件路径进行类型判断并执行压缩任务
function mainTask(filePath){
	//获取文件扩展类型
	var type = path.parse(filePath).ext;
	//获取相对路径
	var outputPath = outputPathParser(filePath);
	//根据不同类型执行不同操作
	switch(type){
		case '.html':
			gulp.src(filePath)
		  		.pipe(htmlMin(finalConfig.html))
		  		.pipe(gulp.dest(outputPath));
			break;
		case '.css':
			gulp.src(filePath)
		  		.pipe(cssMin(finalConfig.css))
		  		.pipe(gulp.dest(outputPath));
			break;
		case '.js':
			gulp.src(filePath)
		  		.pipe(uglify(finalConfig.js))
		  		.pipe(gulp.dest(outputPath));
			break;
		default:
			gulp.src(filePath)
				.pipe(gulp.dest(outputPath));
	}
}

//监听js文件变化, 进行压缩
gulp.task('jsWatcher', function(){
	//监听config.entry目录下的所有js扩展文件
    return gulp.watch(config.entry + '/**/*.js', function(event){
    	//计算得到的输出路径
    	var outputPath = outputPathParser(event.path);
    	//用户配置, 如果用户没有进行配置, 则使用默认配置
      	gulp.src(event.path)
      		.pipe(uglify(finalConfig.js))
      		.pipe(gulp.dest(outputPath));
    });
});

//监听css文件变化, 进行压缩
gulp.task('cssWatcher', function(){
	return gulp.watch(config.entry + '/**/*.css', function(event){
		var outputPath =  outputPathParser(event.path);
		gulp.src(event.path)
			.pipe(cssMin(finalConfig.css))
			.pipe(gulp.dest(outputPath));
	});
});

//监听html文件变化, 进行压缩
gulp.task('htmlWatcher', function(){
	return gulp.watch(config.entry + '/**/*.html', function(event){
		var outputPath =  outputPathParser(event.path);
		//用户如果不配置,则启用默认htmlmin配置
		gulp.src(event.path)
			.pipe(htmlMin(finalConfig.html))
			.pipe(gulp.dest(outputPath));
	});
});

//启动文件监听模式之前先进行一次压缩, 解决没有开启监听就编写代码导致代码压缩不同步(待改善!!!);
//也可以不使用监听模式, 直接使用gulp start, 手动进行代码压缩
gulp.task('minify', function(){
	var entryPath = __dirname + '/' + config.entry + '/';
	readFiles(entryPath);
});

//gulp watch 启动监听模式
gulp.task('watch',['jsWatcher', 'cssWatcher', 'htmlWatcher']);

//gulp compress 压缩一次代码
gulp.task('compress', ['minify']);

//默认任务 通过命令行 gulp 启动(这里如果是异步的任务可能出问题,可能出问题)
gulp.task('default', ['start', 'jsWatcher', 'cssWatcher', 'htmlWatcher']);
// gulp.task('default', function(callback) {
//     runSequence('start',['jsWatcher', 'cssWatcher', 'htmlWatcher'],callback);
// });
