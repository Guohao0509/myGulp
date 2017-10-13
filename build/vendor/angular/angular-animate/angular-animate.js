!function(window,angular,undefined){"use strict";angular.module("ngAnimate",["ng"]).directive("ngAnimateChildren",function(){return function(scope,element,attrs){var val=attrs.ngAnimateChildren;angular.isString(val)&&0===val.length?element.data("$$ngAnimateChildren",!0):scope.$watch(val,function(value){element.data("$$ngAnimateChildren",!!value)})}}).factory("$$animateReflow",["$$rAF","$document",function($$rAF,$document){var bod=$document[0].body;return function(fn){return $$rAF(function(){bod.offsetWidth,fn()})}}]).config(["$provide","$animateProvider",function($provide,$animateProvider){function extractElementNode(element){for(var i=0;i<element.length;i++){var elm=element[i];if(elm.nodeType==ELEMENT_NODE)return elm}}function prepareElement(element){return element&&angular.element(element)}function stripCommentsFromElement(element){return angular.element(extractElementNode(element))}function isMatchingElement(elm1,elm2){return extractElementNode(elm1)==extractElementNode(elm2)}var noop=angular.noop,forEach=angular.forEach,selectors=$animateProvider.$$selectors,isArray=angular.isArray,isString=angular.isString,isObject=angular.isObject,ELEMENT_NODE=1,NG_ANIMATE_STATE="$$ngAnimateState",NG_ANIMATE_CHILDREN="$$ngAnimateChildren",NG_ANIMATE_CLASS_NAME="ng-animate",rootAnimateState={running:!0};$provide.decorator("$animate",["$delegate","$$q","$injector","$sniffer","$rootElement","$$asyncCallback","$rootScope","$document","$templateRequest",function($delegate,$$q,$injector,$sniffer,$rootElement,$$asyncCallback,$rootScope,$document,$templateRequest){function classBasedAnimationsBlocked(element,setter){var data=element.data(NG_ANIMATE_STATE)||{};return setter&&(data.running=!0,data.structural=!0,element.data(NG_ANIMATE_STATE,data)),data.disabled||data.running&&data.structural}function runAnimationPostDigest(fn){var cancelFn,defer=$$q.defer();return defer.promise.$$cancelFn=function(){cancelFn&&cancelFn()},$rootScope.$$postDigest(function(){cancelFn=fn(function(){defer.resolve()})}),defer.promise}function parseAnimateOptions(options){if(isObject(options))return options.tempClasses&&isString(options.tempClasses)&&(options.tempClasses=options.tempClasses.split(/\s+/)),options}function resolveElementClasses(element,cache,runningAnimations){var lookup={};forEach(runningAnimations=runningAnimations||{},function(data,selector){forEach(selector.split(" "),function(s){lookup[s]=data})});var hasClasses=Object.create(null);forEach((element.attr("class")||"").split(/\s+/),function(className){hasClasses[className]=!0});var toAdd=[],toRemove=[];return forEach(cache&&cache.classes||[],function(status,className){var hasClass=hasClasses[className],matchingAnimation=lookup[className]||{};!1===status?(hasClass||"addClass"==matchingAnimation.event)&&toRemove.push(className):!0===status&&(hasClass&&"removeClass"!=matchingAnimation.event||toAdd.push(className))}),toAdd.length+toRemove.length>0&&[toAdd.join(" "),toRemove.join(" ")]}function lookup(name){if(name){var matches=[],flagMap={},classes=name.substr(1).split(".");($sniffer.transitions||$sniffer.animations)&&matches.push($injector.get(selectors[""]));for(var i=0;i<classes.length;i++){var klass=classes[i],selectorFactoryName=selectors[klass];selectorFactoryName&&!flagMap[klass]&&(matches.push($injector.get(selectorFactoryName)),flagMap[klass]=!0)}return matches}}function animationRunner(element,animationEvent,className,options){function registerAnimation(animationFactory,event){var afterFn=animationFactory[event],beforeFn=animationFactory["before"+event.charAt(0).toUpperCase()+event.substr(1)];if(afterFn||beforeFn)return"leave"==event&&(beforeFn=afterFn,afterFn=null),after.push({event:event,fn:afterFn}),before.push({event:event,fn:beforeFn}),!0}function run(fns,cancellations,allCompleteFn){function afterAnimationComplete(index){if(cancellations){if((cancellations[index]||noop)(),++count<animations.length)return;cancellations=null}allCompleteFn()}var animations=[];forEach(fns,function(animation){animation.fn&&animations.push(animation)});var count=0;forEach(animations,function(animation,index){var progress=function(){afterAnimationComplete(index)};switch(animation.event){case"setClass":cancellations.push(animation.fn(element,classNameAdd,classNameRemove,progress,options));break;case"animate":cancellations.push(animation.fn(element,className,options.from,options.to,progress));break;case"addClass":cancellations.push(animation.fn(element,classNameAdd||className,progress,options));break;case"removeClass":cancellations.push(animation.fn(element,classNameRemove||className,progress,options));break;default:cancellations.push(animation.fn(element,progress,options))}}),cancellations&&0===cancellations.length&&allCompleteFn()}var node=element[0];if(node){options&&(options.to=options.to||{},options.from=options.from||{});var classNameAdd,classNameRemove;isArray(className)&&(classNameAdd=className[0],classNameRemove=className[1],classNameAdd?classNameRemove?className=classNameAdd+" "+classNameRemove:(className=classNameAdd,animationEvent="addClass"):(className=classNameRemove,animationEvent="removeClass"));var isSetClassOperation="setClass"==animationEvent,isClassBased=isSetClassOperation||"addClass"==animationEvent||"removeClass"==animationEvent||"animate"==animationEvent,classes=element.attr("class")+" "+className;if(isAnimatableClassName(classes)){var beforeComplete=noop,beforeCancel=[],before=[],afterComplete=noop,afterCancel=[],after=[],animationLookup=(" "+classes).replace(/\s+/g,".");return forEach(lookup(animationLookup),function(animationFactory){!registerAnimation(animationFactory,animationEvent)&&isSetClassOperation&&(registerAnimation(animationFactory,"addClass"),registerAnimation(animationFactory,"removeClass"))}),{node:node,event:animationEvent,className:className,isClassBased:isClassBased,isSetClassOperation:isSetClassOperation,applyStyles:function(){options&&element.css(angular.extend(options.from||{},options.to||{}))},before:function(allCompleteFn){beforeComplete=allCompleteFn,run(before,beforeCancel,function(){beforeComplete=noop,allCompleteFn()})},after:function(allCompleteFn){afterComplete=allCompleteFn,run(after,afterCancel,function(){afterComplete=noop,allCompleteFn()})},cancel:function(){beforeCancel&&(forEach(beforeCancel,function(cancelFn){(cancelFn||noop)(!0)}),beforeComplete(!0)),afterCancel&&(forEach(afterCancel,function(cancelFn){(cancelFn||noop)(!0)}),afterComplete(!0))}}}}}function performAnimation(animationEvent,className,element,parentElement,afterElement,domOperation,options,doneCallback){function fireDOMCallback(animationPhase){var eventName="$animate:"+animationPhase;elementEvents&&elementEvents[eventName]&&elementEvents[eventName].length>0&&$$asyncCallback(function(){element.triggerHandler(eventName,{event:animationEvent,className:className})})}function fireBeforeCallbackAsync(){fireDOMCallback("before")}function fireAfterCallbackAsync(){fireDOMCallback("after")}function fireDoneCallbackAsync(){fireDOMCallback("close"),doneCallback()}function fireDOMOperation(){fireDOMOperation.hasBeenRun||(fireDOMOperation.hasBeenRun=!0,domOperation())}function closeAnimation(){if(!closeAnimation.hasBeenRun){runner&&runner.applyStyles(),closeAnimation.hasBeenRun=!0,options&&options.tempClasses&&forEach(options.tempClasses,function(className){element.removeClass(className)});var data=element.data(NG_ANIMATE_STATE);data&&(runner&&runner.isClassBased?cleanup(element,className):($$asyncCallback(function(){var data=element.data(NG_ANIMATE_STATE)||{};localAnimationCount==data.index&&cleanup(element,className)}),element.data(NG_ANIMATE_STATE,data))),fireDoneCallbackAsync()}}var noopCancel=noop,runner=animationRunner(element,animationEvent,className,options);if(!runner)return fireDOMOperation(),fireBeforeCallbackAsync(),fireAfterCallbackAsync(),closeAnimation(),noopCancel;animationEvent=runner.event,className=runner.className;var elementEvents=angular.element._data(runner.node);if(elementEvents=elementEvents&&elementEvents.events,parentElement||(parentElement=afterElement?afterElement.parent():element.parent()),animationsDisabled(element,parentElement))return fireDOMOperation(),fireBeforeCallbackAsync(),fireAfterCallbackAsync(),closeAnimation(),noopCancel;var ngAnimateState=element.data(NG_ANIMATE_STATE)||{},runningAnimations=ngAnimateState.active||{},totalActiveAnimations=ngAnimateState.totalActive||0,lastAnimation=ngAnimateState.last,skipAnimation=!1;if(totalActiveAnimations>0){var animationsToCancel=[];if(runner.isClassBased){if("setClass"==lastAnimation.event)animationsToCancel.push(lastAnimation),cleanup(element,className);else if(runningAnimations[className]){var current=runningAnimations[className];current.event==animationEvent?skipAnimation=!0:(animationsToCancel.push(current),cleanup(element,className))}}else if("leave"==animationEvent&&runningAnimations["ng-leave"])skipAnimation=!0;else{for(var klass in runningAnimations)animationsToCancel.push(runningAnimations[klass]);ngAnimateState={},cleanup(element,!0)}animationsToCancel.length>0&&forEach(animationsToCancel,function(operation){operation.cancel()})}if(!runner.isClassBased||runner.isSetClassOperation||"animate"==animationEvent||skipAnimation||(skipAnimation="addClass"==animationEvent==element.hasClass(className)),skipAnimation)return fireDOMOperation(),fireBeforeCallbackAsync(),fireAfterCallbackAsync(),fireDoneCallbackAsync(),noopCancel;runningAnimations=ngAnimateState.active||{},totalActiveAnimations=ngAnimateState.totalActive||0,"leave"==animationEvent&&element.one("$destroy",function(e){var element=angular.element(this),state=element.data(NG_ANIMATE_STATE);if(state){var activeLeaveAnimation=state.active["ng-leave"];activeLeaveAnimation&&(activeLeaveAnimation.cancel(),cleanup(element,"ng-leave"))}}),element.addClass(NG_ANIMATE_CLASS_NAME),options&&options.tempClasses&&forEach(options.tempClasses,function(className){element.addClass(className)});var localAnimationCount=globalAnimationCounter++;return totalActiveAnimations++,runningAnimations[className]=runner,element.data(NG_ANIMATE_STATE,{last:runner,active:runningAnimations,index:localAnimationCount,totalActive:totalActiveAnimations}),fireBeforeCallbackAsync(),runner.before(function(cancelled){var data=element.data(NG_ANIMATE_STATE);cancelled=cancelled||!data||!data.active[className]||runner.isClassBased&&data.active[className].event!=animationEvent,fireDOMOperation(),!0===cancelled?closeAnimation():(fireAfterCallbackAsync(),runner.after(closeAnimation))}),runner.cancel}function cancelChildAnimations(element){var node=extractElementNode(element);if(node){var nodes=angular.isFunction(node.getElementsByClassName)?node.getElementsByClassName(NG_ANIMATE_CLASS_NAME):node.querySelectorAll("."+NG_ANIMATE_CLASS_NAME);forEach(nodes,function(element){var data=(element=angular.element(element)).data(NG_ANIMATE_STATE);data&&data.active&&forEach(data.active,function(runner){runner.cancel()})})}}function cleanup(element,className){if(isMatchingElement(element,$rootElement))rootAnimateState.disabled||(rootAnimateState.running=!1,rootAnimateState.structural=!1);else if(className){var data=element.data(NG_ANIMATE_STATE)||{},removeAnimations=!0===className;!removeAnimations&&data.active&&data.active[className]&&(data.totalActive--,delete data.active[className]),!removeAnimations&&data.totalActive||(element.removeClass(NG_ANIMATE_CLASS_NAME),element.removeData(NG_ANIMATE_STATE))}}function animationsDisabled(element,parentElement){if(rootAnimateState.disabled)return!0;if(isMatchingElement(element,$rootElement))return rootAnimateState.running;var allowChildAnimations,parentRunningAnimation,hasParent;do{if(0===parentElement.length)break;var isRoot=isMatchingElement(parentElement,$rootElement),state=isRoot?rootAnimateState:parentElement.data(NG_ANIMATE_STATE)||{};if(state.disabled)return!0;if(isRoot&&(hasParent=!0),!1!==allowChildAnimations){var animateChildrenFlag=parentElement.data(NG_ANIMATE_CHILDREN);angular.isDefined(animateChildrenFlag)&&(allowChildAnimations=animateChildrenFlag)}parentRunningAnimation=parentRunningAnimation||state.running||state.last&&!state.last.isClassBased}while(parentElement=parentElement.parent());return!hasParent||!allowChildAnimations&&parentRunningAnimation}$rootElement.data(NG_ANIMATE_STATE,rootAnimateState);var deregisterWatch=$rootScope.$watch(function(){return $templateRequest.totalPendingRequests},function(val,oldVal){0===val&&(deregisterWatch(),$rootScope.$$postDigest(function(){$rootScope.$$postDigest(function(){rootAnimateState.running=!1})}))}),globalAnimationCounter=0,classNameFilter=$animateProvider.classNameFilter(),isAnimatableClassName=classNameFilter?function(className){return classNameFilter.test(className)}:function(){return!0};return{animate:function(element,from,to,className,options){return className=className||"ng-inline-animate",options=parseAnimateOptions(options)||{},options.from=to?from:null,options.to=to||from,runAnimationPostDigest(function(done){return performAnimation("animate",className,stripCommentsFromElement(element),null,null,noop,options,done)})},enter:function(element,parentElement,afterElement,options){return options=parseAnimateOptions(options),element=angular.element(element),parentElement=prepareElement(parentElement),afterElement=prepareElement(afterElement),classBasedAnimationsBlocked(element,!0),$delegate.enter(element,parentElement,afterElement),runAnimationPostDigest(function(done){return performAnimation("enter","ng-enter",stripCommentsFromElement(element),parentElement,afterElement,noop,options,done)})},leave:function(element,options){return options=parseAnimateOptions(options),element=angular.element(element),cancelChildAnimations(element),classBasedAnimationsBlocked(element,!0),runAnimationPostDigest(function(done){return performAnimation("leave","ng-leave",stripCommentsFromElement(element),null,null,function(){$delegate.leave(element)},options,done)})},move:function(element,parentElement,afterElement,options){return options=parseAnimateOptions(options),element=angular.element(element),parentElement=prepareElement(parentElement),afterElement=prepareElement(afterElement),cancelChildAnimations(element),classBasedAnimationsBlocked(element,!0),$delegate.move(element,parentElement,afterElement),runAnimationPostDigest(function(done){return performAnimation("move","ng-move",stripCommentsFromElement(element),parentElement,afterElement,noop,options,done)})},addClass:function(element,className,options){return this.setClass(element,className,[],options)},removeClass:function(element,className,options){return this.setClass(element,[],className,options)},setClass:function(element,add,remove,options){if(options=parseAnimateOptions(options),element=angular.element(element),element=stripCommentsFromElement(element),classBasedAnimationsBlocked(element))return $delegate.$$setClassImmediately(element,add,remove,options);var classes,cache=element.data("$$animateClasses"),hasCache=!!cache;return cache||((cache={}).classes={}),classes=cache.classes,add=isArray(add)?add:add.split(" "),forEach(add,function(c){c&&c.length&&(classes[c]=!0)}),remove=isArray(remove)?remove:remove.split(" "),forEach(remove,function(c){c&&c.length&&(classes[c]=!1)}),hasCache?(options&&cache.options&&(cache.options=angular.extend(cache.options||{},options)),cache.promise):(element.data("$$animateClasses",cache={classes:classes,options:options}),cache.promise=runAnimationPostDigest(function(done){var parentElement=element.parent(),elementNode=extractElementNode(element),parentNode=elementNode.parentNode;if(parentNode&&!parentNode.$$NG_REMOVED&&!elementNode.$$NG_REMOVED){var cache=element.data("$$animateClasses");element.removeData("$$animateClasses");var state=element.data(NG_ANIMATE_STATE)||{},classes=resolveElementClasses(element,cache,state.active);return classes?performAnimation("setClass",classes,element,parentElement,null,function(){classes[0]&&$delegate.$$addClassImmediately(element,classes[0]),classes[1]&&$delegate.$$removeClassImmediately(element,classes[1])},cache.options,done):done()}done()}))},cancel:function(promise){promise.$$cancelFn()},enabled:function(value,element){switch(arguments.length){case 2:if(value)cleanup(element);else{var data=element.data(NG_ANIMATE_STATE)||{};data.disabled=!0,element.data(NG_ANIMATE_STATE,data)}break;case 1:rootAnimateState.disabled=!value;break;default:value=!rootAnimateState.disabled}return!!value}}}]),$animateProvider.register("",["$window","$sniffer","$timeout","$$animateReflow",function($window,$sniffer,$timeout,$$animateReflow){function clearCacheAfterReflow(){cancelAnimationReflow||(cancelAnimationReflow=$$animateReflow(function(){animationReflowQueue=[],cancelAnimationReflow=null,lookupCache={}}))}function afterReflow(element,callback){cancelAnimationReflow&&cancelAnimationReflow(),animationReflowQueue.push(callback),cancelAnimationReflow=$$animateReflow(function(){forEach(animationReflowQueue,function(fn){fn()}),animationReflowQueue=[],cancelAnimationReflow=null,lookupCache={}})}function animationCloseHandler(element,totalTime){var node=extractElementNode(element);element=angular.element(node),animationElementQueue.push(element);var futureTimestamp=Date.now()+totalTime;futureTimestamp<=closingTimestamp||($timeout.cancel(closingTimer),closingTimestamp=futureTimestamp,closingTimer=$timeout(function(){closeAllAnimations(animationElementQueue),animationElementQueue=[]},totalTime,!1))}function closeAllAnimations(elements){forEach(elements,function(element){var elementData=element.data(NG_ANIMATE_CSS_DATA_KEY);elementData&&forEach(elementData.closeAnimationFns,function(fn){fn()})})}function getElementAnimationDetails(element,cacheKey){var data=cacheKey?lookupCache[cacheKey]:null;if(!data){var transitionDuration=0,transitionDelay=0,animationDuration=0,animationDelay=0;forEach(element,function(element){if(element.nodeType==ELEMENT_NODE){var elementStyles=$window.getComputedStyle(element)||{},transitionDurationStyle=elementStyles[TRANSITION_PROP+DURATION_KEY];transitionDuration=Math.max(parseMaxTime(transitionDurationStyle),transitionDuration);var transitionDelayStyle=elementStyles[TRANSITION_PROP+DELAY_KEY];transitionDelay=Math.max(parseMaxTime(transitionDelayStyle),transitionDelay),animationDelay=Math.max(parseMaxTime(elementStyles[ANIMATION_PROP+DELAY_KEY]),animationDelay);var aDuration=parseMaxTime(elementStyles[ANIMATION_PROP+DURATION_KEY]);aDuration>0&&(aDuration*=parseInt(elementStyles[ANIMATION_PROP+ANIMATION_ITERATION_COUNT_KEY],10)||1),animationDuration=Math.max(aDuration,animationDuration)}}),data={total:0,transitionDelay:transitionDelay,transitionDuration:transitionDuration,animationDelay:animationDelay,animationDuration:animationDuration},cacheKey&&(lookupCache[cacheKey]=data)}return data}function parseMaxTime(str){var maxValue=0,values=isString(str)?str.split(/\s*,\s*/):[];return forEach(values,function(value){maxValue=Math.max(parseFloat(value)||0,maxValue)}),maxValue}function getCacheKey(element){var parentElement=element.parent(),parentID=parentElement.data(NG_ANIMATE_PARENT_KEY);return parentID||(parentElement.data(NG_ANIMATE_PARENT_KEY,++parentCounter),parentID=parentCounter),parentID+"-"+extractElementNode(element).getAttribute("class")}function animateSetup(animationEvent,element,className,styles){var structural=["ng-enter","ng-leave","ng-move"].indexOf(className)>=0,cacheKey=getCacheKey(element),eventCacheKey=cacheKey+" "+className,itemIndex=lookupCache[eventCacheKey]?++lookupCache[eventCacheKey].total:0,stagger={};if(itemIndex>0){var staggerClassName=className+"-stagger",staggerCacheKey=cacheKey+" "+staggerClassName,applyClasses=!lookupCache[staggerCacheKey];applyClasses&&element.addClass(staggerClassName),stagger=getElementAnimationDetails(element,staggerCacheKey),applyClasses&&element.removeClass(staggerClassName)}element.addClass(className);var formerData=element.data(NG_ANIMATE_CSS_DATA_KEY)||{},timings=getElementAnimationDetails(element,eventCacheKey),transitionDuration=timings.transitionDuration,animationDuration=timings.animationDuration;if(structural&&0===transitionDuration&&0===animationDuration)return element.removeClass(className),!1;var blockTransition=styles||structural&&transitionDuration>0,blockAnimation=animationDuration>0&&stagger.animationDelay>0&&0===stagger.animationDuration,closeAnimationFns=formerData.closeAnimationFns||[];element.data(NG_ANIMATE_CSS_DATA_KEY,{stagger:stagger,cacheKey:eventCacheKey,running:formerData.running||0,itemIndex:itemIndex,blockTransition:blockTransition,closeAnimationFns:closeAnimationFns});var node=extractElementNode(element);return blockTransition&&(blockTransitions(node,!0),styles&&element.css(styles)),blockAnimation&&blockAnimations(node,!0),!0}function animateRun(animationEvent,element,className,activeAnimationComplete,styles){function onEnd(){element.off(css3AnimationEvents,onAnimationProgress),element.removeClass(activeClassName),element.removeClass(pendingClassName),staggerTimeout&&$timeout.cancel(staggerTimeout),animateClose(element,className);var node=extractElementNode(element);for(var i in appliedStyles)node.style.removeProperty(appliedStyles[i])}function onAnimationProgress(event){event.stopPropagation();var ev=event.originalEvent||event,timeStamp=ev.$manualTimeStamp||ev.timeStamp||Date.now(),elapsedTime=parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));Math.max(timeStamp-startTime,0)>=maxDelayTime&&elapsedTime>=maxDuration&&activeAnimationComplete()}var node=extractElementNode(element),elementData=element.data(NG_ANIMATE_CSS_DATA_KEY);if(-1!=node.getAttribute("class").indexOf(className)&&elementData){var activeClassName="",pendingClassName="";forEach(className.split(" "),function(klass,i){var prefix=(i>0?" ":"")+klass;activeClassName+=prefix+"-active",pendingClassName+=prefix+"-pending"});var appliedStyles=[],itemIndex=elementData.itemIndex,stagger=elementData.stagger,staggerTime=0;if(itemIndex>0){var transitionStaggerDelay=0;stagger.transitionDelay>0&&0===stagger.transitionDuration&&(transitionStaggerDelay=stagger.transitionDelay*itemIndex);var animationStaggerDelay=0;stagger.animationDelay>0&&0===stagger.animationDuration&&(animationStaggerDelay=stagger.animationDelay*itemIndex,appliedStyles.push(CSS_PREFIX+"animation-play-state")),staggerTime=Math.round(100*Math.max(transitionStaggerDelay,animationStaggerDelay))/100}staggerTime||(element.addClass(activeClassName),elementData.blockTransition&&blockTransitions(node,!1));var eventCacheKey=elementData.cacheKey+" "+activeClassName,timings=getElementAnimationDetails(element,eventCacheKey),maxDuration=Math.max(timings.transitionDuration,timings.animationDuration);if(0===maxDuration)return element.removeClass(activeClassName),animateClose(element,className),void activeAnimationComplete();!staggerTime&&styles&&(timings.transitionDuration||(element.css("transition",timings.animationDuration+"s linear all"),appliedStyles.push("transition")),element.css(styles));var maxDelay=Math.max(timings.transitionDelay,timings.animationDelay),maxDelayTime=maxDelay*ONE_SECOND;if(appliedStyles.length>0){var oldStyle=node.getAttribute("style")||"";";"!==oldStyle.charAt(oldStyle.length-1)&&(oldStyle+=";"),node.setAttribute("style",oldStyle+" ")}var staggerTimeout,startTime=Date.now(),css3AnimationEvents=ANIMATIONEND_EVENT+" "+TRANSITIONEND_EVENT,totalTime=(staggerTime+(maxDelay+maxDuration)*CLOSING_TIME_BUFFER)*ONE_SECOND;return staggerTime>0&&(element.addClass(pendingClassName),staggerTimeout=$timeout(function(){staggerTimeout=null,timings.transitionDuration>0&&blockTransitions(node,!1),timings.animationDuration>0&&blockAnimations(node,!1),element.addClass(activeClassName),element.removeClass(pendingClassName),styles&&(0===timings.transitionDuration&&element.css("transition",timings.animationDuration+"s linear all"),element.css(styles),appliedStyles.push("transition"))},staggerTime*ONE_SECOND,!1)),element.on(css3AnimationEvents,onAnimationProgress),elementData.closeAnimationFns.push(function(){onEnd(),activeAnimationComplete()}),elementData.running++,animationCloseHandler(element,totalTime),onEnd}activeAnimationComplete()}function blockTransitions(node,bool){node.style[TRANSITION_PROP+PROPERTY_KEY]=bool?"none":""}function blockAnimations(node,bool){node.style[ANIMATION_PROP+ANIMATION_PLAYSTATE_KEY]=bool?"paused":""}function animateBefore(animationEvent,element,className,styles){if(animateSetup(animationEvent,element,className,styles))return function(cancelled){cancelled&&animateClose(element,className)}}function animateAfter(animationEvent,element,className,afterAnimationComplete,styles){if(element.data(NG_ANIMATE_CSS_DATA_KEY))return animateRun(animationEvent,element,className,afterAnimationComplete,styles);animateClose(element,className),afterAnimationComplete()}function animate(animationEvent,element,className,animationComplete,options){var preReflowCancellation=animateBefore(animationEvent,element,className,options.from);if(!preReflowCancellation)return clearCacheAfterReflow(),void animationComplete();var cancel=preReflowCancellation;return afterReflow(element,function(){cancel=animateAfter(animationEvent,element,className,animationComplete,options.to)}),function(cancelled){(cancel||noop)(cancelled)}}function animateClose(element,className){element.removeClass(className);var data=element.data(NG_ANIMATE_CSS_DATA_KEY);data&&(data.running&&data.running--,data.running&&0!==data.running||element.removeData(NG_ANIMATE_CSS_DATA_KEY))}function suffixClasses(classes,suffix){var className="";return classes=isArray(classes)?classes:classes.split(/\s+/),forEach(classes,function(klass,i){klass&&klass.length>0&&(className+=(i>0?" ":"")+klass+suffix)}),className}var TRANSITION_PROP,TRANSITIONEND_EVENT,ANIMATION_PROP,ANIMATIONEND_EVENT,CSS_PREFIX="";void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend?(CSS_PREFIX="-webkit-",TRANSITION_PROP="WebkitTransition",TRANSITIONEND_EVENT="webkitTransitionEnd transitionend"):(TRANSITION_PROP="transition",TRANSITIONEND_EVENT="transitionend"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend?(CSS_PREFIX="-webkit-",ANIMATION_PROP="WebkitAnimation",ANIMATIONEND_EVENT="webkitAnimationEnd animationend"):(ANIMATION_PROP="animation",ANIMATIONEND_EVENT="animationend");var cancelAnimationReflow,DURATION_KEY="Duration",PROPERTY_KEY="Property",DELAY_KEY="Delay",ANIMATION_ITERATION_COUNT_KEY="IterationCount",ANIMATION_PLAYSTATE_KEY="PlayState",NG_ANIMATE_PARENT_KEY="$$ngAnimateKey",NG_ANIMATE_CSS_DATA_KEY="$$ngAnimateCSS3Data",ELAPSED_TIME_MAX_DECIMAL_PLACES=3,CLOSING_TIME_BUFFER=1.5,ONE_SECOND=1e3,lookupCache={},parentCounter=0,animationReflowQueue=[],closingTimer=null,closingTimestamp=0,animationElementQueue=[];return{animate:function(element,className,from,to,animationCompleted,options){return options=options||{},options.from=from,options.to=to,animate("animate",element,className,animationCompleted,options)},enter:function(element,animationCompleted,options){return options=options||{},animate("enter",element,"ng-enter",animationCompleted,options)},leave:function(element,animationCompleted,options){return options=options||{},animate("leave",element,"ng-leave",animationCompleted,options)},move:function(element,animationCompleted,options){return options=options||{},animate("move",element,"ng-move",animationCompleted,options)},beforeSetClass:function(element,add,remove,animationCompleted,options){options=options||{};var cancellationMethod=animateBefore("setClass",element,suffixClasses(remove,"-remove")+" "+suffixClasses(add,"-add"),options.from);if(cancellationMethod)return afterReflow(element,animationCompleted),cancellationMethod;clearCacheAfterReflow(),animationCompleted()},beforeAddClass:function(element,className,animationCompleted,options){options=options||{};var cancellationMethod=animateBefore("addClass",element,suffixClasses(className,"-add"),options.from);if(cancellationMethod)return afterReflow(element,animationCompleted),cancellationMethod;clearCacheAfterReflow(),animationCompleted()},beforeRemoveClass:function(element,className,animationCompleted,options){options=options||{};var cancellationMethod=animateBefore("removeClass",element,suffixClasses(className,"-remove"),options.from);if(cancellationMethod)return afterReflow(element,animationCompleted),cancellationMethod;clearCacheAfterReflow(),animationCompleted()},setClass:function(element,add,remove,animationCompleted,options){return options=options||{},animateAfter("setClass",element,(remove=suffixClasses(remove,"-remove"))+" "+(add=suffixClasses(add,"-add")),animationCompleted,options.to)},addClass:function(element,className,animationCompleted,options){return options=options||{},animateAfter("addClass",element,suffixClasses(className,"-add"),animationCompleted,options.to)},removeClass:function(element,className,animationCompleted,options){return options=options||{},animateAfter("removeClass",element,suffixClasses(className,"-remove"),animationCompleted,options.to)}}}])}])}(window,window.angular);