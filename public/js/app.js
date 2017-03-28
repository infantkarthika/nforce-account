angular.module("accountsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    accounts: function(Accounts) {
                        return Accounts.getAccounts();
                    }
                }
            })
            .when("/new/account", {
                controller: "NewAccountController",
                templateUrl: "account-form.html"
            })
            .when("/account/:accountId", {
                controller: "EditAccountController",
                templateUrl: "account.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Accounts", function($http) {
        this.getAccounts = function() {
            return $http.get("/account").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding account.");
                });
        }
        this.createAccount = function(account) {
            return $http.post("/account", account).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating account.");
                });
        }
        this.getAccount = function(accountId) {
            var url = "/account/" + accountId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this account.");
                });
        }
        this.editAccount = function(account) {
            var url = "/account/" + account.id;
            console.log(account.id);
            return $http.put(url, account).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this account.");
                    console.log(response);
                });
        }
        this.deleteAccount = function(accountId) {
            var url = "/account/" + accountId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this account.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(accounts, $scope) {
        $scope.accounts = accounts.data;
    })
    .controller("NewAccountController", function($scope, $location, Accounts) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveAccount = function(account) {
            Accounts.createAccount(account).then(function(doc) {
                var accountUrl = "/account/" + doc.data.id;
                $location.path(accountUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditAccountController", function($scope, $routeParams, Accounts) {
        Accounts.getAccount($routeParams.accountId).then(function(res) {
            $scope.account = res.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.accountFormUrl = "account-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.accountFormUrl = "";
        }

        $scope.saveAccount = function(account) {
            Accounts.editAccount(account);
            $scope.editMode = false;
            $scope.accountFormUrl = "";
        }

        $scope.deleteAccount = function(accountId) {
            Accounts.deleteAccount(accountId);
        }
    });