app.controller("RouteEditController",function($tableListService,$compile,$rootScope,$scope,$http,$state,$localStorage,$stateParams,$filter,$myHttpService){function openInfo(item){}function closeEditMode(index){for(var i=0,len=$scope.buslineStations.length;i<len;i++)i!=index&&($scope.buslineStations[i].editMode=!1)}$scope.editMode=!!$stateParams.id;var options={searchFormId:"J_search_form",size:"9999",listUrl:"api/unit/queryUnitlistByKeyword",multiTable:"companyList"};$tableListService.init($scope,options),$tableListService.get(),$scope.address={};var $sortable=$("#J_sortable").sortable(),saveDataOld={};$scope.editMode?($scope.buslineStations=[],$myHttpService.post("api/busline/queryBusline.htm",{lineid:$stateParams.id},function(data){var tmpData={busline:data.busline,stations:data.stations};saveDataOld=angular.copy(tmpData),$scope.busline=data.busline;for(var stations=data.stations,i=0;i<stations.length;i++)$scope.buslineStations.push({lineid:stations[i].lineid,stationId:stations[i].stationid,stationName:stations[i].stationname,lng:stations[i].stalongitude,lat:stations[i].stalatitude,drivingTime:stations[i].drivingtime});window.setTimeout(function(){$scope.$apply(),$sortable.sortable()}),MapOperation.addMarkers($scope.buslineStations)})):($scope.busline={lineid:"",linename:"",runstatus:0,linetype:0,region:"武汉",stationnum:0},$scope.buslineStations=[]),$scope.tabs=[!0,!1],$scope.tab=function(index){for(var i=0,len=$scope.tabs.length;i<len;i++)$scope.tabs[i]=i==index},$scope.changeRunStatus=function(){0==$scope.busline.runstatus?$scope.busline.runstatus=1:$scope.busline.runstatus=0};var MapOperation={map:null,contextMenuPositon:null,contextMenu:null,geocoder:null,createMap:function(){MapOperation.map=new AMap.Map("J_map_canvas",{zooms:[1,18],zoom:12,center:[114.305214,30.592934]}),AMap.service("AMap.Geocoder",function(){MapOperation.geocoder=new AMap.Geocoder({city:"09"})}),AMap.plugin(["AMap.Autocomplete","AMap.PlaceSearch"],function(){var autoOptions={city:"09",input:"searchPosition"};autocomplete=new AMap.Autocomplete(autoOptions);var placeSearch=new AMap.PlaceSearch({city:"09",map:MapOperation.map});AMap.event.addListener(autocomplete,"select",function(e){placeSearch.search(e.poi.name,function(status,result){})}),AMap.event.addListener(placeSearch,"markerClick",function(e){$scope.address.gdPosition=[{formattedAddress:e.data.name,location:e.data.location}],$scope.address.formattedAddress="",$scope.add()})}),MapOperation.contextMenu=new AMap.ContextMenu,MapOperation.contextMenu.addItem("添加站点",function(e){var len=$scope.buslineStations.length;closeEditMode(9999);var busline={stationId:(new Date).getTime()+""+(Math.floor(9e3*Math.random())+1e3),stationName:"新建站点",lng:MapOperation.contextMenuPositon.getLng(),lat:MapOperation.contextMenuPositon.getLat(),drivingTime:0,editMode:!0,drivetime:$scope.busline.drivetime,drivedistance:$scope.busline.drivedistance};len>1?$scope.buslineStations.splice(len-1,0,busline):$scope.buslineStations.push(busline),MapOperation.addMarkers([busline]),$scope.$apply(),$sortable.sortable(),MapOperation.calcRouteLine()},0),MapOperation.contextMenu.addItem("放大一级",function(){MapOperation.map.zoomIn()},1),MapOperation.contextMenu.addItem("缩小一级",function(){MapOperation.map.zoomOut()},2),MapOperation.map.on("rightclick",function(e){MapOperation.contextMenu.open(MapOperation.map,e.lnglat),MapOperation.contextMenuPositon=e.lnglat})},getAddr:function(lnglatXY){MapOperation.geocoder.getAddress(lnglatXY,function(status,result){"complete"===status&&"OK"===result.info?$scope.formattedAddress=result.regeocode.formattedAddress:layer.msg("获取地址失败")})},addMarkers:function(buslines){for(var i=0,len=buslines.length;i<len;i++){var text="<div class='marker station-marker'>"+i+"</div>";0==i?text="<div class='marker start-marker'>起</div>":i==len-1&&(text="<div class='marker stop-marker'>终</div>");var marker=new AMap.Marker({map:MapOperation.map,position:new AMap.LngLat(buslines[i].lng,buslines[i].lat),content:text,extData:buslines[i],draggable:!0});AMap.event.addListener(marker,"dragend",function(e){for(var j=0,len2=$scope.buslineStations.length;j<len2;j++){var data=this.getExtData(),lngLat=this.getPosition();if(data.stationId==$scope.buslineStations[j].stationId){closeEditMode(9999),$scope.buslineStations[j].lng=lngLat.getLng(),$scope.buslineStations[j].lat=lngLat.getLat(),$scope.buslineStations[j].editMode=!0,$scope.$apply();break}}})}},calcRouteLine:function(){MapOperation.map.clearMap(),MapOperation.addMarkers($scope.buslineStations)}};$scope.location=function(data){MapOperation.map.setCenter(new AMap.LngLat(data.lng,data.lat))},$scope.getLngLat=function(){MapOperation.geocoder.getLocation($scope.address.formattedAddress,function(status,result){"complete"===status&&"OK"===result.info?($scope.address.gdPosition=result.geocodes,openInfo($scope.address.gdPosition[0])):layer.msg("没有找到您输入的地址")})},$scope.add=function(){var len=$scope.buslineStations.length;closeEditMode(9999);var busline={stationId:(new Date).getTime()+""+(Math.floor(9e3*Math.random())+1e3),stationName:$scope.address.gdPosition[0].formattedAddress,lng:$scope.address.gdPosition[0].location.lng,lat:$scope.address.gdPosition[0].location.lat,drivingTime:0,editMode:!0,drivetime:$scope.busline.drivetime,drivedistance:$scope.busline.drivedistance};len>1?$scope.buslineStations.splice(len-1,0,busline):$scope.buslineStations.push(busline),MapOperation.addMarkers([busline]),$scope.$apply(),$sortable.sortable(),MapOperation.calcRouteLine()},$sortable.on("sortupdate",function(event){var temp=[];$sortable.children("li").each(function(index,item){temp.push(JSON.parse($(item).attr("data")))}),$scope.buslineStations=temp,$scope.$apply(),$sortable.sortable(),MapOperation.calcRouteLine()}),MapOperation.createMap(),$scope.edit=function(index){closeEditMode(index),$scope.buslineStations[index].editMode=!$scope.buslineStations[index].editMode},$scope.delete=function(index){$scope.buslineStations.splice(index,1),$sortable.sortable(),MapOperation.calcRouteLine()},$scope.save=function(){$scope.submit(!0)},$scope.submit=function(saveMode){for(var len=$scope.buslineStations.length,i=1;i<$scope.buslineStations.length;i++)if(0==$scope.buslineStations[i].drivingTime)return void layer.msg("用时不能为0分钟");if(len>1){for(var stations=[],i=0;i<len;i++){if("新建站点"==$scope.buslineStations[i].stationName)return void layer.msg("请命名站点名称");stations.push({stationid:$scope.buslineStations[i].stationId,lineid:$scope.buslineStations[i].lineid,stationname:$scope.buslineStations[i].stationName,stalongitude:$scope.buslineStations[i].lng,stalatitude:$scope.buslineStations[i].lat,drivingtime:$scope.buslineStations[i].drivingTime,serialno:i})}$scope.busline.stationnum=len,$scope.busline.departaddr=stations[0].stationname,$scope.busline.departlon=stations[0].stalongitude,$scope.busline.departlat=stations[0].stalatitude,$scope.busline.arriveaddr=stations[len-1].stationname,$scope.busline.arrivelon=stations[len-1].stalongitude,$scope.busline.arrivelat=stations[len-1].stalatitude;var data={busline:$scope.busline,stations:stations};if(angular.equals(data,saveDataOld))return void layer.msg("线路信息未经过修改");if($scope.editMode&&!saveMode)$myHttpService.post("api/busline/updateBuslineInfo.htm",{data:JSON.stringify(data)},function(){layer.msg("修改成功！",{offset:"100px"}),$state.go("app.route.list",{},{reload:!0})});else{if(void 0==$scope.busline.drivetime||void 0==$scope.busline.drivedistance)return void layer.alert("请输入运行时长和运行距离");$myHttpService.post("api/busline/insertBusline.htm",{data:JSON.stringify(data)},function(){layer.msg("添加成功！",{offset:"100px"}),$state.go("layout.route_add",{},{reload:!0})})}}else layer.alert("一条线路必须有一个起点和终点")}}),app.controller("RouteListController",function($rootScope,$scope,$http,$state,$localStorage,$stateParams,$filter,$tableListService,$myHttpService){var options={searchFormId:"J_search_form",listUrl:"api/busline/queryBuslineByKeyword.htm"};$scope.delete=function(item){layer.confirm("您确定要删除吗？",{icon:3,title:"提示"},function(){$myHttpService.post("api/busline/deleteBusline.htm",item,function(){layer.msg("删除成功！",{offset:"100px"}),$state.go("app.route.list",{},{reload:!0})})},function(index){layer.close(index)})},$tableListService.init($scope,options),$tableListService.get()}),app.controller("RouteCreateListController",function($rootScope,$scope,$http,$state,$localStorage,$stateParams,$filter,$tableListService,$myHttpService){var selected=!1;$scope.selectAll=function(){selected=!selected,angular.forEach($scope.pageResponse.buslines,function(item){item.selected=selected})};var options={searchFormId:"J_search_form",listUrl:"api/busline/queryApplyBuslinesByKeyword.htm"};$tableListService.init($scope,options),$tableListService.get()});