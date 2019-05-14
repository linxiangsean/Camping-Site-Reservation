var express = require('express');
var router = express.Router();
var monk =require('monk');
var db = monk('localhost:27017/camping');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        var collection = db.get('meta');
        collection.count({},function(err,val){
            cb(null, val  +'.jpg');
            collection.insert(
            {abc:"nulll"},function(err,val){
                if(err) throw err;
            }
        );
        });
        
    }
});
var upload = multer({storage: storage});

router.get('/counter',function(req,res){
    var collection = db.get('meta');
    collection.count({},function(err,val){
        if(err) throw err;
        res.json({"counter":val})
    });

   
})

router.get('/', function(req, res) {
    var collection = db.get('campsites');

    var searchCriteria = {};
    var newcheckInDate =new Date( req.query.checkin);
    var newcheckOutDate = new Date(req.query.checkout);
    var history = db.get("reservation");
    var hset =  new Set();

    history.find({},function(err,all_history){
       

        for( var i = 0 ; i < all_history.length ; i++){ //overlap add to array;

            old_checkin = new Date(all_history[i]["check_in"]);
            old_checkout = new Date(all_history[i]["check_out"]);
    //         hset.add(old_checkin );
    // hset.add(old_checkout );

            if(( old_checkin>newcheckInDate && old_checkin<newcheckOutDate)||(old_checkout>newcheckInDate && old_checkout<newcheckOutDate)||(old_checkin<=newcheckInDate && old_checkout>=newcheckOutDate) )  {
                hset.add(all_history[i]['campname']);
            }
        }

       var mm = Array.from(hset);


        collection.find({"name":{$nin:mm}},function(err,camps){
            res.json(camps);

        })

        


        }
            
            
    )
    




    // var collection_history = db.get("reservation");
    // collection.find({},function(err,order_history){
    //     if (err) throw err;
    //     for(int i = 0 ; i <order_history.length;i++)




    // })
    // var searchName = req.query.searchName;
    // var searchGen = req.query.searchGen;

    // //search by name and genre, both matching
    // if(searchName && searchGen && searchGen !="all") 
    // {
    //     searchCriteria = {'name': {'$regex':searchName, '$options':'i'},'genre': {'$regex':searchGen, '$options':'i'}};
    // }
    // //search by name under all genre
    // if(searchName && searchGen =="all") {
    //     searchCriteria = {'name': {'$regex':searchName, '$options':'i'}};
    // }   
    // //search by genre but no name
    // if(searchGen && !searchName) {
    //     searchCriteria = {'genre': {'$regex':searchGen, '$options':'i'}};
    // }
    // //no name and display all genre
    //  if(!searchName && searchGen == "all" ){
    //     searchCriteria = {};
    // }

    // collection.find(searchCriteria, function(err, campsites){
    //     if (err) throw err;
    //   	res.json(campsites);
    // });
});



router.get('/:id', function(req, res) {
    var collection = db.get('campsites');
    collection.findOne({ _id: req.params.id }, function(err, campsite){
        if (err) throw err;
      	res.json(campsite);
    });
});

router.post('/', function(req, res){
    
    var collection = db.get('campsites');
    collection.find({name:req.body.name},function(err,camp){
        if (err) throw err;
        
        if(camp.length==0){

            collection.insert({
                name: req.body.name,
                address:req.body.address,
                price: req.body.price,
                img:req.body.img
            }, function(err, campsite){
                if (err) throw err;
                res.json(campsite);
            });

        }
        else{
            
            res.json({name: -1});
        }



    })
   
});


router.put('/:id',function(req,res){
    var collection = db.get('campsites');
    collection.update({
        _id:req.params.id
    },
    {
        name: req.body.name,
        address:req.body.address,
        price: req.body.price,
        img:req.body.img
    },function(err,campsite){
        if(err) throw err;

        res.json(campsite);
    });
});

router.delete('/:id', function(req, res){
    var collection = db.get('campsites');
    collection.remove({ _id: req.params.id }, function(err, campsite){
        if (err) throw err;

        res.json(campsite);
    });
});


// POST /upload for single file upload
/* ===== Make sure that file name matches the name attribute in your html ===== */
router.post('/upload', upload.single('myFile'), (req, res) => {
    if (req.file) {
        console.log('Uploading file...');
        var filename = req.file.filename;
        var uploadStatus = 'File Uploaded Successfully';
    } else {
        console.log('No File Uploaded');
        var filename = 'FILE NOT UPLOADED';
        var uploadStatus = 'File Upload Failed';
    }
    //res.json({"filename":filename});
});




module.exports = router;
