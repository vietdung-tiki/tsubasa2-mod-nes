// patterns+调色板显示
window.drawPatternsPals = function (nes, ctx) {
  // 256x160: 上128像素为pattern table，下32像素为调色板
  let imgData = ctx.createImageData(256, 160);

  // 左侧 pattern table
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      window.drawTile(nes, imgData, x * 8, y * 8, y * 16 + x, 0);
    }
  }
  // 右侧 pattern table
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      window.drawTile(nes, imgData, 128 + x * 8, y * 8, 256 + y * 16 + x, 0);
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // 绘制调色板（主调色板和精灵调色板）
  for (let i = 0; i < 16; i++) {
    let col = nes.ppu.nesPal[nes.ppu.readPalette(i) & 0x3f];
    ctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, 1)`;
    ctx.fillRect(i * 16, 128, 16, 16);
    col = nes.ppu.nesPal[nes.ppu.readPalette(i + 16) & 0x3f];
    ctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, 1)`;
    ctx.fillRect(i * 16, 144, 16, 16);
  }
};

// nametable显示
window.drawNametables = function (nes, ctx) {
  // 512x480: 四个命名表，每个256x240，排列成2x2
  let imgData = ctx.createImageData(512, 480);
  for (let nt = 0; nt < 4; nt++) {
    // nt: 0=左上, 1=右上, 2=左下, 3=右下
    let baseX = (nt & 1) * 256;
    let baseY = (nt >> 1) * 240;
    let ntBase = 0x2000 + nt * 0x400;
    let attBase = 0x23C0 + nt * 0x400;
    for (let y = 0; y < 30; y++) {
      for (let x = 0; x < 32; x++) {
        let tileNumAdr = ntBase + (y << 5) + x;
        let tileNum = nes.mapper.ppuPeak(tileNumAdr);
        let attAdr = attBase + ((y >> 2) << 3) + (x >> 2);
        let atr = nes.mapper.ppuPeak(attAdr);
        // 计算属性表
        let shift = ((y & 0x2) << 1) | (x & 0x2);
        atr = (atr >> shift) & 0x3;
        window.drawTile(nes, imgData, baseX + x * 8, baseY + y * 8, tileNum + (nes.ppu.bgPatternBase === 0 ? 0 : 256), atr);
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
};
// 通用绘制tile函数
window.drawTile = function (nes, imgData, x, y, num, col) {
  for (let i = 0; i < 8; i++) {
    let lp = nes.mapper.ppuPeak(num * 16 + i);
    let hp = nes.mapper.ppuPeak(num * 16 + i + 8);
    for (let j = 0; j < 8; j++) {
      let shift = 7 - j;
      let pixel = (lp >> shift) & 1;
      pixel |= ((hp >> shift) & 1) << 1;
      let pind = pixel === 0 ? 0 : col * 4 + pixel;
      let color = nes.ppu.nesPal[nes.ppu.readPalette(pind) & 0x3f];
      let index = ((y + i) * imgData.width + (x + j)) * 4;
      imgData.data[index] = color[0];
      imgData.data[index + 1] = color[1];
      imgData.data[index + 2] = color[2];
      imgData.data[index + 3] = 255;
    }
  }
};

// 假设每页显示 256x128（即 0x1000 字节，256 tiles），页码从 0 开始
const CHR_PAGE_SIZE = 0x1000; // 4KB per page
function drawChrPage(nes, ctx, pageId) {
  let imgData = ctx.createImageData(256, 128);
  let chr = nes.mapper.chrRom || nes.mapper.chrRam;
  if (!chr) return;
  let baseAddr = pageId * CHR_PAGE_SIZE;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      let tileIndex = y * 16 + x;
      let tileAddr = baseAddr + tileIndex * 16;
      drawChrTile(chr, imgData, x * 8, y * 8, tileAddr, nes);
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function drawChrTile(chr, imgData, x, y, addr, nes) {
  // 取当前调色板的 0F 07 28 39 号色
  const palIdx = [0x0F, 0x07, 0x28, 0x39];
  const pal = palIdx.map(idx => nes.ppu.nesPal[idx]);
  for (let i = 0; i < 8; i++) {
    let lp = chr[addr + i];
    let hp = chr[addr + i + 8];
    for (let j = 0; j < 8; j++) {
      let shift = 7 - j;
      let pixel = (lp >> shift) & 1;
      pixel |= ((hp >> shift) & 1) << 1;
      let color = pal[pixel];
      let index = ((y + i) * imgData.width + (x + j)) * 4;
      imgData.data[index] = color[0];
      imgData.data[index + 1] = color[1];
      imgData.data[index + 2] = color[2];
      imgData.data[index + 3] = 255;
    }
  }
}
// 绑定页码切换事件
document.getElementById('chapageID').onchange = function () {

  document.getElementById('chapage').width = 128; // 设置宽度
  document.getElementById('chapage').height = 128; // 设置高度
  let pageId = parseInt(this.value);
  let ctx = document.getElementById('chapage').getContext('2d');
  drawChrPage(nes, ctx, pageId);
};

// 初始化页码选项
function initChrPageSelector(nes) {
  let chrLen = nes.mapper.chrRom ? nes.mapper.chrRom.length : 0;
  let pageCount = Math.ceil(chrLen / CHR_PAGE_SIZE);
  let sel = document.getElementById('chapageID');
  sel.innerHTML = "";
  for (let i = 0; i < pageCount; i++) {
    let opt = document.createElement('option');
    opt.value = i;
    opt.text = "CHR页 " + i;
    sel.appendChild(opt);
  }
}

// 初始化 Tile 信息浮动层
function initTileInfoOverlay() {
  tileInfoOverlay = document.createElement('div');
  tileInfoOverlay.style.position = 'absolute';
  tileInfoOverlay.style.background = 'rgba(0, 0, 0, 0.7)';
  tileInfoOverlay.style.color = '#fff';
  tileInfoOverlay.style.padding = '5px';
  tileInfoOverlay.style.borderRadius = '5px';
  tileInfoOverlay.style.pointerEvents = 'none';
  tileInfoOverlay.style.zIndex = '10000';
  tileInfoOverlay.style.display = 'none';
  document.body.appendChild(tileInfoOverlay);
}

// 更新 Tile 信息浮动层的位置和内容
function updateTileInfoOverlay(x, y, tileId, chrPage, isSpriteMode, tileData) {
  try {
    //console.log(`更新 Tile 信息浮动层: x=${x}, y=${y}, tileId=${tileId}, chrPage=${chrPage}, isSpriteMode=${isSpriteMode}`);
    
    // 计算正确的 Tile 地址
    const chr = nes.mapper.chrRom || nes.mapper.chrRam;
    if (!chr) {
      //console.error("CHR 数据为空，无法获取 Tile 数据");
      return;
    }
    const tileAddr = chrPage * CHR_PAGE_SIZE + tileId * 16;
    tileData = getTileData(nes, tileAddr);
    //console.log("计算的 Tile 数据:", tileData);

    // 确保浮动层样式正确
    tileInfoOverlay.style.left = `${x + 10}px`;
    tileInfoOverlay.style.top = `${y + 10}px`;
    tileInfoOverlay.style.width = 'auto';
    tileInfoOverlay.style.height = 'auto';
    tileInfoOverlay.style.zIndex = '10000';
    tileInfoOverlay.style.display = 'block';

    // 清空浮动层内容
    tileInfoOverlay.innerHTML = '';

    // 创建一个 Canvas 绘制放大的 32x32 Tile 图像
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = 32;
    tileCanvas.height = 32;
    const tileCtx = tileCanvas.getContext('2d');
    const imgData = tileCtx.createImageData(32, 32);

    // 获取动态调色板
    const dynamicPalette = getDynamicPalette(nes, isSpriteMode);
    //console.log("动态调色板:", dynamicPalette);

    // 绘制放大的 32x32 Tile 数据
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const pixel = tileData[i * 8 + j];
        const color = dynamicPalette[pixel]; // 使用动态调色板获取颜色
        if (!color) {
          //console.error(`未找到有效颜色: pixel=${pixel}, i=${i}, j=${j}`);
          continue;
        }
        for (let dy = 0; dy < 4; dy++) {
          for (let dx = 0; dx < 4; dx++) {
            const index = ((i * 4 + dy) * 32 + (j * 4 + dx)) * 4;
            imgData.data[index] = color[0];
            imgData.data[index + 1] = color[1];
            imgData.data[index + 2] = color[2];
            imgData.data[index + 3] = 255;
          }
        }
      }
    }
    tileCtx.putImageData(imgData, 0, 0);

    // 创建文本信息
    const tileInfoText = document.createElement('div');
    tileInfoText.style.marginTop = '5px';
    tileInfoText.style.color = '#fff';
    tileInfoText.style.fontSize = '12px';
    tileInfoText.innerHTML = `
      <div>${isSpriteMode ? "精灵Tile" : "背景Tile"}: ${tileId.toString(16).toUpperCase()}</div>
      <div>CHR Page: ${chrPage}</div>
    `;

    // 将 Canvas 和文本添加到浮动层
    tileInfoOverlay.appendChild(tileCanvas);
    tileInfoOverlay.appendChild(tileInfoText);

    //console.log(`Tile 绘制成功: Tile ID=${tileId}, CHR Page=${chrPage}, Sprite Mode=${isSpriteMode}`);
  } catch (error) {
    //console.error("更新 Tile 信息浮动层时发生异常:", error);
  }
}

// 隐藏 Tile 信息浮动层
function hideTileInfoOverlay() {
  tileInfoOverlay.style.display = 'none';
}

// 初始化浮动层
initTileInfoOverlay();

// 创建透明覆盖层
function createClickOverlay() {
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.zIndex = '10001'; // 确保在所有元素之上
  overlay.style.cursor = 'crosshair';
  overlay.style.background = 'rgba(0, 0, 0, 0)'; // 完全透明
  document.body.appendChild(overlay);
  return overlay;
}

// 移除透明覆盖层
function removeClickOverlay(overlay) {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
}

function enableTileTracking(output, isSpriteMode, button, otherElements, displayMap) {
  isTrackingTile = true;

  // 创建透明覆盖层
  const overlay = createClickOverlay();

  // 鼠标移动事件
  overlay.onmousemove = function (e) {
    if (!isTrackingTile) return;

    const rect = output.getBoundingClientRect();
    const scaleX = output.width / rect.width; // 计算宽度缩放比例
    const scaleY = output.height / rect.height; // 计算高度缩放比例

    const x = (e.clientX - rect.left) * scaleX; // 调整后的 X 坐标
    const y = (e.clientY - rect.top) * scaleY;  // 调整后的 Y 坐标

    if (isSpriteMode) {
      // 精灵模式
      let clickedSpriteIndex = -1;
      for (let i = 0; i < 64; i++) { // OAM 中最多有 64 个精灵
        const spriteY = nes.ppu.oamRam[i * 4];
        const spriteX = nes.ppu.oamRam[i * 4 + 3];

        if (x >= spriteX && x < spriteX + 8 && y >= spriteY && y < spriteY + nes.ppu.spriteHeight) {
          clickedSpriteIndex = i;
          break;
        }
      }

      if (clickedSpriteIndex === -1) {
        hideTileInfoOverlay();
        return;
      }

      const spriteChrAddr = nes.ppu.getSpriteChrAddr(clickedSpriteIndex);
      const chrInfo = nes.mapper.getChrPageAndTile(spriteChrAddr);
      if (!chrInfo) {
        hideTileInfoOverlay();
        return;
      }

      const { pageId, tileOffset } = chrInfo;
      const tileData = getTileData(nes, spriteChrAddr);
      updateTileInfoOverlay(e.clientX, e.clientY, tileOffset, pageId, true, tileData);
    } else {
      // 背景模式
      const tileX = Math.floor(x / 8); // 每个图块宽度为 8 像素
      const tileY = Math.floor(y / 8); // 每个图块高度为 8 像素
      const nametableIndex = Math.floor(tileY / 30) * 2 + Math.floor(tileX / 32); // 计算 Nametable 索引
      const localX = tileX % 32; // Nametable 内的 X 坐标
      const localY = tileY % 30; // Nametable 内的 Y 坐标
      const tileNumAdr = 0x2000 + nametableIndex * 0x400 + localY * 32 + localX; // 图块编号地址

      const tileNum = nes.mapper.ppuPeak(tileNumAdr); // 从 Nametable 获取图块编号
      const bgPatternBase = nes.ppu.bgPatternBase; // 背景图案表基地址
      const chrAddr = bgPatternBase + tileNum * 16; // 每个图块占 16 字节
      const chrInfo = nes.mapper.getChrPageAndTile(chrAddr);
      if (!chrInfo) {
        hideTileInfoOverlay();
        return;
      }

      const { pageId, tileOffset } = chrInfo;
      const tileData = getTileData(nes, chrAddr);
      updateTileInfoOverlay(e.clientX, e.clientY, tileOffset, pageId, false, tileData);
    }
  };

  // 鼠标点击事件
  overlay.onclick = function () {
    if (!isTrackingTile) return;

    isTrackingTile = false;
    hideTileInfoOverlay();

    // 移除鼠标事件
    overlay.onmousemove = null;
    overlay.onclick = null;

    // 移除透明覆盖层
    removeClickOverlay(overlay);

    // 恢复其他元素显示
    otherElements.forEach(el => {
      el.style.display = displayMap.get(el) || '';
    });
    output.classList.remove('active');

    // 更新按钮文本、页码等
    const match = tileInfoOverlay.innerHTML.match(/(?:精灵Tile|背景Tile): ([0-9A-F]+)/i);
    if (match) {
      const tileId = match[1];
      button.textContent = isSpriteMode ? `精灵 ${tileId}` : `chr ${tileId}`;
    } else {
      console.error("无法解析 Tile ID 信息");
    }

    const chrPage = document.getElementById('chapageID');
    const pageMatch = tileInfoOverlay.innerHTML.match(/CHR Page: (\d+)/);
    if (pageMatch) {
      chrPage.value = pageMatch[1];
      chrPage.dispatchEvent(new Event('change'));
    } else {
      console.error("无法解析 CHR Page 信息");
    }

    output.style.cursor = 'default';
  };
}

// 获取 Tile 数据
function getTileData(nes, addr) {
  try {
    const chr = nes.mapper.chrRom || nes.mapper.chrRam;
    if (!chr) {
      console.error("CHR 数据为空，无法获取 Tile 数据");
      return [];
    }
    const tileData = [];
    for (let i = 0; i < 8; i++) {
      const lp = chr[addr + i];
      const hp = chr[addr + i + 8];
      for (let j = 0; j < 8; j++) {
        const shift = 7 - j;
        const pixel = (lp >> shift) & 1 | ((hp >> shift) & 1) << 1;
        tileData.push(pixel); // 保存像素值（索引）
      }
    }
    //console.log(`成功获取 Tile 数据: 地址=${addr.toString(16).toUpperCase()}, 数据=`, tileData);
    return tileData;
  } catch (error) {
    //console.error("获取 Tile 数据时发生异常:", error);
    return [];
  }
}

function getDynamicPalette(nes, isSpriteMode) {
  try {
    const baseAddr = isSpriteMode ? 0x10 : 0x00; // 精灵使用 $3F10-$3F1F，背景使用 $3F00-$3F0F
    const palette = [];
    for (let i = 0; i < 4; i++) {
      const colorIndex = nes.ppu.readPalette(baseAddr + i);
      palette.push(nes.ppu.nesPal[colorIndex & 0x3F]); // 获取实际颜色
    }
    //console.log(`成功获取动态调色板: ${palette.map(c => `rgb(${c[0]},${c[1]},${c[2]})`).join(", ")}`);
    return palette;
  } catch (error) {
    //console.error("获取动态调色板时发生异常:", error);
    return [[0, 0, 0], [255, 255, 255], [128, 128, 128], [64, 64, 64]]; // 返回默认调色板
  }
}

// 按钮事件：ActChr
document.getElementById('ActChr').onclick = function () {
  const output = document.getElementById('output');
  const fullscreenContainer = document.getElementById('fullscreenContainer');
  const wrapper = document.getElementById('wrapper');
  const otherElements = Array.from(document.body.children).filter(
    el => el !== fullscreenContainer && el !== wrapper
  );
  if (wrapper) otherElements.push(wrapper);

  const displayMap = new Map();
  otherElements.forEach(el => {
    displayMap.set(el, el.style.display);
    el.style.display = 'none';
  });

  fullscreenContainer.style.position = 'absolute';
  fullscreenContainer.style.zIndex = '9999';
  fullscreenContainer.style.background = '#000';
  fullscreenContainer.style.width = '100vw';
  fullscreenContainer.style.height = '100vh';
  fullscreenContainer.style.top = '0';
  fullscreenContainer.style.left = '0';

  output.style.cursor = 'crosshair';
  output.classList.add('active');

  enableTileTracking(output, false, this, otherElements, displayMap);

  // output.onclick 只保留 classList.remove
  output.onclick = function () {
    output.classList.remove('active');
  };
};

// 按钮事件：ActSpi
document.getElementById('ActSpi').onclick = function () {
  const output = document.getElementById('output');
  const fullscreenContainer = document.getElementById('fullscreenContainer');
  const wrapper = document.getElementById('wrapper');
  const otherElements = Array.from(document.body.children).filter(
    el => el !== fullscreenContainer && el !== wrapper
  );
  if (wrapper) otherElements.push(wrapper);

  const displayMap = new Map();
  otherElements.forEach(el => {
    displayMap.set(el, el.style.display);
    el.style.display = 'none';
  });

  fullscreenContainer.style.position = 'absolute';
  fullscreenContainer.style.zIndex = '9999';
  fullscreenContainer.style.background = '#000';
  fullscreenContainer.style.width = '100vw';
  fullscreenContainer.style.height = '100vh';
  fullscreenContainer.style.top = '0';
  fullscreenContainer.style.left = '0';

  output.style.cursor = 'crosshair';
  output.classList.add('active');

  enableTileTracking(output, true, this, otherElements, displayMap);

  output.onclick = function () {
    output.classList.remove('active');
  };
};







