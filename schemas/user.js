var mongoose=require('mongoose');               
var bcrypt=require('bcrypt');
var SALT_WORK_FACTOR=10;

var UserSchema=new mongoose.Schema({             //用户名和密码字段 userschema实例
	name:{
		unique:true,
		type:String,
	},
	password:String,
	meta:{                                         
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		},
	}
})

UserSchema.pre('save',function(next){              //存储数据前都调用方法
	var user=this;
	if(this.isNew){                                 //数据是否新创建
		this.meta.createAt=this.meta.updateAt=Date.now()
	}else{
		this.meta.updateAt=Date.now()
	}

	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){               //加盐
		if(err) return next(err)
			bcrypt.hash(user.password,salt,function(err,hash){
				if(err) return next(err);

				user.password=hash;
			    next();
			})
	});
	next();
})

UserSchema.statics={
	fetch:function(cb){                              //取出目前数据库中所有数据
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById:function(id,cb){                           //详情页findid    
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports=MovieSchema