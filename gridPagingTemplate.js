app.directive('paginationTemplate', function($timeout) {
  return {
        restrict: 'A',
        template: '<div class="ngFooterPanel" '
    		+'ng-class="{\'ui-widget-content\': jqueryUITheme, \'ui-corner-bottom\': jqueryUITheme}" ng-style="footerStyle()"> '
    		+'<div class="ngTotalSelectContainer" > <div class="ngFooterSelectedItems">  '
    		+'<span class="ngLabel">{{i18n.ngSelectedItemsLabel}} {{selectedItems.length}}</span>'
    		+'</div></div><div class="ngPagerContainer" style="float: right;" ng-show="gridOptions.enablePaging" '
    		+'ng-class="{\'ngNoMultiSelect\': !multiSelect}"> <div class="ngPagerControl" style="float: left; min-width: 135px;"> '
    		+'<button class="ngPagerButton" ng-click="pageToFirst()" ng-class="{\'active\': cantPageBackward()==false}" ng-disabled="cantPageBackward()" title="{{i18n.ngPagerFirstTitle}}">'
    		+'<i class="icon-chevron-left"></i></button> <button class="ngPagerButton" ng-click="pageBackward()"  ng-class="{\'active\': cantPageBackward()==false}" ng-disabled="cantPageBackward()" '
    		+'title="{{i18n.ngPagerPrevTitle}}"><i class="icon-chevron-left"></i></button>'
    		+'<span class="pagerText"><span class="currentItems">{{(gridOptions.totalServerItems) && (gridOptions.pagingOptions.pageSize*gridOptions.pagingOptions.currentPage-(gridOptions.pagingOptions.pageSize-1)) || (gridOptions.totalServerItems)}}'
    		+' - {{(gridOptions.totalServerItems) && ((gridOptions.pagingOptions.currentPage*gridOptions.pagingOptions.pageSize >= gridOptions.totalServerItems) && (gridOptions.totalServerItems) || (gridOptions.pagingOptions.currentPage*gridOptions.pagingOptions.pageSize)) || (gridOptions.totalServerItems) }}</span>'
    		+' <span class="totalItems">of {{gridOptions.totalServerItems}}</span></span><button class="ngPagerButton" ng-click="pageForward()"  ng-class="{\'active\': cantPageForward()==false}" ng-disabled="cantPageForward()" title="{{i18n.ngPagerNextTitle}}">'
    		+'<i class="icon-chevron-right"></i></button>'
    		+'<button class="ngPagerButton" ng-click="pageToLast()" ng-class="{\'active\': cantPageToLast()==false}" ng-disabled="cantPageToLast()" '
    		+'title="{{i18n.ngPagerLastTitle}}"><i class="icon-chevron-right"></i></button> </div> </div></div>',
        scope: {
        	allDataObjects: '=',
        	gridOptions: '=',
        	callBack:'=',
        	isServerSidePagination:'=',
        	serverObj:'='
        },
        controller: function ($scope){
        	$scope.setPagingData = function(){
    		    var pagedData;
    		    var data = $scope.allData;
    		    var page = $scope.gridOptions.pagingOptions.currentPage;
    		    var pageSize = $scope.gridOptions.pagingOptions.pageSize;
    		    var filterText = $scope.gridOptions.filterOptions.filterText
    		    if (filterText) {
    		    	var filteredData;
    		        var ft = filterText.toLowerCase();
		            filteredData = data.objects.filter(function(item) {
		                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
		            });
		            $scope.gridOptions.totalServerItems = filteredData.length;
		            pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
		            $scope.allDataObjects = pagedData;
    		    }else{
    		    	if($scope.isServerSidePagination){
    		    		var responseback = function(data){
    		    			$scope.gridOptions.totalServerItems = data.totalObjects;
    		    			$scope.allDataObjects = data.objects;
    		    		}
		    			responseback(data);
			    		var callId = $scope.serverObj.paginationCallback;
			    		var index= $scope.serverObj.startIndex;
			    		callId(responseback);
    		    	}else{
				    	$scope.gridOptions.totalServerItems = $scope.allData.objects.length;
				    	pagedData = data.objects.slice((page - 1) * pageSize, page * pageSize);
				    	$scope.allDataObjects = pagedData;
    		    	}
    		    }
    		    if($scope.callBack)
    		        $scope.callBack($scope.allDataObjects);
    		};
    		$scope.pageRefresh = function(){
                $scope.allDataObjects = [];
                $scope.setPagingData();
    		};
    		$scope.init = function() {
	    		$scope.maxRows = function () {
	                return $scope.gridOptions.totalServerItems;
	            };
	    		$scope.maxPages = function () {
	                return Math.ceil($scope.maxRows() / $scope.gridOptions.pagingOptions.pageSize)
	    		};
	    		$scope.pageToFirst = function () {
	                $scope.allDataObjects=[];
	    			$scope.gridOptions.pagingOptions.currentPage = 1
	    			 if($scope.isServerSidePagination){
	    			     $scope.serverObj.startIndex = 0;
	    			 }
	    			$scope.pageRefresh();
	            };
	            $scope.pageBackward = function () {
	            	var t = $scope.gridOptions.pagingOptions.currentPage;
	                $scope.gridOptions.pagingOptions.currentPage = Math.max(t - 1, 1);
	                if($scope.isServerSidePagination){
	                     $scope.serverObj.startIndex-=$scope.gridOptions.pagingOptions.pageSize;
	                }
	                $scope.pageRefresh();
	            };
	            $scope.pageForward = function () {
	            	var t = $scope.gridOptions.pagingOptions.currentPage;
	            	$scope.gridOptions.totalServerItems > 0 ? $scope.gridOptions.pagingOptions.currentPage = Math.min(t + 1, $scope.maxPages()) : $scope.gridOptions.pagingOptions.currentPage++
	                if($scope.isServerSidePagination){
	            		$scope.serverObj.startIndex+=$scope.gridOptions.pagingOptions.pageSize;
	                }
	            	$scope.pageRefresh();
	            };
	            $scope.pageToLast = function () {
	            	var t = $scope.maxPages();
	                $scope.gridOptions.pagingOptions.currentPage = t
	                if($scope.isServerSidePagination){
	                    $scope.serverObj.startIndex=(Math.floor($scope.gridOptions.totalServerItems/$scope.gridOptions.pagingOptions.pageSize))*$scope.gridOptions.pagingOptions.pageSize;
	                }
	                $scope.pageRefresh();
	                
                    
	            };
	            $scope.cantPageBackward = function () {
	            	 var t = $scope.gridOptions.pagingOptions.currentPage;
	                 return 1 >= t;
	            };
	            $scope.cantPageForward = function () {
	            	 var n = $scope.gridOptions.pagingOptions.currentPage,
	                 o = $scope.maxPages();
	                 return $scope.gridOptions.totalServerItems > 0 ? n >= o : 1 < $scope.allData.length
	            };
	            $scope.cantPageToLast = function () {
	            	return $scope.gridOptions.totalServerItems > 0 ? $scope.cantPageForward() : !0
	            };
    		}
    		$scope.sortData = function(field, direction) {
    			  $scope.allData.objects.sort(function (a, b) {
    			    if (direction == "asc") {
    			      return a[field] > b[field] ? 1 : -1;
    			    } else {
    			      return a[field] > b[field] ? -1 : 1;
    			    }
    			  })
    		}
    		   
    		// sort over all data, not only the data on current page
		   $scope.$watch('gridOptions.sortInfo', function (newVal, oldVal) {
			  if (newVal !== oldVal) {
			     $scope.gridOptions.pagingOptions.currentPage = 1;
			     if($scope.allData){
			    	 if(!$scope.isServerSidePagination){
			    	    $scope.sortData(newVal.fields[0], newVal.directions[0]);
			    	 }else{
			    		 $scope.serverObj.order = newVal.directions[0]; 
			    		 $scope.serverObj.sortByField = newVal.fields[0];
			    	 }
			        $scope.setPagingData();
			     }
			     }
			 }, true);

            $scope.$watch('[gridOptions.filterOptions]', function (newVal, oldVal) {
			    if (newVal !== oldVal) {
			    	$scope.gridOptions.pagingOptions.currentPage= 1;
			    	$scope.setPagingData();
			    }
			}, true);
            
        },
        link: function (scope, elem, attrs, contrl) {
        	scope.$on('dataloaded', function(e, data) {
        		scope.allData = data;
        		scope.init();
        		if(!scope.isServerSidePagination){
        	      scope.sortData(scope.gridOptions.sortInfo.fields[0], scope.gridOptions.sortInfo.directions[0]);
        		}
        	    scope.setPagingData();
        	});
        	
       } // end of link
    }
})
