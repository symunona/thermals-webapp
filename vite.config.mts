import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { exec } from 'child_process';

// import devtools from 'solid-devtools/vite';

import { Buffer as BufferPolyfill } from 'buffer'
declare var Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill

export default defineConfig({
  //base: '/app/',
  plugins: [
    /*
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),

    {
      name: 'append-script',
      apply: 'build',
      transformIndexHtml: {
        transform(html) {
          return html.replace(
            '</body>',
            `<script>
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('phc_2ems64UCs0PihWh9ChcixoQvmmLdGSACTg0htnVzXLy',{api_host:'https://us.i.posthog.com', person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
                })
          </script></body>`
          );
        },
      }
    },
    {
      name: 'run-shell-script',
      apply: 'build',
      // buildEnd() {
      //   // This does not work for some reason now.
      //   exec('ln -s /home/symunona/wwwroot/thermal/out/ /home/symunona/wwwroot/thermal/dist/out',
      //   (error, stdout, stderr) => {
      //     if (error) {
      //       console.warn(`Error: ${error.message}`);
      //       return;
      //     }
      //     if (stderr) {
      //       console.warn(`Stderr: ${stderr}`);
      //       return;
      //     }
      //     console.log(`Stdout: ${stdout}`);
      //   });
      // },
    }
  ],
  define: {
    global: {},
  },
  server: {
    // Show to everyone on the network
    host: '0.0.0.0',
    port: 3000,
    cors: {
      origin: "*",
      allowedHeaders: ["Access-Control-Allow-Origin", "Access-Control-Allow-Methods"]
    }
  },
  build: {
    target: 'esnext',
  },
});
