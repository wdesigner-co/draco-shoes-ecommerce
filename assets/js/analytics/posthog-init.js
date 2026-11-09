// PostHog Analytics — Draco Shoes
(function (document, window) {
  if (window.posthog) return;

  !function(t,e){
    var o,n,p,r;
    e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){
      function g(t,e){
        var o=e.split(".");
        2==o.length&&(t=t[o[0]],e=o[1]),
        t[e]=function(){
          t.push([e].concat(Array.prototype.slice.call(arguments,0)))
        }
      }
      (p=t.createElement("script")).type="text/javascript";
      p.crossOrigin="anonymous";
      p.async=true;
      p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js";
      (r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);
      var u=e;
      for(void 0!==a?u=e[a]=[]:a="posthog",
      u.people=u.people||[],
      o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags on onFeatureFlags identify setPersonProperties group reset resetGroups get_distinct_id get_session_id captureException startSessionRecording stopSessionRecording opt_in_capturing opt_out_capturing".split(" "),
      n=0;n<o.length;n++)g(u,o[n]);
      e._i.push([i,s,a])
    },e.__SV=1)
  }(document,window.posthog||[]);

  if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    window.posthog.init("phc_wtek3RQiedxwRGyb7nTQjxAsZUD93MssGhffY2Z599Eq", {
      api_host: "https://us.i.posthog.com",
      defaults: "2026-08-30",
      autocapture: true,
      capture_heatmaps: true,
      capture_pageview: true,
      capture_pageleave: true
    });
  }
})(document, window);