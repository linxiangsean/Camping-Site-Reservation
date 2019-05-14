var express = require('express');
var router = express.Router();
var monk =require('monk');
var db = monk('localhost:27017/camping');



router.get('/', function(req, res) {
    var collection = db.get('cart');

    var searchCriteria = {};

    var searchUser = req.query.searchUser;

    if(searchUser){
        searchCriteria = {'username': searchUser};
    }

    collection.find(searchCriteria, function(err, campsites){
        if (err) throw err;
      	res.json(campsites);
    });

});

router.get('/:id', function(req, res) {
    var collection = db.get('cart');
    collection.findOne({ _id: req.params.id }, function(err, reservation){
        if (err) throw err;
      	res.json(reservation);
    });
});

router.post('/', function(req, res){
    console.log(req.file);
    var collection = db.get('cart');
    
    collection.insert({
        campname: req.body.campname,
        username:req.body.username,
        check_in: new Date(req.body.check_in),
        check_out: new Date(req.body.check_out),
        price:req.body.price
    }, function(err, reservation){
        if (err) throw err;
        res.json(reservation);
    });
});


router.put('/:id',function(req,res){
    var collection = db.get('cart');
    collection.update({
        _id:req.params.id
    },
    {
        campname: req.body.campname,
        username:req.body.username,
        check_in: req.body.check_in,
        check_out: req.body.check_out,
        price:req.body.price
    },function(err,reservation){
        if(err) throw err;

        res.json(reservation);
    });
});

router.delete('/:id', function(req, res){
    var collection = db.get('cart');
    collection.remove({ _id: req.params.id }, function(err, reservation){
        if (err) throw err;

        res.json(reservation);
    });
});

router.delete('/', function(req, res){
    var collection = db.get('cart');
    collection.remove({}, function(err, reservation){
        if (err) throw err;
        res.json(reservation);
    });
});

module.exports = router;