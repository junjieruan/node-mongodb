var express=require('express');             //入口文件
var path=require('path');
var mongoose=require('mongoose');  
var _ =require('underscore');               //有extend方法，对象中新字段替换老字段
var Movie=require('./models/movie');        
var User=require('./models/user');              //用户登录模型
var port=process.env.PORT || 3000;
var app=express();
var bodyParser= require('body-parser');

mongoose.connect('mongodb://localhost/imooc')                     //传入本地数据库

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(express.static(path.join(__dirname,'public/')))
app.locals.moment=require('moment');

app.listen(port);

app.use(bodyParser());

console.log('imooc started on port'+port);

//index.page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
	res.render('index',{                       //返回首页渲染并传值
	title:'imooc 首页',
    movies:movies
	});
	})    
})

//signup
app.post('/user/signup',function(req,res){
	var _user=req.body.user;
	console.log(_user);
})

//detail.page
app.get('/movie/:id',function(req,res){
	var id=req.params.id;

	Movie.findById(id,function(err,movie){
	res.render('detail',{
		title:'imooc '+ movie.title,
		movie:movie,
	});   
	})
})

//admin.page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'imooc 后台录入页',
		movie:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:'',
		}
}); 
})  

//admin update movie 列表页更新时回到后台路由页，电影数据初始化到表单
app.get('/admin/update/:id',function(req,res){
     var id=req.params.id;
     if(id){
     	Movie.findById(id,function(err,movie){
     		res.render('admin',{                               //拿到数据直接渲染后台路由页
                 title:"imooc 后台更新页",
                 movie:movie,
     		}
     		)                         
     	})
     }
})

//admin post movie 拿到后台路由post过来的数据
app.post('/admin/movie/new',function(req,res){
	var id=req.body.movie._id;                                //取出id判断是否存在
	var movieObj=req.body.movie;                              //拿到movie对象
	var _movie

	if(id !== 'undefined'){                                    //已经存储过到数据库，需要更新
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}

			_movie = _.extend(movie,movieObj);                //对象中新字段替换老字段
			_movie.save(function(err,movie){                  //movie中save()
				if(err){
					console.log(err);
				}

				res.redirect('/movie/'+_movie._id);              //页面重定向
			})
		})
	}
	else{                                                 
		_movie=new Movie({                                    //新建一个Movie，传入数据
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			country: movieObj.country,
			summary: movieObj.summary,
			flash: movieObj.flash,
		})

		_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}

				res.redirect('/movie/'+_movie._id);
			})
	}
})

//list.page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
	res.render('list',{                       
	title:'imooc 列表页',
    movies:movies
	});
	})  
})

//list delete movie
app.delete('/admin/list',function(req,res){
	var id=req.query.id;

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
			}
			else{
				res.json({success:1})                   //给客户端返回数据
			}
		})
	}
})