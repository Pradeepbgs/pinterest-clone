var express = require('express');
var router = express.Router();
const userModel = require('./users.js');
const postModel = require('./posts.js');
const passport = require('passport');
const upload = require('./multer.js');

const localStategy = require('passport-local').Strategy;
passport.use(new localStategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/feed', function(req, res){
  res.render("feed")
})

router.post('/upload',isLoggedIn, upload.single('file'), async function(req,res){
  if(!req.file){
    return res.status(400).send('No file uploaded')
  }
  const user = await userModel.findById(req.user._id)
  const post = await postModel.create({
    image: req.file.filename,
    postText: req.body.filecaption,
    user: user._id.toString()
  })

   user.posts.push(post._id)
  await user.save()
  res.redirect("/profile")
})

router.get('/login', function(req,res){
  // console.log(req.flash('error'))
  res.render("login",{error : req.flash('error')});
})

router.get('/profile', isLoggedIn, async function(req,res){
 const user = await userModel.findById(req.user._id)
 .populate('posts')
  res.render("profile", {user : user})

})

router.post('/register', function(req,res){
  const { username, email, fullname } = req.body;
const userData = new userModel({ username, email, fullname })

userModel.register(userData, req.body.password)
.then(() => {
  passport.authenticate('local')(req,res, function(){
    res.redirect('/profile')
  })
})
})

router.post('/login',passport.authenticate('local',{
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res){
  console.log(req.user)
});

router.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

 function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next()
    res.redirect('/login')
 }

module.exports = router;
