function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},e.apply(this,arguments)}class t extends Error{constructor(e){super(e),this.name="SidechatAPIError"}}class r{}r.defaultHeaders={Accept:"application/json","Content-Type":"application/json"},r.loginViaSMS=async e=>{try{const t=await fetch("https://api.sidechat.lol/v1/login_register",{method:"POST",headers:defaultHeaders,body:JSON.stringify({phone_number:`+1${e}`,version:3})});return await t.json()}catch(e){throw console.error(error),new t("Failed to request SMS verification.")}},r.verifySMSCode=async(e,r)=>{try{const t=await fetch("https://api.sidechat.lol/v1/verify_phone_number",{method:"POST",headers:defaultHeaders,body:JSON.stringify({phone_number:`+1${e}`,code:r.toUpperCase()})});return await t.json()}catch(e){throw console.error(e),new t("Failed verify this code.")}},r.setAge=async(e,r)=>{if(e<13)throw new t("You're too young to use Offsides.");try{const t=await fetch("https://api.sidechat.lol/v1/complete_registration",{method:"POST",headers:defaultHeaders,body:JSON.stringify({age:Number(e),registration_id:r})});return await t.json()}catch(e){throw console.error(e),new t("Failed verify this code.")}},r.registerEmail=async(r,o)=>{try{const a=await fetch("https://api.sidechat.lol/v2/users/register_email",{method:"POST",headers:e({},defaultHeaders,{Authorization:`Bearer ${o}`}),body:JSON.stringify({email:r})}),s=await a.json();if(s.message)throw new t(s.message);return s}catch(e){throw console.error(error),new t("Failed to request email verification.")}},r.checkEmailVerification=async r=>{try{const o=await fetch("https://api.sidechat.lol/v1/users/check_email_verified",{method:"GET",headers:e({},defaultHeaders,{Authorization:`Bearer ${r}`})}),a=await o.json();if(a.verified_email_updates_response)return a.verified_email_updates_response;throw new t((null==a?void 0:a.message)||"Email is not verified.")}catch(e){throw console.error(error),new t("Email is not verified.")}},r.setDeviceID=async(r,o)=>{try{const t=await fetch("https://api.sidechat.lol/v1/register_device_token",{method:"POST",headers:e({},defaultHeaders,{Authorization:`Bearer ${o}`}),body:JSON.stringify({build_type:"release",bundle_id:"com.flowerave.sidechat",device_token:r})}),a=await t.json();return await AsyncStorage.setItem("deviceID",r),a}catch(e){throw console.error(e),new t("Failed verify this code.")}},r.getUserAndGroup=async(r,o="")=>{try{const t=await fetch(`https://api.sidechat.lol/v1/updates?group_id=${o}`,{method:"GET",headers:e({},defaultHeaders,{Authorization:`Bearer ${r}`})});return await t.json()}catch(e){throw console.error(e),new t("Failed to get posts from group.")}},r.getGroupPosts=async(r,o,a="hot",s)=>{try{const t=await fetch(`https://api.sidechat.lol/v1/posts?group_id=${r}&type=${a}${s?"&cursor="+s:""}`,{method:"GET",headers:e({},defaultHeaders,{Authorization:`Bearer ${o}`})});return await t.json()}catch(e){throw console.error(e),new t("Failed to get posts from group.")}},r.setVote=async(r,o,a)=>{try{const t=await fetch("https://api.sidechat.lol/v1/posts/set_vote",{method:"POST",headers:e({},defaultHeaders,{Authorization:`Bearer ${o}`}),body:JSON.stringify({post_id:r,vote_status:a})});return await t.json()}catch(e){throw console.error(e),new t("Failed to change the vote on post.")}},r.getPostComments=async(r,o)=>{try{const a=await fetch(`https://api.sidechat.lol/v1/posts/comments/?post_id=${r}`,{method:"GET",headers:e({},defaultHeaders,{Authorization:`Bearer ${o}`})});function s(e){const t=new Map,r=[];return e.forEach(e=>{t.set(e.id,e);const o=t.get(e.reply_post_id);o&&e.reply_post_id!==e.parent_post_id?(o.replies||(o.replies=[]),o.replies.push(e)):r.push(e)}),i(r)}function i(e){return e.reduce((e,t)=>(e.push(t),t.replies&&e.push(...i(t.replies)),e),[])}return s((await a.json()).posts)}catch(n){throw console.error(n),new t("Failed to get comments on post.")}},r.getAvailableGroups=async r=>{try{const t=await fetch("https://api.sidechat.lol/v1/groups/explore",{method:"GET",headers:e({},defaultHeaders,{Authorization:`Bearer ${r}`})});return(await t.json()).groups}catch(e){throw console.error(e),new t("Failed to get groups from explore.")}};export{r as SidechatAPIClient,t as SidechatAPIError};
//# sourceMappingURL=sidechat.modern.js.map