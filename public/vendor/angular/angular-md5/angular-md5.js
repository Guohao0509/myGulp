"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports="angular-md5"),function(angular){angular.module("angular-md5",["gdi2290.md5"]),angular.module("ngMd5",["gdi2290.md5"]),angular.module("gdi2290.md5",["gdi2290.gravatar-filter","gdi2290.md5-service","gdi2290.md5-filter"]),angular.module("gdi2290.gravatar-filter",[]).filter("gravatar",["md5",function(md5){var cache={};return function(text,defaultText){return cache[text]||(defaultText=defaultText?md5.createHash(defaultText.toString().toLowerCase()):"",cache[text]=text?md5.createHash(text.toString().toLowerCase()):defaultText),cache[text]}}]),angular.module("gdi2290.md5-filter",[]).filter("md5",["md5",function(md5){return function(text){return text?md5.createHash(text.toString().toLowerCase()):text}}]),angular.module("gdi2290.md5-service",[]).factory("md5",[function(){return{createHash:function(str){if(null===str)return null;var xl,k,AA,BB,CC,DD,a,b,c,d,rotateLeft=function(lValue,iShiftBits){return lValue<<iShiftBits|lValue>>>32-iShiftBits},addUnsigned=function(lX,lY){var lX4,lY4,lX8,lY8,lResult;return lX8=2147483648&lX,lY8=2147483648&lY,lX4=1073741824&lX,lY4=1073741824&lY,lResult=(1073741823&lX)+(1073741823&lY),lX4&lY4?2147483648^lResult^lX8^lY8:lX4|lY4?1073741824&lResult?3221225472^lResult^lX8^lY8:1073741824^lResult^lX8^lY8:lResult^lX8^lY8},_F=function(x,y,z){return x&y|~x&z},_G=function(x,y,z){return x&z|y&~z},_H=function(x,y,z){return x^y^z},_I=function(x,y,z){return y^(x|~z)},_FF=function(a,b,c,d,x,s,ac){return a=addUnsigned(a,addUnsigned(addUnsigned(_F(b,c,d),x),ac)),addUnsigned(rotateLeft(a,s),b)},_GG=function(a,b,c,d,x,s,ac){return a=addUnsigned(a,addUnsigned(addUnsigned(_G(b,c,d),x),ac)),addUnsigned(rotateLeft(a,s),b)},_HH=function(a,b,c,d,x,s,ac){return a=addUnsigned(a,addUnsigned(addUnsigned(_H(b,c,d),x),ac)),addUnsigned(rotateLeft(a,s),b)},_II=function(a,b,c,d,x,s,ac){return a=addUnsigned(a,addUnsigned(addUnsigned(_I(b,c,d),x),ac)),addUnsigned(rotateLeft(a,s),b)},wordToHex=function(lValue){var lCount,wordToHexValue="",wordToHexValue_temp="";for(lCount=0;lCount<=3;lCount++)wordToHexValue+=(wordToHexValue_temp="0"+(lValue>>>8*lCount&255).toString(16)).substr(wordToHexValue_temp.length-2,2);return wordToHexValue},x=[];for(a=1732584193,b=4023233417,c=2562383102,d=271733878,xl=(x=function(str){for(var lWordCount,lMessageLength=str.length,lNumberOfWords_temp1=lMessageLength+8,lNumberOfWords=16*((lNumberOfWords_temp1-lNumberOfWords_temp1%64)/64+1),lWordArray=new Array(lNumberOfWords-1),lBytePosition=0,lByteCount=0;lByteCount<lMessageLength;)lBytePosition=lByteCount%4*8,lWordArray[lWordCount=(lByteCount-lByteCount%4)/4]=lWordArray[lWordCount]|str.charCodeAt(lByteCount)<<lBytePosition,lByteCount++;return lWordCount=(lByteCount-lByteCount%4)/4,lBytePosition=lByteCount%4*8,lWordArray[lWordCount]=lWordArray[lWordCount]|128<<lBytePosition,lWordArray[lNumberOfWords-2]=lMessageLength<<3,lWordArray[lNumberOfWords-1]=lMessageLength>>>29,lWordArray}(str)).length,k=0;k<xl;k+=16)AA=a,BB=b,CC=c,DD=d,b=_II(b=_II(b=_II(b=_II(b=_HH(b=_HH(b=_HH(b=_HH(b=_GG(b=_GG(b=_GG(b=_GG(b=_FF(b=_FF(b=_FF(b=_FF(b,c=_FF(c,d=_FF(d,a=_FF(a,b,c,d,x[k+0],7,3614090360),b,c,x[k+1],12,3905402710),a,b,x[k+2],17,606105819),d,a,x[k+3],22,3250441966),c=_FF(c,d=_FF(d,a=_FF(a,b,c,d,x[k+4],7,4118548399),b,c,x[k+5],12,1200080426),a,b,x[k+6],17,2821735955),d,a,x[k+7],22,4249261313),c=_FF(c,d=_FF(d,a=_FF(a,b,c,d,x[k+8],7,1770035416),b,c,x[k+9],12,2336552879),a,b,x[k+10],17,4294925233),d,a,x[k+11],22,2304563134),c=_FF(c,d=_FF(d,a=_FF(a,b,c,d,x[k+12],7,1804603682),b,c,x[k+13],12,4254626195),a,b,x[k+14],17,2792965006),d,a,x[k+15],22,1236535329),c=_GG(c,d=_GG(d,a=_GG(a,b,c,d,x[k+1],5,4129170786),b,c,x[k+6],9,3225465664),a,b,x[k+11],14,643717713),d,a,x[k+0],20,3921069994),c=_GG(c,d=_GG(d,a=_GG(a,b,c,d,x[k+5],5,3593408605),b,c,x[k+10],9,38016083),a,b,x[k+15],14,3634488961),d,a,x[k+4],20,3889429448),c=_GG(c,d=_GG(d,a=_GG(a,b,c,d,x[k+9],5,568446438),b,c,x[k+14],9,3275163606),a,b,x[k+3],14,4107603335),d,a,x[k+8],20,1163531501),c=_GG(c,d=_GG(d,a=_GG(a,b,c,d,x[k+13],5,2850285829),b,c,x[k+2],9,4243563512),a,b,x[k+7],14,1735328473),d,a,x[k+12],20,2368359562),c=_HH(c,d=_HH(d,a=_HH(a,b,c,d,x[k+5],4,4294588738),b,c,x[k+8],11,2272392833),a,b,x[k+11],16,1839030562),d,a,x[k+14],23,4259657740),c=_HH(c,d=_HH(d,a=_HH(a,b,c,d,x[k+1],4,2763975236),b,c,x[k+4],11,1272893353),a,b,x[k+7],16,4139469664),d,a,x[k+10],23,3200236656),c=_HH(c,d=_HH(d,a=_HH(a,b,c,d,x[k+13],4,681279174),b,c,x[k+0],11,3936430074),a,b,x[k+3],16,3572445317),d,a,x[k+6],23,76029189),c=_HH(c,d=_HH(d,a=_HH(a,b,c,d,x[k+9],4,3654602809),b,c,x[k+12],11,3873151461),a,b,x[k+15],16,530742520),d,a,x[k+2],23,3299628645),c=_II(c,d=_II(d,a=_II(a,b,c,d,x[k+0],6,4096336452),b,c,x[k+7],10,1126891415),a,b,x[k+14],15,2878612391),d,a,x[k+5],21,4237533241),c=_II(c,d=_II(d,a=_II(a,b,c,d,x[k+12],6,1700485571),b,c,x[k+3],10,2399980690),a,b,x[k+10],15,4293915773),d,a,x[k+1],21,2240044497),c=_II(c,d=_II(d,a=_II(a,b,c,d,x[k+8],6,1873313359),b,c,x[k+15],10,4264355552),a,b,x[k+6],15,2734768916),d,a,x[k+13],21,1309151649),c=_II(c,d=_II(d,a=_II(a,b,c,d,x[k+4],6,4149444226),b,c,x[k+11],10,3174756917),a,b,x[k+2],15,718787259),d,a,x[k+9],21,3951481745),a=addUnsigned(a,AA),b=addUnsigned(b,BB),c=addUnsigned(c,CC),d=addUnsigned(d,DD);return(wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d)).toLowerCase()}}}])}(angular);