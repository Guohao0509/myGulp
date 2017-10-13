!function($){var options={series:{bars:{order:null}}};jQuery.plot.plugins.push({init:function(plot){function serieNeedToBeReordered(serie){return null!=serie.bars&&serie.bars.show&&null!=serie.bars.order}function calculPixel2XWidthConvert(plot){var gridDimSize=isHorizontal?plot.getPlaceholder().innerHeight():plot.getPlaceholder().innerWidth(),minMaxValues=isHorizontal?getAxeMinMaxValues(plot.getData(),1):getAxeMinMaxValues(plot.getData(),0),AxeSize=minMaxValues[1]-minMaxValues[0];pixelInXWidthEquivalent=AxeSize/gridDimSize}function getAxeMinMaxValues(series,AxeIdx){for(var minMaxValues=new Array,i=0;i<series.length;i++)minMaxValues[0]=series[i].data[0][AxeIdx],minMaxValues[1]=series[i].data[series[i].data.length-1][AxeIdx];return minMaxValues}function retrieveBarSeries(plot){orderedBarSeries=findOthersBarsToReOrders(plot.getData()),nbOfBarsToOrder=orderedBarSeries.length}function findOthersBarsToReOrders(series){for(var retSeries=new Array,i=0;i<series.length;i++)null!=series[i].bars.order&&series[i].bars.show&&retSeries.push(series[i]);return retSeries.sort(sortByOrder)}function sortByOrder(serie1,serie2){var x=serie1.bars.order,y=serie2.bars.order;return x<y?-1:x>y?1:0}function calculBorderAndBarWidth(serie){borderWidth=serie.bars.lineWidth?serie.bars.lineWidth:2,borderWidthInXabsWidth=borderWidth*pixelInXWidthEquivalent}function checkIfGraphIsHorizontal(serie){serie.bars.horizontal&&(isHorizontal=!0)}function findPosition(serie){for(var pos=0,i=0;i<orderedBarSeries.length;++i)if(serie==orderedBarSeries[i]){pos=i;break}return pos+1}function calculCenterBarShift(){var width=0;return nbOfBarsToOrder%2!=0&&(width=orderedBarSeries[Math.ceil(nbOfBarsToOrder/2)].bars.barWidth/2),width}function isBarAtLeftOfCenter(position){return position<=Math.ceil(nbOfBarsToOrder/2)}function sumWidth(series,start,end){for(var totalWidth=0,i=start;i<=end;i++)totalWidth+=series[i].bars.barWidth+2*borderWidthInXabsWidth;return totalWidth}function shiftPoints(datapoints,serie,dx){for(var ps=datapoints.pointsize,points=datapoints.points,j=0,i=isHorizontal?1:0;i<points.length;i+=ps)points[i]+=dx,serie.data[j][3]=points[i],j++;return points}var orderedBarSeries,nbOfBarsToOrder,borderWidth,borderWidthInXabsWidth,pixelInXWidthEquivalent=1,isHorizontal=!1;plot.hooks.processDatapoints.push(function(plot,serie,datapoints){var shiftedPoints=null;if(serieNeedToBeReordered(serie)&&(checkIfGraphIsHorizontal(serie),calculPixel2XWidthConvert(plot),retrieveBarSeries(plot),calculBorderAndBarWidth(serie),nbOfBarsToOrder>=2)){var position=findPosition(serie),centerBarShift=calculCenterBarShift();shiftedPoints=shiftPoints(datapoints,serie,isBarAtLeftOfCenter(position)?-1*sumWidth(orderedBarSeries,position-1,Math.floor(nbOfBarsToOrder/2)-1)-centerBarShift:sumWidth(orderedBarSeries,Math.ceil(nbOfBarsToOrder/2),position-2)+centerBarShift+2*borderWidthInXabsWidth),datapoints.points=shiftedPoints}return shiftedPoints})},options:options,name:"orderBars",version:"0.2"})}();