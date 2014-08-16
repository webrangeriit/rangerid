'use strict';

/* Controllers */

angular.module('myApp.controllers', ['firebase.utils', 'simpleLogin'])
  .controller('AboutCtrl', ['$scope', function($scope) {
    
  }])

  .controller('MemberCtrl', ['$scope', 'memberList', function($scope, memberList) {
    $scope.members = memberList;
  }])

  .controller('StatisticCtrl', ['$scope', '$firebase', 'FBURL', '$window', 'WithProdi', function($scope, $firebase, FBURL, $window, WithProdi) {
    var ref = new $window.Firebase(FBURL + '/users');
    var list = $firebase(ref, {arrayFactory: WithProdi}).$asArray();
    list.$watch(function() {
      var sum = list.sum();
      $scope.data.data[0].y = [sum.total_if];
      $scope.data.data[1].y = [sum.total_sti];
    });
    $scope.config = {
      tooltips: true,
      labels: true,
      mouseover: function() {},
      mouseout: function() {},
      click: function() {},
      legend: {
        display: true,
        position: 'left'
      }
    };
    $scope.data = {
      series: ['IF', 'STI'],
      data: [{
        x: "IF",
        y: [10],
        tooltip: "Informatika"
      }, {
        x: "STI",
        y: [5],
        tooltip: "Sistem Teknologi Informasi"
      }]
    };
  }])

  .controller('StatisticGenderCtrl', ['$scope', '$firebase', 'FBURL', '$window', 'WithGender', function($scope, $firebase, FBURL, $window, WithGender) {
    var ref = new $window.Firebase(FBURL + '/users');
    var list = $firebase(ref, {arrayFactory: WithGender}).$asArray();
    list.$watch(function() {
      var sum = list.sum();
      $scope.data.data[0].y = [sum.male];
      $scope.data.data[1].y = [sum.female];
    });
    $scope.config = {
      tooltips: true,
      labels: true,
      mouseover: function() {},
      mouseout: function() {},
      click: function() {},
      legend: {
        display: true,
        position: 'left'
      }
    };
    $scope.data = {
      series: ['Laki-laki', 'Perempuan'],
      data: [{
        x: "Laki-laki",
        y: [10],
        tooltip: "Laki-laki"
      }, {
        x: "Perempuan",
        y: [5],
        tooltip: "Perempuan"
      }]
    };
  }])

  .controller('FriendCtrl', ['$scope', 'friendProfile', '$routeParams', function($scope, friendProfile, $routeParams) {
    console.log($routeParams.id);
    $scope.genders = [
      {id: 1, name: 'Laki-laki'},
      {id: 2, name: 'Perempuan'},
    ]
    $scope.friend = friendProfile($routeParams.id);
  }])

  .controller('RepoCtrl', ['$scope', 'repoList', 'user', function($scope, repoList, user) {
    repoList(user.username).then(function(data) {
      $scope.repos = data;
    });
  }])

  .controller('SidebarCtrl', ['$scope', 'memberList', function($scope, memberList) {
    $scope.members = memberList;
  }])

  .controller('LoginCtrl', ['$scope', 'fbutil', 'simpleLogin', 'createProfile', '$location', function($scope, fbutil, simpleLogin, createProfile, $location) {
    $scope.email = null;
    $scope.pass = null;
    $scope.confirm = null;
    $scope.createMode = false;

    $scope.login = function(nim) {
      $scope.err = null;
      if( assertValidAccountProps(nim) ) {
        simpleLogin.login()
          .then(function(user) {
            createProfile(user.uid, nim, user.displayName, user.username, user.thirdPartyUserData.avatar_url).then(function() {
              $location.path('/account');
            });
          }, function(err) {
            $scope.err = errMessage(err);
          });
      }
    };

    function assertValidAccountProps(nim) {
      if( !nim ) {
        $scope.err = 'NIM belum diisi';
      }
      return !$scope.err;
    }

    function errMessage(err) {
      return angular.isObject(err) && err.code? err.code : err + '';
    }
  }])

  .controller('AccountCtrl', ['$scope', 'simpleLogin', 'fbutil', 'user', '$location',
    function($scope, simpleLogin, fbutil, user, $location) {

      console.log(user);
      $scope.genders = [
        {id: 1, name: 'Laki-laki'},
        {id: 2, name: 'Perempuan'},
      ]
      // create a 3-way binding with the user profile object in Firebase
      var profile = fbutil.syncObject(['users', user.uid]);
      profile.$bindTo($scope, 'profile');

      // expose logout function to scope
      $scope.logout = function() {
        profile.$destroy();
        simpleLogin.logout();
        $location.path('/login');
      };
    }
  ]);