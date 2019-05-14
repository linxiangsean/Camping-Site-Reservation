var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/camping');
var Crypto = require('crypto-js')
/* GET users listing. */
router.post('/', function(req, res){
  var collection = db.get('users');
  var crypt = Crypto.SHA256(req.body.password).toString();
  collection.findOne({username: req.body.username},function(err,user){
      if(user==null){
              collection.insert({
                username: req.body.username,
                password: crypt,
                email:req.body.email,
            }, function(err, user){
                if (err) throw err;

                res.json(user);
            });
      }
      else{
        res.json(null);//return orginal requst body

      }


  })


});

router.post('/login',function(req,res){
  var collection =db.get('users'); 
  var temp_crypted = Crypto.SHA256(req.body.password).toString()
  collection.findOne({username: req.body.username,password:temp_crypted},function(err,user){
    if (err) throw err;
    if(user!=null){

      if(user.username=='admin'){
        res.json({status:2,username:user.username});
      }
      else{
        res.json({status:1,username:user.username});
      }

    }
    else{
      res.json({status:0});
    }
  });

})

module.exports = router;
