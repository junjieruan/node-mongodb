var mongoose=require('mongoose');

var MovieSchema=new mongoose.Schema({             //存放字段及类型
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	meta:{                                         //更新数据时时间记录
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

MovieSchema.pre('save',function(next){              //存储数据前都调用方法
	if(this.isNew){                                 //数据是否新创建
		this.meta.createAt=this.meta.updateAt=Date.now()
	}else{
		this.meta.updateAt=Date.now()
	}
	next()
})

MovieSchema.statics={
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