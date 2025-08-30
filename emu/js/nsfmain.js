// NSF 播放器相关变量
let nsfPlayer = null;
let nsfAudioHandler = null;
let nsfPaused = false;
let nsfLoaded = false;
let nsfLoopId = 0;
let nsfCurrentSong = 1;
let nsfRandomMode = false; // 随机播放

// 新增：NSF帧率控制变量
let nsfLastFrameTime = 0;
let nsfFrameResidue = 0;

window.nsfResizeCanvasToFitWindow = function () {
  const c = document.getElementById('output');
  if (!c) return;
  const dpr = window.devicePixelRatio || 1;
  let maxW = window.innerWidth,
    maxH = window.innerHeight;
  let scale = Math.min(maxW / 256, maxH / 240); // 按NSF画布比例调整
  let displayW = Math.round(256 * scale);
  let displayH = Math.round(240 * scale);
  c.width = displayW * dpr;
  c.height = displayH * dpr;
  c.style.width = displayW + 'px';
  c.style.height = displayH + 'px';
  // 如有需要，重建 context 或 imgData
  if (window.nsfUpdateCtxAfterResize) window.nsfUpdateCtxAfterResize();
};

// 按钮名称常量
const NSF_BTN_NAMES = [
  'prev',
  'pause',
  'next',
  'random',
  'edit',
  'debugger',
  'datafetch',
];

// 记录按钮的实际区域，便于点击判定
let nsfBtnDrawRects = {};
NSF_BTN_NAMES.forEach((name) => (nsfBtnDrawRects[name] = null));

// 新增：NSF/编辑模式切换
let nsfEditMode = false;
let nsfDebuggerPanel = null; // 新增：全局变量
// 不再生成HTML控件，全部canvas绘制
function showNsfUI() {
  // 隐藏 NES 控件
  [
    'pause',
    'reset',
    'hardreset',
    'palettes',
    'doutput',
    'turboBtnLabel',
  ].forEach((id) => {
    let elx = document.getElementById(id);
    if (elx) elx.style.display = 'none';
  });
  // 新增：隐藏所有触屏按钮（transparent-button类）
  document.querySelectorAll('.transparent-button').forEach((btn) => {
    btn.style.display = 'none';
  });
  nsfDrawVisual();

  // 绑定canvas点击/触摸事件（合并判定逻辑）
  let canvas = document.getElementById('output');
  function handleNsfCanvasEvent(x, y, isTouch) {
    for (const btn of NSF_BTN_NAMES) {
      if (nsfBtnDrawRects[btn] && inRect(x, y, nsfBtnDrawRects[btn])) {
        switch (btn) {
          case 'prev':
            nsfPrevSong();
            break;
          case 'pause':
            nsfPauseToggle();
            break;
          case 'next':
            nsfNextSong();
            break;
          case 'random':
            nsfRandomMode = !nsfRandomMode;
            nsfDrawVisual();
            break;
          case 'edit':
            nsfSwitchToEditMode();
            break;
          case 'debugger':
            openNsfDebugger();
            break;
          case 'datafetch':
            if (
              window.nsfDebugPL &&
              typeof window.nsfDebugPL.showHotspotAnalysis === 'function'
            ) {
              window.nsfDebugPL.showHotspotAnalysis();
            }
            break;
        }
        if (isTouch) event?.preventDefault();
        return;
      }
    }
  }
  canvas.onclick = function (e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    handleNsfCanvasEvent(x, y, false);
  };
  canvas.ontouchstart = function (e) {
    if (!e.touches || e.touches.length === 0) return;
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    handleNsfCanvasEvent(x, y, true);
  };
}

function openNsfDebugger() {
  // 打开调试器，只能有一个
  if (window.nsfDebugger && typeof window.nsfDebugger.init === 'function') {
    // 已有则先关闭
    if (nsfDebuggerPanel && nsfDebuggerPanel.parentNode) {
      return;
    }
    // 创建一个浮动层
    let panel = document.createElement('div');
    panel.style =
      'position:fixed;left:50vw;top:10vh;min-width:420px;max-height:90vh;overflow:auto;background:#222;border:2px solid #FFD700;z-index:5000;box-shadow:0 8px 32px #000;border-radius:8px;padding:0 0 18px 0;color:#FFD700;font-size:14px;';
    panel.innerHTML = `
        <div class="nsf-debugger-dragbar" style="cursor:move;user-select:none;display:flex;justify-content:space-between;align-items:center;background:#333;padding:8px 16px;border-radius:8px 8px 0 0;">
          <span style="color:#FFD700;font-size:16px;">NSF调试器</span>
          <button class="nsf-debugger-close" title="关闭" style="background:none;border:none;color:#FFD700;font-size:20px;cursor:pointer;">&#10005;</button>
        </div>
        <div id="nsf-debugger-float-panel"></div>
      `;
    document.body.appendChild(panel);
    nsfDebuggerPanel = panel; // 记录
    // 关闭按钮事件
    panel.querySelector('.nsf-debugger-close').onclick = function () {
      if (panel.parentNode) panel.parentNode.removeChild(panel);
      nsfDebuggerPanel = null;
    };
    // 拖动实现
    let dragbar = panel.querySelector('.nsf-debugger-dragbar');
    let dragging = false,
      offsetX = 0,
      offsetY = 0;
    dragbar.onmousedown = function (e) {
      // 如果点击的是按钮、输入框等，不拖拽
      if (
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'LABEL' ||
        e.target.closest('button') ||
        e.target.closest('input')
      )
        return;
      dragging = true;
      let rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      document.onmousemove = function (ev) {
        if (!dragging) return;
        panel.style.left = ev.clientX - offsetX + 'px';
        panel.style.top = ev.clientY - offsetY + 'px';
        panel.style.right = '';
        panel.style.bottom = '';
        panel.style.transform = '';
      };
      document.onmouseup = function () {
        dragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
      };
      e.preventDefault();
    };
    // 手机端拖拽支持（用addEventListener防止passive问题）
    let touchMoveHandler = function (ev) {
      if (!dragging || !ev.touches || ev.touches.length !== 1) return;
      let t = ev.touches[0];
      panel.style.left = t.clientX - offsetX + 'px';
      panel.style.top = t.clientY - offsetY + 'px';
      panel.style.right = '';
      panel.style.bottom = '';
      panel.style.transform = '';
      ev.preventDefault();
    };
    let touchEndHandler = function () {
      dragging = false;
      document.removeEventListener('touchmove', touchMoveHandler, {
        passive: false,
      });
      document.removeEventListener('touchend', touchEndHandler, {
        passive: false,
      });
    };
    dragbar.ontouchstart = function (e) {
      let t = e.target;
      if (
        t.tagName === 'BUTTON' ||
        t.tagName === 'INPUT' ||
        t.tagName === 'LABEL' ||
        t.closest('button') ||
        t.closest('input')
      )
        return;
      if (!e.touches || e.touches.length !== 1) return;
      dragging = true;
      let rect = panel.getBoundingClientRect();
      let touch = e.touches[0];
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
      document.addEventListener('touchmove', touchMoveHandler, {
        passive: false,
      });
      document.addEventListener('touchend', touchEndHandler, {
        passive: false,
      });
      e.preventDefault();
    };
    // 初始化调试器内容到指定panel
    window.nsfDebugger.init(panel.querySelector('#nsf-debugger-float-panel'));
  }
}
function hideNsfUI() {
  let canvas = document.getElementById('output');
  canvas.onclick = null;
  canvas.ontouchstart = null; // 新增：解绑触摸事件
  [
    'pause',
    'reset',
    'hardreset',
    'palettes',
    'doutput',
    'turboBtnLabel',
  ].forEach((id) => {
    let elx = document.getElementById(id);
    if (elx) elx.style.display = '';
  });
  // 恢复触屏按钮显示
  document.querySelectorAll('.transparent-button').forEach((btn) => {
    btn.style.display = '';
  });
}

function nsfSwitchToEditMode() {
  nsfEditMode = true;
  nsfStopPlayback();
  hideNsfUI();
  nsfShowEditUI();
}

function nsfSwitchToNsfMode() {
  nsfEditMode = false;
  nsfStopPlayback();
  hideNsfEditUI();
  showNsfUI();
}

// 停止NSF播放（共用）
function nsfStopPlayback() {
  if (nsfLoopId) cancelAnimationFrame(nsfLoopId);
  if (nsfAudioHandler) nsfAudioHandler.stop();
  nsfPaused = true;
}

// 编辑模式入口
function nsfShowEditUI() {
  // 由 nsfCT2edit.js 实现
  if (window.nsfEdit && window.nsfEdit.showEditUI) {
    window.nsfEdit.showEditUI(nsfSwitchToNsfMode);
  }
}

// 编辑模式隐藏
function hideNsfEditUI() {
  if (window.nsfEdit && window.nsfEdit.hideEditUI) {
    window.nsfEdit.hideEditUI();
  }
}

// NSF 播放相关函数
function nsfPauseToggle() {
  if (!nsfLoaded) return;
  if (nsfPaused) {
    // 暂停后继续播放
    nsfLastFrameTime = performance.now(); // 重置时间戳
    nsfFrameResidue = 0; // 重置残余时间

    // 新增：预填充音频缓冲区，避免恢复播放时声音卡顿
    if (nsfPlayer && nsfAudioHandler) {
      // 预先运行几帧但不播放，确保音频状态正确
      for (let i = 0; i < 3; i++) {
        nsfPlayer.runFrame();
        nsfPlayer.getSamples(
          nsfAudioHandler.sampleBuffer,
          nsfAudioHandler.samplesPerFrame,
        );
        nsfAudioHandler.nextBuffer();
      }
      // 重置音频处理器状态
      nsfAudioHandler.resetBuffers && nsfAudioHandler.resetBuffers();
    }

    nsfLoopId = requestAnimationFrame(nsfUpdate);
    nsfAudioHandler.start();
    nsfPaused = false;
  } else {
    cancelAnimationFrame(nsfLoopId);
    nsfAudioHandler.stop();
    nsfPaused = true;
  }
  window.nsfPaused = nsfPaused; // 保证全局同步
  nsfDrawVisual();
}
function nsfRestart() {
  if (nsfLoaded) {
    nsfPlayer.playSong(nsfCurrentSong);
    window.nsfPlayer = nsfPlayer; // 保证全局同步
    nsfDrawVisual();
  }
}
function nsfPrevSong() {
  if (nsfLoaded) {
    let total = nsfPlayer.totalSongs || 1;
    if (nsfRandomMode) {
      let next = nsfCurrentSong;
      while (total > 1 && next === nsfCurrentSong) {
        next = 1 + Math.floor(Math.random() * total);
      }
      nsfCurrentSong = next;
    } else {
      nsfCurrentSong--;
      if (nsfCurrentSong < 1) nsfCurrentSong = total; // 首尾循环
    }
    nsfPlayer.playSong(nsfCurrentSong);
    window.nsfPlayer = nsfPlayer; // 保证全局同步
    // 切歌时自动恢复播放
    if (nsfPaused) {
      nsfPaused = false;
      window.nsfPaused = nsfPaused;
      nsfLastFrameTime = performance.now(); // 重置时间戳
      nsfFrameResidue = 0; // 重置残余时间

      // 新增：预填充音频缓冲区，避免恢复播放时声音卡顿
      if (nsfPlayer && nsfAudioHandler) {
        // 预先运行几帧但不播放，确保音频状态正确
        for (let i = 0; i < 3; i++) {
          nsfPlayer.runFrame();
          nsfPlayer.getSamples(
            nsfAudioHandler.sampleBuffer,
            nsfAudioHandler.samplesPerFrame,
          );
          nsfAudioHandler.nextBuffer();
        }
        // 重置音频处理器状态
        nsfAudioHandler.resetBuffers && nsfAudioHandler.resetBuffers();
      }

      nsfAudioHandler.start();
      nsfLoopId = requestAnimationFrame(nsfUpdate);
    }
    nsfDrawVisual();
  }
}
function nsfNextSong() {
  if (nsfLoaded) {
    let total = nsfPlayer.totalSongs || 1;
    if (nsfRandomMode) {
      let next = nsfCurrentSong;
      while (total > 1 && next === nsfCurrentSong) {
        next = 1 + Math.floor(Math.random() * total);
      }
      nsfCurrentSong = next;
    } else {
      nsfCurrentSong++;
      if (nsfCurrentSong > total) nsfCurrentSong = 1; // 首尾循环
    }
    nsfPlayer.playSong(nsfCurrentSong);
    window.nsfPlayer = nsfPlayer; // 保证全局同步
    // 切歌时自动恢复播放
    if (nsfPaused) {
      nsfPaused = false;
      window.nsfPaused = nsfPaused;
      nsfLastFrameTime = performance.now(); // 重置时间戳
      nsfFrameResidue = 0; // 重置残余时间

      // 新增：预填充音频缓冲区，避免恢复播放时声音卡顿
      if (nsfPlayer && nsfAudioHandler) {
        // 预先运行几帧但不播放，确保音频状态正确
        for (let i = 0; i < 3; i++) {
          nsfPlayer.runFrame();
          nsfPlayer.getSamples(
            nsfAudioHandler.sampleBuffer,
            nsfAudioHandler.samplesPerFrame,
          );
          nsfAudioHandler.nextBuffer();
        }
        // 重置音频处理器状态
        nsfAudioHandler.resetBuffers && nsfAudioHandler.resetBuffers();
      }

      nsfAudioHandler.start();
      nsfLoopId = requestAnimationFrame(nsfUpdate);
    }
    nsfDrawVisual();
  }
}
function updateNsfSongInfo() {
  // 已集成到 nsfDrawVisual
}
function nsfUpdate() {
  if (nsfPaused) return; // 暂停时不推进

  // 新增：帧率控制逻辑
  let now = performance.now();
  let elapsed = now - nsfLastFrameTime;
  // 如果elapsed太大（如切回前台），只累计最多200ms，避免卡死
  if (elapsed > 200) elapsed = 200;
  nsfLastFrameTime = now;

  // 60帧每秒，每帧约16.6667ms
  let nsfFrames = (elapsed + nsfFrameResidue) / (1000 / 60);
  let framesToRun = Math.floor(nsfFrames);
  nsfFrameResidue = elapsed + nsfFrameResidue - framesToRun * (1000 / 60);

  // turbo模式支持
  let turbo = window.turboSpeed || 1;
  framesToRun = framesToRun * turbo;

  if (framesToRun > 0) {
    for (let i = 0; i < framesToRun; i++) {
      nsfRunFrame();
    }
  }

  nsfLoopId = requestAnimationFrame(nsfUpdate);
}
function nsfRunFrame() {
  if (!nsfLoaded) return;
  nsfPlayer.runFrame();
  nsfPlayer.getSamples(
    nsfAudioHandler.sampleBuffer,
    nsfAudioHandler.samplesPerFrame,
  );
  nsfAudioHandler.nextBuffer();
  nsfDrawVisual();

  // 新增：如果数据分析层可见且正在播放，自动刷新ROM读取统计
  if (
    window.nsfToCT2Code &&
    window.nsfToCT2Code.nsfDataFetchLayer &&
    window.nsfToCT2Code.nsfDataFetchLayer.style.display !== 'none' &&
    !nsfPaused &&
    typeof window.nsfToCT2Code.autoDumpRomReadStat === 'function'
  ) {
    window.nsfToCT2Code.autoDumpRomReadStat();
  }
}
function nsfDrawVisual() {
  let canvas = document.getElementById('output');
  let ctx = canvas.getContext('2d');

  // 适配高分辨率，提升清晰度
  const cssWidth = canvas.clientWidth || 256;
  const cssHeight = canvas.clientHeight || 240;
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== cssWidth * dpr || canvas.height !== cssHeight * dpr) {
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置变换
  ctx.scale(dpr, dpr);

  // 计算缩放比例（以256为基准）
  const baseWidth = 256;
  const scale = canvas.width / (window.devicePixelRatio || 1) / baseWidth;

  ctx.clearRect(0, 0, cssWidth, cssHeight);

  // 背景
  ctx.fillStyle = '#181818';
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  // 曲目信息
  ctx.fillStyle = '#5fcf5b';
  ctx.font = `bold ${Math.round(16 * scale)}px Arial`;
  fillString(
    ctx,
    nsfEditMode ? 'CT2编辑器' : 'NSF播放器',
    10 * scale,
    20 * scale,
  );

  // === 新增：调试器/数据分析按钮 ===
  let titleWidth = ctx.measureText(
    nsfEditMode ? 'CT2编辑器' : 'NSF播放器',
  ).width;
  let btnY = 6 * scale;
  let btnH = 20 * scale;
  let btnW = 62 * scale;
  let btnGap = 8 * scale;
  let debugBtnX = 10 * scale + titleWidth + 6 * scale;
  let dataBtnX = debugBtnX + btnW + btnGap;

  // 调试器按钮
  ctx.save();
  ctx.fillStyle = '#333';
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1.2 * scale;
  ctx.fillRect(debugBtnX, btnY, btnW, btnH);
  ctx.strokeRect(debugBtnX, btnY, btnW, btnH);
  ctx.fillStyle = '#FFD700';
  ctx.font = `${Math.round(13 * scale)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('调试器', debugBtnX + btnW / 2, btnY + btnH / 2 + 0.5 * scale);
  ctx.restore();

  // 数据分析按钮
  ctx.save();
  ctx.fillStyle = '#333';
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1.2 * scale;
  ctx.fillRect(dataBtnX, btnY, btnW, btnH);
  ctx.strokeRect(dataBtnX, btnY, btnW, btnH);
  ctx.fillStyle = '#FFD700';
  ctx.font = `${Math.round(13 * scale)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('数据分析', dataBtnX + btnW / 2, btnY + btnH / 2 + 0.5 * scale);
  ctx.restore();

  // 记录按钮区域
  nsfBtnDrawRects.debugger = { x: debugBtnX, y: btnY, w: btnW, h: btnH };
  nsfBtnDrawRects.datafetch = { x: dataBtnX, y: btnY, w: btnW, h: btnH };

  // 按钮紧跟在标题右侧
  ctx.font = `bold ${Math.round(20 * scale)}px Arial`;
  let btnX = 10 * scale;
  btnY = 28 * scale;
  btnGap = 4 * scale;
  let btnSize = 22 * scale;

  nsfBtnDrawRects.prev = { x: btnX, y: btnY, w: btnSize, h: btnSize };
  nsfBtnDrawRects.pause = {
    x: btnX + btnSize + btnGap,
    y: btnY,
    w: btnSize,
    h: btnSize,
  };
  nsfBtnDrawRects.next = {
    x: btnX + (btnSize + btnGap) * 2,
    y: btnY,
    w: btnSize,
    h: btnSize,
  };
  nsfBtnDrawRects.random = {
    x: btnX + (btnSize + btnGap) * 3,
    y: btnY,
    w: btnSize,
    h: btnSize,
  };
  nsfBtnDrawRects.edit = {
    x: btnX + (btnSize + btnGap) * 5,
    y: btnY,
    w: btnSize * 1.3,
    h: btnSize,
  };

  drawNsfBtn(ctx, nsfBtnDrawRects.prev, '⏮️', scale);
  drawNsfBtn(ctx, nsfBtnDrawRects.pause, nsfPaused ? '▶️' : '⏸️', scale);
  drawNsfBtn(ctx, nsfBtnDrawRects.next, '⏭️', scale);
  drawNsfBtn(
    ctx,
    nsfBtnDrawRects.random,
    '🔀',
    scale,
    nsfRandomMode ? '#ffd700' : '#fff',
    nsfRandomMode,
  );
  drawNsfBtn(
    ctx,
    nsfBtnDrawRects.edit,
    nsfEditMode ? 'NSF模式' : '编辑模式',
    scale,
    '#fff',
    nsfEditMode,
  );

  ctx.font = `${Math.round(10 * scale)}px Arial`;
  ctx.fillStyle = '#fff';
  fillString(
    ctx,
    '标题: ' + (nsfPlayer?.tags?.name || ''),
    10 * scale,
    66 * scale,
  );
  fillString(
    ctx,
    '作者: ' + (nsfPlayer?.tags?.artist || ''),
    10 * scale,
    80 * scale,
  );
  fillString(
    ctx,
    '版权: ' + (nsfPlayer?.tags?.copyright || ''),
    10 * scale,
    94 * scale,
  );

  ctx.fillStyle = '#ffd700';
  ctx.font = `bold ${Math.round(10 * scale)}px Arial`;
  fillString(
    ctx,
    `曲目: ${nsfCurrentSong} / ${nsfPlayer?.totalSongs || 1}`,
    10 * scale,
    108 * scale,
  );

  // === NSF技术信息 ===
  ctx.font = `${Math.round(10 * scale)}px Arial`;
  ctx.fillStyle = '#aaa';
  let infoX = 10 * scale;
  let infoY = 122 * scale;
  let loadAdr = nsfPlayer?.mapper?.loadAdr || 0;
  let initAdr = 0,
    playAdr = 0;
  if (nsfPlayer && nsfPlayer.callArea) {
    initAdr = nsfPlayer.callArea[1] | (nsfPlayer.callArea[2] << 8);
    playAdr = nsfPlayer.callArea[9] | (nsfPlayer.callArea[10] << 8);
  }
  var addrsnsf =
    `加载: $${loadAdr.toString(16).padStart(4, '0').toUpperCase()}` +
    ` 初始化: $${initAdr.toString(16).padStart(4, '0').toUpperCase()}` +
    ` 播放: $${playAdr.toString(16).padStart(4, '0').toUpperCase()}`;
  fillString(ctx, addrsnsf, infoX, infoY);

  // === 保留APU可视化钢琴条 ===
  if (!nsfPlayer || !nsfPlayer.apu) return;

  const keysPerRow = 36;
  const pianoRows = 2;
  const pianoMargin = 12 * scale;
  const pianoW = cssWidth - pianoMargin * 2;
  const pianoH = 18 * scale;
  const pianoGap = 4 * scale;
  const blackKeyH = pianoH * 0.62;
  const blackKeyW = (pianoW / keysPerRow) * 0.6;
  const whiteKeyW = pianoW / keysPerRow;
  const pianoY0 = cssHeight - (pianoH * pianoRows + pianoGap + pianoMargin);

  ctx.save();
  ctx.fillStyle = '#000';
  ctx.fillRect(
    pianoMargin - 2 * scale,
    pianoY0 - 2 * scale,
    pianoW + 4 * scale,
    pianoH * pianoRows + pianoGap + 4 * scale,
  );
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(
    pianoMargin - 2 * scale,
    pianoY0 - 2 * scale,
    pianoW + 4 * scale,
    pianoH * pianoRows + pianoGap + 4 * scale,
  );

  let highlight1 = new Array(keysPerRow).fill(false);
  let highlight2 = new Array(keysPerRow).fill(false);
  const apu = nsfPlayer.apu;
  function markHighlight(midi) {
    if (midi >= 36 && midi < 36 + keysPerRow) highlight1[midi - 36] = true;
    if (midi >= 72 && midi < 72 + keysPerRow) highlight2[midi - 72] = true;
  }
  // 脉冲1
  if (apu.enablePulse1 && apu.p1Counter > 0 && apu.p1Timer > 7) {
    let freq = 1789773 / (16 * (apu.p1Timer + 1));
    let midi = Math.round(69 + 12 * Math.log2(freq / 440));
    markHighlight(midi);
  }
  // 脉冲2
  if (apu.enablePulse2 && apu.p2Counter > 0 && apu.p2Timer > 7) {
    let freq = 1789773 / (16 * (apu.p2Timer + 1));
    let midi = Math.round(69 + 12 * Math.log2(freq / 440));
    markHighlight(midi);
  }
  // 三角
  if (apu.enableTriangle && apu.triCounter > 0 && apu.triTimer > 7) {
    let freq = 1789773 / (32 * (apu.triTimer + 1));
    let midi = Math.round(69 + 12 * Math.log2(freq / 440));
    markHighlight(midi);
  }

  function drawWhiteKeys(y, highlightArr) {
    for (let i = 0; i < keysPerRow; i++) {
      let x = pianoMargin + i * whiteKeyW;
      ctx.fillStyle = highlightArr[i] ? '#5fcf5b' : '#fff';
      ctx.fillRect(x, y, whiteKeyW - 1 * scale, pianoH);
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(x + whiteKeyW - 1 * scale, y);
      ctx.lineTo(x + whiteKeyW - 1 * scale, y + pianoH);
      ctx.stroke();
    }
  }
  function drawBlackKeys(y, highlightArr) {
    for (let i = 0; i < keysPerRow; i++) {
      let note = i % 12;
      if ([1, 3, 6, 8, 10].includes(note)) {
        let x = pianoMargin + i * whiteKeyW + whiteKeyW * 0.7 - blackKeyW / 2;
        ctx.fillStyle = highlightArr[i] ? '#5fcf5b' : '#111';
        ctx.fillRect(x, y, blackKeyW, blackKeyH);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1 * scale;
        ctx.strokeRect(x, y, blackKeyW, blackKeyH);
      }
    }
  }

  drawWhiteKeys(pianoY0, highlight1);
  drawBlackKeys(pianoY0, highlight1);
  drawWhiteKeys(pianoY0 + pianoH + pianoGap, highlight2);
  drawBlackKeys(pianoY0 + pianoH + pianoGap, highlight2);

  ctx.restore();
}

function drawNsfBtn(
  ctx,
  rect,
  label,
  scale = 1,
  color = '#fff',
  highlight = false,
) {
  ctx.save();
  if (highlight) {
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  }
  ctx.fillStyle = color;
  ctx.font = `bold ${Math.round(18 * scale)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1 * scale);
  ctx.restore();
}

// 工具函数
function fillString(ctx, str, x, y) {
  if (!ctx || typeof ctx.fillText !== 'function' || typeof str !== 'string')
    return;
  ctx.fillText(str, x, y);
}
function inRect(x, y, rect) {
  if (!rect) return false;
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

// 检查是否为NSF文件
function isNsfFile(name) {
  return name && name.toLowerCase().endsWith('.nsf');
}

// 隐藏 NES UI（用于NSF模式）
function hideNesUiForNsf() {
  [
    'pause',
    'reset',
    'hardreset',
    'palettes',
    'doutput',
    'turboBtnLabel',
  ].forEach((id) => {
    let elx = document.getElementById(id);
    if (elx) elx.style.display = 'none';
  });
}

// 监听NES控制器按键控制NSF播放（VirtuaNES风格：仅1P控制器，方向键/AB/Start/Select有不同功能）
(function () {
  let nsfKeyBound = false;
  function bindNsfKeyControl() {
    if (nsfKeyBound) return;
    nsfKeyBound = true;

    function getKeyMap() {
      if (window.keyMap) return window.keyMap;
      return {
        1: {
          up: 'w',
          down: 's',
          left: 'a',
          right: 'd',
          select: 'f',
          start: 'g',
          b: ';',
          a: "'",
        },
        2: {
          up: '↑',
          down: '↓',
          left: '←',
          right: '→',
          select: '7',
          start: '8',
          b: '4',
          a: '5',
        },
      };
    }
    function getNesButtonMap() {
      if (window.nesButtonMap) return window.nesButtonMap;
      return {
        a: 'A',
        b: 'B',
        select: 'SELECT',
        start: 'START',
        up: 'UP',
        down: 'DOWN',
        left: 'LEFT',
        right: 'RIGHT',
      };
    }

    window.addEventListener(
      'keydown',
      function (e) {
        if (!nsfLoaded) return;
        const ae = document.activeElement;
        if (
          ae &&
          (ae.tagName === 'INPUT' ||
            ae.tagName === 'TEXTAREA' ||
            ae.isContentEditable)
        )
          return;

        let key =
          e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase();
        const keyMap = getKeyMap();
        const nesButtonMap = getNesButtonMap();

        // 只用1P控制器
        for (let btn in keyMap[1]) {
          if (key && key === keyMap[1][btn]) {
            let nesBtn = nesButtonMap[btn];
            if (!nesBtn) continue;
            // VirtuaNES风格：方向键=切曲目，A=暂停/继续，B=重播，Start=下一曲，Select=上一曲
            switch (nesBtn) {
              case 'UP':
                nsfPrevSong();
                e.preventDefault();
                return;
              case 'DOWN':
                nsfNextSong();
                e.preventDefault();
                return;
              case 'LEFT':
                nsfPrevSong();
                e.preventDefault();
                return;
              case 'RIGHT':
                nsfNextSong();
                e.preventDefault();
                return;
              case 'A':
                nsfPauseToggle();
                e.preventDefault();
                return;
              case 'B':
                nsfRestart();
                e.preventDefault();
                return;
              case 'START':
                nsfNextSong();
                e.preventDefault();
                return;
              case 'SELECT':
                nsfPrevSong();
                e.preventDefault();
                return;
            }
          }
        }
      },
      true,
    );
  }
  bindNsfKeyControl();
})();

// NSF模式下自动处理页面可见性变化，自动暂停/恢复
(function () {
  let nsfPausedInBg = false;
  document.addEventListener('visibilitychange', function () {
    if (!nsfLoaded) return;
    if (document.hidden) {
      nsfPausedInBg = false;
      if (!nsfPaused) {
        nsfPauseToggle();
        nsfPausedInBg = true;
      }
    } else {
      if (nsfPausedInBg && nsfLoaded) {
        nsfPauseToggle();
        nsfPausedInBg = false;
      }
    }
  });
})();

// 检查AudioHandler是否已定义，若已定义则只添加新方法
if (typeof AudioHandler === 'function') {
  // 添加重置缓冲区的方法
  AudioHandler.prototype.resetBuffers = function () {
    // 重置内部音频缓冲区状态
    if (this.audioBuffers) {
      for (let i = 0; i < this.audioBuffers.length; i++) {
        if (this.audioBuffers[i]) {
          // 将缓冲区填充为静音
          const buffer = this.audioBuffers[i];
          for (let j = 0; j < buffer.length; j++) {
            buffer[j] = 0;
          }
        }
      }
    }

    // 重置音频处理状态
    if (this.scriptNode) {
      // 脚本处理节点重置
      this._bufferFillAmount = 0;
      this._activeBuffer = 0;
    }

    // 重置采样计数器
    this._sampleCounter = 0;
  };
} else {
  console.warn('AudioHandler class not found, cannot add resetBuffers method');
}
