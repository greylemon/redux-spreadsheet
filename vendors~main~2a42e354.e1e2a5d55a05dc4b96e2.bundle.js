(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{1010:function(module,exports,__webpack_require__){"use strict";exports.byteLength=function byteLength(b64){var lens=getLens(b64),validLen=lens[0],placeHoldersLen=lens[1];return 3*(validLen+placeHoldersLen)/4-placeHoldersLen},exports.toByteArray=function toByteArray(b64){var tmp,i,lens=getLens(b64),validLen=lens[0],placeHoldersLen=lens[1],arr=new Arr(function _byteLength(b64,validLen,placeHoldersLen){return 3*(validLen+placeHoldersLen)/4-placeHoldersLen}(0,validLen,placeHoldersLen)),curByte=0,len=placeHoldersLen>0?validLen-4:validLen;for(i=0;i<len;i+=4)tmp=revLookup[b64.charCodeAt(i)]<<18|revLookup[b64.charCodeAt(i+1)]<<12|revLookup[b64.charCodeAt(i+2)]<<6|revLookup[b64.charCodeAt(i+3)],arr[curByte++]=tmp>>16&255,arr[curByte++]=tmp>>8&255,arr[curByte++]=255&tmp;2===placeHoldersLen&&(tmp=revLookup[b64.charCodeAt(i)]<<2|revLookup[b64.charCodeAt(i+1)]>>4,arr[curByte++]=255&tmp);1===placeHoldersLen&&(tmp=revLookup[b64.charCodeAt(i)]<<10|revLookup[b64.charCodeAt(i+1)]<<4|revLookup[b64.charCodeAt(i+2)]>>2,arr[curByte++]=tmp>>8&255,arr[curByte++]=255&tmp);return arr},exports.fromByteArray=function fromByteArray(uint8){for(var tmp,len=uint8.length,extraBytes=len%3,parts=[],i=0,len2=len-extraBytes;i<len2;i+=16383)parts.push(encodeChunk(uint8,i,i+16383>len2?len2:i+16383));1===extraBytes?(tmp=uint8[len-1],parts.push(lookup[tmp>>2]+lookup[tmp<<4&63]+"==")):2===extraBytes&&(tmp=(uint8[len-2]<<8)+uint8[len-1],parts.push(lookup[tmp>>10]+lookup[tmp>>4&63]+lookup[tmp<<2&63]+"="));return parts.join("")};for(var lookup=[],revLookup=[],Arr="undefined"!=typeof Uint8Array?Uint8Array:Array,code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,len=code.length;i<len;++i)lookup[i]=code[i],revLookup[code.charCodeAt(i)]=i;function getLens(b64){var len=b64.length;if(len%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var validLen=b64.indexOf("=");return-1===validLen&&(validLen=len),[validLen,validLen===len?0:4-validLen%4]}function encodeChunk(uint8,start,end){for(var tmp,num,output=[],i=start;i<end;i+=3)tmp=(uint8[i]<<16&16711680)+(uint8[i+1]<<8&65280)+(255&uint8[i+2]),output.push(lookup[(num=tmp)>>18&63]+lookup[num>>12&63]+lookup[num>>6&63]+lookup[63&num]);return output.join("")}revLookup["-".charCodeAt(0)]=62,revLookup["_".charCodeAt(0)]=63},1021:function(module,exports,__webpack_require__){const singleUnitStrs=["","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า"],placeNameStrs=["","สิบ","ร้อย","พัน","หมื่น","แสน","ล้าน"];function num2Word(nums){let result="";const len=nums.length;if(len>7){const overflowIndex=len-7+1,overflowNums=nums.slice(0,overflowIndex),remainingNumbs=nums.slice(overflowIndex);return num2Word(overflowNums)+"ล้าน"+num2Word(remainingNumbs)}for(let i=0;i<len;i++){const digit=nums[i];digit>0&&(result+=singleUnitStrs[digit]+placeNameStrs[len-i-1])}return result}function grammarFix(str){let result=str;result=result.replace("หนึ่งสิบ","สิบ"),result=result.replace("สองสิบ","ยี่สิบ");return result.length>5&&result.length-result.lastIndexOf("หนึ่ง")==5&&(result=result.substr(0,result.length-5)+"เอ็ด"),result}null!=module.exports&&(module.exports=function bahttext(num){let result="ศูนย์บาทถ้วน";if(isNaN(num))return result;if(num>=Number.MAX_SAFE_INTEGER)return result;const bahtStr=Math.floor(num).toString(),satangStr=Math.round(num%1*100).toString(),bahtArr=Array.from(bahtStr).map(Number),satangArr=Array.from(satangStr).map(Number);let baht=num2Word(bahtArr),satang=num2Word(satangArr);return baht=grammarFix(baht),satang=grammarFix(satang),result=function combine(baht,satang){let result="";return result=""===baht&&""===satang?"ศูนย์บาทถ้วน":""!==baht&&""===satang?baht+"บาทถ้วน":""===baht&&""!==satang?satang+"สตางค์":baht+"บาท"+satang+"สตางค์",result}(baht,satang),result})},1044:function(module,exports){module.exports=function(arr,fn,self){if(arr.filter)return arr.filter(fn,self);if(null==arr)throw new TypeError;if("function"!=typeof fn)throw new TypeError;for(var ret=[],i=0;i<arr.length;i++)if(hasOwn.call(arr,i)){var val=arr[i];fn.call(self,val,i,arr)&&ret.push(val)}return ret};var hasOwn=Object.prototype.hasOwnProperty},403:function(module,exports,__webpack_require__){"use strict";var ArraySpeciesCreate=__webpack_require__(291),Call=__webpack_require__(129),CreateDataPropertyOrThrow=__webpack_require__(293),Get=__webpack_require__(74),HasProperty=__webpack_require__(390),IsCallable=__webpack_require__(114),ToUint32=__webpack_require__(683),ToObject=__webpack_require__(183),ToString=__webpack_require__(128),callBound=__webpack_require__(32),isString=__webpack_require__(218),boxedString=Object("a"),splitString="a"!==boxedString[0]||!(0 in boxedString),strSplit=callBound("String.prototype.split");module.exports=function map(callbackfn){var T,O=ToObject(this),self=splitString&&isString(O)?strSplit(O,""):O,len=ToUint32(self.length);if(!IsCallable(callbackfn))throw new TypeError("Array.prototype.map callback must be a function");arguments.length>1&&(T=arguments[1]);for(var A=ArraySpeciesCreate(O,len),k=0;k<len;){var Pk=ToString(k),kPresent=HasProperty(O,Pk);if(kPresent){var kValue=Get(O,Pk),mappedValue=Call(callbackfn,T,[kValue,k,O]);CreateDataPropertyOrThrow(A,Pk,mappedValue)}k+=1}return A}},404:function(module,exports,__webpack_require__){"use strict";var arrayMethodBoxesProperly=__webpack_require__(684),implementation=__webpack_require__(403);module.exports=function getPolyfill(){var method=Array.prototype.map;return arrayMethodBoxesProperly(method)?method:implementation}},522:function(module,exports,__webpack_require__){"use strict";(function(global){var filter=__webpack_require__(1044);module.exports=function availableTypedArrays(){return filter(["BigInt64Array","BigUint64Array","Float32Array","Float64Array","Int16Array","Int32Array","Int8Array","Uint16Array","Uint32Array","Uint8Array","Uint8ClampedArray"],(function(typedArray){return"function"==typeof global[typedArray]}))}}).call(this,__webpack_require__(45))},569:function(module,exports,__webpack_require__){"use strict";__webpack_require__(570)},570:function(module,exports,__webpack_require__){"use strict";__webpack_require__(571),__webpack_require__(572),__webpack_require__(573)},573:function(module,exports,__webpack_require__){"use strict";__webpack_require__(574),__webpack_require__(575)(),__webpack_require__(580)},580:function(module,exports,__webpack_require__){"use strict";__webpack_require__(581)(),__webpack_require__(593)},581:function(module,exports,__webpack_require__){"use strict";var define=__webpack_require__(39),getPolyfill=__webpack_require__(582);module.exports=function shimArrayPrototypeIncludes(){var polyfill=getPolyfill();return define(Array.prototype,{includes:polyfill},{includes:function(){return Array.prototype.includes!==polyfill}}),polyfill}},582:function(module,exports,__webpack_require__){"use strict";var implementation=__webpack_require__(583);module.exports=function getPolyfill(){return Array.prototype.includes||implementation}},583:function(module,exports,__webpack_require__){"use strict";var ToInteger=__webpack_require__(370),ToLength=__webpack_require__(589),ToObject=__webpack_require__(590),SameValueZero=__webpack_require__(592),$isNaN=__webpack_require__(161),$isFinite=__webpack_require__(282),GetIntrinsic=__webpack_require__(9),callBound=__webpack_require__(32),isString=__webpack_require__(218),$charAt=callBound("String.prototype.charAt"),$indexOf=GetIntrinsic("%Array.prototype.indexOf%");module.exports=function includes(searchElement){var fromIndex=arguments.length>1?ToInteger(arguments[1]):0;if($indexOf&&!$isNaN(searchElement)&&$isFinite(fromIndex)&&void 0!==searchElement)return $indexOf.apply(this,arguments)>-1;var O=ToObject(this),length=ToLength(O.length);if(0===length)return!1;for(var k=fromIndex>=0?fromIndex:Math.max(0,length+fromIndex);k<length;){if(SameValueZero(searchElement,isString(O)?$charAt(O,k):O[k]))return!0;k+=1}return!1}},593:function(module,exports,__webpack_require__){"use strict";__webpack_require__(594)(),__webpack_require__(597)(),__webpack_require__(600)(),__webpack_require__(603)(),__webpack_require__(606)(),__webpack_require__(611)},611:function(module,exports,__webpack_require__){"use strict";"function"==typeof Promise&&__webpack_require__(612),__webpack_require__(626)},626:function(module,exports,__webpack_require__){"use strict";__webpack_require__(627),__webpack_require__(634),__webpack_require__(638),__webpack_require__(643),__webpack_require__(657)},627:function(module,exports,__webpack_require__){"use strict";__webpack_require__(628)()},628:function(module,exports,__webpack_require__){"use strict";var define=__webpack_require__(39),getPolyfill=__webpack_require__(629);module.exports=function shimFlat(){var polyfill=getPolyfill();return define(Array.prototype,{flat:polyfill},{flat:function(){return Array.prototype.flat!==polyfill}}),polyfill}},629:function(module,exports,__webpack_require__){"use strict";var implementation=__webpack_require__(630);module.exports=function getPolyfill(){return Array.prototype.flat||implementation}},630:function(module,exports,__webpack_require__){"use strict";var ArraySpeciesCreate=__webpack_require__(291),FlattenIntoArray=__webpack_require__(389),Get=__webpack_require__(74),ToInteger=__webpack_require__(376),ToLength=__webpack_require__(149),ToObject=__webpack_require__(183);module.exports=function flat(){var O=ToObject(this),sourceLen=ToLength(Get(O,"length")),depthNum=1;arguments.length>0&&void 0!==arguments[0]&&(depthNum=ToInteger(arguments[0]));var A=ArraySpeciesCreate(O,0);return FlattenIntoArray(A,O,sourceLen,0,depthNum),A}},634:function(module,exports,__webpack_require__){"use strict";__webpack_require__(635)()},635:function(module,exports,__webpack_require__){"use strict";var define=__webpack_require__(39),getPolyfill=__webpack_require__(636);module.exports=function shimFlatMap(){var polyfill=getPolyfill();return define(Array.prototype,{flatMap:polyfill},{flatMap:function(){return Array.prototype.flatMap!==polyfill}}),polyfill}},636:function(module,exports,__webpack_require__){"use strict";var implementation=__webpack_require__(637);module.exports=function getPolyfill(){return Array.prototype.flatMap||implementation}},637:function(module,exports,__webpack_require__){"use strict";var ArraySpeciesCreate=__webpack_require__(291),FlattenIntoArray=__webpack_require__(389),Get=__webpack_require__(74),IsCallable=__webpack_require__(114),ToLength=__webpack_require__(149),ToObject=__webpack_require__(183);module.exports=function flatMap(mapperFunction){var T,O=ToObject(this),sourceLen=ToLength(Get(O,"length"));if(!IsCallable(mapperFunction))throw new TypeError("mapperFunction must be a function");arguments.length>1&&(T=arguments[1]);var A=ArraySpeciesCreate(O,0);return FlattenIntoArray(A,O,sourceLen,0,1,mapperFunction,T),A}},657:function(module,exports,__webpack_require__){"use strict";__webpack_require__(658),__webpack_require__(670),__webpack_require__(674)},682:function(module,exports,__webpack_require__){"use strict";var define=__webpack_require__(39),RequireObjectCoercible=__webpack_require__(115),callBound=__webpack_require__(32),implementation=__webpack_require__(403),getPolyfill=__webpack_require__(404),polyfill=getPolyfill(),shim=__webpack_require__(685),$slice=callBound("Array.prototype.slice"),boundMapShim=function map(array,callbackfn){return RequireObjectCoercible(array),polyfill.apply(array,$slice(arguments,1))};define(boundMapShim,{getPolyfill:getPolyfill,implementation:implementation,shim:shim}),module.exports=boundMapShim},685:function(module,exports,__webpack_require__){"use strict";var define=__webpack_require__(39),getPolyfill=__webpack_require__(404);module.exports=function shimArrayPrototypeMap(){var polyfill=getPolyfill();return define(Array.prototype,{map:polyfill},{map:function(){return Array.prototype.map!==polyfill}}),polyfill}},875:function(module,exports,__webpack_require__){"use strict";function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}var entities=__webpack_require__(876),defaults={fg:"#FFF",bg:"#000",newline:!1,escapeXML:!1,stream:!1,colors:function getDefaultColors(){var colors={0:"#000",1:"#A00",2:"#0A0",3:"#A50",4:"#00A",5:"#A0A",6:"#0AA",7:"#AAA",8:"#555",9:"#F55",10:"#5F5",11:"#FF5",12:"#55F",13:"#F5F",14:"#5FF",15:"#FFF"};return range(0,5).forEach((function(red){range(0,5).forEach((function(green){range(0,5).forEach((function(blue){return function setStyleColor(red,green,blue,colors){var r=red>0?40*red+55:0,g=green>0?40*green+55:0,b=blue>0?40*blue+55:0;colors[16+36*red+6*green+blue]=function toColorHexString(ref){var results=[],_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _step,_iterator=ref[Symbol.iterator]();!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0){var r=_step.value;results.push(toHexString(r))}}catch(err){_didIteratorError=!0,_iteratorError=err}finally{try{_iteratorNormalCompletion||null==_iterator.return||_iterator.return()}finally{if(_didIteratorError)throw _iteratorError}}return"#"+results.join("")}([r,g,b])}(red,green,blue,colors)}))}))})),range(0,23).forEach((function(gray){var c=gray+232,l=toHexString(10*gray+8);colors[c]="#"+l+l+l})),colors}()};function toHexString(num){for(var str=num.toString(16);str.length<2;)str="0"+str;return str}function generateOutput(stack,token,data,options){var result;return"text"===token?result=function pushText(text,options){if(options.escapeXML)return entities.encodeXML(text);return text}(data,options):"display"===token?result=function handleDisplay(stack,code,options){code=parseInt(code,10);var result,codeMap={"-1":function _(){return"<br/>"},0:function _(){return stack.length&&resetStyles(stack)},1:function _(){return pushTag(stack,"b")},3:function _(){return pushTag(stack,"i")},4:function _(){return pushTag(stack,"u")},8:function _(){return pushStyle(stack,"display:none")},9:function _(){return pushTag(stack,"strike")},22:function _(){return pushStyle(stack,"font-weight:normal;text-decoration:none;font-style:normal")},23:function _(){return closeTag(stack,"i")},24:function _(){return closeTag(stack,"u")},39:function _(){return pushForegroundColor(stack,options.fg)},49:function _(){return pushBackgroundColor(stack,options.bg)},53:function _(){return pushStyle(stack,"text-decoration:overline")}};codeMap[code]?result=codeMap[code]():4<code&&code<7?result=pushTag(stack,"blink"):29<code&&code<38?result=pushForegroundColor(stack,options.colors[code-30]):39<code&&code<48?result=pushBackgroundColor(stack,options.colors[code-40]):89<code&&code<98?result=pushForegroundColor(stack,options.colors[code-90+8]):99<code&&code<108&&(result=pushBackgroundColor(stack,options.colors[code-100+8]));return result}(stack,data,options):"xterm256"===token?result=pushForegroundColor(stack,options.colors[data]):"rgb"===token&&(result=function handleRgb(stack,data){var operation=+(data=data.substring(2).slice(0,-1)).substr(0,2),rgb=data.substring(5).split(";").map((function(value){return("0"+Number(value).toString(16)).substr(-2)})).join("");return pushStyle(stack,(38===operation?"color:#":"background-color:#")+rgb)}(stack,data)),result}function resetStyles(stack){var stackClone=stack.slice(0);return stack.length=0,stackClone.reverse().map((function(tag){return"</"+tag+">"})).join("")}function range(low,high){for(var results=[],j=low;j<=high;j++)results.push(j);return results}function categoryForCode(code){var result=null;return 0===(code=parseInt(code,10))?result="all":1===code?result="bold":2<code&&code<5?result="underline":4<code&&code<7?result="blink":8===code?result="hide":9===code?result="strike":29<code&&code<38||39===code||89<code&&code<98?result="foreground-color":(39<code&&code<48||49===code||99<code&&code<108)&&(result="background-color"),result}function pushTag(stack,tag,style){return style||(style=""),stack.push(tag),["<"+tag,style?' style="'+style+'"':void 0,">"].join("")}function pushStyle(stack,style){return pushTag(stack,"span",style)}function pushForegroundColor(stack,color){return pushTag(stack,"span","color:"+color)}function pushBackgroundColor(stack,color){return pushTag(stack,"span","background-color:"+color)}function closeTag(stack,style){var last;if(stack.slice(-1)[0]===style&&(last=stack.pop()),last)return"</"+style+">"}var Filter=function(){function Filter(options){!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,Filter),(options=options||{}).colors&&(options.colors=Object.assign({},defaults.colors,options.colors)),this.options=Object.assign({},defaults,options),this.stack=[],this.stickyStack=[]}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Constructor}(Filter,[{key:"toHtml",value:function toHtml(input){var _this=this;input="string"==typeof input?[input]:input;var stack=this.stack,options=this.options,buf=[];return this.stickyStack.forEach((function(element){var output=generateOutput(stack,element.token,element.data,options);output&&buf.push(output)})),function tokenize(text,options,callback){var ansiMatch=!1;function remove(){return""}function newline(m){return options.newline?callback("display",-1):callback("text",m),""}var tokens=[{pattern:/^\x08+/,sub:remove},{pattern:/^\x1b\[[012]?K/,sub:remove},{pattern:/^\x1b\[\(B/,sub:remove},{pattern:/^\x1b\[[34]8;2;\d+;\d+;\d+m/,sub:function rgb(m){return callback("rgb",m),""}},{pattern:/^\x1b\[38;5;(\d+)m/,sub:function removeXterm256(m,g1){return callback("xterm256",g1),""}},{pattern:/^\n/,sub:newline},{pattern:/^\r+\n/,sub:newline},{pattern:/^\x1b\[((?:\d{1,3};?)+|)m/,sub:function ansiMess(m,g1){ansiMatch=!0,0===g1.trim().length&&(g1="0"),g1=g1.trimRight(";").split(";");var _iteratorNormalCompletion2=!0,_didIteratorError2=!1,_iteratorError2=void 0;try{for(var _step2,_iterator2=g1[Symbol.iterator]();!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=!0){var g=_step2.value;callback("display",g)}}catch(err){_didIteratorError2=!0,_iteratorError2=err}finally{try{_iteratorNormalCompletion2||null==_iterator2.return||_iterator2.return()}finally{if(_didIteratorError2)throw _iteratorError2}}return""}},{pattern:/^\x1b\[\d?J/,sub:remove},{pattern:/^\x1b\[\d{0,3};\d{0,3}f/,sub:remove},{pattern:/^\x1b\[?[\d;]{0,3}/,sub:remove},{pattern:/^(([^\x1b\x08\r\n])+)/,sub:function realText(m){return callback("text",m),""}}];function process(handler,i){i>3&&ansiMatch||(ansiMatch=!1,text=text.replace(handler.pattern,handler.sub))}var results1=[],length=text.length;outer:for(;length>0;){for(var i=0,o=0,len=tokens.length;o<len;i=++o){if(process(tokens[i],i),text.length!==length){length=text.length;continue outer}}if(text.length===length)break;results1.push(0),length=text.length}return results1}(input.join(""),options,(function(token,data){var output=generateOutput(stack,token,data,options);output&&buf.push(output),options.stream&&(_this.stickyStack=function updateStickyStack(stickyStack,token,data){return"text"!==token&&(stickyStack=stickyStack.filter(function notCategory(category){return function(e){return(null===category||e.category!==category)&&"all"!==category}}(categoryForCode(data)))).push({token:token,data:data,category:categoryForCode(data)}),stickyStack}(_this.stickyStack,token,data))})),stack.length&&buf.push(resetStyles(stack)),buf.join("")}}]),Filter}();module.exports=Filter}}]);
//# sourceMappingURL=vendors~main~2a42e354.e1e2a5d55a05dc4b96e2.bundle.js.map