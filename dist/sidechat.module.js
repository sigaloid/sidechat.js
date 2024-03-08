function e(){try{var r=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch(r){}return(e=function(){return!!r})()}function r(){return r=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},r.apply(this,arguments)}function t(e){return t=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},t(e)}function o(e,r){return o=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,r){return e.__proto__=r,e},o(e,r)}function n(r){var i="function"==typeof Map?new Map:void 0;return n=function(r){if(null===r||!function(e){try{return-1!==Function.toString.call(e).indexOf("[native code]")}catch(r){return"function"==typeof e}}(r))return r;if("function"!=typeof r)throw new TypeError("Super expression must either be null or a function");if(void 0!==i){if(i.has(r))return i.get(r);i.set(r,n)}function n(){return function(r,t,n){if(e())return Reflect.construct.apply(null,arguments);var i=[null];i.push.apply(i,t);var s=new(r.bind.apply(r,i));return n&&o(s,n.prototype),s}(r,arguments,t(this).constructor)}return n.prototype=Object.create(r.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),o(n,r)},n(r)}var i=/*#__PURE__*/function(e){var r,t;function n(r){var t;return(t=e.call(this,r)||this).name="SidechatAPIError",t}return t=e,(r=n).prototype=Object.create(t.prototype),r.prototype.constructor=r,o(r,t),n}(/*#__PURE__*/n(Error));function s(e,r){try{var t=e()}catch(e){return r(e)}return t&&t.then?t.then(void 0,r):t}var u={Accept:"application/json","Content-Type":"application/json"},c=function(e){try{return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v1/login_register",{method:"POST",headers:u,body:JSON.stringify({phone_number:"+1"+e,version:3})})).then(function(e){return Promise.resolve(e.json())})},function(){throw console.error(error),new i("Failed to request SMS verification.")}))}catch(e){return Promise.reject(e)}},a=function(e,r){try{return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v1/verify_phone_number",{method:"POST",headers:u,body:JSON.stringify({phone_number:"+1"+e,code:r.toUpperCase()})})).then(function(e){return Promise.resolve(e.json())})},function(e){throw console.error(e),new i("Failed verify this code.")}))}catch(e){return Promise.reject(e)}},h=function(e,r){try{if(e<13)throw new i("You're too young to use Offsides.");return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v1/complete_registration",{method:"POST",headers:u,body:JSON.stringify({age:Number(e),registration_id:r})})).then(function(e){return Promise.resolve(e.json())})},function(e){throw console.error(e),new i("Failed verify this code.")}))}catch(e){return Promise.reject(e)}},l=function(e,t){try{return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v2/users/register_email",{method:"POST",headers:r({},u,{Authorization:"Bearer "+t}),body:JSON.stringify({email:e})})).then(function(e){return Promise.resolve(e.json()).then(function(e){if(e.message)throw new i(e.message);return e})})},function(){throw console.error(error),new i("Failed to request email verification.")}))}catch(e){return Promise.reject(e)}},f=function(e){try{return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v1/users/check_email_verified",{method:"GET",headers:r({},u,{Authorization:"Bearer "+e})})).then(function(e){return Promise.resolve(e.json()).then(function(e){if(e.verified_email_updates_response)return e.verified_email_updates_response;throw new i((null==e?void 0:e.message)||"Email is not verified.")})})},function(){throw console.error(error),new i("Email is not verified.")}))}catch(e){return Promise.reject(e)}},p=function(e,t){try{return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v1/register_device_token",{method:"POST",headers:r({},u,{Authorization:"Bearer "+t}),body:JSON.stringify({build_type:"release",bundle_id:"com.flowerave.sidechat",device_token:e})})).then(function(r){return Promise.resolve(r.json()).then(function(r){return Promise.resolve(AsyncStorage.setItem("deviceID",e)).then(function(){return r})})})},function(e){throw console.error(e),new i("Failed verify this code.")}))}catch(e){return Promise.reject(e)}},d=function(e,t){void 0===t&&(t="");try{return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v1/updates?group_id="+t,{method:"GET",headers:r({},u,{Authorization:"Bearer "+e})})).then(function(e){return Promise.resolve(e.json())})},function(e){throw console.error(e),new i("Failed to get posts from group.")}))}catch(e){return Promise.reject(e)}},v=function(e,t,o,n){void 0===o&&(o="hot");try{return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v1/posts?group_id="+e+"&type="+o+(n?"&cursor="+n:""),{method:"GET",headers:r({},u,{Authorization:"Bearer "+t})})).then(function(e){return Promise.resolve(e.json())})},function(e){throw console.error(e),new i("Failed to get posts from group.")}))}catch(e){return Promise.reject(e)}},m=function(e,t,o){try{return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v1/posts/set_vote",{method:"POST",headers:r({},u,{Authorization:"Bearer "+t}),body:JSON.stringify({post_id:e,vote_status:o})})).then(function(e){return Promise.resolve(e.json())})},function(e){throw console.error(e),new i("Failed to change the vote on post.")}))}catch(e){return Promise.reject(e)}},y=function(e,t){try{return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v1/posts/comments/?post_id="+e,{method:"GET",headers:r({},u,{Authorization:"Bearer "+t})})).then(function(e){function r(e){var r=new Map,o=[];return e.forEach(function(e){r.set(e.id,e);var t=r.get(e.reply_post_id);t&&e.reply_post_id!==e.parent_post_id?(t.replies||(t.replies=[]),t.replies.push(e)):o.push(e)}),t(o)}function t(e){return e.reduce(function(e,r){return e.push(r),r.replies&&e.push.apply(e,t(r.replies)),e},[])}return Promise.resolve(e.json()).then(function(e){return r(e.posts)})})},function(e){throw console.error(e),new i("Failed to get comments on post.")}))}catch(e){return Promise.reject(e)}},P=function(e){try{return Promise.resolve(s(function(){return Promise.resolve(fetch("https://api.sidechat.lol/v1/groups/explore",{method:"GET",headers:r({},u,{Authorization:"Bearer "+e})})).then(function(e){return Promise.resolve(e.json()).then(function(e){return e.groups})})},function(e){throw console.error(e),new i("Failed to get groups from explore.")}))}catch(e){return Promise.reject(e)}};export{f as checkEmailVerification,P as getAvailableGroups,v as getGroupPosts,y as getPostComments,d as getUserAndGroup,c as loginViaSMS,l as registerEmail,h as setAge,p as setDeviceID,m as setVote,a as verifySMSCode};
//# sourceMappingURL=sidechat.module.js.map
