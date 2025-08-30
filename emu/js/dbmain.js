// 多来源log浮层管理
const logToastMap = {};
let logToastOrder = [];

// log函数必须在logToastMap定义后声明
let logLastTime = 0;
function log(text, source = "default") {
  let now = Date.now();
  if (now - logLastTime < 30) return; // 30ms节流
  logLastTime = now;
  // 1. 获取或创建浮层
  let toast = logToastMap[source];
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'nes-toast';
    toast.style.position = 'fixed';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.zIndex = '9999';
    toast.style.background = 'rgba(30,60,200,0.92)';
    toast.style.color = '#fff';
    toast.style.padding = '5px 12px';
    toast.style.borderRadius = '6px';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = 'bold';
    toast.style.boxShadow = '0 2px 16px rgba(0,0,0,0.25)';
    toast.style.textShadow = '2px 2px 4px #000, 0 0 2px #fff';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    toast.style.transition = 'opacity 0.4s';
    toast.style.maxWidth = '98vw';
    toast.style.overflowWrap = 'break-word'; 
    var container = document.getElementById('fullscreenContainer') || document.body;
    container.appendChild(toast);
    logToastMap[source] = toast;
    logToastOrder.push(source);
  }

  // 2. 更新内容
  toast.textContent = text;
  toast.style.opacity = '1';

  // 3. 重新排列所有log浮层
  let baseBottom = 5;
  let curBottom = baseBottom;
  for (let i = 0; i < logToastOrder.length; i++) {
    let s = logToastOrder[i];
    let t = logToastMap[s];
    if (t) {
      t.style.bottom = curBottom + 'px';
      // 先让浮层可见，才能正确获取高度
      t.style.visibility = 'hidden';
      t.style.opacity = '1';
      // 强制触发重排
      let h = t.offsetHeight;
      t.style.visibility = '';
      // 间距 8px
      curBottom += h + 8;
    }
  }

  // 4. 清除旧定时器
  if (toast._timer) clearTimeout(toast._timer);

  // 5. 3秒后淡出并移除/补位
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      // 移除dom和map
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      delete logToastMap[source];
      let idx = logToastOrder.indexOf(source);
      if (idx !== -1) logToastOrder.splice(idx, 1);
      // 重新排列剩余log浮层
      for (let i = 0; i < logToastOrder.length; i++) {
        let s = logToastOrder[i];
        let t = logToastMap[s];
        if (t) t.style.bottom = (baseBottom + i * 30) + 'px';
      }
    }, 400);
  }, 3000);

  // 6. 追加到log区域
  el("log").innerHTML += text + "<br>";
  el("log").scrollTop = el("log").scrollHeight;
}


let nes = new Nes();
let audioHandler = new AudioHandler();
let paused = false;
let loaded = false;
let pausedInBg = false;
let loopId = 0;
let loadedName = "";

let dpr = window.devicePixelRatio || 1;
let c = el("output");
c.width = 256;
c.height = 240;
// 设置画布样式防止模糊
c.style.width = "256px";
c.style.height = "240px";
c.style.imageRendering = "pixelated";
c.style.imageRendering = "crisp-edges"; // 兼容部分浏览器
let ctx = c.getContext("2d");
let imgData = ctx.createImageData(256, 240);

let dc = el("doutput");
dc.width = 512;
dc.height = 480;
// 设置调试画布样式防止模糊
dc.style.width = "512px";
dc.style.height = "480px";
dc.style.imageRendering = "pixelated";
dc.style.imageRendering = "crisp-edges"; // 兼容部分浏览器
let dctx = dc.getContext("2d");

let db = new Debugger(nes, dctx);

let controlsP1 = {
  d: nes.INPUT.RIGHT,
  a: nes.INPUT.LEFT,
  s: nes.INPUT.DOWN,
  w: nes.INPUT.UP,
  f: nes.INPUT.START,
  g: nes.INPUT.SELECT, // ← 用 g 作为 SELECT
  k: nes.INPUT.B,
  j: nes.INPUT.A
}
let controlsP2 = {
  arrowright: nes.INPUT.RIGHT,
  arrowleft: nes.INPUT.LEFT,
  arrowdown: nes.INPUT.DOWN,
  arrowup: nes.INPUT.UP,
  num8: nes.INPUT.START,
  num7: nes.INPUT.SELECT,
  num5: nes.INPUT.B,
  num4: nes.INPUT.A
}


zip.workerScriptsPath = "lib/";
zip.useWebWorkers = false;

// 加速功能变量
window.turboSpeed = 1; // 1=正常，2/3=加速
window.setTurboSpeed = function (speed) {
  if (typeof speed === "boolean") {
    window.turboSpeed = speed ? 2 : 1;
  } else if (typeof speed === "number") {
    window.turboSpeed = speed;
  }
  // 可选：在UI上显示当前倍速
  if (document.getElementById('turboBtnLabel')) {
    document.getElementById('turboBtnLabel').textContent = window.turboSpeed + 'X';
  }
};

// NSF/NES模式切换支持
window.isNsfMode = false;

// 定义常用模拟器调色板，增加 default 选项
const NES_PALETTES = {
  default: {
    name: "PPU原生",
    data: [
      0x656565, 0x002D69, 0x131F7F, 0x3B1377, 0x600B63, 0x730A36, 0x710F07, 0x531900,
      0x2F2500, 0x0A3400, 0x003C00, 0x003D10, 0x003840, 0x000000, 0x000000, 0x000000,
      0xAEAEAE, 0x0C48EF, 0x444CEF, 0x8200F6, 0xB900B6, 0xE00858, 0xE01400, 0xC02D00,
      0x8B5000, 0x2D7400, 0x007C00, 0x007C44, 0x007288, 0x000000, 0x000000, 0x000000,
      0xFFFFFF, 0x3B82FF, 0x6F8AFF, 0xA366FF, 0xF249FF, 0xFF40A6, 0xFF5431, 0xFF6F00,
      0xC49300, 0x6BCB00, 0x26D700, 0x00D24D, 0x00C9AA, 0x393939, 0x000000, 0x000000,
      0xFFFFFF, 0xA6CEFF, 0xB3CFFF, 0xCABFFF, 0xF7B3FF, 0xFFB6D6, 0xFFC4B7, 0xFFCCAE,
      0xF7D8A5, 0xD7E895, 0xA6F7AF, 0xA2F2DA, 0xA0E8F2, 0xA0A0A0, 0x000000, 0x000000
    ]
  },
  fceux: {
    name: "FCEUX",
    data: [
      0x7C7C7C, 0x0000FC, 0x0000BC, 0x4428BC, 0x940084, 0xA80020, 0xA81000, 0x881400,
      0x503000, 0x007800, 0x006800, 0x005800, 0x004058, 0x000000, 0x000000, 0x000000,
      0xBCBCBC, 0x0078F8, 0x0058F8, 0x6844FC, 0xD800CC, 0xE40058, 0xF83800, 0xE45C10,
      0xAC7C00, 0x00B800, 0x00A800, 0x00A844, 0x008888, 0x000000, 0x000000, 0x000000,
      0xF8F8F8, 0x3CBCFC, 0x6888FC, 0x9878F8, 0xF878F8, 0xF85898, 0xF87858, 0xFCA044,
      0xF8B800, 0xB8F818, 0x58D854, 0x58F898, 0x00E8D8, 0x787878, 0x000000, 0x000000,
      0xFCFCFC, 0xA4E4FC, 0xB8B8F8, 0xD8B8F8, 0xF8B8F8, 0xF8A4C0, 0xF0D0B0, 0xFCE0A8,
      0xF8D878, 0xD8F878, 0xB8F8B8, 0xB8F8D8, 0x00FCFC, 0xF8D8F8, 0x000000, 0x000000
    ]
  },
  mesen: {
    name: "Mesen",
    data: [
      0x757575, 0x271B8F, 0x0000AB, 0x47009F, 0x8F0077, 0xAB0013, 0xA70000, 0x7F0B00,
      0x432F00, 0x004700, 0x005100, 0x003F17, 0x1B3F5F, 0x000000, 0x000000, 0x000000,
      0xBCBCBC, 0x0073EF, 0x233BEF, 0x8300F3, 0xBF00BF, 0xE7005B, 0xDB2B00, 0xCB4F0F,
      0x8B7300, 0x009700, 0x00AB00, 0x00933B, 0x00838B, 0x000000, 0x000000, 0x000000,
      0xFFFFFF, 0x3FBFFF, 0x5F73FF, 0xA78BFD, 0xF77BFF, 0xFF77B7, 0xFF7763, 0xFF9B3B,
      0xF3BF3F, 0x83D313, 0x4FDF4B, 0x58F898, 0x00EBDB, 0x757575, 0x000000, 0x000000,
      0xFFFFFF, 0xABE7FF, 0xC7D7FF, 0xD7CBFF, 0xFFC7FF, 0xFFC7DB, 0xFFBFA3, 0xFFDBAB,
      0xFFE7A3, 0xE3FFA3, 0xABF3BF, 0xB3FFCF, 0x9FFFF3, 0xBCBCBC, 0x000000, 0x000000
    ]
  },
  nintendulator: {
    name: "Nintendulator",
    data: [
      0x6B6B6B, 0x001E7B, 0x0F0F8B, 0x47009F, 0x8F0077, 0xA70013, 0xA70000, 0x7F0B00,
      0x432F00, 0x004700, 0x005100, 0x003F17, 0x1B3F5F, 0x000000, 0x000000, 0x000000,
      0xBFBFBF, 0x0073EF, 0x233BEF, 0x8300F3, 0xBF00BF, 0xE7005B, 0xDB2B00, 0xCB4F0F,
      0x8B7300, 0x009700, 0x00AB00, 0x00933B, 0x00838B, 0x000000, 0x000000, 0x000000,
      0xFFFFFF, 0x3FBFFF, 0x5F73FF, 0xA78BFD, 0xF77BFF, 0xFF77B7, 0xFF7763, 0xFF9B3B,
      0xF3BF3F, 0x83D313, 0x4FDF4B, 0x58F898, 0x00EBDB, 0x757575, 0x000000, 0x000000,
      0xFFFFFF, 0xABE7FF, 0xC7D7FF, 0xD7CBFF, 0xFFC7FF, 0xFFC7DB, 0xFFBFA3, 0xFFDBAB,
      0xFFE7A3, 0xE3FFA3, 0xABF3BF, 0xB3FFCF, 0x9FFFF3, 0xBCBCBC, 0x000000, 0x000000
    ]
  },
  virtuanes: {
    name: "VirtuaNES",
    data: [
      0x7C7C7C, 0x0000FC, 0x0000BC, 0x4428BC, 0x940084, 0xA80020, 0xA81000, 0x881400,
      0x503000, 0x007800, 0x006800, 0x005800, 0x004058, 0x000000, 0x000000, 0x000000,
      0xBCBCBC, 0x0078F8, 0x0058F8, 0x6844FC, 0xD800CC, 0xE40058, 0xF83800, 0xE45C10,
      0xAC7C00, 0x00B800, 0x00A800, 0x00A844, 0x008888, 0x000000, 0x000000, 0x000000,
      0xF8F8F8, 0x3CBCFC, 0x6888FC, 0x9878F8, 0xF878F8, 0xF85898, 0xF87858, 0xFCA044,
      0xF8B800, 0xB8F818, 0x58D854, 0x58F898, 0x00E8D8, 0x787878, 0x000000, 0x000000,
      0xFCFCFC, 0xA4E4FC, 0xB8B8F8, 0xD8B8F8, 0xF8B8F8, 0xF8A4C0, 0xF0D0B0, 0xFCE0A8,
      0xF8D878, 0xD8F878, 0xB8F8B8, 0xB8F8D8, 0x00FCFC, 0xF8D8F8, 0x000000, 0x000000
    ]
  },
  nestopia: {
    name: "Nestopia",
    data: [
      0x6B6B6B, 0x001E7B, 0x0F0F8B, 0x47009F, 0x8F0077, 0xA70013, 0xA70000, 0x7F0B00,
      0x432F00, 0x004700, 0x005100, 0x003F17, 0x1B3F5F, 0x000000, 0x000000, 0x000000,
      0xBFBFBF, 0x0073EF, 0x233BEF, 0x8300F3, 0xBF00BF, 0xE7005B, 0xDB2B00, 0xCB4F0F,
      0x8B7300, 0x009700, 0x00AB00, 0x00933B, 0x00838B, 0x000000, 0x000000, 0x000000,
      0xFFFFFF, 0x3FBFFF, 0x5F73FF, 0xA78BFD, 0xF77BFF, 0xFF77B7, 0xFF7763, 0xFF9B3B,
      0xF3BF3F, 0x83D313, 0x4FDF4B, 0x58F898, 0x00EBDB, 0x757575, 0x000000, 0x000000,
      0xFFFFFF, 0xABE7FF, 0xC7D7FF, 0xD7CBFF, 0xFFC7FF, 0xFFC7DB, 0xFFBFA3, 0xFFDBAB,
      0xFFE7A3, 0xE3FFA3, 0xABF3BF, 0xB3FFCF, 0x9FFFF3, 0xBCBCBC, 0x000000, 0x000000
    ]
  }
};

// 动态填充调色板下拉框
function fillPaletteSelect() {
  const sel = document.getElementById('palettes');
  if (!sel) return;
  sel.innerHTML = '';
  Object.keys(NES_PALETTES).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = NES_PALETTES[key].name;
    sel.appendChild(opt);
  });
  // 默认选中 default
  sel.value = "default";
}

// 切换调色板事件
function setNesPaletteBySelect() {
  const sel = document.getElementById('palettes');
  if (!sel) return;
  const key = sel.value;
  if (NES_PALETTES[key] && nes && nes.ppu && nes.loadRom && typeof nes.ppu.setPalette === 'function') {
    nes.ppu.setPalette(NES_PALETTES[key].data);
    log(i18n('log.palette.loaded_palette', { name: NES_PALETTES[key].name }), "palette");
  }
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', function () {
  fillPaletteSelect();
  setNesPaletteBySelect();
  if (window.resizeCanvasToFitWindow) window.resizeCanvasToFitWindow();
  if (window.updateCtxAfterResize) window.updateCtxAfterResize(); 


  const sel = document.getElementById('palettes');
  if (sel) sel.onchange = setNesPaletteBySelect;

  // 新增：点击 nesornsf 切换NSF/NES模式
  const nesornsf = document.getElementById('nesornsf');
  if (nesornsf) {
    nesornsf.style.cursor = "pointer";
    nesornsf.title = "点击切换NSF/NES模式";
    nesornsf.onclick = function (e) {
      // 如果点击的是关闭按钮，不切换模式
      if (e.target && e.target.id === "statusBarClose") return;
      stopnesnsf();
      // 切换模式
      if (window.isNsfMode) {
        window.isNsfMode = false;
        hideNsfUI();
        saveBatteryForRom();
        draw();
      } else {
        window.isNsfMode = true;
        hideNesUiForNsf();
        showNsfUI();
      }
    };
  }
});

function stopnesnsf() {
  // 先销毁已有 NES/NSF 线程和资源
  // 停止 NES 主循环和音频
  if (typeof loopId !== "undefined" && loopId) {
    cancelAnimationFrame(loopId);
    loopId = 0;
  }
  if (typeof audioHandler !== "undefined" && audioHandler) {
    audioHandler.stop();
  }
  // 停止 NSF 主循环和音频
  if (typeof nsfLoopId !== "undefined" && nsfLoopId) {
    cancelAnimationFrame(nsfLoopId);
    nsfLoopId = 0;
  }
  if (typeof nsfAudioHandler !== "undefined" && nsfAudioHandler) {
    nsfAudioHandler.stop();
  }
  window.nsfPlayer = null;
  // 标记状态
  loaded = false;
  paused = false;
  nsfLoaded = false;
  nsfPaused = false;
}

// 新增：统一zip解压方法，返回Promise
function extractRomFromZip(blob) {
  return new Promise((resolve, reject) => {
    zip.createReader(new zip.BlobReader(blob), function (reader) {
      reader.getEntries(function (entries) {
        if (!entries.length) {
          reject(i18n('log.zip.empty'));
          return;
        }
        let found = false;
        for (let i = 0; i < entries.length; i++) {
          let name = entries[i].filename;
          if (name.slice(-4).toLowerCase() === ".nes" || name.slice(-4).toLowerCase() === ".nsf") {
            found = true;
            entries[i].getData(new zip.BlobWriter(), function (blob) {
              let breader = new FileReader();
              breader.onload = function () {
                let rbuf = breader.result;
                let arr = new Uint8Array(rbuf);
                resolve({ arr, name });
                reader.close(function () { });
              };
              breader.readAsArrayBuffer(blob);
            }, function () { });
            break;
          }
        }
        if (!found) {
          reject(i18n('log.zip.no_nes'));
        }
      });
    }, function (err) {
      reject(i18n('log.zip.failed', { err }));
    });
  });
}

// 修改 loadRom 入口，支持 zip 自动解压
function loadRom(romOrArr, name) {
  // 如果是 File/Blob 且是 zip，先解压
  if (typeof romOrArr === "object" && romOrArr instanceof Blob && name && name.slice(-4).toLowerCase() === ".zip") {
    extractRomFromZip(romOrArr).then(({ arr, name }) => {
      loadRom(arr, name);
    }).catch(err => {
      log(err, "zip");
    });
    return;
  }
  // 如果是 Uint8Array 且文件名是 zip，尝试转为 Blob 解压
  if (romOrArr instanceof Uint8Array && name && name.slice(-4).toLowerCase() === ".zip") {
    let blob = new Blob([romOrArr]);
    extractRomFromZip(blob).then(({ arr, name }) => {
      loadRom(arr, name);
    }).catch(err => {
      log(err, "zip");
    });
    return;
  }
  // NES 正常流程
  stopnesnsf();
  // 标记状态
  loaded = false;
  paused = false;
  nsfLoaded = false;
  nsfPaused = false;

  // 检查NSF
  if (isNsfFile(name)) {
    // 切换到NSF模式
    hideNesUiForNsf();
    showNsfUI();
    if (!window.NsfPlayer) {
      log("未加载NSF支持脚本", "nsf");
      return;
    }
    nsfPlayer = new NsfPlayer();
    nsfAudioHandler = new AudioHandler();
    if (nsfPlayer.loadNsf(romOrArr)) {
      nsfLoaded = true;
      nsfPaused = false;
      nsfCurrentSong = nsfPlayer.startSong;
      nsfPlayer.playSong(nsfCurrentSong);
      nsfLoopId = requestAnimationFrame(nsfUpdate);
      nsfAudioHandler.start();
      updateNsfSongInfo();
      nsfDrawVisual();
      document.title = name;
    }
    return;
  }
  // NES 正常流程
  hideNsfUI();
  saveBatteryForRom();
  db.loadRom(romOrArr, function (success) {
    if (!success) return;
    let data = localStorage.getItem(name + "_battery");
    if (data) {
      let obj = JSON.parse(data);
      db.nes.setBattery(obj);
      log(i18n('log.save.loaded_battery'), "save");
    }
    if (!loaded && !paused) {
      loopId = requestAnimationFrame(update);
      audioHandler.start();
    }
    loaded = true;
    loadedName = name;
    setNesPaletteBySelect();
    db.updateDebugView();

    resetRomCache();
    initChrPageSelector(db.nes);
    let ctx = document.getElementById('chapage').getContext('2d');
    drawChrPage(db.nes, ctx, 0);
    document.title = loadedName;
    if (window.SaveManager && SaveManager.checkAutoSave) {
      setPausedState(true);
      SaveManager.checkAutoSave(function (err, record) {
        if (!err && record && record.romName === name && record.saveState) {
          SaveManager.showAutoSavePrompt(record, function () {
            setPausedState(false);
            startAutoSave();
          });
        } else {
          setPausedState(false);
          startAutoSave();
        }
      });
    } else {
      startAutoSave();
    }
  });
}

// 兼容 window.loadRom
window.loadRom = loadRom;

// 修改 el("rom").onchange，直接传递 File/Blob 给 loadRom
el("rom").onchange = function (e) {
  audioHandler.resume();
  let file = e.target.files[0];
  let fileName = file.name;
  // 直接传递 File/Blob 给 loadRom，内部自动判断 zip
  let freader = new FileReader();
  freader.onload = function () {
    let buf = freader.result;
    // zip 直接传 Blob，否则传 Uint8Array
    if (fileName.slice(-4).toLowerCase() === ".zip") {
      loadRom(file, fileName);
    } else {
      let arr = new Uint8Array(buf);
      loadRom(arr, fileName);
    }
  };
  freader.readAsArrayBuffer(file);
};

el("pause").onclick = function (e) {
  if (paused && loaded) {
    setPausedState(false);
  } else {
    setPausedState(true);
  }
}

el("reset").onclick = function (e) {
  db.nes.reset(false);
  db.updateDebugView();
}

el("hardreset").onclick = function (e) {
  db.nes.reset(true);
  db.updateDebugView();
}

document.onvisibilitychange = function (e) {
  if (document.hidden) {
    pausedInBg = false;
    if (!paused && loaded) {
      setPausedState(true);
      pausedInBg = true;
    }
  } else {
    if (pausedInBg && loaded) {
      setPausedState(false);
      pausedInBg = false;
    }
  }
}

window.onpagehide = function (e) {
  saveBatteryForRom();
}

let autoSaveTimer = null;

function startAutoSave() {
  if (autoSaveTimer) clearInterval(autoSaveTimer);
  autoSaveTimer = setInterval(function () {
    if (loaded && !paused && window.nes) {
      let output = document.getElementById('output');
      let screenshot = output.toDataURL("image/png");
      let timestamp = new Date().toLocaleString();

      if (window.SaveManager) {
        window.SaveManager.updateSaveSlot(window.SaveManager.AUTO_SAVE_SLOT, screenshot, timestamp, function (err, record) {
          if (err) {
          }
        });
      }
    }
  }, 7000);
}

function saveBatteryForRom() {
  if (loaded) {
    let data = db.nes.getBattery();
    if (data) {
      try {
        localStorage.setItem(loadedName + "_battery", JSON.stringify(data));
        log(i18n('log.save.saved_battery'), "save");
      } catch (e) {
        log(i18n('log.save.failed_save_battery', { err: e }), "save");
      }
    }
  }
}

function setPausedState(paused) {
  if (paused === window.paused) return;
  window.paused = paused;
  if (window.db) window.db.isPaused = paused;
  if (db) db.isPaused = paused;
  if (paused) {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
    cancelAnimationFrame(loopId);
    audioHandler.stop();
    el("pause").innerText = "继续";
    log(i18n('log.pause.paused'), "pause");
  } else {
    cancelAnimationFrame(loopId);
    loopId = requestAnimationFrame(update);
    audioHandler.start();
    el("pause").innerText = "暂停";
    log(i18n('log.pause.unpaused'), "pause");
    startAutoSave();
  }
  if (window.updatePauseBtnOverlayState) window.updatePauseBtnOverlayState();
}

window.pause = function () {
  setPausedState(true);
};
window.unpause = function () {
  setPausedState(false);
};

let lastFrameTime = performance.now();
let nesFrameResidue = 0;
function update() {
  let now = performance.now();
  let elapsed = now - lastFrameTime;
  // 如果elapsed太大（如切回前台），只累计最多200ms，避免卡死
  if (elapsed > 200) elapsed = 200;
  lastFrameTime = now;

  // 60帧每秒，每帧约16.6667ms
  let nesFrames = (elapsed + nesFrameResidue) / (1000 / 60);
  let framesToRun = Math.floor(nesFrames);
  nesFrameResidue = (elapsed + nesFrameResidue) - framesToRun * (1000 / 60);

  // turbo模式下加速
  let turbo = window.turboSpeed || 1;
  framesToRun = framesToRun * turbo;

  if (framesToRun > 0) {
    for (let i = 0; i < framesToRun; i++) {
      let r = runFrame();
      if (r) {
        setPausedState(true);
        return;
      }
    }
  }
  loopId = requestAnimationFrame(update);
}
function runFrame() {
  let bpHit = db.runFrame();
  draw();
  if (bpHit) {
    return true;
  }
  return false;
}


let lastFpsUpdate = performance.now();
let frameCount = 0;
let currentFps = 60;
let showFps = false;
const fpsCheckbox = document.getElementById('showFpsCheckbox');
if (fpsCheckbox) {
  showFps = fpsCheckbox.checked;
  fpsCheckbox.addEventListener('change', function () {
    showFps = this.checked;
  });
}


function draw() {
  db.nes.getSamples(audioHandler.sampleBuffer, audioHandler.samplesPerFrame);
  audioHandler.nextBuffer();
  db.nes.getPixels(imgData.data);
  ctx.putImageData(imgData, 0, 0);

  // FPS统计
  frameCount++;
  let now = performance.now();
  if (now - lastFpsUpdate >= 500) {
    currentFps = Math.round(frameCount * 1000 / (now - lastFpsUpdate));
    lastFpsUpdate = now;
    frameCount = 0;
  }

  // 仅在 showFps 为 true 时绘制FPS
  if (showFps) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const canvasElem = ctx.canvas;
    // 真实像素宽高
    const realW = canvasElem.width;
    const realH = canvasElem.height;
    // CSS宽高
    const cssW = parseFloat(getComputedStyle(canvasElem).width);
    const cssH = parseFloat(getComputedStyle(canvasElem).height);
    // 比例
    const scaleX = realW / cssW;
    const scaleY = realH / cssH;

    // 推荐字号和边距都用像素坐标
    const fontSize = Math.max(12, Math.round(realW / 28));
    ctx.font = `500 ${fontSize}px Arial,Consolas,monospace`;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    // 右上角，距离右边8像素
    const x = realW - 8 * scaleX;
    const y = 4 * scaleY;
    let fpsText = currentFps > 0 ? currentFps + " FPS" : "... FPS";
    ctx.strokeText(fpsText, x, y);
    ctx.fillText(fpsText, x, y);
    ctx.restore();
  }
}

window.addEventListener('load', function () {
  if (window.resizeCanvasToFitWindow) window.resizeCanvasToFitWindow();
});

window.updateCtxAfterResiz=updateCtxAfterResize;
function updateCtxAfterResize() {
  c = el("output");
  ctx = c.getContext("2d");
  imgData = ctx.createImageData(256, 240);
}

function el(id) {
  return document.getElementById(id);
}



function save_State() {
  let saveState = db.nes.getState();
  let slot = window.currentSaveSlot !== undefined ? window.currentSaveSlot : 0;

  let output = document.getElementById('output');
  let screenshot = output.toDataURL("image/png");
  let timestamp = new Date().toLocaleString();

  if (window.SaveManager && SaveManager.updateSaveSlot) {
    SaveManager.updateSaveSlot(slot, screenshot, timestamp, function (err, record) {
      if (err) {
        log(i18n('log.save.failed_save_state') + "到存档卡槽" + slot, "save");
        return;
      }

      record.saveState = saveState;

      window.SaveManager.updateSaveData(slot, record, function (err) {
        if (err) {
          log(i18n('log.save.failed_save_state') + "到存档卡槽" + slot, "save");
        } else {
          log(i18n('log.save.saved_state') + "到存档卡槽" + slot, "save");
        }
      });
    });
  }
}

function load_State() {
  let slot = window.currentSaveSlot !== undefined ? window.currentSaveSlot : 0;

  if (window.SaveManager && SaveManager.getSaveData) {
    window.SaveManager.getSaveData(slot, function (err, record) {
      if (err || !record || !record.saveState) {
        log("存档卡槽" + slot + "为空，无法读档!", "save");
        return;
      }

      if (record.romName !== loadedName) {
        log("存档卡槽" + slot + "为空，无法读档!", "save");
        return;
      }

      if (db.nes.setState(record.saveState)) {
        if (slot != -1) {
          log("从存档卡槽" + slot + i18n('log.save.loaded_state'), "save");
        }
        else {
          log("已加载自动存档", "save");
        }
      } else {
        log("从存档卡槽" + slot + i18n('log.save.failed_load_state'), "save");
      }
    });
  }
}



window.nes = nes;
