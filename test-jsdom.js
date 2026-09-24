const { JSDOM } = require("jsdom");
JSDOM.fromURL("https://farha215.github.io/spidey-bday/", {
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true
}).then(dom => {
  dom.window.console.log = (...args) => console.log('LOG:', ...args);
  dom.window.console.error = (...args) => console.error('ERROR:', ...args);
  dom.window.addEventListener("error", (event) => {
    console.error("DOM ERROR:", event.error);
  });
  dom.window.addEventListener("unhandledrejection", (event) => {
    console.error("UNHANDLED REJECTION:", event.reason);
  });
  
  setTimeout(() => {
    console.log("Done waiting");
  }, 5000);
}).catch(e => console.error(e));
