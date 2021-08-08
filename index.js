const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const version = '2.0.0';

let css = '';
let styleEl;

const updateCSS = (c) => {
  styleEl.innerHTML = '';
  
  styleEl.appendChild(document.createTextNode(c));
};


export default {
goosemodHandlers: {
  onImport: async function () {
    styleEl = document.createElement('style');
    
    document.head.appendChild(styleEl);
    
    // Setup ace
    eval(await (await fetch(`https://ajaxorg.github.io/ace-builds/src-min-noconflict/ace.js`)).text()); // Load Ace main

    eval(await (await fetch(`https://ajaxorg.github.io/ace-builds/src-min-noconflict/theme-monokai.js`)).text()); // Load Monokai theme

    eval(await (await fetch(`https://ajaxorg.github.io/ace-builds/src-min-noconflict/mode-css.js`)).text()); // Load CSS lang
    
    goosemodScope.settings.createItem('Custom CSS', [
      `(v${version})`,
      
      {
        type: 'header',
        text: 'Add your own Custom CSS here:'
        
      },
      
      {
      
        type: 'custom',
        element: () => {
          const el = document.createElement('div');
    
          el.id = 'gm-editor';

          el.style.width = '90%';
          el.style.height = '85vh';

          el.innerHTML = css;
          el.className = '';

          (async function() {
            await sleep(10);

            const editor = ace.edit('gm-editor');
            const session = editor.getSession();
  
            session.setUseWorker(false); // Tell Ace not to use Workers
  
            session.setMode('ace/mode/css'); // Set lang to CSS
  
            editor.setTheme('ace/theme/monokai'); // Set theme to Monokai
  
            session.on('change', () => {
              const val = session.getValue();
  
              css = val;
              updateCSS(val);
            });
          })();

          return el;
        }
      }
    ]);
  },
  
  onRemove: async function () {
    styleEl.remove();
    
    goosemodScope.settings.removeItem('Custom CSS');
  },

  getSettings: () => [css],
  loadSettings: ([_css]) => {
    css = _css; // Update internal var

    updateCSS(css); // Update actual style
  },
}
};
