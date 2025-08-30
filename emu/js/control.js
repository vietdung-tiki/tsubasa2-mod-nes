(function () {
  var menuDropdown = document.getElementById('menu-dropdown');
  var menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.onclick = function (e) {
      if (menuDropdown.style.display === 'none' || menuDropdown.style.display === '') {
        menuDropdown.style.display = 'block';
      } else {
        menuDropdown.style.display = 'none';
      }
    }
  }

  // 金手指弹窗
  function showCheatDialog() {
    let nes = window.nes;
    if (!nes) return;
    let dlg = document.getElementById('cheatDialog');
    let container = document.getElementById('fullscreenContainer') || document.body;
    if (dlg) { dlg.style.display = 'block'; dlg.classList.add('active'); return; }
    dlg = document.createElement('div');
    dlg.id = 'cheatDialog';
    dlg.className = 'cheat-dialog active';

    let cheatList = nes.cheatCodes || [];
    let editingIdx = -1;

    function renderList() {
      dlg.innerHTML = `<b>金手指列表</b>
        <button id="cheatAddBtn" style="float:right;">新增</button>
        <br><br>
        <div id="cheatListArea"></div>
        <br>
        <button id="cheatCloseBtn" style="width:100%;">关闭</button>
        <div class="cheat-tip">
          <hr>
          <b>格式说明：</b><br>
          每行：名称 代码<br>
          代码支持：<br>
          1. 0000:00,0448:80,0446:05,0449:80<br>
          2. 038E:15 A5 A8 11 12（自动顺序写入）<br>
          compare可选，如 0000:00:FF<br>
          <span style="color:#c00;">编辑/新增后默认禁用，需手动勾选启用</span>
        </div>
      `;
      let area = dlg.querySelector('#cheatListArea');
      if (cheatList.length === 0) {
        area.innerHTML = '<div style="color:#888;">暂无金手指</div>';
      } else {
        area.innerHTML = cheatList.map((c, i) => `
          <div class="cheat-row">
            <input type="checkbox" class="cheat-enable" data-idx="${i}" ${c.enabled ? 'checked' : ''}>
            <span class="cheat-name">${c.name}</span>
            <span class="cheat-codes" style="display:none;">${c.codes.map(code =>
          code.compare !== undefined
            ? code.address.toString(16).padStart(4, '0').toUpperCase() + ':' + code.value.toString(16).padStart(2, '0').toUpperCase() + ':' + code.compare.toString(16).padStart(2, '0').toUpperCase()
            : code.address.toString(16).padStart(4, '0').toUpperCase() + ':' + code.value.toString(16).padStart(2, '0').toUpperCase()
        ).join(',')}</span>
            <button class="cheat-edit" data-idx="${i}">编辑</button>
            <button class="cheat-del" data-idx="${i}">删除</button>
          </div>
        `).join('');
      }
      // 事件绑定
      dlg.querySelectorAll('.cheat-enable').forEach(cb => {
        cb.onchange = function () {
          let idx = parseInt(this.getAttribute('data-idx'));
          nes.setCheatEnabled(idx, this.checked);
        };
      });
      dlg.querySelectorAll('.cheat-edit').forEach(btn => {
        btn.onclick = function () {
          editingIdx = parseInt(this.getAttribute('data-idx'));
          renderEdit(editingIdx);
        };
      });
      dlg.querySelectorAll('.cheat-del').forEach(btn => {
        btn.onclick = function () {
          let idx = parseInt(this.getAttribute('data-idx'));
          nes.cheatCodes.splice(idx, 1);
          cheatList = nes.cheatCodes;
          renderList();
        };
      });
      dlg.querySelector('#cheatAddBtn').onclick = function () {
        editingIdx = -1;
        renderEdit(-1);
      };
      dlg.querySelector('#cheatCloseBtn').onclick = function () {
        dlg.style.display = 'none';
        dlg.classList.remove('active');
      };
    }

    function renderEdit(idx) {
      let cheat = idx >= 0 ? cheatList[idx] : { enabled: false, name: '', codes: [] };
      let codeStr = '';
      if (idx >= 0) {
        codeStr = cheat.codes.map(cc =>
          cc.compare !== undefined
            ? cc.address.toString(16).padStart(4, '0').toUpperCase() + ':' + cc.value.toString(16).padStart(2, '0').toUpperCase() + ':' + cc.compare.toString(16).padStart(2, '0').toUpperCase()
            : cc.address.toString(16).padStart(4, '0').toUpperCase() + ':' + cc.value.toString(16).padStart(2, '0').toUpperCase()
        ).join('\n');
        dlg.innerHTML = `
          <b>编辑金手指</b><br><br>
          <label>描述 <input type="text" id="cheatEditName" value="${cheat.name || ''}" style="width:100%"></label><br>
          <label>代码 <textarea id="cheatEditCodes" rows="5" style="width:100%">${codeStr}</textarea></label><br>
          <button id="cheatEditSaveBtn">保存</button>
          <button id="cheatEditCancelBtn">取消</button>
          <div class="cheat-tip">
            <hr>
            <b>格式说明：</b><br>
            描述（单独输入），多行代码，每行一条，或一行内用逗号分隔<br>
            例：<br>
            0027:01<br>
            0026:11<br>
            或<br>
            0027:01,0026:11<br>
            <span style="color:#c00;">保存后默认禁用，需手动勾选启用</span>
          </div>
        `;
      } else {
        dlg.innerHTML = `
          <b>新增金手指</b><br><br>
          <label>描述 <input type="text" id="cheatAddName" style="width:100%"></label><br>
          <label>代码 <textarea id="cheatBatchInput" rows="6" style="width:100%" placeholder="0027:01&#10;0026:11"></textarea></label><br>
          <button id="cheatBatchSaveBtn">保存</button>
          <button id="cheatEditCancelBtn">取消</button>
          <div class="cheat-tip">
            <hr>
            <b>格式说明：</b><br>
            描述（单独输入），多行代码，每行一条，或一行内用逗号分隔<br>
            例：<br>
            0027:01<br>
            0026:11<br>
            或<br>
            0027:01,0026:11<br>
            <span style="color:#c00;">保存后默认禁用，需手动勾选启用</span>
          </div>
        `;
      }
      if (idx >= 0) {
        dlg.querySelector('#cheatEditSaveBtn').onclick = function () {
          let name = dlg.querySelector('#cheatEditName').value.trim();
          let codeStr = dlg.querySelector('#cheatEditCodes').value.trim();
          let allCodes = [];
          codeStr.split('\n').forEach(line => {
            line.split(',').forEach(item => {
              if (item.trim()) allCodes.push(item.trim());
            });
          });
          nes.cheatCodes[idx] = {};
          let codes = [];
          allCodes.forEach(item => {
            window.nes.addCheat(false, name, item, undefined);
            let last = window.nes.cheatCodes.pop();
            if (last && last.codes && last.codes.length) {
              codes = codes.concat(last.codes);
            }
          });
          nes.cheatCodes[idx] = { enabled: false, name, codes };
          cheatList = nes.cheatCodes;
          renderList();
        };
      } else {
        dlg.querySelector('#cheatBatchSaveBtn').onclick = function () {
          let name = dlg.querySelector('#cheatAddName').value.trim();
          let codeStr = dlg.querySelector('#cheatBatchInput').value.trim();
          let allCodes = [];
          codeStr.split('\n').forEach(line => {
            line.split(',').forEach(item => {
              if (item.trim()) allCodes.push(item.trim());
            });
          });
          let codes = [];
          allCodes.forEach(item => {
            window.nes.addCheat(false, name, item, undefined);
            let last = window.nes.cheatCodes.pop();
            if (last && last.codes && last.codes.length) {
              codes = codes.concat(last.codes);
            }
          });
          nes.cheatCodes.push({ enabled: false, name, codes });
          cheatList = nes.cheatCodes;
          renderList();
        };
      }
      dlg.querySelector('#cheatEditCancelBtn').onclick = function () {
        renderList();
      };

      setTimeout(() => {
        let inputs = dlg.querySelectorAll('input[type="text"], textarea');
        inputs.forEach(input => {
          input.addEventListener('keydown', function (e) {
            e.stopPropagation();
          }, true);
          input.addEventListener('keyup', function (e) {
            e.stopPropagation();
          }, true);
        });
      }, 0);
    }

    renderList();
    container.appendChild(dlg);
  }


  // 控制器弹窗
  window.showControllerDialog = function () {
    let dlg = document.getElementById('controllerDialog');
    let container = document.getElementById('fullscreenContainer') || document.body;
    if (dlg) {
      dlg.style.display = 'block';
      dlg.classList.add('active');
      return;
    }
    dlg = document.createElement('div');
    dlg.id = 'controllerDialog';
    dlg.className = 'controller-dialog active';

    // 补充内容：添加控制器设置和透明按键设置的tab
    let tabHeader = document.createElement('div');
    tabHeader.className = 'transp-tab-header';
    tabHeader.innerHTML = `<button id="tabController">控制器设置</button>
                           <button id="tabTransp">透明按键设置</button>`;
    dlg.appendChild(tabHeader);

    let contentDiv = document.createElement('div');
    contentDiv.id = 'controllerContent';
    dlg.appendChild(contentDiv);

    let currentPlayer = 1;
    if (window.renderControllerTab) {
      window.renderControllerTab(contentDiv, currentPlayer);
    }

    setTimeout(() => {
      let tabCtrl = document.getElementById('tabController');
      let tabTransp = document.getElementById('tabTransp');
      if (tabCtrl && window.renderControllerTab) {
        tabCtrl.onclick = function () {
          window.renderControllerTab(contentDiv, currentPlayer);
        };
      }
      if (tabTransp && window.renderTransparentTab) {
        tabTransp.onclick = function () {
          window.renderTransparentTab(contentDiv);
        };
      }
    }, 0);

    container.appendChild(dlg);
  };

  // 全屏相关
  function enterFullscreen(elem) {
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  }

  function exitFullscreen() {
    try {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      }
    } catch (e) {
      // 忽略异常
    }
  }

  window.resizeCanvasToFitWindow = resizeCanvasToFitWindow;
  // canvas 自适应窗口，保持 NES 比例 256:240
  function resizeCanvasToFitWindow() {
    var output = document.getElementById('output');
    if (!output) return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var aspect = 256 / 240;
    var targetW = w, targetH = h;
    if (w / h > aspect) {
      targetH = h;
      targetW = Math.round(h * aspect);
    } else {
      targetW = w;
      targetH = Math.round(w / aspect);
    }
    output.width = 256;
    output.height = 240;
    output.style.width = targetW + "px";
    output.style.height = targetH + "px";
    output.style.maxWidth = "100vw";
    output.style.maxHeight = "100vh";
    // 透明按钮自适应
    if (window.updateCtxAfterResize) window.updateCtxAfterResize();
    if (window.renderTransparentOverlay) window.renderTransparentOverlay(false);
  }


  // 监听全屏变化
  function onFullscreenChange() {
    const fsElem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    const body = document.body;
    const msub = document.getElementById('msub');
    if (fsElem) {
      body.classList.add('fullscreen');
      if (msub) {
        msub.removeAttribute('style');
        void msub.offsetHeight;
      }
      if (window.renderTransparentOverlay) window.renderTransparentOverlay(false);
    } else {
      body.classList.remove('fullscreen');
      if (window.renderTransparentOverlay) window.renderTransparentOverlay(false);
      if (msub) {
        msub.removeAttribute('style');
      }
    }
  }

  // 绑定全屏事件
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  document.addEventListener('mozfullscreenchange', onFullscreenChange);
  document.addEventListener('MSFullscreenChange', onFullscreenChange);

  // 绑定Esc退出提示
  document.addEventListener('keydown', function (e) {
    if ((document.fullscreenElement || document.webkitFullscreenElement) && e.key === "Escape") {
      // 退出全屏时自动恢复菜单按钮
      setTimeout(() => {
        document.getElementById('msub').style.display = 'block';
      }, 100);
    }
  });


  window.joyButtonsVisible = true;
  // 触屏按钮显示/隐藏
  function toggleJoyButtons() {
    window.joyButtonsVisible = !window.joyButtonsVisible;
    if (window.renderTransparentOverlay) window.renderTransparentOverlay(false);
    // 保证暂停和加速按钮始终显示
    let turboBtn = document.getElementById('turboBtnOverlay');
    let pauseBtn = document.getElementById('pauseBtnOverlay');
    if (turboBtn) turboBtn.style.display = '';
    if (pauseBtn) pauseBtn.style.display = '';
  }

  // 绑定按钮
  window.addEventListener('DOMContentLoaded', function () {
    let cheatBtn = document.getElementById('Cheat');
    if (cheatBtn) cheatBtn.onclick = showCheatDialog;

    // 调试面板关闭按钮
    let closeBtn = document.getElementById('closeDebugPanelBtn');
    if (closeBtn) {
      closeBtn.onclick = function () {
        let wrapper = document.getElementById('wrapper');
        if (wrapper) wrapper.style.display = 'none';
      };
    }

    // 全屏按钮
    let fsBtn = document.getElementById('fullsc_');
    if (fsBtn) {
      fsBtn.onclick = function () {
        enterFullscreen(document.getElementById('fullscreenContainer') || document.body);
      };
    }

    // 触屏按钮显示/隐藏
    let joyBtn = document.getElementById('showjoybuttons');
    if (joyBtn) {
      joyBtn.onclick = toggleJoyButtons;
    }

    // 关于按钮
    let aboutBtn = document.getElementById('aboutme');
    if (aboutBtn) {
      aboutBtn.onclick = showAboutDialog;
    }
    window.addEventListener('resize', function () {
      if (window.isNsfMode) {
        // NSF模式下，调用NSF自适应
        if (window.nsfResizeCanvasToFitWindow) window.nsfResizeCanvasToFitWindow();
        if (window.nsfDrawVisual) window.nsfDrawVisual();
        document.querySelectorAll('.transparent-button').forEach(btn => {
          btn.style.display = "none";
        });
      } else {
        // NES模式下
        if (window.resizeCanvasToFitWindow) window.resizeCanvasToFitWindow();
        if (window.updateCtxAfterResize) window.updateCtxAfterResize();
        let turboBtn = document.getElementById('turboBtnOverlay');
        let pauseBtn = document.getElementById('pauseBtnOverlay');
        if (turboBtn) turboBtn.style.display = '';
        if (pauseBtn) pauseBtn.style.display = '';
      }
    });

  });



})();