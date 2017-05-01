//����������
var express = require ('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session');
//var checkLogin = require('./checkLogin.js');
var moment = require('moment');
var flash = require('connect-flash');



//����mongoose
var mongoose = require('mongoose');
//����ģ��
var models = require('./models/models');
 

//ʹ��mongoose���ӷ���
mongoose.connect('mongodb://localhost:27017/notes');
mongoose.connection.on('error',console.error.bind(console,'�������ݿ�ʧ��'));



//����expressʵ��
var app = express();

//����EJSģ�������ģ���ļ�λ��
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//���徲̬�ļ�Ŀ¼
app.use(express.static(path.join(__dirname,'public')));

//�������ݽ�����
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//����sessionģ��
app.use(session({
	secret: '1234',
	name: 'note',
	cookie: {maxAge: 1000 * 60 * 10080}, //����session�ı���ʱ��Ϊһ��
	resave: false,
	saveUninitialized: true
}));
//app.use(flash());

/*//set flash
app.use(function(req,res,next){
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	res.locals.nameerror = req.flash('nameerror');
	res.locals.pwderror = req.flash('pwderror');
	res.locals.rpwderror = req.flash('rpwderror');
	next();
});
*/


var User = models.User;
var Note = models.Note;

var wrong = '';
var right = '';
//��Ӧ��ҳget����
app.get('/', checkLogin);
app.get('/',function(req, res){
	Note.find({author: req.session.user.username})
		.exec(function(err,allNotes){
			if(err){
				console.log(err);
				return res.redirect('/');
			}
			res.render('index',{
				title:'��ҳ',
				user:req.session.user,
				notes:allNotes,
				error:wrong,
				success:right
			});
		});
});



//��Ӧע��ҳ��get����
var regerror=' ';
app.get('/register',function(req, res){
	console.log('ע�ᣡ');
	//�Ѿ�ע��ɹ����û���ֻ����ת����ҳ
	if(req.session.user){
		return res.redirect('/');
	}

	res.render('register',{
		user: req.session.user,
		title: 'ע��',
		error: regerror
			});
	});
//post����
app.post('/register', function(req,res){
	//req.body ���Ի�ȡ��ÿ������
	var username = req.body.username,
		password = req.body.password,
		passwordRepeat = req.body.passwordRepeat;

		
	var validatename=/^\w{3,20}$/;	
	//��֤�û���
	//����\wָ��ʾƥ����ĸ�����֡��»��ߵ����; $��ʾһֱƥ�䵽ĩβ
	//	^ :�ַ����Ŀ�ʼ  $:�ַ����Ľ���. 
	//	If you left off the ^, for example, ~@*##@horatio would pass your validation.
	//	 Likewise for the $ and the end of the string being checked. �C
	
	//��֤����
	//���룺���Ȳ�������6������ͬʱ�������֡�Сд��ĸ����д��ĸ��
	var validatepw=/^(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/;
 


	

		//���������û����Ƿ�Ϊ�գ�ʹ��trimȥ�����˿ո�
	if (username.trim().length == 0) {
		regerror = '�û�������Ϊ�գ�';
		return res.redirect('/register');
	}	 else if (!(validatename.test(username.trim()))) {
         regerror = "�û���ֻ�ܰ�����Сд��ĸ�����֣���Ϊ3-20���ַ���";
        return res.redirect('/register');
    } else if (!(validatepw.test(password.trim()))) {
     	regerror = "������������Сд��ĸ�����֣��ҳ��Ȳ�������6λ��";
        return res.redirect('/register');

	
    } else if(password.trim().length == 0 || passwordRepeat.trim().length == 0) {
    	////�������������Ƿ�Ϊ�գ�ʹ��trimȥ�����˿ո�
		regerror = "��������һ��ȷ�����룡";
		return res.redirect('/register');
	} else if(password!=passwordRepeat) {
	//�����������������Ƿ�һ��
		regerror = "������������벻һ�£�";
		return res.redirect('/register');
	}

	

	//����û����Ƿ��Ѿ����ڣ���������ڣ����������¼
	User.findOne({username:username}, function(err,user){
		if(err){
			console.log(err);
			return res.redirect('/register');
		}
		if (user) {
			regerror = '�û����Ѿ�����';
			//wrong = '�û����Ѿ�����';//��app.post�ж�ȫ�ֱ�����ֵ
			return res.redirect('/register');
		}
	
	//���������md5����
	var md5 = crypto.createHash('md5'),
		md5password = md5.update(password).digest('hex');

	//�½�user�������ڱ�������
	var newUser = new User({
		username: username,
		password: md5password
	});

	newUser.save(function(err,doc){
		if(err){
			console.log(err);
			return res.redirect('/register');
		}
		
		right = '��½�ɹ�';
		return res.redirect('/');
	});
});
})



var logerror=' ';
app.get('/login',function(req, res){
	console.log('��½��');
	//�Ѿ���¼�ɹ����û���ֻ����ת����ҳ
	if(req.session.user){
		return res.redirect('/');
	}

	res.render('login',{
		user: req.session.user,
		title: '��½',
/*		user:req.user.username */
		error:logerror
	});
	});


app.post('/login',function(req,res){
var username = req.body.username,
		password = req.body.password;

	User.findOne({username:username},function (err,user){
		if(err){
			console.log(err);
			return res.redirect('/login');
		}
		if (!user) {
			logerror='�û������ڣ�';
			return res.redirect('/login');
		}
	//���������md5����
	var md5 = crypto.createHash('md5');
			md5password = md5.update(password).digest('hex');
	if(user.password != md5password){
		logerror='�������';
		return res.redirect('/login');
	}
	right='��½�ɹ�!';
	user.password = null;
	// delete user.password;
	req.session.user = user;
	return res.redirect('/');
	});	
});






app.get('/quit',function(req, res){
	req.session.user=null;
	console.log('�˳���');
	return res.redirect('/login');
	});

app.get('/post',function(req, res){
	console.log('������');
	res.render('post',{
		user: req.session.user,
		title:'����'
	});
	});

app.post('/post',function(req,res){
	var note = new Note({
		title: req.body.title,
		author: req.session.user.username,
		tag: req.body.tag,
		content: req.body.content
	});

	note.save(function(err,doc){
		if(err){
			console.log(err);
			return res.redirect('/post');
		}
		right = '���·���ɹ���'
		return res.redirect('/');
	});
});

app.get('/detail/:_id',function(req,res){
	console.log('�鿴�ʼǣ�');
	Note.findOne({_id:req.params._id})
		.exec(function(err,art){
			if(err){
				console.log(err);
				return res.redirect('/');
			}
			if(art){
				res.render('detail',{
					title:'�ʼ�����',
					user:req.session.user,
					art: art,
					moment:moment
				});
			}
		});
});

function checkLogin(req,res,next){
	if(!req.session.user){
		wrong='δ��¼';
		return res.redirect('/login');
	}
	next();
}

//����3000�˿�
app.listen(3000,function(req,res){
	console.log('app is running at port 3000');
});
