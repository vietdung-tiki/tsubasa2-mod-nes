var 指令文本 = [
  'Shoot',
  'Volley',
  'Header',
  'Spiral Shot',
  'Spiral Overhead Kick',
  'Falcon Shot',
  'Falcon Volley',
  'Razor Shot',
  'Aerial Hurricane',
  'Twin Shot',
  'Twin Hurricane',
  'Eagle Shot',
  'Tiger Shot',
  'Neo Tiger Shot',
  'Bicycle Kick',
  'Power Bicycle Kick',
  'Jump Volley (Misaki)',
  'Spinning Tiger Shot',
  'Hurricane Shot (Super Spin)',
  'Sano Combination Shot',
  'Banana Shot',
  'Nei Combination Shot',
  'Golden Eagle',
  'Magic Cannon',
  'Snake Shot',
  'Curve Shot',
  'Cannon Shot',
  'Fire Shot',
  'Bomb Header',
  'Power Header',
  'Rocket Header',
  'Rising Dragon Kick',
  'Backheel Shot',
  'Curve Cannon',
  'Zagalo Shot',
  'Pass',
  'Spiral Pass',
  'Razor Pass',
  'Topspin Pass',
  'Dribble',
  'Lift Dribble',
  'Straight Dribble',
  'Magic Dribble',
  'Clone Dribble',
  'High-Speed Dribble',
  'Hedgehog Dribble',
  'One-Two',
  'Golden Combination',
  'Toho Combination',
  'Twin Attack',
  'Eiffel Attack',
  'Trap',
  'Dummy',
  'Our Clearance',
  'Our Clearance (Power)',
  'Block',
  'Face Block',
  'High Block',
  'Power Block',
  'Tackle',
  'High Tackle',
  'Razor Tackle',
  'Power Tackle',
  'Tiger Tackle',
  'Tackle (Power)',
  'Intercept',
  'High Intercept',
  'Opponent Clearance',
  'Opponent Clearance (Power)',
  'Scramble',
  'Scramble (Power)',
  'GK Catch',
  'Spiral Save',
  'Clone Save',
  'Grand Spin Save',
  'GK Punch',
  'Triangle Save',
  'GK Rush Out',
  'GK Stop Dribble',
  'GK Save Shot',
];

var gametime = [
  '00:00',
  '00:10',
  '00:20',
  '00:30',
  '00:40',
  '00:50',
  '01:00',
  '01:10',
  '01:20',
  '01:30',
  '01:40',
  '01:50',
  '02:00',
  '02:10',
  '02:20',
  '02:30',
  '02:40',
  '02:50',
  '03:00',
  '03:10',
  '03:20',
  '03:30',
  '03:40',
  '03:50',
  '04:00',
  '04:10',
  '04:20',
  '04:30',
  '04:40',
  '04:50',
  '05:00',
  '05:10',
  '05:20',
  '05:30',
  '05:40',
  '05:50',
  '06:00',
  '06:10',
  '06:20',
  '06:30',
  '06:40',
  '06:50',
  '07:00',
  '07:10',
  '07:20',
  '07:30',
  '07:40',
  '07:50',
  '08:00',
  '08:10',
  '08:20',
  '08:30',
  '08:40',
  '08:50',
  '09:00',
  '09:10',
  '09:20',
  '09:30',
  '09:40',
  '09:50',
  '10:00',
  '10:10',
  '10:20',
  '10:30',
  '10:40',
  '10:50',
  '11:00',
  '11:10',
  '11:20',
  '11:30',
  '11:40',
  '11:50',
  '12:00',
  '12:10',
  '12:20',
  '12:30',
  '12:40',
  '12:50',
  '13:00',
  '13:10',
  '13:20',
  '13:30',
  '13:40',
  '13:50',
  '14:00',
  '14:10',
  '14:20',
  '14:30',
  '14:40',
  '14:50',
  '15:00',
  '15:10',
  '15:20',
  '15:30',
  '15:40',
  '15:50',
  '16:00',
  '16:10',
  '16:20',
  '16:30',
  '16:40',
  '16:50',
  '17:00',
  '17:10',
  '17:20',
  '17:30',
  '17:40',
  '17:50',
  '18:00',
  '18:10',
  '18:20',
  '18:30',
  '18:40',
  '18:50',
  '19:00',
  '19:10',
  '19:20',
  '19:30',
  '19:40',
  '19:50',
  '20:00',
  '20:10',
  '20:20',
  '20:30',
  '20:40',
  '20:50',
  '21:00',
  '21:10',
  '21:20',
  '21:30',
  '21:40',
  '21:50',
  '22:00',
  '22:10',
  '22:20',
  '22:30',
  '22:40',
  '22:50',
  '23:00',
  '23:10',
  '23:20',
  '23:30',
  '23:40',
  '23:50',
  '24:00',
  '24:10',
  '24:20',
  '24:30',
  '24:40',
  '24:50',
  '25:00',
  '25:10',
  '25:20',
  '25:30',
  '25:40',
  '25:50',
  '26:00',
  '26:10',
  '26:20',
  '26:30',
  '26:40',
  '26:50',
  '27:00',
  '27:10',
  '27:20',
  '27:30',
  '27:40',
  '27:50',
  '28:00',
  '28:10',
  '28:20',
  '28:30',
  '28:40',
  '28:50',
  '29:00',
  '29:10',
  '29:20',
  '29:30',
  '29:40',
  '29:50',
  '30:00',
  '30:10',
  '30:20',
  '30:30',
  '30:40',
  '30:50',
  '31:00',
  '31:10',
  '31:20',
  '31:30',
  '31:40',
  '31:50',
  '32:00',
  '32:10',
  '32:20',
  '32:30',
  '32:40',
  '32:50',
  '33:00',
  '33:10',
  '33:20',
  '33:30',
  '33:40',
  '33:50',
  '34:00',
  '34:10',
  '34:20',
  '34:30',
  '34:40',
  '34:50',
  '35:00',
  '35:10',
  '35:20',
  '35:30',
  '35:40',
  '35:50',
  '36:00',
  '36:10',
  '36:20',
  '36:30',
  '36:40',
  '36:50',
  '37:00',
  '37:10',
  '37:20',
  '37:30',
  '37:40',
  '37:50',
  '38:00',
  '38:10',
  '38:20',
  '38:30',
  '38:40',
  '38:50',
  '39:00',
  '39:10',
  '39:20',
  '39:30',
  '39:40',
  '39:50',
  '40:00',
  '40:10',
  '40:20',
  '40:30',
  '40:40',
  '40:50',
  '41:00',
  '41:10',
  '41:20',
  '41:30',
  '41:40',
  '41:50',
  '42:00',
  '42:10',
  '42:20',
  '42:30',
];

// 00
var playerstrtemp0 = '00 NPC';

// 01–75 (players)
var playerstrtemp1 =
  '01 Tsubasa Ozora,02 Renato{Goalkeeper},03 Lima,04 Marini,05 Amaral{São Paulo},06 Doutor{São Paulo},07 Batista,08 Tahamata,09 Babinton{São Paulo},0A Giu,0B Platon,0C Hanji Urabe,0D Takeshi Kishida,0E Masao Nakayama,0F Yuzo Morisaki{Goalkeeper},10 Shingo Takasugi,11 Taro Misaki,12 Mamoru Izawa,13 Hajime Taki,14 Ryo Ishizaki,15 Shun Nitta,16 Teppei Kisugi,17 Masao Tachibana,18 Kazuo Tachibana,19 Mitsuru Sano,1A Kojiro Hyuga,1B Makoto Soda,1C Hiroshi Jito,1D Hikaru Matsuyama,1E Kazuki Sorimachi,1F Takeshi Sawada,20 Jun Misugi,21 Genzo Wakabayashi{Goalkeeper},22 Ken Wakashimazu{Goalkeeper},23 Sartorustic,24 Libério,25 Da Silva,26 Mannone{Goalkeeper},27 Toninho,28 Nei,29 Zagalo,2A Diuseu,2B Carlos,2C Santamaria,2D Jetorio,2E Hiroshi Jito{Kunimi},2F Mitsuru Sano{Kunimi},30 Masao Tachibana{Akita Shogyo},31 Kazuo Tachibana{Akita Shogyo},32 Makoto Soda{Roppongi},33 Taichi Nakanishi{Goalkeeper},34 Jun Misugi{Musashi},35 Hikaru Matsuyama{Furano},36 Kojiro Hyuga{Toho},37 Kazuki Sorimachi{Toho},38 Takeshi Sawada{Toho},39 Ken Wakashimazu{Toho}{Goalkeeper},3A Lampião,3B Ramón Victorino,3C Da Silva{Uruguay},3D Capellmann,3E Kaltz,3F Metz,40 Genzo Wakabayashi{Hamburg}{Goalkeeper},41 Kojiro Hyuga{NPC Japan},42 Shun Nitta{NPC Japan},43 Mitsuru Sano{NPC Japan},44 Taro Misaki{NPC Japan},45 Jun Misugi{NPC Japan},46 Masao Tachibana{NPC Japan},47 Kazuo Tachibana{NPC Japan},48 Hiroshi Jito{NPC Japan},49 Ryo Ishizaki{NPC Japan},4A Makoto Soda{NPC Japan},4B Hikaru Matsuyama{NPC Japan},4C Ken Wakashimazu{NPC Japan}{Goalkeeper},4D Li Hannei,4E Li Hankun,4F Xia,50 Jim,51 Maiha,52 Zaic{Goalkeeper},53 Lolima,54 Robertson,55 Belev,56 Rashin{Goalkeeper},57 Napoleon,58 Pierre,59 Espanha,5A Lampião{Italy},5B Hernandez{Goalkeeper},5C Islas,5D Libuta,5E Pascal,5F Sartorustic{Argentina},60 Diaz,61 Babinton{Argentina},62 Galvan,63 Schneider,64 Margas,65 Kaltz{West Germany},66 Metz{West Germany},67 Shester,68 Cabello{West Germany},69 Müller{Goalkeeper},6A Carlos{Brazil},6B Zagalo{Brazil},6C Libério{Brazil},6D Nei{Brazil},6E Santamaria{Brazil},6F Toninho{Brazil},70 Doutor{Brazil},71 Amaral{Brazil},72 Diuseu{Brazil},73 Jetorio{Brazil},74 Geldis{Goalkeeper},75 Coimbra';

// 76–C7 (generic roles by team)
var playerstrtemp2 =
  '76 Fluminense Goalkeeper,77 Fluminense Defender,78 Fluminense CB/FW,79 Corinthians Goalkeeper,7A Corinthians Defender,7B Corinthians CB/FW,7C Grêmio Defender,7D Grêmio CB/FW,7E Palmeiras Goalkeeper,7F Palmeiras Defender,80 Palmeiras CB/FW,81 Santos Goalkeeper,82 Santos Defender,83 Santos CB/FW,84 Flamengo Goalkeeper,85 Flamengo Defender,86 Flamengo CB/FW,87 Kunimi Goalkeeper,88 Kunimi Defender,89 Kunimi CB/FW,8A Akita Goalkeeper,8B Akita Defender,8C Akita CB/FW,8D Roppongi Defender,8E Roppongi CB/FW,8F Musashi Goalkeeper,90 Musashi Defender,91 Musashi CB/FW,92 Furano Goalkeeper,93 Furano Defender,94 Furano CB/FW,95 Toho Defender,96 Toho CB/FW,97 Roma Goalkeeper,98 Roma Defender,99 Roma CB/FW,9A Uruguay Goalkeeper,9B Uruguay Defender,9C Uruguay CB/FW,9D Hamburg Defender,9E Hamburg CB/FW,9F Syria Goalkeeper,A0 Syria Defender,A1 Syria CB/FW,A2 China Goalkeeper,A3 China Defender,A4 China CB/FW,A5 Iran Goalkeeper,A6 Iran DF/FW,A7 Iran CB,A8 North Korea Goalkeeper,A9 North Korea Defender,AA North Korea CB/FW,AB Saudi Arabia Goalkeeper,AC Saudi Arabia Defender,AD Saudi Arabia CB/FW,AE South Korea Goalkeeper,AF South Korea Defender,B0 South Korea CB/FW,B1 Vasco da Gama Goalkeeper,B2 Vasco da Gama FW/CB,B3 Poland Defender,B4 Poland CB/FW,B5 England Goalkeeper,B6 England Defender,B7 England CB/FW,B8 Soviet Union Defender,B9 Soviet Union CB/FW,BA France Goalkeeper,BB France Defender,BC France CB/FW,BD Mexico Goalkeeper,BE Mexico Defender,BF Mexico CB/FW,C0 Italy Defender,C1 Italy CB/FW,C2 Netherlands Goalkeeper,C3 Netherlands Defender,C4 Netherlands CB/FW,C5 Argentina Goalkeeper,C6 Argentina Common,C7 West Germany Common';

var playerstr = (
  playerstrtemp0 +
  ',' +
  playerstrtemp1 +
  ',' +
  playerstrtemp2
).split(',');

var teamlist = [
  'Stage 01 Fluminense',
  'Stage 02 Corinthians',
  'Stage 03 Grêmio',
  'Stage 04 Palmeiras',
  'Stage 05 Santos',
  'Stage 06 Flamengo',
  'Stage 07 Kunimi',
  'Stage 08 Akita',
  'Stage 09 Roppongi',
  'Stage 10 Musashi',
  'Stage 11 Furano',
  'Stage 12 Toho',
  'Stage 13 Roma',
  'Stage 14 Uruguay',
  'Stage 15 Hamburg',
  'Stage 16 Japan',
  'Stage 17 Syria',
  'Stage 18 China',
  'Stage 19 Iran',
  'Stage 20 North Korea',
  'Stage 21 Saudi Arabia',
  'Stage 22 South Korea',
  'Stage 23 Vasco da Gama',
  'Stage 24 Poland',
  'Stage 25 England',
  'Stage 26 Soviet Union',
  'Stage 27 France',
  'Stage 28 Mexico',
  'Stage 29 Italy',
  'Stage 30 Netherlands',
  'Stage 31 Argentina',
  'Stage 32 West Germany',
  'Stage 33 Brazil',
  'Stage 34 Brazil (Lower)',
];

// Shooting/Passing/Dribble/etc. command labels
var 射门指令 = [
  '00 Shoot',
  '01 Volley',
  '02 Header',
  '03 Spiral Shot',
  '04 Spiral Overhead Kick',
  '05 Falcon Shot',
  '06 Falcon Volley',
  '07 Razor Shot',
  '08 Aerial Hurricane',
  '09 Twin Shot',
  '0A Twin Hurricane',
  '0B Eagle Shot',
  '0C Tiger Shot',
  '0D Neo Tiger Shot',
  '0E Bicycle Kick',
  '0F Power Bicycle Kick',
  '10 Jump Volley (Misaki)',
  '11 Spinning Tiger Shot',
  '12 Hurricane Shot (Super Spin)',
  '13 Sano Combination Shot',
  '14 Banana Shot',
  '15 Nei Combination Shot',
  '16 Golden Eagle',
  '17 Magic Cannon',
  '18 Snake Shot',
  '19 Curve Shot',
  '1A Cannon Shot',
  '1B Fire Shot',
  '1C Bomb Header',
  '1D Power Header',
  '1E Rocket Header',
  '1F Rising Dragon Kick',
  '20 Backheel Shot',
  '21 Curve Cannon',
  '22 Zagalo Shot',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '28',
  '2A',
  '2B',
  '2C',
  '2D',
  '2E',
  '2F',
];
var 传球指令 = [
  '00 Pass',
  '01 Spiral Pass',
  '02 Razor Pass',
  '03 Topspin Pass',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '0A',
  '0B',
  '0C',
  '0D',
  '0E',
  '0F',
];
var 过人指令 = [
  '00 Dribble',
  '01 Lift Dribble',
  '02 Straight Dribble',
  '03 Magic Dribble',
  '04 Clone Dribble',
  '05 High-Speed Dribble',
  '06 Hedgehog Dribble',
  '07',
  '08',
  '09',
  '0A',
  '0B',
  '0C',
  '0D',
  '0E',
  '0F',
];
var 二过一指令 = [
  '00 One-Two',
  '01 Golden Combination',
  '02 Toho Combination',
  '03 Twin Attack',
  '04 Eiffel Attack',
  '05',
  '06',
  '07',
  '08',
  '09',
  '0A',
  '0B',
  '0C',
  '0D',
  '0E',
  '0F',
];
var 挡球指令 = [
  '00 Block',
  '01 Face Block',
  '02 High Block',
  '03 Power Block',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '0A',
  '0B',
  '0C',
  '0D',
  '0E',
  '0F',
];
var 铲球指令 = [
  '00 Tackle',
  '01 High Tackle',
  '02 Razor Tackle',
  '03 Power Tackle',
  '04 Tiger Tackle',
  '05 Tackle (Power)',
  '06',
  '07',
  '08',
  '09',
  '0A',
  '0B',
  '0C',
  '0D',
  '0E',
  '0F',
];
var 截球指令 = [
  '00 Intercept',
  '01 High Intercept',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '0A',
  '0B',
  '0C',
  '0D',
  '0E',
  '0F',
];

// 1) cheats_ct2 structure: [{ enabled, name, codes: [{address, value, compare}] }]
var cheats_ct2 = [
  {
    enabled: false,
    name: 'Select Stage',
    codes: [{ address: 0x0026, value: 0x00 }],
  },
  {
    enabled: false,
    name: 'Shooting Command',
    codes: [{ address: 0x043c, value: 0x00 }],
  },
  {
    enabled: false,
    name: 'Match Time',
    codes: [{ address: 0x05f7, value: 0xb4 }],
  },
  {
    enabled: false,
    name: 'Our Goals',
    codes: [{ address: 0x0028, value: 0x00 }],
  },
  {
    enabled: false,
    name: 'Opponent Goals',
    codes: [{ address: 0x0029, value: 0x00 }],
  },
  {
    enabled: false,
    name: 'Our GK Selection',
    codes: [{ address: 0x0300, value: 0x21 }],
  },
  {
    enabled: false,
    name: 'Our No.02 Selection',
    codes: [{ address: 0x030c, value: 0x15 }],
  },
  {
    enabled: false,
    name: 'Our No.03 Selection',
    codes: [{ address: 0x0318, value: 0x15 }],
  },
  {
    enabled: false,
    name: 'Our No.04 Selection',
    codes: [{ address: 0x0324, value: 0x15 }],
  },
  {
    enabled: false,
    name: 'Our No.05 Selection',
    codes: [{ address: 0x0330, value: 0x15 }],
  },
  {
    enabled: false,
    name: 'Our No.06 Selection',
    codes: [{ address: 0x033c, value: 0x15 }],
  },
  {
    enabled: false,
    name: 'Our No.07 Selection',
    codes: [{ address: 0x0348, value: 0x15 }],
  },
  {
    enabled: false,
    name: 'Our No.08 Selection',
    codes: [{ address: 0x0354, value: 0x15 }],
  },
  {
    enabled: false,
    name: 'Our No.09 Selection',
    codes: [{ address: 0x0360, value: 0x15 }],
  },
  {
    enabled: false,
    name: 'Our No.10 Selection',
    codes: [{ address: 0x036c, value: 0x15 }],
  },
  {
    enabled: false,
    name: 'Our No.11 Selection',
    codes: [{ address: 0x0378, value: 0x15 }],
  },
];

document.getElementById('ct2cheat').onclick = function () {
  const cheatDiv = document.getElementById('cheatdiv');
  const menus = document.querySelector('.menus.active'); // get menus active
  if (cheatDiv) {
    cheatDiv.style.display = 'block';
    if (menus) menus.classList.remove('active'); // hide menus active
  }
};

function bindCheat() {
  if (!document.getElementById('cheatdiv')) {
    const cheatDiv = document.createElement('div');
    cheatDiv.id = 'cheatdiv';
    cheatDiv.style.display = 'none';
    cheatDiv.style.position = 'fixed';
    cheatDiv.style.left = '50%';
    cheatDiv.style.top = '50%';
    cheatDiv.style.transform = 'translate(-50%,-50%)';
    cheatDiv.style.background = '#222';
    cheatDiv.style.color = '#fff';
    cheatDiv.style.padding = '24px 32px 16px 32px';
    cheatDiv.style.borderRadius = '12px';
    cheatDiv.style.boxShadow = '0 4px 24px #000a';
    cheatDiv.style.zIndex = 1000; // make sure on top
    cheatDiv.style.minWidth = '320px';
    cheatDiv.style.maxWidth = '90vw';
    cheatDiv.style.maxHeight = '80vh';
    cheatDiv.style.overflowY = 'auto';

    // close button
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '8px';
    closeBtn.style.right = '12px';
    closeBtn.style.background = 'transparent';
    closeBtn.style.color = '#fff';
    closeBtn.style.fontSize = '22px';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = function () {
      cheatDiv.style.display = 'none';
    };
    cheatDiv.appendChild(closeBtn);

    // title
    const title = document.createElement('div');
    title.innerHTML =
      '<b>Captain Tsubasa II — Cheats</b><br><small>Tick options and click Apply to enable. Some functions must be used during matches.</small>';
    title.style.marginBottom = '12px';
    cheatDiv.appendChild(title);

    // clear all
    const cancelAll = document.createElement('button');
    cancelAll.innerText = 'Clear All';
    cancelAll.style.marginBottom = '8px';
    cancelAll.onclick = function () {
      cheatDiv
        .querySelectorAll('input[type=checkbox][data-ct2cheat]')
        .forEach((cb) => (cb.checked = false));
    };
    cheatDiv.appendChild(cancelAll);

    // apply
    const applyBtn = document.createElement('button');
    applyBtn.innerText = 'Apply Cheats';
    applyBtn.style.marginTop = '8px';
    applyBtn.onclick = function () {
      applyCT2Cheats();
    };
    cheatDiv.appendChild(applyBtn);

    // list container
    const cheatsList = document.createElement('div');
    cheatsList.id = 'ct2cheatlist';
    cheatsList.style.margin = '10px 0 10px 0';
    cheatDiv.appendChild(cheatsList);

    var container =
      document.getElementById('fullscreenContainer') || document.body;
    container.appendChild(cheatDiv);
  }

  // render items
  const cheatsList = document.getElementById('ct2cheatlist');
  if (cheatsList) {
    cheatsList.innerHTML = '';
    cheats_ct2.forEach((item, idx) => {
      const line = document.createElement('div');
      line.style.marginBottom = '4px';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.ct2cheat = '1';
      cb.id = 'ct2cheat_cb_' + idx;
      cb.checked = !!item.enabled;
      line.appendChild(cb);

      const label = document.createElement('label');
      label.htmlFor = cb.id;
      label.innerText = item.name;
      label.style.marginLeft = '6px';
      line.appendChild(label);

      // dropdown
      const select = document.createElement('select');
      select.style.marginLeft = '10px';
      let options = [];

      // fill options based on cheat type
      if (item.name === 'Select Stage') {
        options = teamlist.map((txt, i) => ({ text: txt, value: i }));
      } else if (item.name === 'Shooting Command') {
        options = 指令文本.map((txt, i) => ({ text: txt, value: i }));
      } else if (item.name === 'Match Time') {
        options = gametime.map((txt, i) => ({ text: txt, value: i }));
      } else if (item.name === 'Our Goals' || item.name === 'Opponent Goals') {
        options = Array.from({ length: 256 }, (_, i) => ({
          text: i,
          value: i,
        }));
      } else if (/Our (GK|0[2-9]|1[0-1]) Selection/.test(item.name)) {
        options = playerstr.map((txt, i) => ({ text: txt, value: i }));
      }

      if (options.length > 0) {
        options.forEach((opt) => {
          const op = document.createElement('option');
          op.value = opt.value;
          op.text = opt.text;
          if (item.codes && item.codes[0] && opt.value == item.codes[0].value) {
            op.selected = true;
          }
          select.appendChild(op);
        });
        select.onchange = function () {
          if (item.codes && item.codes[0]) {
            item.codes[0].value = Number(this.value);
          }
        };
        line.appendChild(select);
      }

      cheatsList.appendChild(line);
    });
  }
}

// apply cheats to the game
function applyCT2Cheats() {
  const cbs = document.querySelectorAll('input[type=checkbox][data-ct2cheat]');
  cbs.forEach((cb, idx) => {
    cheats_ct2[idx].enabled = cb.checked;
  });
  nes.cheatCodes_ct2 = cheats_ct2;
  log('Cheats applied!', 'chectCT2');
}

// init
bindCheat();
