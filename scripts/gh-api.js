angular.module('app.ghAPI', ['base64'])

  .value('ghClientID', '0df626e36b8ff8454531')

  .value('ghClientSecret', '8f7f06a64dec75a0ea7af574aedf104cd437db78')

  .value('ghHost', 'https://api.github.com/')

  .factory('ghRequest', function($http, $rootScope, $q, ghHost, ghClientID, ghClientSecret) {
    return function(path) {
	  console.log('path:'+path);
      var suffix = (path.indexOf('?') > 0 ? '&' : '?') + 'callback=JSON_CALLBACK';
      if((ghClientID && ghClientID.length > 0) &&
         (ghClientSecret && ghClientSecret.length > 0)) {
        suffix += '&client_id=' + ghClientID;
        suffix += '&client_secret=' + ghClientSecret;
      }

      var defer = $q.defer();
	  console.log('url:'+ghHost + path + suffix);
      $http.jsonp(ghHost + path + suffix, { cache : true }).success(function(response) {
          if(/API rate limit exceeded/.test(response.message)) {
            $rootScope.$broadcast('ghRateLimitExceeded');
            defer.reject();
          }
          else {
            $rootScope.$broadcast('ghRequestSuccess');
            defer.resolve(response.data ? response.data : response);
          }
        }, function() {
          $rootScope.$broadcast('ghRateLimitExceeded');
          defer.reject();
        });

      return defer.promise;
    }
  })

  .factory('ghRepoCommits', function(ghRequest) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo + '/commits');
    };
  })

  .factory('ghRepoPullRequests', function(ghRequest) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo + '/pulls');
    };
  })

  .factory('ghRepoIssues', function(ghRequest) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo + '/issues');
    };
  })

  .factory('ghRepoReadme', function(ghRequest, base64Decode) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo + '/readme').then(function(data) {
        return base64Decode(data.content);
      });
    };
  })

  .factory('ghRepos', function(ghRequest) {
    return function(search) {
      search = search ? search : '';
      return ghRequest('search/repositories?q=' + search).then(function(data) {
        return data.items;
      });
    };
  })

  .factory('ghRepo', function(ghRequest) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo);
    };
  })

  .factory('ghRepoCollaborators', function(ghRequest) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo + '/collaborators');
    };
  });
