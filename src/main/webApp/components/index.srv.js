'use strict';
angular.module('app')
.factory('memberService',['store', function(store) {
	var currentMember = null;
	var cartName = 'kinhNguyenCart'; //
	var memberService = {
            setCurrentMember : setCurrentMember,
            getCurrentMember : getCurrentMember,
            makeLoginStr : makeLoginStr,
            logout : logout,
        //	makeSignupStr : makeSignupStr,
            isLogin : isLogin,
            isAdmin :isAdmin,
            isSuperAdmin :isSuperAdmin,
            isAccountant :isAccountant,
            isSuperAccountant :isSuperAccountant,
            isMod : isMod,
            isGodLike : isGodLike
		};
	return memberService;

	function logout(){
        setCurrentMember(null);
    }
	
	function setCurrentMember(member){
		currentMember = member;
        store.set('member', member);
        return currentMember;
	}
	
	function getCurrentMember(){
		if (!currentMember) {
            currentMember = store.get('member');
        }
        return currentMember;
	}
	
	function isLogin(){ 
		if (!currentMember) {
            currentMember = store.get('member');
        }
		if(currentMember){
			return true;
		}
		return false;
	}
	
	function isAdmin(){
		if(isLogin() && currentMember.roles.indexOf("ADMIN") != -1){
			return true;
		}
		return false;
	}

	function isSuperAdmin(){
        if(isLogin() && currentMember.roles.indexOf("SUPER_ADMIN") != -1){
            return true;
        }
        return false;
    }
	
	function isMod(){
		if(isLogin() && currentMember.roles.indexOf("MOD") != -1){
			return true;
		}
		return false;
	}

	function isGodLike(){
        if(isLogin() && currentMember.roles.indexOf("GODLIKE") != -1){
            return true;
        }
        return false;
    }

	function isAccountant(){
        if(isLogin() && currentMember.roles.indexOf("ACCOUNTANT") != -1){
            return true;
        }
        return false;
    }

    function isSuperAccountant(){

        if(isLogin() && isAccountant() && currentMember.roles.indexOf("SUPER_ACCOUNTANT") != -1){
            return true;
        }
        return false;
    }
	
	function makeLoginStr(email,pass){
		var deli = 'd3m';
		var result = randomString(getRandomArbitrary(10,20)) + deli;
		
		for(var i = 0; i < 2; i++){
			result += randomString(getRandomArbitrary(10,20)) +deli;
		}
		result += email +deli;
		
		for(var i = 0; i < 10; i++){
			result += randomString(getRandomArbitrary(10,20)) +deli;
		}
		
		result += pass + deli;
		for(var i = 0; i < 10; i++){
			result += randomString(getRandomArbitrary(10,20)) +deli;
		}
		result += randomString(getRandomArbitrary(10,20));
		return btoa(result);
	}
	
	function makeSignupStr(email,pass,fullName,phone){
		var deli = 'o3k';
		var result = randomString(getRandomArbitrary(10,20)) + deli;
		
		for(var i = 0; i < 2; i++){
			result += randomString(getRandomArbitrary(10,20)) +deli;
		}
		result += email +deli;
		
		for(var i = 0; i < 10; i++){
			result += randomString(getRandomArbitrary(10,20)) +deli;
		}
		
		result += pass + deli;
		for(var i = 0; i < 8; i++){
			result += randomString(getRandomArbitrary(10,20)) +deli;
		}
		result += phone;
		return btoa(result) +deli+ fullName;
	}
	
	function randomString(length, chars) {
		var chars = '012456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

}])
.factory('cartStoreService',['store', function(store) {
	var currentCart = [];
	var currentOrderId = '';
	var cartName = 'kinhNguyenCart';
	var cartStoreService = {
		setCurrentCart : setCurrentCart,
		getCurrentCart : getCurrentCart,
		getQuantity : getQuantity,
		clearCart : clearCart,
//		setOrderId : setOrderId,
//		getOrderId : getOrderId,
//		clearOrderId : clearOrderId,
		};
	return cartStoreService;
	
	function setCurrentCart(cart){
		currentCart = cart;
        store.set(cartName, cart);
        return currentCart;
	}
	
	function getCurrentCart(){
		if (store.get(cartName)) {
			currentCart = store.get(cartName);
        }else{
        	store.set(cartName, currentCart);
        }
        return currentCart;
	}
	
	function getQuantity(){
		if(getCurrentCart()){
			return getCurrentCart().length;
		}
		return 0;
	}
	
	function clearCart(){
		currentCart = [];
		store.set(cartName, currentCart);
	}

}])
.factory('uploadService',['Upload','$timeout', function(Upload,$timeout) {
	var shipList = [];
	var newPicName='tete';
	var uploadService = {
		uploadFunction : uploadFunction,
		uploadFilesFunction : uploadFilesFunction
		};
	return uploadService;

	function uploadFunction(file, type) {

        file.upload = Upload.upload({
          url: 'mgnt/uploadFile',
          data: {oldName: file.oldName ? file.oldName : '' , file: file, type: type},
          headers:{'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}
        });

        file.upload.then(function (response) {
          $timeout(function () {
          file.result = response.data;
          });
        }, function (response) {
          if (response.status > 0)
            self.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }

    function uploadFilesFunction(files, oldNames) {

        Upload.upload({
          url: 'mgnt/uploadFiles',
          data: {oldNames: oldNames ? oldNames : '' , files: files},
          arrayKey: '',
          headers:{'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}
        }).then(function (response) {
          $timeout(function () {
          files.result = response.data;
          });
        }, function (response) {
          if (response.status > 0)
            self.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          files.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }

}])
.factory('paginationService',['store','PaginationItemDO','PaginationDO', function(store,PaginationItemDO,PaginationDO) {
	var pagination = new PaginationDO;
	var paginationService = {
		builder : builder
		};
	return paginationService;
	
	function builder(pageable){ // pageable = current page
		pagination.clear();
	   for(var i=1 ; i <= pageable.totalPages ; i++){ 
		   var temp = new PaginationItemDO();
		   temp.first = i == 1 ? true : false;
		   temp.last  = i == pageable.totalPages ? true : false;
		   temp.number = i ;
		   temp.status = i == (pageable.number + 1) ? true : false;
		   pagination.list.push(temp);
	   }
	   pagination.totalElements = pageable.totalElements;
	   pagination.currentFirstItemIndex = pageable.size*pageable.number +1;
	   pagination.currentLastItemIndex = (pageable.number + 1) == pageable.totalPages ? (pagination.currentFirstItemIndex + pageable.numberOfElements -1)  : pageable.size*(pageable.number + 1);

	   pagination.currentNumber = parseInt(pageable.number) +1;
	   pagination.nextNumber = parseInt(pagination.currentNumber) + 1;
	   pagination.previousNumber = pagination.currentNumber == 1 ? 1 : parseInt(pagination.currentNumber) - 1;
	   
	   return pagination;
	}
	
}])
.factory('searchService',['ajaxService', function(ajaxService) {
	var searchService = {
		    searchByNamePhone : searchByNamePhone,
		    getOrderByNamePhone : getOrderByNamePhone,
		    searchLensProduct2 : searchLensProduct2
		    //searchLensProduct : searchLensProduct
		};
	return searchService;

    //// orderList for search function
	function getOrderByNamePhone(req){
        if(req){
            var url = "mgnt/orderByNamePhoneMngt";
            return ajaxService.post(url,req,{}).then(function(response){
                return response.data;
            });
        }
    }

    function searchByNamePhone(searchText){
        if(searchText){
            var url = "search/orderByNamePhoneMngt/"+searchText;
            return ajaxService.get(url,null,{}).then(function(response){
                return response.data;
            });
        }
    }

    /// storeOrder page
    /*function searchLensProduct(searchText){
        if(searchText){
            var url = "mgnt/searchLensProduct/"+searchText;
            return ajaxService.get(url,null,{}).then(function(response){
                return response.data;
            });
        }else {return '';}
    }*/

    /// storeOrder page
    function searchLensProduct2(req){
        if(req.generalPurpose){
            var url = "mgnt/searchLensProduct/";
            return ajaxService.post(url,req,{}).then(function(response){
                return response.data;
            });
        }else {return '';}
    }

}])
.factory('orderCacheService',['store', function(store) {
	var currentOrderCache = [];
	var cacheName = 'kinhNguyenOrderCache';
	var orderCacheService = {
		setCurrentOrderCache : setCurrentOrderCache,
		getCurrentOrderCache : getCurrentOrderCache,
		addOneOrder : addOneOrder, // overwrite the duplicated order
		addOneOrder2 : addOneOrder2,// keep version
		addOneOrder3 : addOneOrder3,// just insert order to cache
		getQuantity : getQuantity,
		getOneOrder : getOneOrder,
		clearCache : clearCache
		}
	return orderCacheService;

	function getOneOrder(orderId){
	    currentOrderCache = getCurrentOrderCache();
        return currentOrderCache.find(i => i.id == orderId);
	}

	function addOneOrder(order){
	    currentOrderCache = getCurrentOrderCache();
	    var found = currentOrderCache.find(i => i.id == order.id);

	    if(found){
	        var index = currentOrderCache.indexOf(found);
            currentOrderCache[index] = order;
	    }else{
            currentOrderCache.unshift(order);
            if(getQuantity() > 100){
                currentOrderCache.pop();
            }
	    }
	    setCurrentOrderCache(currentOrderCache);
    }

    function addOneOrder3(order){
        currentOrderCache = getCurrentOrderCache();
        var found = currentOrderCache.find(i => i.id == order.id && i.phase == order.phase);

        if(found){
            if(JSON.stringify(order) !== JSON.stringify(found)){
                 currentOrderCache.unshift(order);
            }
        }else{
            currentOrderCache.unshift(order);
        }


        //currentOrderCache.unshift(order);
        if(getQuantity() > 2500){
            currentOrderCache.pop();
        }
        setCurrentOrderCache(currentOrderCache);
    }

    function addOneOrder2(order){
        currentOrderCache = getCurrentOrderCache();
        var foundArray = currentOrderCache.filter(i => i.id == order.id);
        if(foundArray.length > 0 && foundArray.length <= 3){
            var index = currentOrderCache.indexOf(foundArray);
            currentOrderCache[index] = order;

            var indexOfMax = Math.max(...foundArray.map(o => o.version));
            order.version = indexOfMax + 1;
            var orderMaxVersion = foundArray.find(item => item.version == indexOfMax);
            currentOrderCache.unshift(order);
        }else{
            order.version = 1;
            currentOrderCache.unshift(order);

        }
        if(getQuantity() > 2000){
            currentOrderCache.pop();
        }
        setCurrentOrderCache(currentOrderCache);
    }

	function setCurrentOrderCache(orderList){
        currentOrderCache = orderList;
        store.set(cacheName, orderList);
        return currentOrderCache;
    }

    function getCurrentOrderCache(){
        if (store.get(cacheName)) {
            currentOrderCache = store.get(cacheName);
        }else{
            store.set(cacheName, currentOrderCache);
        }
        return currentOrderCache;
    }

    function getQuantity(){
        if(getCurrentOrderCache()){
            return getCurrentOrderCache().length;
        }
        return 0;
    }

    function clearCache(){
        currentOrderCache = [];
        store.set(cacheName, currentOrderCache);
    }

}])
.factory('commonService',['$location', function($location) { // no use yet
	var currentOrderCache = [];
	var cacheName = 'kinhNguyenOrderCache';
	var commonService = {
		isLocalWeb : isLocalWeb
		}
	return commonService;

	function isLocalWeb(){
        if ($location.host() == 'localhost') {
            return true;
        }
        return false;
    }

}])
.factory('commonCacheService',['store','ajaxService', function(store,ajaxService) {
	var currentCache = {};
	// var globalCacheName = '';
	var commonCacheService = {
		setCurrentCache : setCurrentCache,
		getCurrentCache : getCurrentCache,
		clearCache : clearCache,
		getLastTimeData : getLastTimeData
		}
	return commonCacheService;

	// get data from class CommonCache.java in backend
	function getLastTimeData(){
        var url = "mgnt/getLastTimeData";
        return ajaxService.post(url,null,{}).then(function(response){
            return response.data;
        });
    }

	function setCurrentCache(cacheName, cacheData){
        //currentCache = cacheData;

        store.set(cacheName, cacheData);
    }

    function getCurrentCache(cacheName){
       /* if (store.get(cacheName)) {
            currentCache = store.get(cacheName);
        }else{
            store.set(cacheName, currentCache);
        }
        return currentCache;*/
        return store.get(cacheName);
    }

    function clearCache(cacheName){
       // currentCache = {};
        store.set(cacheName, null);
    }

}])
//deprecated : shopInfoCacheService
.factory('shopInfoCacheService',['shopConfigService','cacheName','commonCacheService',
function(shopConfigService,cacheName,commonCacheService) {
    var cacheNameStr = cacheName.shopInfoCacheName;
	var service = {
            setCurrentCache : setCurrentCache,
            getCurrentCache : getCurrentCache,
            clearCache : clearCache
		}
	return service;

	function setCurrentCache(cacheData){
	    commonCacheService.setCurrentCache(cacheNameStr, cacheData);
	}

    function getCurrentCache(){
        var shopInfo =  commonCacheService.getCurrentCache(cacheNameStr);
        if(!shopInfo.shopName){
            shopConfigService.getDataForMgnt().then(function (data) {
                shopInfo = data.obj
                commonCacheService.setCurrentCache(cacheNameStr,data.obj);
            });
        }
        return shopInfo;
    }

    function clearCache(){
        commonCacheService.clearCache(cacheNameStr);
    }

}]) // deprecated

.factory('clientInfoCacheService',['cacheName','commonCacheService',
    function(cacheName,commonCacheService) {
    var cacheNameStr = cacheName.clientInfoCacheName;

	var service = {
            set : set,
            get : get,
            clear : clear
		}
	return service;

	function set(cacheData){
	    commonCacheService.setCurrentCache(cacheNameStr, cacheData);
	}

    function get(){
        var clientInfo =  commonCacheService.getCurrentCache(cacheNameStr);
        return clientInfo;
    }

    function clear(){
        commonCacheService.clearCache(cacheNameStr);
    }

}])

// for opticShopOnline
.factory('configOSOCacheService',['opticShopOnlineService','cacheName','commonCacheService','memberService',
function(opticShopOnlineService,cacheName,commonCacheService,memberService) {
    var cacheNameStr = 'configOSOCache';
	var service = {
            setCurrentCache : setCurrentCache,
            getCurrentCache : getCurrentCache,
            clearCache : clearCache
		}
	return service;

	function setCurrentCache(cacheData){
	    commonCacheService.setCurrentCache(cacheNameStr, cacheData);
	}

    function getCurrentCache(){
        var info =  commonCacheService.getCurrentCache(cacheNameStr);
        if(!info && memberService.isGodLike()){
            opticShopOnlineService.getDataForMgnt().then(function (data) {
                info = data.obj
                commonCacheService.setCurrentCache(cacheNameStr,data.obj);
            });
        }
        return info;
    }

    function clearCache(){
        commonCacheService.clearCache(cacheNameStr);
    }

}])
.factory('shopListCacheService',['commonCacheService','ShopDO',
    function(commonCacheService,ShopDO) {
    var cacheNameStr = 'shopListCache';
    var allShop = new ShopDO();
    allShop.shopCode = 'ALL';
    allShop.shopName = 'shop';
    allShop.shopAddress = 'all';

	var service = {
            set : set,
            get : get,
            clear : clear
		}
	return service;

	function set(cacheData){
	    if(cacheData.length >1){
	        cacheData.unshift(allShop);
	    }
	    commonCacheService.setCurrentCache(cacheNameStr, cacheData);
	}

    function get(){
        return commonCacheService.getCurrentCache(cacheNameStr);;
    }

    function clear(){
        commonCacheService.clearCache(cacheNameStr);
    }

}])
.factory('currentShopCacheService',['commonCacheService',
    function(commonCacheService) {
    var cacheNameStr = 'currentShopCache';
	var service = {
            set : set,
            get : get,
            clear : clear
		}
	return service;

	function set(cacheData){
	    commonCacheService.setCurrentCache(cacheNameStr, cacheData);
	}

    function get(){
        return commonCacheService.getCurrentCache(cacheNameStr);;
    }

    function clear(){
        commonCacheService.clearCache(cacheNameStr);
    }

}])

//for godlike logic
.factory('clientListCacheService',['commonCacheService','ClientDO',
   function(commonCacheService,ClientDO) {
   var cacheNameStr = 'clientListCache';
   var allClient = new ClientDO();
   allClient.clientCode = 'ALL';
   allClient.brandName = 'all client';

	var service = {
            set : set,
            get : get,
            clear : clear
		}
	return service;

	function set(cacheData){
	    if(cacheData.length >1){
            cacheData.unshift(allClient);
        }
	    commonCacheService.setCurrentCache(cacheNameStr, cacheData);
	}

    function get(){
        return commonCacheService.getCurrentCache(cacheNameStr);;
    }

    function clear(){
        commonCacheService.clearCache(cacheNameStr);
    }
}])

// for user.
.factory('oneClientShopListCacheService',['commonCacheService','ShopDO',
    function(commonCacheService,ShopDO) {
    var cacheNameStr = 'oneClientShopListCache';
    var allShop = new ShopDO();
    allShop.shopCode = 'ALL';
    allShop.shopName = 'shop';
    allShop.shopAddress = 'all';

	var service = {
            set : set,
            get : get,
            clear : clear
		}
	return service;

	function set(cacheData){
	    if(cacheData.length >1){
	        cacheData.unshift(allShop);
	    }
	    commonCacheService.setCurrentCache(cacheNameStr, cacheData);
	}

    function get(){
        return commonCacheService.getCurrentCache(cacheNameStr);;
    }

    function clear(){
        commonCacheService.clearCache(cacheNameStr);
    }

}])


;