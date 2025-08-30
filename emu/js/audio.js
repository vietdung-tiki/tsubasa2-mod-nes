function AudioHandler() {

  this.hasAudio = true;
  let Ac = window.AudioContext || window.webkitAudioContext;
  this.sampleBuffer = new Float64Array(735);
  this.samplesPerFrame = 735;

  if(Ac === undefined) {
    log("Audio disabled: no Web Audio API support");
    this.hasAudio = false;
  } else {
    this.actx = new Ac();

    let samples = Math.floor(this.actx.sampleRate / 60);
    this.sampleBuffer = new Float64Array(samples);
    this.samplesPerFrame = samples;

    // 只保留一个缓冲区，删除其他缓冲区
    this.buffer = new Float32Array(32768);
    this.writePos = 0;
    this.readPos = 0;
    this.lastValue = 0;
    
    // 只保留必要的节点
    this.scriptNode = undefined;
  }

  this.resume = function() {
    // for Chrome autoplay policy
    if(this.hasAudio) {
      this.actx.onstatechange = function() { console.log(this.actx.state) };
      this.actx.resume();
    }
  }

  this.start = function() {
    if(!this.hasAudio) return;

    // 创建处理节点
    this.scriptNode = this.actx.createScriptProcessor(2048, 0, 1);
    this.scriptNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for(let i = 0; i < output.length; i++) {
        const sample = this.buffer[this.readPos];
        // 使用适度的平滑处理
        output[i] = this.lastValue * 0.1 + sample * 0.9;
        this.lastValue = output[i];
        this.readPos = (this.readPos + 1) & 32767;
      }
    };

    this.scriptNode.connect(this.actx.destination);
  }

  this.nextBuffer = function() {
    if(!this.hasAudio) return;
    
    // 新增：判断写入前剩余空间，如果不足一帧则重置 readPos
    let capacity = 32768;
    // 计算从 writePos 到 readPos 之间剩余的空间
    let free = (this.readPos - this.writePos - 1 + capacity) & (capacity - 1);
    if(free < this.samplesPerFrame) {
      // 重置读取指针以避免播放旧数据
     // this.readPos = this.writePos;
    }
    
    // 直接写入数据
    for(let i = 0; i < this.samplesPerFrame; i++) {
      this.buffer[this.writePos] = Math.max(-1, Math.min(1, this.sampleBuffer[i]));
      this.writePos = (this.writePos + 1) & (capacity - 1);
    }
  }

  this.stop = function() {
    if(!this.hasAudio) return;
    if(this.scriptNode) {
      this.scriptNode.disconnect();
      this.scriptNode = undefined;
    }
    this.writePos = 0;
    this.readPos = 0;
    this.lastValue = 0;
  }
}
