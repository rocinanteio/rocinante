"use strict";(self.webpackChunkrocinante=self.webpackChunkrocinante||[]).push([[328],{9404:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>s,metadata:()=>o,toc:()=>l});var i=t(7624),r=t(2172);const s={sidebar_position:1},a="Intro",o={id:"intro",title:"Intro",description:"Let's discover Rocinante in less than 5 minutes.",source:"@site/docs/intro.md",sourceDirName:".",slug:"/intro",permalink:"/rocinante/docs/intro",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Review App",permalink:"/rocinante/docs/category/review-app"}},c={},l=[{value:"What is the Rocinante?",id:"what-is-the-rocinante",level:2},{value:"Getting Started",id:"getting-started",level:2},{value:"Build Up Review App Client",id:"build-up-review-app-client",level:3},{value:"Start your app with prepared image",id:"start-your-app-with-prepared-image",level:3},{value:"Stop your app which is started with image",id:"stop-your-app-which-is-started-with-image",level:3}];function p(e){const n={code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.M)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"intro",children:"Intro"}),"\n",(0,i.jsxs)(n.p,{children:["Let's discover ",(0,i.jsx)(n.strong,{children:"Rocinante in less than 5 minutes"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"what-is-the-rocinante",children:"What is the Rocinante?"}),"\n",(0,i.jsxs)(n.p,{children:["If you are managing your applications in kubernetes environment, ",(0,i.jsx)(n.strong,{children:"Rocinante"})," is an infra tool that brings you an extra feature set to manage these applications. Currently there is only the ",(0,i.jsx)(n.strong,{children:"ReviewApp"})," feature, but over time this feature set will continue to expand (with yours support)"]}),"\n",(0,i.jsx)(n.h2,{id:"getting-started",children:"Getting Started"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"We said Rocinante is an application running in a kubernetes environment, so you must have a k8s cluster."}),"\n",(0,i.jsxs)(n.li,{children:["Install ",(0,i.jsx)(n.strong,{children:"Rocinante"})]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kubectl apply -f https://raw.githubusercontent.com/rocinanteio/Rocinante/master/versions/rocinante-v1beta1.yaml\n"})}),"\n",(0,i.jsxs)(n.p,{children:["This command will install Rocinante your cluster. You can see this app below the ",(0,i.jsx)(n.strong,{children:"rocinante"})," namespace. It will follow up ",(0,i.jsx)(n.strong,{children:"roci"})," resources types."]}),"\n",(0,i.jsx)(n.h3,{id:"build-up-review-app-client",children:"Build Up Review App Client"}),"\n",(0,i.jsx)(n.p,{children:"You can create your review app resource with basic yaml config like below"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: roci.io/v1beta1\nkind: Application\nmetadata:\n  name: reviewapp-sample\n  namespace: roci-test\nspec:\n  version:\n    ui: 0.0.4\n    core: 0.0.4\n  variables:\n    coreApiPort: 30001\n    coreApiSocketPort: 30002\n    uiPort: 30003\n    apiUrl: http://localhost:30001  \n"})}),"\n",(0,i.jsxs)(n.p,{children:["It will build up your ",(0,i.jsx)(n.em,{children:"service"})," and ",(0,i.jsx)(n.em,{children:"rocinante-ui"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"You can access them with nodeports;"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"<cluster-ip>:30001 (Core API)\n<cluster-ip>:30002/reviewapps (Rocinante UI)\n"})}),"\n",(0,i.jsx)(n.h3,{id:"start-your-app-with-prepared-image",children:"Start your app with prepared image"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:'http://<cluster-api>:30001/projects/start/image\n\nQuery Params\n{\n  "name": "test-app",\n  "image": "idalavye/roci-reviewapp-1703706410364-test:master",\n  "appPort": 3000\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"name"})," is deployment and service objects names. ",(0,i.jsx)("br",{}),"\n",(0,i.jsx)(n.strong,{children:"image"}),"  is your dockerized image. ",(0,i.jsx)("br",{}),"\n",(0,i.jsx)(n.strong,{children:"appPort"})," is exposed port number in your Dockerfile"]}),"\n",(0,i.jsx)(n.p,{children:"Core API will be start a new deployment for serving to you. This EP will be return your environment information. Or you can see deployed app in Rocinante UI."}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"img.png",src:t(4260).c+"",width:"1432",height:"571"})}),"\n",(0,i.jsx)(n.h3,{id:"stop-your-app-which-is-started-with-image",children:"Stop your app which is started with image"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:'http://<cluster-api>:30001/projects/stop/image\n\nQuery Params\n{\n  "name": "test-app",\n  "image": "idalavye/roci-reviewapp-1703706410364-test:master",\n  "appPort": 3000\n}\n'})}),"\n",(0,i.jsx)(n.p,{children:"This EP will be stop your test environment. And also you can use Rocinante UI for stopping."}),"\n",(0,i.jsx)(n.p,{children:"For full api documentation you can visit API swagger"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"http://<cluster-api>:30001/api\n"})})]})}function d(e={}){const{wrapper:n}={...(0,r.M)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},4260:(e,n,t)=>{t.d(n,{c:()=>i});const i=t.p+"assets/images/roci-review-app-sample-4fa83624ac4ad6b32b8c1523cf56123a.png"},2172:(e,n,t)=>{t.d(n,{I:()=>o,M:()=>a});var i=t(1504);const r={},s=i.createContext(r);function a(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);