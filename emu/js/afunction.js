function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GameSavesDB', 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('RomStore')) {
        db.createObjectStore('RomStore', { keyPath: 'id' });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject('IndexedDB 初始化失败: ' + event.target.errorCode);
    };
  });
}



const LANG = window.LANG || 'zh';
const I18N_DICT = {
  "log.save.loaded_battery": {
    "zh": "已加载电池存档",
    "en": "Loaded battery"
  },
  "log.save.saved_battery": {
    "zh": "已保存电池存档",
    "en": "Saved battery"
  },
  "log.save.failed_save_battery": {
    "zh": "保存电池存档失败: {err}",
    "en": "Failed to save battery: {err}"
  },
  "log.save.saved_state": {
    "zh": "已保存存档",
    "en": "Saved state"
  },
  "log.save.failed_save_state": {
    "zh": "保存存档失败: {err}",
    "en": "Failed to save state: {err}"
  },
  "log.save.loaded_state": {
    "zh": "加载存档",
    "en": "Loaded state"
  },
  "log.save.failed_load_state": {
    "zh": "加载存档失败",
    "en": "Failed to load state"
  },
  "log.save.no_state": {
    "zh": "尚未保存存档",
    "en": "No state saved yet"
  },
  "log.zip.loaded": {
    "zh": "已从zip加载 \"{name}\"",
    "en": "Loaded \"{name}\" from zip"
  },
  "log.zip.no_nes": {
    "zh": "zip中未找到.nes文件",
    "en": "No .nes file found in zip"
  },
  "log.zip.no_nsf": {
    "zh": "zip中未找到.nsf文件",
    "en": "No .nsf file found in zip"
  },
  "log.zip.empty": {
    "zh": "zip文件为空",
    "en": "Zip file was empty"
  },
  "log.zip.failed": {
    "zh": "读取zip失败: {err}",
    "en": "Failed to read zip: {err}"
  },
  "log.pause.paused": {
    "zh": "暂停游戏",
    "en": "Game paused"
  },
  "log.pause.unpaused": {
    "zh": "继续游戏",
    "en": "Game resumed"
  },
  "log.debugger.invalid_bp_addr": {
    "zh": "断点地址无效",
    "en": "Invalid address for breakpoint"
  },
  "log.palette.loaded_palette": {
    "zh": "已加载调色板: {name}",
    "en": "Loaded palette: {name}"
  },
  "log.imagefilter.switch": {
    "zh": "[NES滤镜] 切换滤镜: {filter}",
    "en": "[NES Filter] Switch filter: {filter}"
  },
  "log.rom.load_failed": {
    "zh": "ROM加载失败: {err}",
    "en": "ROM load failed: {err}"
  },
  "log.rom.unsupported_format": {
    "zh": "不支持的ROM格式",
    "en": "Unsupported ROM format"
  },
  "log.rom.load_success": {
    "zh": "ROM加载成功: {name}",
    "en": "ROM loaded successfully: {name}"
  },
  "log.rom.unsupported_mapper": {
    "zh": "不支持的Mapper: {mapper}",
    "en": "Unsupported Mapper: {mapper}"
  },
  "log.ppu.init_failed": {
    "zh": "PPU初始化失败",
    "en": "PPU initialization failed"
  },
  "log.apu.init_failed": {
    "zh": "APU初始化失败",
    "en": "APU initialization failed"
  },
  "log.gamepad.connected": {
    "zh": "已连接手柄: {id}",
    "en": "Gamepad connected: {id}"
  },
  "log.gamepad.disconnected": {
    "zh": "手柄已断开: {id}",
    "en": "Gamepad disconnected: {id}"
  },
  "log.gamepad.detected": {
    "zh": "检测到 {n} 个手柄",
    "en": "Detected {n} gamepad(s)"
  }
  ,
  "log.default.breakpoint_read": {
    "zh": "断点命中(读取){adr}:{val}",
    "en": "Breakpoint hit (read){adr}:{val}"
  }
  ,
  "log.default.breakpoint_execute": {
    "zh": "断点命中(执行):{adr}",
    "en": "Breakpoint hit (execute):{adr}"
  }
  ,
  "log.default.breakpoint_write": {
    "zh": "断点命中(写入){adr}:{val}",
    "en": "Breakpoint hit (write){adr}:{val}"
  }
};
function i18n(key, vars) {
  let str = (I18N_DICT[key] && I18N_DICT[key][LANG]) || key;
  if (vars) {
    for (const k in vars) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
    }
  }
  return str;
}



// 加载游戏
function loadgame() {
  initIndexedDB().then(db => {
    try {
      const transaction = db.transaction(['RomStore'], 'readonly');
      const store = transaction.objectStore('RomStore');
      const romDataReq = store.get('RomDataToplay');
      const romNameReq = store.get('RomDataToplay_name');
      transaction.oncomplete = function () {
        const romData = romDataReq.result?.data;
        const romName = romNameReq.result?.data;
        if (!romData || !romName) {
          alert("无法识别游戏文件\nUnable to recognize game file.");
          return;
        }
        // 直接调用 window.loadRom，自动支持 zip
        if (window.loadRom) {
          // 如果是 zip，转为 Blob 传递
          if (romName.slice(-4).toLowerCase() === ".zip") {
            window.loadRom(new Blob([romData]), romName);
          } else {
            window.loadRom(new Uint8Array(romData), romName);
          }
        } else if (window.db && typeof db.loadRom === "function") {
          db.loadRom(new Uint8Array(romData), romName);
        }
        // 设置标题栏
        document.title = romName;
        // 隐藏文件选择
        const romInput = document.getElementById('rom');
        if (romInput) romInput.style.display = 'none';
      };
      transaction.onerror = function () {
        alert("无法识别游戏文件\nUnable to recognize game file.");
      };
    } catch (e) {
      alert("无法识别游戏文件\nUnable to recognize game file.");
    }
  }).catch(() => {
    alert("无法识别游戏文件\nUnable to recognize game file.");
  });
}

// 页面加载时检测参数
if (location.search.indexOf('debug=true') !== -1 || location.search.indexOf('rom=') !== -1) {
  window.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(location.search);

    // 检查是否有 rom 参数
    if (params.has('rom')) {
      const romUrl = params.get('rom');
      const romName = decodeURIComponent(romUrl.split('/').pop());
      // 支持 .nes/.nsf/.zip（不区分大小写）
      if ((romUrl.startsWith('https://') || romUrl.startsWith('http://')) &&
        (romUrl.toLowerCase().endsWith('.nes') || romUrl.toLowerCase().endsWith('.zip') || romUrl.toLowerCase().endsWith('.nsf'))) {
        fetch(romUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`无法下载游戏文件: ${response.statusText}`);
            }
            return response.arrayBuffer();
          })
          .then(buffer => {
            // 统一用 Uint8Array 传递，window.loadRom 内部自动判断 zip/nes/nsf
            if (window.loadRom) {
              window.loadRom(new Uint8Array(buffer), romName);
            } else if (window.db && typeof db.loadRom === "function") {
              db.loadRom(new Uint8Array(buffer), romName);
            }
            document.title = romName;
            const romInput = document.getElementById('rom');
            if (romInput) romInput.style.display = 'none';
          })
          .catch(err => {
            alert(`加载游戏文件失败: ${err.message}`);
          });
      } else {
        alert("无效的 ROM 文件路径。请提供 https:// 开头且以 .nes/.nsf/.zip 结尾的路径。");
      }
      history.replaceState({}, "", window.location.pathname);
    }
    if (location.search.indexOf('debug=true') !== -1) {
      loadgame();
    }
  });
}


// 关于弹窗
function showAboutDialog() {
  let dlg = document.getElementById('aboutDialog');
  let container = document.getElementById('fullscreenContainer') || document.body;
  if (dlg) {
    dlg.style.display = 'block';
    dlg.classList.add('active');
    return;
  }
  dlg = document.createElement('div');
  dlg.id = 'aboutDialog';
  dlg.className = 'controller-dialog active';
  dlg.style.position = 'fixed';
  dlg.style.left = '50%';
  dlg.style.top = '50%';
  dlg.style.transform = 'translate(-50%,-50%)';
  dlg.style.zIndex = 10020;
  dlg.style.minWidth = '260px';
  dlg.style.maxWidth = '96vw';
  dlg.style.maxHeight = '96vh';
  dlg.style.overflow = 'auto';
  dlg.style.background = '#fff';
  dlg.style.border = '2px solid #888';
  dlg.style.borderRadius = '12px';
  dlg.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
  dlg.style.padding = '1.2em 1.2em 1em 1.2em';
dlg.innerHTML = `
    <button id="aboutCloseBtn" style="position:absolute;top:8px;right:12px;font-size:1.5em;background:none;border:none;cursor:pointer;color:#888;">&times;</button>
    <div id="aboutContent" style="margin-top:1.5em;">     
      <p><a href="https://daymoe.com/rom/" target="_blank">daymoe</a> 2025</p>
<pre style="max-height: 50vh; overflow: auto; background: #f8f8f8; border-radius: 6px; padding: 0.5em 1em;">2025.05.18~2025.05.21
NSF播放器添加调试及音乐获取功能
中文版自动检查添加简易不卡顿补丁
优化帧率默认锁定60帧
优化Mapper加载方式
触屏按钮调整
2025.05.13~2025.05.15
整合NSF并优化播放功能
添加音乐编辑模式(CT2简谱转换功能)
优化CPU、PPU内存数据的显示
解决调试器错误的逻辑导致音频卡顿
2025.05.11
优化了调试器的性能改进部分调试功能
2025.05.07~2005.05.08
对阵信息功能增强修改
部分内容可以点击修改
2025.05.06
添加存档选项卡功能,20多卡槽+自动存档.
可以将prgrom[ram<=0x8000]数据保存至存档.
调整部分页面响应式逻辑.
添加对阵信息,可选择球员切换持球状态.
2025.04.21~2025.04.30
在原有基础上添加mapper74/195/198的支持
修正模拟器mmc3的bug
添加金手指功能/GamePad/调色板/滤镜等
修正大部分改版ROM兼容(暗黑破坏神等.)
完善调试器功能(仿VirtuaNES-debug)
修复存档功能,解决部分bug.
</pre><p>源代码来自<a href="https://github.com/angelo-wf/NesJs" target="_blank">Github</a></p>
    </div>
  `;
  dlg.querySelector('#aboutCloseBtn').onclick = function () {
    dlg.style.display = 'none';
    dlg.classList.remove('active');
  };
  container.appendChild(dlg);
}

// 新增：支持拖拽文件到页面加载游戏
document.addEventListener('dragover', function(e) {
    e.preventDefault();
}, false);

document.addEventListener('drop', function(e) {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const fileName = file.name;
        const reader = new FileReader();
        reader.onload = function(evt) {
            const arrayBuffer = evt.target.result;
            if (window.loadRom) {
                if (fileName.slice(-4).toLowerCase() === ".zip") {
                    window.loadRom(new Blob([arrayBuffer]), fileName);
                } else {
                    window.loadRom(new Uint8Array(arrayBuffer), fileName);
                }
            } else if (window.db && typeof db.loadRom === "function") {
                db.loadRom(new Uint8Array(arrayBuffer), fileName);
            }
        };
        reader.readAsArrayBuffer(file);
    }
}, false);
