'use strict';
angular.module('customerSourceModule')
.factory('customerSourceService', ['ajaxService',function(ajaxService) {
		var customerSourceService = {
				getAll : getAll,
				getCustomerSourceByTerms : getCustomerSourceByTerms,
				upsert : upsert,
				deleteOne : deleteOne,
				getReportAll : getReportAll,
				calculateReport : calculateReport,
				upsertReport : upsertReport,
				getReportByTerms : getReportByTerms
			};
	return customerSourceService;

	/*Deprecated*/
	function getAll(){
		var url = "mgnt/getAllCustomerSource";
		return ajaxService.get(url,null,{}).then(function(response){
			return response.data;
		});
	}

	function getCustomerSourceByTerms(req){
        var url = "mgnt/getCustomerSourceByTerms";
        return ajaxService.post(url,req,{}).then(function(response){
            return response.data;
        });
    }

	function getReportByTerms(req){
        var url = "mgnt/getCusReportByTerms";
        return ajaxService.post(url,req,{}).then(function(response){
            return response.data;
        });
    }

    /*Deprecated*/
    function getReportAll(){
        var url = "mgnt/getAllCustomerSourceReport";
        return ajaxService.get(url,null,{}).then(function(response){
            return response.data;
        });
    }

	function upsert(one){
		var url = "mgnt/upsertCustomerSource";
		return ajaxService.post(url,one,{}).then(function(response){
			return response.data;
		});
	}

	function calculateReport(one){
        var url = "mgnt/calCustomerSourceReport";
        return ajaxService.post(url,one,{}).then(function(response){
            return response.data;
        });
    }

	function upsertReport(one){
        var url = "mgnt/upsertCustomerSourceReport";
        return ajaxService.post(url,one,{}).then(function(response){
            return response.data;
        });
    }

	function deleteOne(one){
		var url = "mgnt/deleteCoupon";
		return ajaxService.post(url,one,{}).then(function(response){
			return response.data;
		});
	}


 }]);