app.controller("itemCtrl", function ($scope, $rootScope, $http, $location, transport){

    $scope.json = [{title:"Drill",
                    price:"5.00",
                    image:"",
                    created_at: "2018-03-15T15:38:21.523+0000",
                    user:{
                       name:"Ivan",
                       phone:"+38(098)123 54 04",
                       email:"ivan@ua.fm"
                    }
                   },
                  {title:"Headphone Black",
                   price:"10.00",
                   image:"img/1.jpg",
                   created_at: "2018-03-15T15:38:21.523+0000",
                   user:{
                       name:"Ivan  Michelivier Dev",
                       phone:"+38(098)123 54 04",
                       email:"ivan@ua.fm"
                   }
                  },
                  {title:"Fridge New Super Technology Native Speaker Virification",
                   price:"25.00",
                   image: "img/1.jpg",
                   created_at: "2018-03-15T15:38:21.523+0000",
                   user:{
                       name:"Ivan",
                       phone:"+38(098)123 54 04",
                       email:"ivan@ua.fm"
                   }
                  }];
    
    //SEARCH ITEMS
    $scope.search = {title:"", order_by:"created_at", order_type:"desc"};
    $scope.searchItems = function(search){

        console.log(search);
        
        $http.get(`/api/item?title=${search.title}&user_id=1&order_by=${search.order_by}&order_type=${search.order_type}`).then(function (response) {
            console.log('success', response.data);// success
            $scope.json = response.data;
            console.log($scope.json);
            $location.path('/table');

        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    }
    
                    //OPTION FOR REGISTERED USERS
        
    //select pressed task 
    $scope.show = function(item){
        $scope.info = item;
        $location.path('/info');
    }

    //select pressed user with ads 
    $scope.getUserInfo = function(user){

        $rootScope.userInfo = user;
        $rootScope.userAds = $scope.json;
    //            transport.setCurrent(user);
    //            transport.setCurrent($scope.json);
    //            $scope.userInfo = transport.getCurrent();
        $location.path('/userInfo');
//
//            $http.get('/api/user/<id>').then(function (response) {
//                console.log('success', response.data);// success
//                $scope.json = response.data;
//                $scope.currentView = "table";
//
//            }, function (data, status, headers, config) {
//                console.log(data);
//                console.log(status);
//                console.log(headers);
//                console.log(config);
//            });
    }
    
    //return to present view
    $scope.back = function(){
        $location.path('/');
    }
    
    //edit or create new task
    $scope.editOrCreate = function (item, view, currentView, showGroup) {
        $scope.token = transport.getToken();
        console.log($scope.token);
        if($scope.token){
            $rootScope.currentItem = item ? angular.copy(item) : {};
            $location.path(`/${currentView}`);
            $rootScope.view = view;
        } else $scope.showForms(true, true, false);
    }

    //save changes
    $scope.saveEdit = function (item) {
        if (angular.isDefined(item._id)) {
            console.log("=========== update");
            $scope.updateTask(item);
        } else {
            console.log("=========== create");
            $scope.createItem(item);
        }
    }    
    
    //ADD NEW TASK
    $scope.createItem = function (item) {
        
        $http.defaults.headers.common['Authorization'] = $scope.token;
        $http.post('api/items', item).then(function (response) {
            if(response.data.title){
                console.log(response.data);
                $rootScope.info = response.data;
                $location.path('/info');
            } else console.log('success', response.data);// success
            
        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    }

    //DELETE THE TASK FROM THE GROUP
    $scope.deleteTask = function (item) {
        $scope.json.forEach(function (e, i) {
            if (e.tasks.indexOf(item) >= 0)
                e.tasks.splice(e.tasks.indexOf(item), 1);
        });
        
        $http.delete('api/deleteTask?id='+item._id).then(function (response) {
            console.log('success', response.data);// success
            $scope.json = response.data;
            
        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
        
        $scope.currentView = "table";
    }
    
    
    //UPDATE TASK
    $scope.updateTask = function (item) {
        $http.put('api/update', item).then(function (response) {
            console.log('success', response.data);// success
            $scope.json = response.data;
            
        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
        
        $scope.info = item;
        $scope.currentView = "info"
    }

    //cancel changes and return to present table
    $scope.cancelEdit = function (item) {
        $scope.currentItem = {};
        $location.path(`/${$rootScope.view}`);
    }
});
