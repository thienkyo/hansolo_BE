'use strict';
angular.module('opticShopOnlineModule')
	.controller('opticShopOnlineController',['$location',
										 'memberService','LensProductDO','OSOConfigDO',
										 'NgTableParams',
										 'opticShopOnlineService',
										 'cacheName','configOSOCacheService',
	function($location,
	        memberService,LensProductDO,OSOConfigDO,
	        NgTableParams,
	        opticShopOnlineService,
	        cacheName,configOSOCacheService
	        ){
	var self = this;
	if(!memberService.isGodLike()){
        $location.path('#/');
    }

	self.theOne = new OSOConfigDO();

    opticShopOnlineService.getDataForMgnt().then(function (data) {
        if(data.obj){
            self.theOne = data.obj;
        }
    });


    self.upsert = function(one){
        self.isSaveButtonPressed=true;
        self.responseStr = false;
        opticShopOnlineService.upsert(one).then(function (data) {
            self.responseStr = data;
            self.isSaveButtonPressed=false;
            self.theShopConfig = data.obj;
            configOSOCacheService.setCurrentCache(data.obj);
        });
        opticShopOnlineService.refreshShopConfig().then(function (data) {
            self.isSaveButtonPressed=false;
        });
    }

    self.refreshShopConfig = function(){
        self.isSaveButtonPressed=true;
        self.responseStr = false;
        opticShopOnlineService.refreshShopConfig().then(function (data) {
            self.responseStr = data;
            self.isSaveButtonPressed=false;
        });
    }

    self.closeAlert = function(index) {
        self.responseStr = false;
    };


    self.clearShopConfig = function(){
        configOSOCacheService.clearCache();
    }

/// modal

}]);
