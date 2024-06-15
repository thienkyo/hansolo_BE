'use strict';
angular.module('clientShopModule')
.controller('clientShopController', ['$scope','$location','NgTableParams','memberService','ContractDO','SalaryDO',
                                    'CommonStatusArray','clientService','shopService','ClientDO','ShopDO','memberListService',
                                    'ClientStatusList','clientInfoCacheService','currentShopCacheService','oneClientShopListCacheService',
function($scope,$location,NgTableParams,memberService,ContractDO,SalaryDO,
         CommonStatusArray,clientService,shopService,ClientDO,ShopDO,memberListService,
         ClientStatusList,clientInfoCacheService,currentShopCacheService,oneClientShopListCacheService,
         ){
    var self = this;
    self.statusList = CommonStatusArray;
    self.theOne = new ContractDO();
    self.theSalary = new SalaryDO();

    self.theClient = new ClientDO();
    self.theSalary = new ShopDO();
    self.clientStatusList = ClientStatusList;
    self.statusStyle = {};

    if(!memberService.isGodLike()){
        $location.path('#/');
    }

    clientService.getAll().then(function (data) {
        self.clientList = data;
        self.clientList.forEach(enrichClientList);
        console.log(self.clientList);
        self.tableParams = new NgTableParams({}, { dataset: self.clientList});
    });

    self.setDefaultClientShop = function(client,shop){
        clientInfoCacheService.set(client);
        currentShopCacheService.set(shop);
        self.clientList.forEach(enrichClientList);
        self.shopList.forEach(enrichShopList);
        oneClientShopListCacheService.set(self.shopList);

    }

    function enrichClientList(client){
        if(client.clientCode == clientInfoCacheService.get().clientCode){
            client.isDefault = true;
        }else{
            client.isDefault = false;
        }
    }

    function enrichShopList(shop){
        console.log(shop);
        console.log(currentShopCacheService.get().shopCode);
        if(shop.shopCode == currentShopCacheService.get().shopCode){
            shop.isDefault = true;
        }else{
            shop.isDefault = false;
        }
    }

    self.addClient = function(){
        self.theClient = new ClientDO();
        self.theShop = new ShopDO();
        self.shopList = [];
        self.shopTableParams = new NgTableParams({}, { dataset: self.shopList});

    }

    self.closeDetailModal = function(){
        console.log('close Detail Modal');
    }

    self.createMember = function(one){
         self.responseStr = false;
         self.responseStrFail = false;
         memberListService.insertByClient(one).then(function (data) {
            if(data.errorCode == 'SUCCESS'){
                self.responseStr = data.errorMessage;
            }else{
                self.responseStrFail = data.errorMessage;
            }
        });
    }

    self.setTheClient = function(one){
        self.theClient = one;
        self.theShop = new ShopDO();
        shopService.getAll(self.theClient.id).then(function (data) {
            self.shopList = data;
            self.shopList.forEach(enrichShopList);
            //console.log(self.shopList);
            self.shopTableParams = new NgTableParams({}, { dataset: self.shopList});
        });
    }

    self.clientUpsert = function(one){
        self.responseStr = false;
        self.responseStrFail = false;
        clientService.upsert(one).then(function (data) {
            if(data.errorCode == 'SUCCESS'){
                self.responseStr = data.errorMessage;
                if(one.id == 0){
                    self.theClient = data.obj;
                    self.clientList.unshift(data.obj);
                    self.tableParams = new NgTableParams({}, { dataset: self.clientList});
                }
            }else{
                self.responseStrFail = data.obj;
            }
        });
    }

    self.updateClientStatus = function(one){
        self.responseStr = false;
        self.responseStrFail = false;
        clientService.updateClientStatus(one).then(function (data) {
        console.log(data);
            if(data.errorCode == 'SUCCESS'){
                self.responseStr = data.errorMessage;
                if(one.id == 0){
                    self.theClient = data.obj;
                    self.clientList.unshift(data.obj);
                    self.tableParams = new NgTableParams({}, { dataset: self.clientList});
                }
            }else{
                self.responseStrFail = data.obj;
            }
        });
    }

    self.deleteClient = function(one){
        self.responseStr = false;
        self.responseStrFail = false;
        clientService.deleteOne(one).then(function (data) {
            self.responseStr = data;
            var index = self.clientList.indexOf(one);
            self.clientList.splice(index,1);
            self.tableParams = new NgTableParams({}, { dataset: self.clientList});

        },function(error){
            if(error.data.exception == 'org.springframework.dao.DataIntegrityViolationException'){
                self.responseStrFail = error;
            }
        });
    }

    self.clear = function(){
        self.responseStr = false;
        self.responseStrFail = false;
        self.theOne = new BizReportDO;
        self.isShowUploadPic = false;
    }

    self.promptDelete = function(id){
        self.deletingId = self.deletingId ? false : id;
    }

	self.resetDelete = function(){
        self.deletingId = false;
    }

    // open datePicker
    self.openDP = function() {
        self.DPisOpen = true;
    };
    self.openDP2 = function() {
        self.DPisOpen2 = true;
    };
    self.openDP3 = function() {
        self.DPisOpen3 = true;
    };
    self.openDP4 = function() {
        self.DPisOpen4 = true;
    };
    self.openDP5 = function() {
        self.DPisOpen5 = true;
    };

    self.setStyle = function(status){
        if(status=='ACTIVE'){
            self.statusStyle.color = "limegreen";
        }else if(status=='INACTIVE'){
            self.statusStyle.color = "brown";
        }else if(status=='INIT'){
            self.statusStyle.color = "blue";
        }
        return self.statusStyle;
    }

    /////// shop

    self.setTheShop = function(one){
        self.theShop = one;
    }
    self.clearTheShop = function(one){
        self.theShop = new ShopDO();;
    }

    self.upsertTheShop = function(one){
        self.responseStr = false;
        self.responseStrFail = false;
        one.clientId = self.theClient.id;
        one.clientCode = self.theClient.clientCode;
        shopService.upsert(one).then(function (data) {
            self.responseStr = data.errorMessage;
            console.log(data);
            if(one.id == 0){
                self.shopList.unshift(data.obj);
                self.shopTableParams = new NgTableParams({}, { dataset: self.shopList});
            }
        });
    }

    self.deleteShop = function(one){
        self.responseStr = false;
        self.responseStrFail = false;
        shopService.deleteOne(one).then(function (data) {
            self.responseStr = data;
            if(data.errorCode == 'SUCCESS'){
                var index = self.shopList.indexOf(one);
                self.shopList.splice(index,1);
                self.shopTableParams = new NgTableParams({}, { dataset: self.shopList});
            }


        },function(error){
            if(error.data.exception == 'org.springframework.dao.DataIntegrityViolationException'){
                self.responseStrFail = error;
            }
        });
    }

    self.closeAlert = function() {
        self.responseStr = false;
        self.responseStrFail = false;
    };

}]);

