var app = angular.module('Camp', ['ngResource', 'ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller:'HomeCtrl'
        })
        .when('/my-reservations', {
            templateUrl: 'partials/my-reservations.html',
            controller:'MyReserveCtrl'
        })
        .when('/my-cart', {
            templateUrl: 'partials/cart.html',
            controller:'MyCartCtrl'
        })
        .when('/add-campsite', {
            templateUrl: 'partials/campsite-form.html',
            controller:'AddCampsiteCtrl'
        })
        // .when('/reserve/:id',{
        //     templateUrl:'partials/reserve.html',
        //     controller:'ReserveCtrl'
        // })
        .when('/campsite/:id', {
            templateUrl: 'partials/campsite-form.html',
            controller:'EditCampsiteCtrl'
        })
        .when('/campsite/delete/:id', {
          templateUrl: 'partials/campsite-delete.html',
            controller: 'DeleteCampsiteCtrl'
        })
        .when('/cart/delete/:id', {
            templateUrl: 'partials/cartItem-delete.html',
              controller: 'DeleteCartCtrl'
          })
        .when('/cart/delete', {
            templateUrl: 'partials/cart-delete-all.html',
            controller: 'CartDeleteAllCtrl'
        })
        .when('/user/add-user',{
            templateUrl:'partials/add-user-form.html',
            controller: 'AddUserCtrl'
        })
        .when('/user/user-login',{
            templateUrl:'partials/user-login.html',
            controller:'UserLoginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode( true );
});

app.controller('MyReserveCtrl',function($scope, $resource, $location){
    
    var userName = sessionStorage.getItem('username');
    console.log("current user name is:  " + userName);

    if(sessionStorage.getItem('username')!=null){
        var Reservations = $resource('/api/reserve',{ searchUser : userName});

        Reservations.query(function(reservations){
            $scope.campsites = reservations;            

       });

    }
});




app.controller('MyCartCtrl',function($scope, $resource, $location, $routeParams){
    
    var userName = sessionStorage.getItem('username');
    console.log("current user name is:  " + userName);

    if(sessionStorage.getItem('username')!=null){

        var myCart = $resource('/api/cart',{ searchUser : userName});

        myCart.query(function(reservations){
            $scope.campsites = reservations;            

       });

    }
   
        $scope.reserve =function(campsites){
            var user_res = $resource('/api/reserve');

        for(i = 0 ; i < campsites.length ; i ++){
           var tempOrder = {
               campname: campsites[i]['campname'],
               username: sessionStorage.getItem('username'),
               check_in: campsites[i]['check_in'],
               check_out: campsites[i]['check_out'],
               price: campsites[i]["price"]
           }

            user_res.save(tempOrder,
                function(err, res){    
                });
        }

            //clear things in the cart.
            var Campsites = $resource('/api/cart');
            Campsites.delete({}, function(campsite){
            });
        
        $location.path('/my-reservations');
        
        }


});


app.controller('AddUserCtrl', ['$scope', '$resource','$location',
    function($scope, $resource, $location){
        $scope.add_user = function(){
            var user_res = $resource('/users');

            if($scope.myForm.pwd.$valid == false){
                alert("Password is not strong enough!")
            }else{
                user_res.save($scope.user, function(res){
                    // console.log(res['password']);
                    // console.log($scope.user.password);
                    if(res['password']==$scope.user.password){alert("user name already in use.")}
                    
                    $location.path('/');
                });
            }
        };
}])

app.directive('myDirective', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function myValidation(value) {


                if (value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
                    mCtrl.$setValidity('charE', true);
                    //console.log("true");
                } else {
                    mCtrl.$setValidity('charE', false);
                    //console.log("false");
                }
                return value;
            }
            mCtrl.$parsers.push(myValidation);
        }
    };
  });


app.controller('UserLoginCtrl', ['$scope', '$resource','$location',
    function($scope, $resource,$location){

        $scope.userlogin = function(){
            var user_res = $resource('/users/login');
           // console.log($scope.user)
            user_res.save($scope.user,function(status){
                sessionStorage.setItem("value",status.status);
                sessionStorage.setItem("username",status.username);
                
                if(status.status == 0){
                    alert("Username or password is not correct.");
                }else{
                    $location.path('/');
                }

                
            });
        };
}])


app.controller('HomeCtrl', ["$scope","$resource","$location","$filter","db",
    function($scope,$resource,$location,$filter,db){



        $scope.PageTitle = "Welcome! Choose your camp today!";

        if (sessionStorage.getItem('username')!=null){
            //$scope.AccountHref = '#/reserves/'+sessionStorage.getItem('user');
            $scope.LoginMessage = 'Welcome: ' +sessionStorage.getItem('username') + " !";
            $scope.PageTitle = "Reserve your campsite right now!";
            
        }

    
        
        if(sessionStorage.getItem("checkInTime") !=null && sessionStorage.getItem("checkOutTime")!=null){
            $scope.checkin = sessionStorage.getItem("checkInTime");
            $scope.checkout = sessionStorage.getItem("checkOutTime");
        }

        if($scope.checkin == undefined){
            $scope.notSearched = true;
        }
        

        // var keywordGen = $location.search().genKey;

        var checkin = $location.search().checkin;
        var checkout = $location.search().checkout;


        var Campsites = $resource('/api/campsites',{ "checkin":checkin ,"checkout":checkout});

        //console.log($scope.campsites);
        Campsites.query(function(campsites){

           
            // $scope.campsites = campsites;
            // console.log($scope.campsites);
            // console.log(campsites);

        $scope.curPage = 1,
        $scope.itemsPerPage = 6,
        $scope.maxSize = 5;
          
       
        $scope.numOfPages = function () {
          return Math.ceil(campsites.length / $scope.itemsPerPage);
          
        };
          $scope.$watch('curPage + numPerPage', function() {
          var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
          end = begin + $scope.itemsPerPage;
          
          $scope.campsites = campsites.slice(begin, end);

        });
            

        });

        


        // handling login logoff
        console.log("User status number is: "+ sessionStorage.getItem("value"));
        if(parseInt(sessionStorage.getItem("value"))==0){
            console.log("all false");
            $scope.logedin=false;
            $scope.isAdmin=false;
        }
        if(sessionStorage.getItem("value")==1){
            $scope.logedin =true;
            $scope.isAdmin=false;
        }
        if(sessionStorage.getItem("value")==2){
            $scope.logedin=true;
            $scope.isAdmin=true;
        }

        $scope.logoff=function(){
            sessionStorage.setItem("value", 0);
            console.log("logging off "+sessionStorage.getItem("value"));
            sessionStorage.clear();
            location.reload();
        }

        

        
        $scope.checkTime = function(){
            sessionStorage.setItem("checkInTime",$scope.checkin);
            sessionStorage.setItem("checkOutTime",$scope.checkout);
            sessionStorage.setItem("searchedToggle", true );
        }

        $scope.searchMessage = "Availiable Campsites From  '" + $scope.checkin + "'  to  '" +$scope.checkout + "':";
       
        $scope.addToList =function(campsite){

            
           

            if($scope.checkin == null || $scope.checkout == null || sessionStorage.getItem("searchedToggle") == false ){
                alert("Please Check availability before adding to your shopping cart!");
                $location.path('/');
            }else{
                var user_res = $resource('/api/cart');
                var tempOrder = {
                    campname: campsite['name'],
                    username: sessionStorage.getItem('username'),
                    check_in: $scope.checkin,
                    check_out: $scope.checkout,
                    price: campsite["price"]
                };
                
                 user_res.save(tempOrder,function(){
                    alert("Campsite added successfully! You can check in your shopping cart!");
                    console.log("Campsite is added successfully!");
                    $location.path('/my-cart');
                 });

                 sessionStorage.setItem("searchedToggle", false );

            }

            
        }

}]);

app.factory("db", function() {
    var obj = {};
    obj.item = {
      title: "testing title",
      date: 1387843200000
    }
  
    return obj;
  
  });
app.controller('AddCampsiteCtrl',
    function($scope,$resource, $location) {
        $scope.allowUpload = true;

        var fileChosen = false;
        $scope.choosedFile = function(){
            fileChosen = true;
        }
        var uploaded = false;
        
        
        var imgNum;
        var videos = $resource('/api/campsites/counter');
            videos.get(function(val){
                imgNum = val['counter'];
        });

        
     
        $scope.uploadImg = function(){
            if(fileChosen){
                $scope.uploadMessage = "Image is uploaded successfully! Continue filling the fields!";
                $scope.messageTrue = true;
                $scope.previewImg = false;
                uploaded = true;
            }
        }

        $scope.save = function(){

            var Campsites = $resource('/api/campsites');

            var tempcamp = {
                name : $scope.campsite['name'],
                address:$scope.campsite['address'],
                price:$scope.campsite['price'],
                img:imgNum
            }

            if(fileChosen && !uploaded){
                alert("Upload the chosen picture before proceed!");
            }
            if(!uploaded){
                tempcamp['img'] = '-1';
            }


            Campsites.save(tempcamp, function(camp){
                console.log(camp);
                if(camp["name"]==-1){
                    alert("Campsite duplicated!");
                }else{
                    console.log(tempcamp);
                    $location.path('/');
                }
                
            });
        };

         

     });

// app.controller('ReserveCtrl',
//      function($scope, $resource, $location, $routeParams){
//          $scope.formTitle = "Reserve Campsite";
 
//      });

app.controller('EditCampsiteCtrl',
    function($scope, $resource, $location, $routeParams){
        $scope.formTitle = "Edit Campsite";

        var uploaded = false;
        var fileChosen = false;
        $scope.choosedFile = function(){
            fileChosen = true;
        }
        
        $scope.uploadImg = function(){
            if(fileChosen){
            $scope.uploadMessage = "Image is updated successfully! Continue updating the fields!";
            $scope.messageTrue = true;
            $scope.previewImg = false;
            uploaded = true;
            }
            
        }

        //console.log($scope.formTitle);
        $scope.previewImg = true;

        $scope.allowUpload = true;

        var Campsites = $resource('/api/campsites/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        var updatedCampsite;
        Campsites.get({ id: $routeParams.id }, function(campsite){
            $scope.campsite = campsite;
        });
        $scope.save = function(){

            var videos = $resource('/api/campsites/counter');
            videos.get(function(val){
                updatedCampsite = {
                        _id : $routeParams.id,
                       name :  $scope.campsite['name'],
                       address:  $scope.campsite['address'],
                       price: $scope.campsite['price'],
                       img: val['counter']-1
                   }
                   console.log(updatedCampsite);

                if(!uploaded){
                    updatedCampsite['img'] =$scope.campsite['img'];
                    console.log("picture is not updated");
                }
                Campsites.update(updatedCampsite , function(){
                    console.log(updatedCampsite);
                    $location.path('/');
                });  
            });
        }

    });

    app.controller('DeleteCampsiteCtrl',
    function($scope, $resource, $location, $routeParams){	
        var Campsites = $resource('/api/campsites/:id');

        Campsites.get({ id: $routeParams.id }, function(campsite){
            $scope.campsite = campsite;
        });

        $scope.delete = function(){
            Campsites.delete({id:$routeParams.id}, function(campsite){
                $location.path('/');
            });
        }
    });

    app.controller('DeleteCartCtrl',
    function($scope, $resource, $location, $routeParams){	
        var Campsites = $resource('/api/cart/:id');

        Campsites.get({ id: $routeParams.id }, function(campsite){
            $scope.campsite = campsite;
            console.log(campsite);
            
        });
        console.log("here");
       

        $scope.deleteCartItem = function(){
            Campsites.delete({id:$routeParams.id}, function(campsite){
                $location.path('/my-cart');
            });
        }
    });

    app.controller('CartDeleteAllCtrl',function($scope, $resource, $location){
    
        var Campsites = $resource('/api/cart');

        $scope.deleteAllCartItem = function(){
            Campsites.delete({}, function(campsite){
                $location.path('/my-cart');
            });
        }
    });