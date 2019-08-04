angular.module('documents', [])
  .controller('DocumentsController', function ($scope) {
    function fetch_documents(callback) {
      var get_course = function (url, callback) {
        var items = [];
        $.getJSON(url, function (data) {
          $.each(data, function (key, val) {
            var type = val.name.slice(-3);
            var name = val.name.slice(0, -4);
            var url = "https://api.github.com/repos/victorwinberg/fgg/contents/";
            var latexonline = `https://latexonline.cc/compile?command=xelatex&download=${name}.pdf&git=https://github.com/victorwinberg/fgg&target=`
            var href = latexonline + val.url.slice(url.length).split("?")[0];
            if (val.type == "file" && type == "tex") {
              items.push({
                title: name,
                href: href
              });
            }
          });
          callback(items);
        });
      }

      var folders = [];
      $.getJSON("https://api.github.com/repos/victorwinberg/fgg/contents/", function (data) {
        var gathered = 0;
        var fetched = 0;
        $.each(data, function (key, val) {
          if (val.type == "dir" && val.name != "app" && val.name != "assets") {
            gathered++;
            get_course(val.url, function (items) {
              folders.push({
                title: val.name.charAt(0).toUpperCase() + val.name.slice(1),
                items: items
              });
              fetched++
              if (fetched == gathered) {
                callback(folders);
              }
            });
          }
        });
      });
    }
    $scope.folders = [{
      title: "Hämtar dokument..."
    }];
    fetch_documents(function (folders) {
      $scope.folders = folders;
      $scope.$apply()
    });
  });