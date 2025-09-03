// 添加配置管理器
window.IDBConfigManager = {
  dbName: 'NesEmulator',
  storeName: 'configs',

  // 打开数据库连接
  openDB: function (callback) {
    let request = indexedDB.open(this.dbName, 1);

    request.onerror = () => callback(request.error);

    request.onupgradeneeded = (e) => {
      let db = e.target.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName);
      }
    };

    request.onsuccess = () => callback(null, request.result);
  },

  // 保存配置
  save: function (config, callback) {
    this.openDB((err, db) => {
      if (err) return callback(err);

      let transaction = db.transaction([this.storeName], 'readwrite');
      let store = transaction.objectStore(this.storeName);

      // 保存所有配置
      let configData = {
        transparentButtons: window.transparentButtonSettings,
        keyMap: window.keyMap,
        commonKeyMap: window.commonKeyMap,
      };

      let request = store.put(configData, 'controllerConfig');

      request.onerror = () => callback(request.error);
      request.onsuccess = () => callback(null);
    });
  },

  // 加载配置
  load: function (callback) {
    this.openDB((err, db) => {
      if (err) return callback(err);

      let transaction = db.transaction([this.storeName], 'readonly');
      let store = transaction.objectStore(this.storeName);
      let request = store.get('controllerConfig');

      request.onerror = () => callback(request.error);
      request.onsuccess = () => {
        if (request.result) {
          callback(null, request.result);
        } else {
          // 返回默认配置
          callback(null, {
            transparentButtons: window.transparentButtonSettings,
            keyMap: window.keyMap,
            commonKeyMap: window.commonKeyMap,
          });
        }
      };
    });
  },
};

// 在 DOMContentLoaded 事件中调用初始化
// 初始化配置，优先从数据库加载
document.addEventListener('DOMContentLoaded', function () {
  window.IDBConfigManager.load(function (err, config) {
    if (config) {
      if (config.keyMap) window.keyMap = config.keyMap;
      if (config.commonKeyMap) window.commonKeyMap = config.commonKeyMap;
      if (config.transparentButtons)
        window.transparentButtonSettings = config.transparentButtons;
    } else {
      // 没有存储时初始化默认
      window.keyMap = {};
      window.keyMap[1] = { ...defaultKeyMap };
      window.keyMap[2] = { ...defaultKeyMap2 };
      window.commonKeyMap = { ...commonKeyMap };
      if (!isMobileDevice()) {
        window.transparentButtonSettings = {
          DPAD: {
            left: 0.03,
            top: 0.6,
            width: 0.32,
            height: 0.32,
            opacity: 0.7,
          },
          LOAD: {
            left: 0.65,
            top: 0.6,
            width: 0.1,
            height: 0.08,
            opacity: 0.5,
          },
          SAVE: { left: 0.8, top: 0.6, width: 0.1, height: 0.08, opacity: 0.5 },
          B: { left: 0.65, top: 0.75, width: 0.1, height: 0.08, opacity: 0.5 },
          A: { left: 0.8, top: 0.75, width: 0.1, height: 0.08, opacity: 0.5 },
          SELECT: {
            left: 0.35,
            top: 0.88,
            width: 0.12,
            height: 0.08,
            opacity: 0.5,
          },
          START: {
            left: 0.53,
            top: 0.88,
            width: 0.12,
            height: 0.08,
            opacity: 0.5,
          },
        };
      } else {
        setMobileButtonLayout();
      }
    }
    renderTransparentOverlay();
    // 其它初始化逻辑（如 waitForNesAndBindKeys() 等）放这里
    if (typeof waitForNesAndBindKeys === 'function') waitForNesAndBindKeys();
  });
});

// 修改默认透明按钮配置，调整 LOAD/SAVE/A/B 为田字排列
if (!isMobileDevice()) {
  // PC端
  window.transparentButtonSettings = {
    DPAD: { left: 0.03, top: 0.6, width: 0.32, height: 0.32, opacity: 0.7 },
    LOAD: { left: 0.65, top: 0.6, width: 0.1, height: 0.08, opacity: 0.5 },
    SAVE: { left: 0.8, top: 0.6, width: 0.1, height: 0.08, opacity: 0.5 },
    B: { left: 0.65, top: 0.75, width: 0.1, height: 0.08, opacity: 0.5 },
    A: { left: 0.8, top: 0.75, width: 0.1, height: 0.08, opacity: 0.5 },
    SELECT: { left: 0.35, top: 0.88, width: 0.12, height: 0.08, opacity: 0.5 },
    START: { left: 0.53, top: 0.88, width: 0.12, height: 0.08, opacity: 0.5 },
  };
  // 绘制完成后隐藏按钮
  window.joyButtonsVisible = false;
  // 需要等 DOM 渲染完再调用
  setTimeout(() => {
    if (window.toggleJoyButtons) window.toggleJoyButtons();
  }, 0);
} else {
  function setMobileButtonLayout() {
    if (isLandscape()) {
      // 横屏布局
      window.transparentButtonSettings = {
        DPAD: { left: 0.03, top: 0.6, width: 0.32, height: 0.32, opacity: 0.7 },
        SELECT: {
          left: 0.35,
          top: 0.8,
          width: 0.1,
          height: 0.08,
          opacity: 0.7,
        },
        START: { left: 0.5, top: 0.8, width: 0.1, height: 0.08, opacity: 0.7 },
        B: { left: 0.7, top: 0.75, width: 0.13, height: 0.13, opacity: 0.7 },
        A: { left: 0.85, top: 0.75, width: 0.13, height: 0.13, opacity: 0.7 },
        SAVE: { left: 0.85, top: 0.6, width: 0.1, height: 0.08, opacity: 0.7 },
        LOAD: { left: 0.7, top: 0.6, width: 0.1, height: 0.08, opacity: 0.7 },
      };
    } else {
      // 竖屏布局
      window.transparentButtonSettings = {
        DPAD: { left: 0.05, top: 0.6, width: 0.32, height: 0.32, opacity: 0.7 },
        SELECT: {
          left: 0.4,
          top: 0.88,
          width: 0.12,
          height: 0.08,
          opacity: 0.7,
        },
        START: {
          left: 0.6,
          top: 0.88,
          width: 0.12,
          height: 0.08,
          opacity: 0.7,
        },
        B: { left: 0.65, top: 0.7, width: 0.15, height: 0.08, opacity: 0.7 },
        A: { left: 0.84, top: 0.7, width: 0.15, height: 0.08, opacity: 0.7 },
        SAVE: { left: 0.84, top: 0.6, width: 0.15, height: 0.08, opacity: 0.7 },
        LOAD: { left: 0.65, top: 0.6, width: 0.15, height: 0.08, opacity: 0.7 },
      };
    }
  }
  // 初始化时设置
  setMobileButtonLayout();
  // 横竖屏切换时自动切换布局
  window.addEventListener('resize', function () {
    setMobileButtonLayout();
    if (window.renderTransparentOverlay) window.renderTransparentOverlay(false);
  });
}

function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

// 工具：获取所有按钮的配置信息（含DPAD），采用新的布局
function getAllButtonConfigs(container) {
  const W = container.offsetWidth,
    H = container.offsetHeight;
  let dpadSize = Math.min(W, H) * (isMobileDevice() ? 0.22 : 0.28);
  let dpadCfg = {
    key: 'DPAD',
    left: W * 0.08,
    top: H * 0.62,
    width: dpadSize,
    height: dpadSize,
  };
  let selectCfg = {
    key: 'SELECT',
    left: W * 0.36,
    top: H * 0.8,
    width: W * 0.12,
    height: H * 0.08,
  };
  let startCfg = {
    key: 'START',
    left: W * 0.52,
    top: H * 0.8,
    width: W * 0.12,
    height: H * 0.08,
  };
  let bCfg = {
    key: 'B',
    left: W * 0.68, // 修改为左侧位置
    top: H * 0.72,
    width: W * (isMobileDevice() ? 0.13 : 0.16),
    height: W * (isMobileDevice() ? 0.13 : 0.16),
  };
  let aCfg = {
    key: 'A',
    left: W * 0.82, // 修改为右侧位置
    top: H * 0.72,
    width: W * (isMobileDevice() ? 0.13 : 0.16),
    height: W * (isMobileDevice() ? 0.13 : 0.16),
  };
  let saveCfg = {
    key: 'SAVE',
    left: W * 0.82,
    top: H * 0.6,
    width: W * 0.1,
    height: H * 0.08,
  };
  let loadCfg = {
    key: 'LOAD',
    left: W * 0.68,
    top: H * 0.6,
    width: W * 0.1,
    height: H * 0.08,
  };
  return [dpadCfg, selectCfg, startCfg, aCfg, bCfg, saveCfg, loadCfg];
}

// 检查按钮是否与其它按钮重叠（基于配置，不依赖DOM）
function isButtonOverlap(rect, allRects) {
  for (let other of allRects) {
    if (
      rect.left < other.left + other.width &&
      rect.left + rect.width > other.left &&
      rect.top < other.top + other.height &&
      rect.top + rect.height > other.top
    ) {
      return true;
    }
  }
  return false;
}

// 自动布局透明按钮，避免重叠，适配容器（只初始化未设置过的按钮）
function autoLayoutTransparentButtons(container) {
  // 只在没有任何配置时才自动布局
  const keys = ['DPAD', 'SELECT', 'START', 'A', 'B', 'SAVE', 'LOAD'];
  if (
    window.transparentButtonSettings &&
    keys.every((k) => window.transparentButtonSettings[k])
  ) {
    return;
  }
  let btns = getAllButtonConfigs(container);
  for (let btn of btns) {
    if (!window.transparentButtonSettings[btn.key])
      window.transparentButtonSettings[btn.key] = {};
    let cfg = window.transparentButtonSettings[btn.key];
    if (typeof cfg.left !== 'number')
      cfg.left = btn.left / container.offsetWidth;
    if (typeof cfg.top !== 'number') cfg.top = btn.top / container.offsetHeight;
    if (typeof cfg.width !== 'number')
      cfg.width = btn.width / container.offsetWidth;
    if (typeof cfg.height !== 'number')
      cfg.height = btn.height / container.offsetHeight;
    if (typeof cfg.opacity !== 'number') cfg.opacity = 0.7;
  }
}

// 透明按钮渲染，支持八方向和全屏自适应
function renderTransparentOverlay(editMode = false) {
  let overlay = document.getElementById('transparentOverlay');
  let container = document.getElementById('fullscreenContainer');
  let output = document.getElementById('output');
  if (!output || !container) return;

  if (!editMode) autoLayoutTransparentButtons(container);

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'transparentOverlay';
    overlay.className = 'transparent-overlay';
    container.appendChild(overlay);
  }
  overlay.style.position = 'absolute';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.width = container.offsetWidth + 'px';
  overlay.style.height = container.offsetHeight + 'px';
  overlay.innerHTML = '';
  overlay.style.pointerEvents = 'none'; // 始终 none

  let selectedKey = window._transpEditSelectedKey || 'A';

  if (editMode) {
    let dlg = document.getElementById('controllerDialog');
    if (dlg) dlg.style.display = 'none';
  }

  function createDpad() {
    const dpad = document.createElement('div');
    dpad.className = 'transparent-button transp-btn-dpad';
    dpad.style.pointerEvents = 'auto';
    let s = window.transparentButtonSettings['DPAD'];
    if (!s) {
      s = { left: 0.03, top: 0.6, width: 0.32, height: 0.32, opacity: 0.7 };
      window.transparentButtonSettings['DPAD'] = s;
    }
    let base = Math.min(container.offsetWidth, container.offsetHeight);
    let size = Math.round(s.width * base);
    let l = Math.round(s.left * container.offsetWidth);
    let t = Math.round(s.top * container.offsetHeight);
    dpad.style.left = l + 'px';
    dpad.style.top = t + 'px';
    dpad.style.width = size + 'px';
    dpad.style.height = size + 'px';
    dpad.style.opacity = s.opacity ?? 0.7;
    dpad.style.borderRadius = '18px';
    dpad.style.background =
      'linear-gradient(135deg,rgba(60,60,60,0.18),rgba(220,220,220,0.18))';
    dpad.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.35)';
    dpad.style.border = '2px solid rgba(0,0,0,0.35)';
    dpad.style.zIndex = 1001;
    dpad.style.display = 'flex';
    dpad.style.alignItems = 'center';
    dpad.style.justifyContent = 'center';
    dpad.setAttribute('data-key', 'DPAD');
    if (editMode && selectedKey === 'DPAD')
      dpad.style.outline = '3px solid #4af';

    dpad.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" style="position:absolute;left:0;top:0;z-index:1;pointer-events:none;">
      <rect x="40" y="7" width="22" height="86" rx="7" fill="#222"/>
      <rect x="7" y="40" width="86" height="22" rx="7" fill="#222"/>
      <circle cx="50" cy="50" r="11" fill="#333"/>
    </svg>
    <div class="dpad-dir-highlight" data-dir="UP"></div>
    <div class="dpad-dir-highlight" data-dir="DOWN"></div>
    <div class="dpad-dir-highlight" data-dir="LEFT"></div>
    <div class="dpad-dir-highlight" data-dir="RIGHT"></div>
    <div class="dpad-dir-highlight" data-dir="UPLEFT"></div>
    <div class="dpad-dir-highlight" data-dir="UPRIGHT"></div>
    <div class="dpad-dir-highlight" data-dir="DOWNLEFT"></div>
    <div class="dpad-dir-highlight" data-dir="DOWNRIGHT"></div>
  `;

    let pressedDirs = {};
    function getDirsFromDir(dir) {
      if (!dir) return [];
      if (dir === 'UPLEFT') return ['UP', 'LEFT'];
      if (dir === 'UPRIGHT') return ['UP', 'RIGHT'];
      if (dir === 'DOWNLEFT') return ['DOWN', 'LEFT'];
      if (dir === 'DOWNRIGHT') return ['DOWN', 'RIGHT'];
      return [dir];
    }
    function pressDir(dir) {
      let dirs = getDirsFromDir(dir);
      dirs.forEach((d) => {
        if (!pressedDirs[d]) {
          handleVirtualButtonDown(d);
          pressedDirs[d] = true;
        }
      });
    }
    function releaseAllDirs() {
      Object.keys(pressedDirs).forEach((d) => {
        if (pressedDirs[d]) {
          handleVirtualButtonUp(d);
          pressedDirs[d] = false;
        }
      });
    }
    function setDpadHighlight(dir) {
      overlay.querySelectorAll('.dpad-dir-highlight').forEach((el) => {
        if (el.getAttribute('data-dir') === dir) el.classList.add('active');
        else el.classList.remove('active');
      });
      let svg = overlay.querySelector('.transp-btn-dpad svg');
      if (svg) {
        svg.querySelectorAll('.dpad-dot').forEach((dot) => {
          if (dot.getAttribute('data-dir') === dir) {
            dot.setAttribute('opacity', '1');
          } else {
            dot.setAttribute('opacity', '0.5');
          }
        });
      }
    }
    function clearDpadHighlight() {
      dpad
        .querySelectorAll('.dpad-dir-highlight')
        .forEach((el) => el.classList.remove('active'));
    }

    let lastDir = null;
    let dpadCenter = null;

    // 用屏幕坐标判定方向，支持滑出dpad区域
    function getDpadDirectionByScreen(center, clientX, clientY) {
      const dx = clientX - center.x;
      const dy = clientY - center.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r < 14) return null; // 死区
      let angle = (Math.atan2(-dy, dx) * 180) / Math.PI;
      if (angle < 0) angle += 360;
      if (angle >= 337.5 || angle < 22.5) return 'RIGHT';
      if (angle >= 22.5 && angle < 67.5) return 'UPRIGHT';
      if (angle >= 67.5 && angle < 112.5) return 'UP';
      if (angle >= 112.5 && angle < 157.5) return 'UPLEFT';
      if (angle >= 157.5 && angle < 202.5) return 'LEFT';
      if (angle >= 202.5 && angle < 247.5) return 'DOWNLEFT';
      if (angle >= 247.5 && angle < 292.5) return 'DOWN';
      if (angle >= 292.5 && angle < 337.5) return 'DOWNRIGHT';
      return null;
    }

    function updateDpadDirection(clientX, clientY) {
      if (!dpadCenter) return;
      const dir = getDpadDirectionByScreen(dpadCenter, clientX, clientY);
      if (dir !== lastDir) {
        releaseAllDirs();
        pressDir(dir);
        lastDir = dir;
      }
      setDpadHighlight(dir);
    }

    if (!editMode) {
      dpad.addEventListener(
        'touchstart',
        function (e) {
          if (!e.touches.length) return;
          const rect = dpad.getBoundingClientRect();
          dpadCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
          updateDpadDirection(e.touches[0].clientX, e.touches[0].clientY);
          e.preventDefault();
        },
        { passive: false },
      );

      dpad.addEventListener(
        'touchmove',
        function (e) {
          if (!e.touches.length) return;
          updateDpadDirection(e.touches[0].clientX, e.touches[0].clientY);
          e.preventDefault();
        },
        { passive: false },
      );

      dpad.addEventListener(
        'touchend',
        function (e) {
          releaseAllDirs();
          lastDir = null;
          clearDpadHighlight();
          dpadCenter = null;
          e.preventDefault();
        },
        { passive: false },
      );

      dpad.addEventListener('mousedown', function (e) {
        const rect = dpad.getBoundingClientRect();
        dpadCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        updateDpadDirection(e.clientX, e.clientY);

        function mouseMove(ev) {
          updateDpadDirection(ev.clientX, ev.clientY);
        }
        function mouseUp(ev) {
          releaseAllDirs();
          lastDir = null;
          clearDpadHighlight();
          dpadCenter = null;
          document.removeEventListener('mousemove', mouseMove);
          document.removeEventListener('mouseup', mouseUp);
        }
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
        e.preventDefault();
      });
    } else {
      enableDragResizeMobile(dpad, 'DPAD', overlay, container);
      dpad.onclick = function (e) {
        window._transpEditSelectedKey = 'DPAD';
        renderTransparentOverlay(true);
        e.stopPropagation();
      };
      dpad.addEventListener('touchstart', (e) => e.stopPropagation(), {
        passive: false,
      });
      dpad.addEventListener('mousedown', (e) => e.stopPropagation(), false);
    }
    overlay.appendChild(dpad);
  }

  if (window.joyButtonsVisible) {
    createDpad();
  }

  const btnCfgs = [
    { key: 'SELECT' },
    { key: 'START' },
    { key: 'A' },
    { key: 'B' },
    { key: 'SAVE' },
    { key: 'LOAD' },
  ];
  let btnElems = [];
  btnCfgs.forEach((cfg) => {
    // 只在 joyButtonsVisible 为 true 时显示
    if (!window.joyButtonsVisible) return;
    let btn = document.createElement('div');
    btn.className = 'transparent-button transp-btn-rect'; // 改成长方形
    if (editMode) btn.classList.add('transp-editing');
    let s = window.transparentButtonSettings[cfg.key];
    let w = Math.round(s.width * container.offsetWidth);
    let h = Math.round(s.height * container.offsetHeight);
    let l = Math.round(s.left * container.offsetWidth);
    let t = Math.round(s.top * container.offsetHeight);
    btn.style.left = l + 'px';
    btn.style.top = t + 'px';
    btn.style.width = w + 'px';
    btn.style.height = h + 'px';
    btn.style.opacity = s.opacity ?? 0.7;
    btn.style.border = '2px solid rgba(0,0,0,0.35)';
    btn.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.35)';
    btn.style.background =
      'linear-gradient(135deg,rgba(60,60,60,0.18),rgba(220,220,220,0.18))';
    btn.setAttribute('data-key', cfg.key);
    btn.innerHTML = `<span class="transp-btn-label">${
      cfg.key === 'SAVE' ? 'S' : cfg.key === 'LOAD' ? 'L' : cfg.key
    }</span>`;

    if (editMode) {
      enableDragResizeMobile(btn, cfg.key, overlay, container, btnElems);
      btn.onclick = function (e) {
        window._transpEditSelectedKey = cfg.key;
        renderTransparentOverlay(true);
        e.stopPropagation();
      };
      if (window._transpEditSelectedKey === cfg.key) {
        btn.style.outline = '3px solid #4af';
        btn.style.zIndex = 1002;
      }
      btn.addEventListener('touchstart', (e) => e.stopPropagation(), {
        passive: false,
      });
      btn.addEventListener('mousedown', (e) => e.stopPropagation(), false);
    } else {
      btn.addEventListener(
        'touchstart',
        function (e) {
          e.preventDefault();
          btn.classList.add('transp-pressed');
          handleVirtualButtonDown(cfg.key);
        },
        { passive: false },
      );
      btn.addEventListener(
        'touchend',
        function (e) {
          e.preventDefault();
          btn.classList.remove('transp-pressed');
          handleVirtualButtonUp(cfg.key);
        },
        { passive: false },
      );
      btn.addEventListener(
        'mousedown',
        function (e) {
          btn.classList.add('transp-pressed');
          handleVirtualButtonDown(cfg.key);
          e.stopPropagation();
        },
        false,
      );
      btn.addEventListener(
        'mouseup',
        function (e) {
          btn.classList.remove('transp-pressed');
          handleVirtualButtonUp(cfg.key);
          e.stopPropagation();
        },
        false,
      );
      btn.addEventListener(
        'mouseleave',
        function (e) {
          btn.classList.remove('transp-pressed');
          handleVirtualButtonUp(cfg.key);
        },
        false,
      );
    }
    overlay.appendChild(btn);
    btnElems.push(btn);
  });

  // 菜单按钮
  let menuBtn = document.getElementById('msub');
  let menuBtnRect = menuBtn
    ? menuBtn.getBoundingClientRect()
    : { right: 16, top: 16, height: 48 };

  // 右上角加速按钮和暂停按钮始终显示，紧挨菜单按钮右侧
  let showTurboBtn = typeof window.setTurboSpeed === 'function';
  let showPauseBtn =
    typeof window.pause === 'function' && typeof window.unpause === 'function';

  // 计算按钮位置
  let btnSize = 48;
  let btnGap = 12;
  let baseTop = btnGap + window.scrollY;
  let baseLeft = btnGap + window.scrollX;

  // 加速按钮
  let turboBtn;
  if (showTurboBtn) {
    turboBtn =
      document.getElementById('turboBtnOverlay') ||
      document.createElement('div');
    turboBtn.id = 'turboBtnOverlay';
    turboBtn.className =
      'transparent-button transp-btn-circle gamepad-toolbar-btn';
    turboBtn.style.position = 'fixed';
    turboBtn.style.left = baseLeft + 'px';
    turboBtn.style.top = baseTop + 'px';
    turboBtn.style.width = btnSize + 'px';
    turboBtn.style.height = btnSize + 'px';
    turboBtn.style.opacity = 0.7;
    turboBtn.style.zIndex = 1003;
    turboBtn.setAttribute('data-key', 'TURBO');
    turboBtn.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 32 32" style="display:block;margin:auto;">
          <circle cx="16" cy="16" r="15" fill="#fff3" stroke="#fff" stroke-width="2"/>
          <text x="16" y="22" text-anchor="middle" font-size="16" fill="#fff" font-weight="bold">${
            window.turboSpeed || 1
          }X</text>
        </svg>
      `;
    if (!editMode) {
      turboBtn.onclick = function (e) {
        if (!window.turboSpeed) window.turboSpeed = 1;
        window.turboSpeed = window.turboSpeed === 3 ? 1 : window.turboSpeed + 1;
        let svg = turboBtn.querySelector('text');
        if (svg) svg.textContent = window.turboSpeed + 'X';
        if (window.setTurboSpeed) window.setTurboSpeed(window.turboSpeed);
        e.preventDefault();
      };
    }
    overlay.appendChild(turboBtn);
  }

  // 暂停按钮
  let pauseBtn;
  if (showPauseBtn) {
    pauseBtn =
      document.getElementById('pauseBtnOverlay') ||
      document.createElement('div');
    pauseBtn.id = 'pauseBtnOverlay';
    pauseBtn.className =
      'transparent-button transp-btn-circle gamepad-toolbar-btn';
    pauseBtn.style.position = 'fixed';
    pauseBtn.style.left = baseLeft + btnSize + btnGap + 'px';
    pauseBtn.style.top = baseTop + 'px';
    pauseBtn.style.width = btnSize + 'px';
    pauseBtn.style.height = btnSize + 'px';
    pauseBtn.style.opacity = 0.7;
    pauseBtn.style.zIndex = 1003;
    pauseBtn.setAttribute('data-key', 'PAUSEBTN');
    // 用SVG绘制暂停/继续
    let paused = typeof window.paused !== 'undefined' ? window.paused : false;
    pauseBtn.innerHTML = paused
      ? `<svg width="32" height="32" viewBox="0 0 32 32" style="display:block;margin:auto;">
              <circle cx="16" cy="16" r="15" fill="#fff3" stroke="#fff" stroke-width="2"/>
              <polygon points="12,10 24,16 12,22" fill="#fff"/>
           </svg>`
      : `<svg width="32" height="32" viewBox="0 0 32 32" style="display:block;margin:auto;">
              <circle cx="16" cy="16" r="15" fill="#fff3" stroke="#fff" stroke-width="2"/>
              <rect x="10" y="10" width="4" height="12" rx="2" fill="#fff"/>
              <rect x="18" y="10" width="4" height="12" rx="2" fill="#fff"/>
           </svg>`;
    if (!editMode) {
      pauseBtn.onclick = function (e) {
        if (typeof window.paused === 'undefined') window.paused = false;
        if (window.pause && window.unpause) {
          if (!window.paused) {
            window.setPausedState(true);
            window.paused = true;
          } else {
            window.setPausedState(false);
            window.paused = false;
          }
          window.updatePauseBtnOverlayState &&
            window.updatePauseBtnOverlayState();
        }
        e.preventDefault();
      };
    }
    overlay.appendChild(pauseBtn);
  }

  // 提供外部同步暂停按钮状态的接口
  window.updatePauseBtnOverlayState = function () {
    let pauseBtn = document.getElementById('pauseBtnOverlay');
    if (!pauseBtn) return;
    let paused = typeof window.paused !== 'undefined' ? window.paused : false;
    pauseBtn.innerHTML = paused
      ? `<svg width="32" height="32" viewBox="0 0 32 32" style="display:block;margin:auto;">
              <circle cx="16" cy="16" r="15" fill="#fff3" stroke="#fff" stroke-width="2"/>
              <polygon points="12,10 24,16 12,22" fill="#fff"/>
           </svg>`
      : `<svg width="32" height="32" viewBox="0 0 32 32" style="display:block;margin:auto;">
              <circle cx="16" cy="16" r="15" fill="#fff3" stroke="#fff" stroke-width="2"/>
              <rect x="10" y="10" width="4" height="12" rx="2" fill="#fff"/>
              <rect x="18" y="10" width="4" height="12" rx="2" fill="#fff"/>
           </svg>`;
  };

  // 修改存档管理按钮，将其放在暂停按钮右侧
  if (!overlay.querySelector('#saveManagerBtn')) {
    let saveBtn = document.createElement('div');
    saveBtn.id = 'saveManagerBtn';
    saveBtn.className =
      'transparent-button transp-btn-circle gamepad-toolbar-btn';
    // 将存档管理按钮放置在暂停按钮右边，暂停按钮位置为 (baseLeft + btnSize + btnGap)
    // 故存档按钮 left = baseLeft + 2 * (btnSize + btnGap)
    saveBtn.style.position = 'fixed';
    saveBtn.style.left = baseLeft + 2 * (btnSize + btnGap) + 'px';
    saveBtn.style.top = baseTop + 'px';
    saveBtn.style.width = '48px';
    saveBtn.style.height = '48px';
    saveBtn.style.opacity = '0.7';
    saveBtn.style.background = 'rgba(0,123,255,0.6)';
    saveBtn.style.borderRadius = '8px';
    saveBtn.style.display = 'flex';
    saveBtn.style.alignItems = 'center';
    saveBtn.style.justifyContent = 'center';
    saveBtn.style.cursor = 'pointer';
    saveBtn.innerHTML = '<span style="color:#fff;font-size:0.9em;">存档</span>';
    saveBtn.onclick = function (e) {
      e.stopPropagation();
      // 调用存档管理界面显示函数，同时需设置全局当前卡槽(window.currentSaveSlot)
      if (window.SaveManagerUI) window.SaveManagerUI.show();
    };
    overlay.appendChild(saveBtn);
  }

  let floatBarId = 'transpEditFloatBar';
  let oldBar = document.getElementById(floatBarId);
  if (oldBar) oldBar.remove();
  if (editMode) {
    let floatBar = document.createElement('div');
    floatBar.id = floatBarId;
    floatBar.className = 'transp-float-bar';
    floatBar.innerHTML = `
        <button id="transpFloatSaveBtn">保存</button>
        <button id="transpFloatCancelBtn">取消</button>
        <button id="transpFloatBiggerBtn">放大</button>
        <button id="transpFloatSmallerBtn">缩小</button>
        <button id="transpFloatOpacityBtn">透明度</button>
      `;
    container.appendChild(floatBar);

    document.getElementById('transpFloatSaveBtn').onclick = function () {
      renderTransparentOverlay(false);
      window._transpEditSelectedKey = undefined;
      // 保存透明按钮配置到 IndexedDB
      if (window.IDBConfigManager && window.IDBConfigManager.save) {
        window.IDBConfigManager.save(
          {
            transparentButtons: window.transparentButtonSettings,
            keyMap: window.keyMap,
            commonKeyMap: window.commonKeyMap,
          },
          function (err) {
            if (err) {
              alert('保存按键配置失败');
            } else {
              let dlg = document.getElementById('controllerDialog');
              if (dlg) dlg.style.display = 'none';
            }
          },
        );
      }
    };
    document.getElementById('transpFloatCancelBtn').onclick = function () {
      renderTransparentOverlay(false);
      window._transpEditSelectedKey = undefined;
    };

    function adjustBtn(prop, delta) {
      let key = window._transpEditSelectedKey || 'A';
      if (key === 'DPAD') {
        let dpad = overlay.querySelector('.transp-btn-dpad');
        if (!dpad) return;
        let curSize = parseFloat(dpad.style.width);
        let newSize = Math.max(40, curSize + delta);
        dpad.style.width = dpad.style.height = newSize + 'px';
      } else {
        let btn = overlay.querySelector(
          '.transparent-button[data-key="' + key + '"]',
        );
        if (!btn) return;
        let curW = parseFloat(btn.style.width);
        let curH = parseFloat(btn.style.height);
        let newW = Math.max(24, curW + delta);
        let newH = Math.max(24, curH + delta);
        let left = parseInt(btn.style.left, 10);
        let top = parseInt(btn.style.top, 10);
        newW = Math.min(newW, container.offsetWidth - left);
        newH = Math.min(newH, container.offsetHeight - top);
        btn.style.width = newW + 'px';
        btn.style.height = newH + 'px';
        window.transparentButtonSettings[key].width =
          newW / container.offsetWidth;
        window.transparentButtonSettings[key].height =
          newH / container.offsetHeight;
        let allBtns = Array.from(
          overlay.querySelectorAll('.transparent-button'),
        );
        while (isButtonOverlap(btn, allBtns) && newW > 24 && newH > 24) {
          newW -= 4;
          newH -= 4;
          btn.style.width = newW + 'px';
          btn.style.height = newH + 'px';
          window.transparentButtonSettings[key].width =
            newW / container.offsetWidth;
          window.transparentButtonSettings[key].height =
            newH / container.offsetHeight;
        }
      }
    }
    document.getElementById('transpFloatBiggerBtn').onclick = function () {
      adjustBtn('size', 10);
    };
    document.getElementById('transpFloatSmallerBtn').onclick = function () {
      adjustBtn('size', -10);
    };
    document.getElementById('transpFloatOpacityBtn').onclick = function () {
      let key = window._transpEditSelectedKey || 'A';
      let btn = overlay.querySelector(
        key === 'DPAD'
          ? '.transp-btn-dpad'
          : '.transparent-button[data-key="' + key + '"]',
      );
      if (!btn) return;
      let cur = parseFloat(btn.style.opacity) || 0.7;
      let next = cur + 0.2;
      if (next > 1) next = 0.3;
      btn.style.opacity = next;
      window.transparentButtonSettings[key].opacity = next; // 无论什么按钮都同步
    };
  }
}

function handleVirtualButtonDown(key) {
  let nes = getActiveNesInstance();
  if (key === 'SAVE') {
    if (loaded && nes && nes.getState) {
      save_State();
    }
  } else if (key === 'LOAD') {
    if (loaded && nes && nes.setState) {
      load_State();
    }
  } else {
    if (
      nes &&
      nes.setButtonPressed &&
      nes.INPUT &&
      nes.INPUT[key] !== undefined
    ) {
      nes.setButtonPressed(1, nes.INPUT[key]);
    }
  }
}
function handleVirtualButtonUp(key) {
  let nes = getActiveNesInstance();
  if (
    ['A', 'B', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'SELECT', 'START'].includes(key)
  ) {
    if (
      nes &&
      nes.setButtonReleased &&
      nes.INPUT &&
      nes.INPUT[key] !== undefined
    ) {
      nes.setButtonReleased(1, nes.INPUT[key]);
    }
  }
}

function enableDragResizeMobile(el, key, overlay, container, btnElems) {
  let startX,
    startY,
    origL,
    origT,
    origW,
    origH,
    resizing = false,
    dragging = false;
  let handle = document.createElement('div');
  handle.className = 'transp-resize-handle';
  el.appendChild(handle);

  handle.addEventListener(
    'touchstart',
    function (e) {
      resizing = true;
      let touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      origW = el.offsetWidth;
      origH = el.offsetHeight;
      e.stopPropagation();
      e.preventDefault();
      document.ontouchmove = resizeMove;
      document.ontouchend = resizeEnd;
    },
    { passive: false },
  );
  function resizeMove(e) {
    let touch = e.touches[0];
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    let newW = Math.max(24, origW + dx);
    let newH = Math.max(24, origH + dy);
    let left = parseInt(el.style.left, 10);
    let top = parseInt(el.style.top, 10);

    if (key === 'DPAD') {
      // 方向键正方形
      let base = Math.min(container.offsetWidth, container.offsetHeight);
      let size = Math.max(newW, newH);
      size = Math.min(
        size,
        container.offsetWidth - left,
        container.offsetHeight - top,
      );
      el.style.width = el.style.height = size + 'px';
      window.transparentButtonSettings[key].width = size / base;
      window.transparentButtonSettings[key].height = size / base;
      let svg = el.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
      }
    } else {
      // 其他按钮保持宽高独立
      newW = Math.min(newW, container.offsetWidth - left);
      newH = Math.min(newH, container.offsetHeight - top);
      el.style.width = newW + 'px';
      el.style.height = newH + 'px';
      window.transparentButtonSettings[key].width =
        newW / container.offsetWidth;
      window.transparentButtonSettings[key].height =
        newH / container.offsetHeight;
    }

    let allBtns =
      btnElems || Array.from(overlay.querySelectorAll('.transparent-button'));
    while (
      isButtonOverlap(el, allBtns) &&
      el.offsetWidth > 24 &&
      el.offsetHeight > 24
    ) {
      if (key === 'DPAD') {
        let size = el.offsetWidth - 4;
        el.style.width = el.style.height = size + 'px';
        window.transparentButtonSettings[key].width =
          size / container.offsetWidth;
        window.transparentButtonSettings[key].height =
          size / container.offsetHeight;
        let svg = el.querySelector('svg');
        if (svg) {
          svg.setAttribute('width', size);
          svg.setAttribute('height', size);
        }
      } else {
        let newW = el.offsetWidth - 4;
        let newH = el.offsetHeight - 4;
        el.style.width = newW + 'px';
        el.style.height = newH + 'px';
        window.transparentButtonSettings[key].width =
          newW / container.offsetWidth;
        window.transparentButtonSettings[key].height =
          newH / container.offsetHeight;
      }
    }
  }
  function resizeEnd(e) {
    document.ontouchmove = null;
    document.ontouchend = null;
    resizing = false;
  }

  handle.onmousedown = function (e) {
    resizing = true;
    startX = e.clientX;
    startY = e.clientY;
    origW = el.offsetWidth;
    origH = el.offsetHeight;
    document.onmousemove = resizeMoveMouse;
    document.onmouseup = resizeEndMouse;
    e.stopPropagation();
    e.preventDefault();
  };
  function resizeMoveMouse(e) {
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    let newW = Math.max(24, origW + dx);
    let newH = Math.max(24, origH + dy);
    let left = parseInt(el.style.left, 10);
    let top = parseInt(el.style.top, 10);

    if (key === 'DPAD') {
      let base = Math.min(container.offsetWidth, container.offsetHeight);
      let size = Math.max(newW, newH);
      size = Math.min(
        size,
        container.offsetWidth - left,
        container.offsetHeight - top,
      );
      el.style.width = el.style.height = size + 'px';
      window.transparentButtonSettings[key].width = size / base;
      window.transparentButtonSettings[key].height = size / base;
      let svg = el.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
      }
    } else {
      newW = Math.min(newW, container.offsetWidth - left);
      newH = Math.min(newH, container.offsetHeight - top);
      el.style.width = newW + 'px';
      el.style.height = newH + 'px';
      window.transparentButtonSettings[key].width =
        newW / container.offsetWidth;
      window.transparentButtonSettings[key].height =
        newH / container.offsetHeight;
    }

    let allBtns =
      btnElems || Array.from(overlay.querySelectorAll('.transparent-button'));
    while (
      isButtonOverlap(el, allBtns) &&
      el.offsetWidth > 24 &&
      el.offsetHeight > 24
    ) {
      if (key === 'DPAD') {
        let size = el.offsetWidth - 4;
        let base = Math.min(container.offsetWidth, container.offsetHeight);
        el.style.width = el.style.height = size + 'px';
        window.transparentButtonSettings[key].width = size / base;
        window.transparentButtonSettings[key].height = size / base;
        let svg = el.querySelector('svg');
        if (svg) {
          svg.setAttribute('width', size);
          svg.setAttribute('height', size);
        }
      } else {
        let newW = el.offsetWidth - 4;
        let newH = el.offsetHeight - 4;
        el.style.width = newW + 'px';
        el.style.height = newH + 'px';
        window.transparentButtonSettings[key].width =
          newW / container.offsetWidth;
        window.transparentButtonSettings[key].height =
          newH / container.offsetHeight;
      }
    }
  }
  function resizeEndMouse(e) {
    document.onmousemove = null;
    document.onmouseup = null;
    resizing = false;
  }

  el.addEventListener(
    'touchstart',
    function (e) {
      if (e.target === handle) return;
      dragging = true;
      let touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      origL = parseInt(el.style.left, 10);
      origT = parseInt(el.style.top, 10);
      e.preventDefault();
      document.ontouchmove = dragMove;
      document.ontouchend = dragEnd;
    },
    { passive: false },
  );
  function dragMove(e) {
    if (resizing) return;
    let touch = e.touches[0];
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    let newLeft = origL + dx;
    let newTop = origT + dy;
    newLeft = Math.max(
      0,
      Math.min(newLeft, container.offsetWidth - el.offsetWidth),
    );
    newTop = Math.max(
      0,
      Math.min(newTop, container.offsetHeight - el.offsetHeight),
    );
    el.style.left = newLeft + 'px';
    el.style.top = newTop + 'px';
    if (!window.transparentButtonSettings[key])
      window.transparentButtonSettings[key] = {};
    window.transparentButtonSettings[key].left =
      newLeft / container.offsetWidth;
    window.transparentButtonSettings[key].top = newTop / container.offsetHeight;
    let allBtns =
      btnElems || Array.from(overlay.querySelectorAll('.transparent-button'));
    while (
      isButtonOverlap(el, allBtns) &&
      el.offsetWidth > 24 &&
      el.offsetHeight > 24
    ) {
      let newW = el.offsetWidth - 4;
      let newH = el.offsetHeight - 4;
      el.style.width = newW + 'px';
      el.style.height = newH + 'px';
      window.transparentButtonSettings[key].width =
        newW / container.offsetWidth;
      window.transparentButtonSettings[key].height =
        newH / container.offsetHeight;
    }
  }
  function dragEnd(e) {
    document.ontouchmove = null;
    document.ontouchend = null;
    dragging = false;
  }

  el.onmousedown = function (e) {
    if (e.target === handle) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    origL = parseInt(el.style.left, 10);
    origT = parseInt(el.style.top, 10);
    document.onmousemove = dragMoveMouse;
    document.onmouseup = dragEndMouse;
    e.preventDefault();
  };
  function dragMoveMouse(e) {
    if (resizing) return;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    let newLeft = origL + dx;
    let newTop = origT + dy;
    newLeft = Math.max(
      0,
      Math.min(newLeft, container.offsetWidth - el.offsetWidth),
    );
    newTop = Math.max(
      0,
      Math.min(newTop, container.offsetHeight - el.offsetHeight),
    );
    el.style.left = newLeft + 'px';
    el.style.top = newTop + 'px';
    if (!window.transparentButtonSettings[key])
      window.transparentButtonSettings[key] = {};
    window.transparentButtonSettings[key].left =
      newLeft / container.offsetWidth;
    window.transparentButtonSettings[key].top = newTop / container.offsetHeight;
    let allBtns =
      btnElems || Array.from(overlay.querySelectorAll('.transparent-button'));
    while (
      isButtonOverlap(el, allBtns) &&
      el.offsetWidth > 24 &&
      el.offsetHeight > 24
    ) {
      let newW = el.offsetWidth - 4;
      let newH = el.offsetHeight - 4;
      el.style.width = newW + 'px';
      el.style.height = newH + 'px';
      window.transparentButtonSettings[key].width =
        newW / container.offsetWidth;
      window.transparentButtonSettings[key].height =
        newH / container.offsetHeight;
    }
  }
  function dragEndMouse(e) {
    document.onmousemove = null;
    document.onmouseup = null;
    dragging = false;
  }
}

function renderTransparentTab(contentDiv) {
  let html = `<div>
        <p>点击“拖动编辑”进入编辑模式，在模拟器画面上拖动透明按钮调整位置。</p>
    </div>
    <br>
    <button id="transpEditBtn">拖动编辑</button>
    <button id="transpResetBtn">复位</button>
    <button id="transpSaveBtn">确定</button>
    <button id="transpCancelBtn">取消</button>`;
  contentDiv.innerHTML = html;
  setTimeout(() => {
    const editBtn = document.getElementById('transpEditBtn');
    const resetBtn = document.getElementById('transpResetBtn');
    const saveBtn = document.getElementById('transpSaveBtn');
    const cancelBtn = document.getElementById('transpCancelBtn');
    if (editBtn) {
      editBtn.onclick = function () {
        renderTransparentOverlay(true);
      };
    }
    if (resetBtn) {
      resetBtn.onclick = function () {
        // 恢复默认配置
        if (!isMobileDevice()) {
          window.transparentButtonSettings = {
            DPAD: {
              left: 0.03,
              top: 0.6,
              width: 0.32,
              height: 0.32,
              opacity: 0.7,
            },
            LOAD: {
              left: 0.65,
              top: 0.6,
              width: 0.1,
              height: 0.08,
              opacity: 0.5,
            },
            SAVE: {
              left: 0.8,
              top: 0.6,
              width: 0.1,
              height: 0.08,
              opacity: 0.5,
            },
            B: {
              left: 0.65,
              top: 0.75,
              width: 0.1,
              height: 0.08,
              opacity: 0.5,
            },
            A: { left: 0.8, top: 0.75, width: 0.1, height: 0.08, opacity: 0.5 },
            SELECT: {
              left: 0.35,
              top: 0.88,
              width: 0.12,
              height: 0.08,
              opacity: 0.5,
            },
            START: {
              left: 0.53,
              top: 0.88,
              width: 0.12,
              height: 0.08,
              opacity: 0.5,
            },
          };
        } else {
          setMobileButtonLayout();
        }
        // 立即刷新按钮位置
        renderTransparentOverlay(false);

        // 写入数据库
        if (window.IDBConfigManager && window.IDBConfigManager.save) {
          window.IDBConfigManager.save(
            {
              transparentButtons: window.transparentButtonSettings,
              keyMap: window.keyMap,
              commonKeyMap: window.commonKeyMap,
            },
            function (err) {
              if (err) {
                alert('保存按键配置失败');
              } else {
                let dlg = document.getElementById('controllerDialog');
                if (dlg) dlg.style.display = 'none';
              }
            },
          );
        }
      };
    }
    // 在 renderControllerTab 函数中的 saveBtn.onclick 处理
    if (saveBtn) {
      saveBtn.onclick = function () {
        // 检查是否有重复按键
        let usedKeys = {};
        let hasDuplicate = false;
        for (let k in defaultKeyMap) {
          let v = document
            .getElementById('key_' + k)
            .value.trim()
            .toLowerCase();
          if (v) {
            if (usedKeys[v]) {
              alert('同一个按键不能分配给多个功能键，请检查！');
              hasDuplicate = true;
              break;
            }
            usedKeys[v] = true;
            keyMap[currentPlayer][k] = v;
          }
        }
        if (hasDuplicate) return;

        // 更新通用按键
        let saveKey = document
          .getElementById('common_save')
          .value.trim()
          .toLowerCase();
        let loadKey = document
          .getElementById('common_load')
          .value.trim()
          .toLowerCase();
        let softresetKey = document
          .getElementById('common_softreset')
          .value.trim()
          .toLowerCase();
        let hardresetKey = document
          .getElementById('common_hardreset')
          .value.trim()
          .toLowerCase();
        let pauseKey = document
          .getElementById('common_pause')
          .value.trim()
          .toLowerCase();
        let turboKey = document
          .getElementById('common_turbo')
          .value.trim()
          .toLowerCase();

        if (saveKey) commonKeyMap.save = saveKey;
        if (loadKey) commonKeyMap.load = loadKey;
        if (softresetKey) commonKeyMap.softreset = softresetKey;
        if (hardresetKey) commonKeyMap.hardreset = hardresetKey;
        if (pauseKey) commonKeyMap.pause = pauseKey;
        if (turboKey) commonKeyMap.turbo = turboKey;

        // 保存到数据库
        window.IDBConfigManager.save(
          {
            transparentButtons: window.transparentButtonSettings,
            keyMap: window.keyMap,
            commonKeyMap: window.commonKeyMap,
          },
          function (err) {
            if (err) {
              alert('保存按键配置失败');
            } else {
              let dlg = document.getElementById('controllerDialog');
              if (dlg) dlg.style.display = 'none';
            }
          },
        );
      };
    }
    if (cancelBtn) {
      cancelBtn.onclick = function () {
        let dlg = document.getElementById('controllerDialog');
        if (dlg) dlg.style.display = 'none';
      };
    }
  }, 0);
}

// 简约风格的按键设置
function renderControllerTab(contentDiv, currentPlayer) {
  let keys = Object.keys(defaultKeyMap);
  let btns = keys
    .map(
      (k) =>
        `<div class="ctrl-row">
      <label>${k.toUpperCase()}</label>
      <input type="text" id="key_${k}" value="${
          keyMap[currentPlayer][k]
        }" maxlength="1" autocomplete="off">
    </div>`,
    )
    .join('');
  let commonBtns = [
    { label: 'Save', id: 'save', val: commonKeyMap.save },
    { label: 'Load', id: 'load', val: commonKeyMap.load },
    { label: 'Soft Reset', id: 'softreset', val: commonKeyMap.softreset },
    { label: 'Hard Reset', id: 'hardreset', val: commonKeyMap.hardreset },
    { label: 'Pause', id: 'pause', val: commonKeyMap.pause },
    { label: 'Turbo', id: 'turbo', val: commonKeyMap.turbo },
  ]
    .map(
      (item) =>
        `<div class="ctrl-row">
      <label>${item.label}</label>
      <input type="text" id="common_${item.id}" value="${item.val}" maxlength="2" autocomplete="off">
    </div>`,
    )
    .join('');
  contentDiv.innerHTML = `
    <form id="ctrlForm" autocomplete="off">
      <div class="ctrl-section">
        <div class="ctrl-title">玩家${currentPlayer} 按键</div>
        ${btns}
      </div>
      <div class="ctrl-section">
        <div class="ctrl-title">通用功能</div>
        ${commonBtns}
      </div>
      <div class="ctrl-actions">
        <button type="button" id="controllerSaveBtn" class="main-btn">保存</button>
        <button type="button" id="switchPlayerBtn">切换到玩家${
          currentPlayer === 1 ? 2 : 1
        }</button>
        <button type="button" id="controllerCancelBtn">取消</button>
      </div>
    </form>
  `;
  setTimeout(() => {
    const saveBtn = document.getElementById('controllerSaveBtn');
    const cancelBtn = document.getElementById('controllerCancelBtn');
    const switchBtn = document.getElementById('switchPlayerBtn');
    if (saveBtn) {
      saveBtn.onclick = function () {
        // 检查是否有重复按键
        let usedKeys = {};
        let hasDuplicate = false;
        for (let k in defaultKeyMap) {
          let v = document
            .getElementById('key_' + k)
            .value.trim()
            .toLowerCase();
          if (v) {
            if (usedKeys[v]) {
              alert('同一个按键不能分配给多个功能键，请检查！');
              hasDuplicate = true;
              break;
            }
            usedKeys[v] = true;
            keyMap[currentPlayer][k] = v;
          }
        }
        if (hasDuplicate) return;
        // 更新通用按键
        let saveKey = document
          .getElementById('common_save')
          .value.trim()
          .toLowerCase();
        let loadKey = document
          .getElementById('common_load')
          .value.trim()
          .toLowerCase();
        let softresetKey = document
          .getElementById('common_softreset')
          .value.trim()
          .toLowerCase();
        let hardresetKey = document
          .getElementById('common_hardreset')
          .value.trim()
          .toLowerCase();
        let pauseKey = document
          .getElementById('common_pause')
          .value.trim()
          .toLowerCase();
        let turboKey = document
          .getElementById('common_turbo')
          .value.trim()
          .toLowerCase();
        if (saveKey) commonKeyMap.save = saveKey;
        if (loadKey) commonKeyMap.load = loadKey;
        if (softresetKey) commonKeyMap.softreset = softresetKey;
        if (hardresetKey) commonKeyMap.hardreset = hardresetKey;
        if (pauseKey) commonKeyMap.pause = pauseKey;
        if (turboKey) commonKeyMap.turbo = turboKey;
        // 保存到数据库
        window.IDBConfigManager.save(
          {
            transparentButtons: window.transparentButtonSettings,
            keyMap: window.keyMap,
            commonKeyMap: window.commonKeyMap,
          },
          function (err) {
            if (err) {
              alert('保存按键配置失败');
            } else {
              let dlg = document.getElementById('controllerDialog');
              if (dlg) dlg.style.display = 'none';
            }
          },
        );
      };
    }
    if (cancelBtn) {
      cancelBtn.onclick = function () {
        let dlg = document.getElementById('controllerDialog');
        if (dlg) dlg.style.display = 'none';
      };
    }
    if (switchBtn) {
      switchBtn.onclick = function () {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        renderControllerTab(contentDiv, currentPlayer);
      };
    }
  }, 0);
}

function showControllerDialog() {
  let dlg = document.getElementById('controllerDialog');
  let container =
    document.getElementById('fullscreenContainer') || document.body;
  if (dlg) {
    dlg.style.display = 'block';
    dlg.classList.add('active');
    return;
  }

  dlg = document.createElement('div');
  dlg.id = 'controllerDialog';
  dlg.className = 'controller-dialog active';
  dlg.innerHTML = `
    <div class="transp-tab-header">
      <button id="tabController" class="tab-btn active">按键设置</button>
      <button id="tabTransp" class="tab-btn">透明按钮</button>
      <button id="controllerCloseBtn" class="close-btn" title="关闭">×</button>
    </div>
    <div id="controllerContent"></div>
  `;
  container.appendChild(dlg);

  // 关闭按钮
  dlg.querySelector('#controllerCloseBtn').onclick = function () {
    dlg.style.display = 'none';
  };

  let currentPlayer = 1;
  renderControllerTab(
    document.getElementById('controllerContent'),
    currentPlayer,
  );

  // Tab切换
  dlg.querySelector('#tabController').onclick = function () {
    this.classList.add('active');
    dlg.querySelector('#tabTransp').classList.remove('active');
    renderControllerTab(
      document.getElementById('controllerContent'),
      currentPlayer,
    );
  };
  dlg.querySelector('#tabTransp').onclick = function () {
    this.classList.add('active');
    dlg.querySelector('#tabController').classList.remove('active');
    renderTransparentTab(document.getElementById('controllerContent'));
  };
}
