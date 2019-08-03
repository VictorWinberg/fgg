angular.module('form', [])
  .controller('FormController', function ($scope) {
    $scope.attendee = {
      name: '',
      position: ''
    }
    $scope.attendees = [];

    $scope.addAttendee = function () {
      $scope.attendees.push({
        name: $scope.attendee.name,
        position: $scope.attendee.position
      });
      $scope.attendee = {}
    };
    $scope.removeAttendee = function (attendee) {
      $scope.attendees.splice($scope.attendees.indexOf(attendee), 1);
    };

    $scope.paragraph = {
      title: '',
      content: ''
    }
    $scope.paragraphs = [];
    $scope.addParagraph = function () {
      $scope.paragraphs.push({
        title: $scope.paragraph.title,
        content: $scope.paragraph.content
      });
      $scope.paragraph = {}
    };
    $scope.removeParagraph = function (paragraph) {
      $scope.paragraphs.splice($scope.paragraphs.indexOf(paragraph), 1);
    };

    $scope.signature = {
      comment: '',
      name: '',
      position: ''
    }
    $scope.signatures = [];
    $scope.addSignature = function () {
      $scope.signatures.push({
        comment: $scope.signature.comment,
        name: $scope.signature.name,
        position: $scope.signature.position
      });
      $scope.signature = {}
    };
    $scope.removeSignature = function (signature) {
      $scope.signatures.splice($scope.signatures.indexOf(signature), 1);
    };

    $scope.github = {
      username: '',
      password: ''
    }

    $scope.submit = function (form) {
      console.log($("form").serializeArray());
      var auth = btoa($scope.github.username + ":" + $scope.github.password);

      fetch("https://api.github.com/user", {
        headers: {
          Authorization: "Basic " + auth
        }
      }).then(res => res.json()).then(console.log)

    };
  });