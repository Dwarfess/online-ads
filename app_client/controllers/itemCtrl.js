app.controller("itemCtrl", function ($scope, $rootScope, $http, $location, transport){

    //SEARCH ITEMS
    $scope.search = {title:"", user_id:"", order_by:"created_at", order_type:"desc"};
    $scope.searchItems = function(search){
        
        $http.get(`/api/item?title=${search.title}&user_id=${search.user_id}&order_by=${search.order_by}&order_type=${search.order_type}`).then(function (response) {
            console.log('success', response.data);// success
            $rootScope.json = response.data;
            $location.path('/table');

        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    }
    
                    //OPTION FOR REGISTERED USERS
        
    //select pressed item 
    $scope.getItemById = function(item){
        $http.get(`/api/item/${item._id}`).then(function (response) {
            console.log('success', response.data);// success
            $rootScope.info = response.data;
            $location.path('/info');

        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    }

    //select pressed user with ads 
    $scope.getUserItems = function(user){
        
        $http.get(`/api/items/${user._id}`).then(function (response) {
            console.log('success', response.data);// success
            $rootScope.userInfo = user;
            $rootScope.userAds = response.data;
            $location.path('/userInfo'); 
            
        }, function (data, status, headers, config) {
            if(data.status == 401) console.log("You should log in again");
            if(data.status == 403) console.log("Forbidden change the ad");
            if(data.status == 404) console.log("Not found");
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    }
    
    //return to present view
    $scope.back = function(){
        $location.path('/');
    }
    
    //edit or create new item
    $scope.editOrCreate = function (item, view, currentView, showGroup) {
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
            $scope.updateItem(item);
        } else {
            console.log("=========== create");
            $scope.createItem(item);
        }
    }    
    
    //ADD NEW ITEM
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
    
    
    //cancel changes and return to present table
    $scope.cancelEdit = function (item) {
        $rootScope.info = $rootScope.currentItem;
        $scope.currentItem = {};
        $location.path(`/${$rootScope.view}`);
    }    
    
    //UPDATE ITEM
    $scope.updateItem = function (item) {
        $http.defaults.headers.common['Authorization'] = $scope.token;        
        $http.patch(`/api/item/${item._id}`, {title:item.title, price:item.price}).then(function (response) {
            console.log('success', response.data);// success
            $rootScope.info = response.data;
            $location.path('/info'); 
            
        }, function (data, status, headers, config) {
            if(data.status == 401) console.log("You should log in again");
            if(data.status == 403) console.log("Forbidden change the ad");
            if(data.status == 404) console.log("Not found");
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
        
        $scope.info = item;
        $scope.currentView = "info"
    }
    
    
    //DELETE TASK
    $scope.deleteItem = function (item) {
        
        $http.defaults.headers.common['Authorization'] = $scope.token;        
        $http.delete(`/api/item/${item._id}`).then(function (response) {
            //delete the item from array            
            $rootScope.json.splice($rootScope.json.indexOf($rootScope.json.filter(x => x._id===item._id)[0]), 1);
            
            $location.path('/table'); 
            
        }, function (data, status, headers, config) {
            if(data.status == 204) console.log("The item was deleted123");
            if(data.status == 401) console.log("You should log in again");
            if(data.status == 403) console.log("Forbidden change the ad");
            if(data.status == 404) console.log("Not found");
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
        
        $scope.info = item;
        $scope.currentView = "info"
    }
    
    
        //ADD IMAGE TO THE ITEM
    $scope.uploadImage = function (id) {

        let formData = new FormData();
        formData.append("file", $scope.img);
        $http.defaults.headers.common['Authorization'] = $scope.token;
        
        $http.put(`/api/item/${id}/image`, formData, {
           transformRequest: angular.identity,
           headers: {'Content-Type': undefined}
        }).then(function (response) {
            $rootScope.currentItem = response.data;
            console.log('success', response.data);// success
            
        }, function (data, status, headers, config) {
            if(data.status == 401) console.log("You should log in again");
            if(data.status == 403) console.log("Forbidden change the ad");
            if(data.status == 404) console.log("Not found");
            if(data.status == 422) console.log(data.data);
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    }
    
    
    //DELETE IMAGE
    $scope.deleteImage = function (item) {
        
        $http.defaults.headers.common['Authorization'] = $scope.token;        
        $http.delete(`/api/item/${item._id}/image`).then(function (response) {
            //delete image from the item            
            $scope.currentItem.image = ""
            
            $location.path('/edit'); 
            
        }, function (data, status, headers, config) {
            if(data.status == 204) console.log("The item was deleted123");
            if(data.status == 401) console.log("You should log in again");
            if(data.status == 403) console.log("Forbidden change the ad");
            if(data.status == 404) console.log("Not found");
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
        
        $scope.info = item;
//        $scope.currentView = "info"
    }
});
