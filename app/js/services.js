(function() {
   'use strict';

   /* Services */

   angular.module('myApp.services', [])

      // put your services here!
      // .service('serviceName', ['dependency', function(dependency) {}]);

     .service('messageList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('messages', {limit: 10, endAt: null});
     }])
     .service('memberList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('users', {});
     }])
     .service('friendProfile', ['fbutil', function(fbutil) {
        return function(id) {
          return fbutil.syncObject(['users', id], {});   
        }
     }])
     .factory('repoList', ['$q', '$http', '$timeout', '$rootScope', function($q, $http, $timeout, $rootScope) {
      return function(username) {
        $rootScope.loading = true;
        var def = $q.defer();
        $http.get('https://api.github.com/users/'+username+'/repos?sort=id&direction=desc').success(function(data) {
          def.resolve(data);
          $rootScope.loading = false;
        });
        return def.promise;  
      }
     }])
     .factory("WithGender", function($FirebaseArray) {
      return $FirebaseArray.$extendFactory({
        sum: function() {
          var total_male = 0, total_female = 0;
          angular.forEach(this.$list, function(rec) {
            if (rec.gender == 1)
              total_male++;
            else if (rec.gender == 2)
              total_female++;
          });
          return {male: total_male, female: total_female};
        }
      });
    })
    .factory("WithProdi", function($FirebaseArray) {
      return $FirebaseArray.$extendFactory({
        sum: function() {
          var total_if = 0, total_sti = 0;
          angular.forEach(this.$list, function(rec) {
            // console.log(rec.nim);
            if (String(rec.nim).indexOf('135') == 0)
              total_if++;
            else if (String(rec.nim).indexOf('182') == 0)
              total_sti++;
          });
          return {total_if: total_if, total_sti: total_sti};
        }
      });
    });

})();

