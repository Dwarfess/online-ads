//(function() {
//    
//    angular
//        .module('app')
//        .factory('transport', bpCur);
//
//    function bpCur() {
//        var _current;
//        return {
//            setCurrent: function(dt) {
//                _current = dt;
//            },
//            getCurrent: function() {
//                return _current;
//            }
//        }
//    }
//})();

app.service('transport', function () {//сервис для получения/передачи объекта
   var _current = null;
    var _items = null;
   return {
       setCurrent: function (n) {
         _current = n;
       },
      getCurrent: function () {
         return _current;
      },
       setItems: function (n) {
         _items = n;
       },
      getItems: function () {
         return _items;
      }
    }
});