
app.service('transport', function () {//сервис для получения/передачи объекта
    var _current = null;
    var _items = null;
    var _token = null;
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
      },
        setToken: function (n) {
         _token = n;
       },
      getToken: function () {
         return _token;
      }
    }
});