"use strict";app.controller("SigninFormController",["$scope","$http","$state",function($scope,$http,$state){$scope.user={},$scope.authError=null,$scope.login=function(){$scope.authError=null,$http.post("api/login",{email:$scope.user.email,password:$scope.user.password}).then(function(response){response.data.user?$state.go("app.dashboard-v1"):$scope.authError="Email or Password not right"},function(x){$scope.authError="Server Error"})}}]);