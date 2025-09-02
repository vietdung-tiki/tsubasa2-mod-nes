var 指令数据选择项 = 0;
var 指令数据Addr = 0;
var Instruct0440 = 0;
var Instruct0443 = 0;
function GetInstruct() {
  指令数据选择项 = $('#InstructList').get(0).selectedIndex;
  指令数据Addr = 0;
  if (指令数据选择项 <= 54) {
    指令数据Addr = 进攻指令数据 + 指令数据选择项 * 4;
  }
  if (指令数据选择项 >= 55 && 指令数据选择项 <= 70) {
    指令数据Addr = 防守指令数据 + (指令数据选择项 - 55) * 4;
  }
  if (指令数据选择项 >= 71) {
    指令数据Addr = GK指令数据 + (指令数据选择项 - 71) * 4;
  }
  $('#Instruct2_1DIV').css('display', 'none');
  var 暴力 = NesHex[指令数据Addr];
  var 威力 = NesHex[指令数据Addr + 1];
  var 体力 = 0;
  //二过一消耗单字节
  if (
    指令数据选择项 == 46 ||
    指令数据选择项 == 47 ||
    指令数据选择项 == 48 ||
    指令数据选择项 == 49 ||
    指令数据选择项 == 50
  ) {
    体力 = NesHex[指令数据Addr + 2] + (NesHex[指令数据Addr + 3] % 4) * 0x100;
    var xxx = parseInt(NesHex[指令数据Addr + 3] / 0x08, 10);
    $('#Instruct2_1').val(xxx); //二过一的距离
    Instruct0440 = NesHex[指令数据Addr + 3] % 4;
    $('#Instruct2_1DIV').css('display', 'block');
  } else {
    var hou = toHex16(NesHex[指令数据Addr + 2]);
    var loadqian = toHex16(NesHex[指令数据Addr + 3]);
    var qian = loadqian.substr(1, 1);
    体力 = parseInt(qian + hou, 16);
    Instruct0443 = parseInt(loadqian.substr(0, 1), 16);
  }
  $('#InstructB').val(暴力);
  $('#InstructW').val(威力);
  $('#InstructT').val(体力);
  $('#InstructTempText').html(
    'Instruction data address:0x' +
      toHex16(指令数据Addr, 5) +
      ' Portrait data address:0x' +
      toHex16(肖像数据地址, 5),
  );
}

//var instempstr = "<span id='instempstrtetx'></span>";

function CheckInstructB() {
  if ($('#InstructB').get(0).selectedIndex % 4 == 3) {
    $('#InstructTempText').html(
      'A Brutality value with a remainder of 3 will cause an unknown bug. Please change the Brutality value.' +
        '<br>Instruction data address: 0x' +
        toHex16(指令数据Addr, 5) +
        ' Portrait data address: 0x' +
        toHex16(肖像数据地址, 5),
    );
  } else {
    $('#InstructTempText').html(
      'Instruction data address: 0x' +
        toHex16(指令数据Addr, 5) +
        ' Portrait data address: 0x' +
        toHex16(肖像数据地址, 5),
    );
  }
}

function ChangeInstruct() {
  //指令数据Addr
  var 暴力 = $('#InstructB').get(0).selectedIndex;
  var 威力 = $('#InstructW').get(0).selectedIndex;
  var 体力 = $('#InstructT').get(0).selectedIndex;
  var 距离 = $('#Instruct2_1').get(0).selectedIndex;
  NesHex[指令数据Addr] = 暴力;
  NesHex[指令数据Addr + 1] = 威力;
  if (体力 <= 255) {
    NesHex[指令数据Addr + 2] = 体力;
  } else {
    NesHex[指令数据Addr + 2] = parseInt(toHex16(体力, 4).substr(2, 2), 16);
  }
  if (
    指令数据选择项 == 46 ||
    指令数据选择项 == 47 ||
    指令数据选择项 == 48 ||
    指令数据选择项 == 49 ||
    指令数据选择项 == 50
  ) {
    //距离
    if (Instruct0440 == 0) {
      NesHex[指令数据Addr + 3] = 距离 * 8;
    } else {
      for (var xw = 距离 * 8; xw < 距离 * 8 + 0x10; xw++) {
        if (xw % 4 == Instruct0440) {
          NesHex[指令数据Addr + 3] = xw;
          break;
        }
      }
      NesHex[指令数据Addr + 2] = 体力 % 256;
    }
  } else {
    var ss1 = toHex16(Instruct0443, 1).substr(0, 1);
    var ss2 = Instruct0440;
    var sx = ss1 + ss2;
    NesHex[指令数据Addr + 3] = parseInt(sx, 16);
  }
  NesHex[肖像数据地址] = parseInt(
    Skill_o_txt[$('#skill__code').get(0).selectedIndex].substr(0, 2),
    16,
  );
  alertMsg('#isfileload', 'green', '指令数据修改成功!');
}

function CheckInstructT() {
  Instruct0440 = 0;
  var 体力 = $('#InstructT').get(0).selectedIndex;

  if (体力 <= 255) {
    Instruct0440 = 0;
  } else if (体力 > 255 && 体力 < 512) {
    Instruct0440 = 1;
  } else if (体力 > 512 && 体力 < 768) {
    Instruct0440 = 2;
  } else if (体力 > 768 && 体力 < 1024) {
    Instruct0440 = 3;
  } else {
    Instruct0440 = 4;
  }
}

var skilllistshoot = [];
var skilllistother = [];

function LoadSkills() {
  skilllistshoot = [];
  skilllistother = [];
  var xdz = $('#SikllNameList').get(0).selectedIndex * 2 + 球员必杀索引;
  var bdz = ramcheck(xdz, NesHex);
  var str =
    'Skill entry: 0x' +
    toHex16(xdz, 5) +
    '=' +
    toHex16(NesHex[xdz]) +
    ' ' +
    toHex16(NesHex[xdz + 1]);
  str += ' Index address: 0x' + toHex16(bdz, 5);
  str += ' <br>Skill index: ';

  //+ toHex16(NesHex[bdz]);
  for (var i = 0; i <= 6; i++) {
    str +=
      toHex16(NesHex[bdz + i * 2 + 0]) +
      ' ' +
      toHex16(NesHex[bdz + i * 2 + 1]) +
      ' ';
  }
  var shootaddr = ramcheck(bdz, NesHex); //继续跳转索引;0x30000 + NesHex[bdz + 1] * 0x100 + NesHex[bdz] + 0x10; //ramcheck(bdz, NesHex);
  var lstSTYPE = Skill_TYPE_.split(',');
  var lstSHOT = Skill_SHOT_.split(',');
  var lstPASS = Skill_PASS_.split(',');
  var lstDRIBB = Skill_DRIBBLE_.split(',');
  var lstCOMBO = Skill_COMBO_.split(',');
  var lstBLOCK = Skill_BLOCK_.split(',');
  var lstTACKLE = Skill_TACKLE_.split(',');
  var lstICEPT = Skill_ICEPT_.split(',');
  var lstGK = Skill_GK_.split(',');

  BindSkillStrO(lstPASS, lstSTYPE, 1, bdz + 2, bdz + 3, 'Pass'); //传/过人/二过一等
  BindSkillStrO(lstDRIBB, lstSTYPE, 2, bdz + 4, bdz + 5, 'Dribble');
  BindSkillStrO(lstCOMBO, lstSTYPE, 3, bdz + 6, bdz + 7, 'Combo');
  BindSkillStrO(lstBLOCK, lstSTYPE, 4, bdz + 8, bdz + 9, 'Block');
  BindSkillStrO(lstTACKLE, lstSTYPE, 5, bdz + 10, bdz + 11, 'Tackle');
  BindSkillStrO(lstICEPT, lstSTYPE, 6, bdz + 12, bdz + 13, 'Intercept');
  BindSkillStrO(lstGK, lstSTYPE, 7, bdz + 14, bdz + 15, 'GK');

  if (NesHex[bdz] == 0x00 && NesHex[bdz + 1] == 0x00) {
    lstSTYPE[0] = lstSTYPE[0] + 'Special Shot: none<br>';
  } else {
    var 射门索引低位 = NesHex[bdz];
    var 射门索引高位 = NesHex[bdz + 1];
    for (var i = 0; i < 9 * 2; i++) {
      if (NesHex[shootaddr + i] == 0x03) {
        break;
      }
      if (NesHex[shootaddr + i] == 0xff) {
        i++;
      }
      for (var x = 0; x < lstSHOT.length; x++) {
        if (skilllistshoot.length > 7) {
          break;
        }
        if (parseInt(lstSHOT[x].substr(0, 2), 16) == NesHex[shootaddr + i]) {
          if (i == 0) {
            lstSTYPE[0] =
              lstSTYPE[0] +
              'Special Shot:            Index ' +
              toHex16(射门索引低位) +
              ' ' +
              toHex16(射门索引高位) +
              ' <br>Special Shot:            Address 0x' +
              toHex16(shootaddr, 5) +
              ':' +
              lstSHOT[x] +
              '<br>';
          } else {
            lstSTYPE[0] =
              lstSTYPE[0] +
              'Special Shot:            Address 0x' +
              toHex16(shootaddr + i, 5) +
              ':' +
              lstSHOT[x] +
              '<br>';
          }
          skilllistshoot.push(lstSHOT[x]);
          //SkillSTR2[0] = SkillSTR2[0] + Skill0[x] + "<br>";
        }
      }

      if (
        NesHex[shootaddr + i] == 0x20 ||
        NesHex[shootaddr + i] == 0x21 ||
        NesHex[shootaddr + i] == 0x22 ||
        NesHex[shootaddr + i] == 0x24 ||
        NesHex[shootaddr + i] == 0x25 ||
        NesHex[shootaddr + i] == 0x26 ||
        NesHex[shootaddr + i] == 0x28 ||
        NesHex[shootaddr + i] == 0x29 ||
        NesHex[shootaddr + i] == 0x2a ||
        NesHex[shootaddr + i] == 0x4c ||
        NesHex[shootaddr + i] == 0x4d ||
        NesHex[shootaddr + i] == 0x4e
      ) {
        i++;
      }
    }
  }
  str += '<br>';
  str += lstSTYPE[0];
  for (var i = 1; i < lstSTYPE.length; i++) {
    str += lstSTYPE[i] + '<br>';
  }
  $('#SkillStr').html(str);
  GetSkillEdit();
  Changeskilladdtype();
}

function BindSkillStrO(lstSkills, lstTypes, ix, bd1, bd2, nm) {
  if (NesHex[bd1] == 0x00 && NesHex[bd2] == 0x00) {
    lstTypes[ix] = lstTypes[ix] + ': none';
    skilllistother.push(['none', nm]);
  } else {
    BindSkillStr(lstSkills, lstTypes, ix, bd1, bd2, nm);
  }
}

function BindSkillStr(lstSkills, lstTypes, ix, bd1, bd2, nm) {
  for (var i = 0; i < lstSkills.length; i++) {
    if (lstSkills[i].substr(0, 2) == toHex16(NesHex[ramcheck(bd1, NesHex)])) {
      lstTypes[ix] =
        lstTypes[ix] +
        ': Index ' +
        toHex16(NesHex[bd1]) +
        ' ' +
        toHex16(NesHex[bd2]) +
        ' Address 0x' +
        toHex16(ramcheck(bd1, NesHex), 5) +
        ':' +
        lstSkills[i];
      skilllistother.push([lstSkills[i], nm]);
    }
  }
}

function ChangeSkillView() {
  if (SkillViewTypeVar == 0) {
    $('#SkillViewType').html('View Mode');
    $('#SkillStr').css('display', 'block');
    $('#SkillEdit').css('display', 'none');
    SkillViewTypeVar = 1;
  } else {
    $('#SkillViewType').html('Edit Mode');
    $('#SkillStr').css('display', 'none');
    $('#SkillEdit').css('display', 'block');
    SkillViewTypeVar = 0;
  }
}

function CheckTempaddr1(dz) {
  for (var i = 0; i < 8064; i++) {
    if (
      NesHex[0x78020 + i] == 0x00 &&
      NesHex[0x78020 + i + 1] == 0x00 &&
      NesHex[0x78020 + i + 2] == 0x00 &&
      NesHex[0x78020 + i + 3] == 0x00 &&
      NesHex[0x78020 + i + 4] == 0x00 &&
      NesHex[0x78020 + i + 5] == 0x00 &&
      NesHex[0x78020 + i + 6] == 0x00 &&
      NesHex[0x78020 + i + 7] == 0x00 &&
      NesHex[0x78020 + i + 8] == 0x00 &&
      NesHex[0x78020 + i + 9] == 0x00 &&
      NesHex[0x78020 + i + 10] == 0x00 &&
      NesHex[0x78020 + i + 11] == 0x00 &&
      NesHex[0x78020 + i + 12] == 0x00 &&
      NesHex[0x78020 + i + 13] == 0x00 &&
      NesHex[0x78020 + i + 14] == 0x00 &&
      NesHex[0x78020 + i + 15] == 0x00 &&
      NesHex[0x78020 + i + 16] == 0x00 &&
      NesHex[0x78020 + i + 17] == 0x00 &&
      NesHex[0x78020 + i + 18] == 0x00 &&
      NesHex[0x78020 + i + 19] == 0x00 &&
      NesHex[0x78020 + i + 20] == 0x00 &&
      NesHex[0x78020 + i + 21] == 0x00 &&
      NesHex[0x78020 + i + 22] == 0x00 &&
      NesHex[0x78020 + i + 23] == 0x00 &&
      NesHex[0x78020 + i + 24] == 0x00 &&
      NesHex[0x78020 + i + 25] == 0x00 &&
      NesHex[0x78020 + i + 26] == 0x00 &&
      NesHex[0x78020 + i + 27] == 0x00 &&
      NesHex[0x78020 + i + 28] == 0x00 &&
      NesHex[0x78020 + i + 29] == 0x00
    ) {
      dz = 0x78020 + i;
      break;
    }
  }
  return dz - 0x10;
}

function CheckTempaddr2(dz) {
  var fxa = true;
  for (var i = 0; i < 700; i++) {
    if (i >= 700) {
      fxa = false;
      break;
    }
    if (
      NesHex[0x3bd10 + i] == 0xff &&
      NesHex[0x3bd10 + i + 1] == 0xff &&
      NesHex[0x3bd10 + i + 2] == 0xff
    ) {
      dz = 0x3bd10 + i;
      break;
    }
  }
  if (fxa == false) {
    for (var i = 0; i < 700; i++) {
      if (
        NesHex[0x3fd10 + i] != 0xff ||
        NesHex[0x3fd10 + i + 1] != 0xff ||
        NesHex[0x3fd10 + i + 2] != 0xff
      )
        continue;
      dz = 0x3fd10 + i;
      break;
    }
  }
  return dz - 0x10;
}

function Save_Skills() {
  var 总索引 = $('#SikllNameList').get(0).selectedIndex * 2 + 球员必杀索引;
  var 开关索引1 = 0;
  var 开关索引2 = 0;
  var rewrite = false;
  var skillothers = [
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x81, 0x82, 0x83, 0x84, 0x00,
  ];
  var xx = {
    '01': [0xe5, 0xff, 0x01],
    '02': [0xe6, 0xff],
    '03': [0xe7, 0xff],
    '04': [0xe8, 0xff],
    '05': [0xe9, 0xff],
    '06': [0xea, 0xff],
    81: [0xeb, 0xff, 0x01],
    82: [0xec, 0xff, 0x03],
    83: [0xed, 0xff, 0x0a],
    84: [0xee, 0xff, 0x20],
  };
  var dz = 0; //总索引;// ramcheck(总索引, NesHex);

  var usenew = $('#usenewaddr').is(':checked');

  if (IsCn) {
    var cncount = NesHex.indexOf(cn768);
    if (cncount <= 0) {
      for (var i = 0; i < cn768.length; i++) {
        NesHex[0x7fa70 + i] = cn768[i];
      }
      NesHex[0x8000c] = 0x60;
      NesHex[0x8000d] = 0xfa;
    }

    for (var i = 0; i < skillothers.length; i++) {
      NesHex[0x78015 + i] = skillothers[i];
    }
    xx = {
      '01': [0x05, 0x50],
      '02': [0x06, 0x50],
      '03': [0x07, 0x50],
      '04': [0x08, 0x50],
      '05': [0x09, 0x50],
      '06': [0x0a, 0x50],
      81: [0x0b, 0x50],
      82: [0x0c, 0x50],
      83: [0x0d, 0x50],
      84: [0x0e, 0x50],
    };
    //空地址
    if (
      NesHex[总索引 + 1] == 0x50 ||
      NesHex[总索引 + 1] == 0x51 ||
      NesHex[总索引 + 1] == 0x52 ||
      NesHex[总索引 + 1] == 0x53 ||
      NesHex[总索引 + 1] == 0x54 ||
      NesHex[总索引 + 1] == 0x55 ||
      NesHex[总索引 + 1] == 0x56 ||
      NesHex[总索引 + 1] == 0x57 ||
      NesHex[总索引 + 1] == 0x58 ||
      NesHex[总索引 + 1] == 0x59 ||
      NesHex[总索引 + 1] == 0x5a ||
      NesHex[总索引 + 1] == 0x5b ||
      NesHex[总索引 + 1] == 0x5c ||
      NesHex[总索引 + 1] == 0x5d ||
      NesHex[总索引 + 1] == 0x5e ||
      NesHex[总索引 + 1] == 0x5f ||
      NesHex[总索引 + 1] == 0x60 ||
      NesHex[总索引 + 1] == 0x61 ||
      NesHex[总索引 + 1] == 0x62 ||
      NesHex[总索引 + 1] == 0x63 ||
      NesHex[总索引 + 1] == 0x64 ||
      NesHex[总索引 + 1] == 0x65 ||
      NesHex[总索引 + 1] == 0x66 ||
      NesHex[总索引 + 1] == 0x67 ||
      NesHex[总索引 + 1] == 0x68 ||
      NesHex[总索引 + 1] == 0x69 ||
      NesHex[总索引 + 1] == 0x6a ||
      NesHex[总索引 + 1] == 0x6b ||
      NesHex[总索引 + 1] == 0x6c ||
      NesHex[总索引 + 1] == 0x6d ||
      NesHex[总索引 + 1] == 0x6e ||
      NesHex[总索引 + 1] == 0x6f
    ) {
      dz = ramcheck(总索引, NesHex);
      rewrite = true;
    } else {
      dz = CheckTempaddr1(dz);
    }
  }

  //else if (Is1v32) {}
  else {
    for (var i = 0; i < skillothers.length; i++) {
      NesHex[0x3fff5 + i] = skillothers[i];
    }
    if (
      NesHex[总索引 + 1] == 0xbd ||
      NesHex[总索引 + 1] == 0xbe ||
      NesHex[总索引 + 1] == 0xbf ||
      NesHex[总索引 + 1] == 0xfd ||
      NesHex[总索引 + 1] == 0xfe ||
      NesHex[总索引 + 1] == 0xff ||
      (toHex16(NesHex[总索引 + 1]).substr(0, 1) == '6' && Is1v32 == true) ||
      (toHex16(NesHex[总索引 + 1]).substr(0, 1) == '7' && Is1v32 == true)
    ) {
      dz = ramcheck(总索引, NesHex);
      rewrite = true;
    } else {
      dz = CheckTempaddr2(dz);
    }
  }

  if (Is1v32 == true) {
    xx = {
      '01': [0xe5, 0x7f],
      '02': [0xe6, 0x7f],
      '03': [0xe7, 0x7f],
      '04': [0xe8, 0x7f],
      '05': [0xe9, 0x7f],
      '06': [0xea, 0x7f],
      81: [0xeb, 0x7f],
      82: [0xec, 0x7f],
      83: [0xed, 0x7f],
      84: [0xee, 0x7f],
    };
    for (var i = 0; i < skillothers.length; i++) {
      NesHex[0x7ff5 + i] = skillothers[i];
    }
  }

  if (dz >= 0x10000 && Is1v32 == true) {
    //dz = parseInt(toHex16(ramcheck(总索引, NesHex), 5).substr(1, 4), 16);
  }

  开关索引1 = parseInt(toHex16(dz, 4).substr(2, 2), 16);
  开关索引2 = parseInt(toHex16(dz, 4).substr(0, 2), 16);
  var tempx1 = NesHex[总索引];
  var tempx2 = NesHex[总索引 + 1];
  NesHex[总索引] = 开关索引1;
  NesHex[总索引 + 1] = 开关索引2;

  dz = dz + 0x10;
  var SkillByte = [];
  for (var i = 0; i < $('#ulshoot').children().length; i++) {
    let str = $('#ulshoot').children().eq(i).find('span').text();
    SkillByte.push(parseInt(str.substr(0, 2), 16));
    if (
      str.substr(0, 2) == '20' ||
      str.substr(0, 2) == '21' ||
      str.substr(0, 2) == '22' ||
      str.substr(0, 2) == '24' ||
      str.substr(0, 2) == '25' ||
      str.substr(0, 2) == '26' ||
      str.substr(0, 2) == '28' ||
      str.substr(0, 2) == '29' ||
      str.substr(0, 2) == '2A' ||
      str.substr(0, 2) == '4C' ||
      str.substr(0, 2) == '4D' ||
      str.substr(0, 2) == '4E'
    ) {
      SkillByte.push(0xff);
    }
  }
  SkillByte.push(0x03);

  NesHex[dz] = parseInt(toHex16(dz + 14 - 0x10, 4).substr(2, 2), 16);
  NesHex[dz + 1] = parseInt(toHex16(dz + 14 - 0x10, 4).substr(0, 2), 16);
  // Special Shot/Whether to write to a new empty address
  if (rewrite == true && usenew == false) {
    var ck = ramcheck(总索引, NesHex) - 0x10;
    NesHex[总索引] = parseInt(toHex16(ck - 0x10, 4).substr(2, 2), 16);
    NesHex[总索引 + 1] = parseInt(toHex16(ck - 0x10, 4).substr(0, 2), 16);
    dz = ck;
    if (IsCn) {
      NesHex[总索引] = tempx1;
      NesHex[总索引 + 1] = tempx2;
      NesHex[dz] = parseInt(
        toHex16(dz - 0x73000 + 14 - 0x10, 4).substr(2, 2),
        16,
      );
      NesHex[dz + 1] = parseInt(
        toHex16(dz - 0x73000 + 14 - 0x10, 4).substr(0, 2),
        16,
      );
      ck = dz = dz + 0x40000;
    }
    for (var i = 0; i < SkillByte.length; i++) {
      NesHex[ck + 14 + i] = SkillByte[i];
      //alert(SkillByte[i]);
    }
  } else {
    if (IsCn) {
      开关索引1 = parseInt(toHex16(dz - 0x73000 - 0x10, 4).substr(2, 2), 16);
      开关索引2 = parseInt(toHex16(dz - 0x73000 - 0x10, 4).substr(0, 2), 16);
      NesHex[总索引] = 开关索引1;
      NesHex[总索引 + 1] = 开关索引2;
      NesHex[dz] = parseInt(
        toHex16(dz - 0x73000 + 14 - 0x10, 4).substr(2, 2),
        16,
      );
      NesHex[dz + 1] = parseInt(
        toHex16(dz - 0x73000 + 14 - 0x10, 4).substr(0, 2),
        16,
      );
    } else {
      NesHex[dz] = parseInt(toHex16(dz + 14 - 0x10, 4).substr(2, 2), 16);
      NesHex[dz + 1] = parseInt(toHex16(dz + 14 - 0x10, 4).substr(0, 2), 16);
    }
    for (var i = 0; i < SkillByte.length; i++) {
      NesHex[dz + 14 + i] = SkillByte[i];
    }
  }
  SkillByte = [];
  var addrtemp = 2;
  // Special Pass
  if ($('#ulother').children().eq(0).find('span').text() == 'none') {
    NesHex[dz + addrtemp] = NesHex[dz + addrtemp + 1] = 0x00;
  } else {
    var cd = $('#ulother').children().eq(0).find('span').text().substr(0, 2);
    NesHex[dz + addrtemp] = xx[cd]?.[0] || 0;
    NesHex[dz + addrtemp + 1] = xx[cd]?.[1] || 0;
  }
  addrtemp += 2;
  // Special Dribble
  if ($('#ulother').children().eq(1).find('span').text() == 'none') {
    NesHex[dz + addrtemp] = NesHex[dz + addrtemp + 1] = 0x00;
  } else {
    var cd = $('#ulother').children().eq(1).find('span').text().substr(0, 2);
    NesHex[dz + addrtemp] = xx[cd]?.[0] || 0;
    NesHex[dz + addrtemp + 1] = xx[cd]?.[1] || 0;
  }
  addrtemp += 2;
  // Special 1-2
  if ($('#ulother').children().eq(2).find('span').text() == 'none') {
    NesHex[dz + addrtemp] = NesHex[dz + addrtemp + 1] = 0x00;
  } else {
    var cd = $('#ulother').children().eq(2).find('span').text().substr(0, 2);
    NesHex[dz + addrtemp] = xx[cd]?.[0] || 0;
    NesHex[dz + addrtemp + 1] = xx[cd]?.[1] || 0;
  }
  addrtemp += 2;
  // Special Block
  if ($('#ulother').children().eq(3).find('span').text() == 'none') {
    NesHex[dz + addrtemp] = NesHex[dz + addrtemp + 1] = 0x00;
  } else {
    var cd = $('#ulother').children().eq(3).find('span').text().substr(0, 2);
    NesHex[dz + addrtemp] = xx[cd]?.[0] || 0;
    NesHex[dz + addrtemp + 1] = xx[cd]?.[1] || 0;
  }
  addrtemp += 2;
  // Special Tackle
  if ($('#ulother').children().eq(4).find('span').text() == 'none') {
    NesHex[dz + addrtemp] = NesHex[dz + addrtemp + 1] = 0x00;
  } else {
    var cd = $('#ulother').children().eq(4).find('span').text().substr(0, 2);
    NesHex[dz + addrtemp] = xx[cd]?.[0] || 0;
    NesHex[dz + addrtemp + 1] = xx[cd]?.[1] || 0;
    NesHex[防守必杀效果代码 + $('#SikllNameList').get(0).selectedIndex] =
      xx[cd]?.[2] || 0; //Defense effect code
  }
  addrtemp += 2;
  // Special Intercept
  if ($('#ulother').children().eq(5).find('span').text() == 'none') {
    NesHex[dz + addrtemp] = NesHex[dz + addrtemp + 1] = 0x00;
  } else {
    var cd = $('#ulother').children().eq(5).find('span').text().substr(0, 2);
    NesHex[dz + addrtemp] = xx[cd]?.[0] || 0;
    NesHex[dz + addrtemp + 1] = xx[cd]?.[1] || 0;
  }
  // Special GK
  if ($('#ulother').children().eq(6).find('span').text() == 'none') {
    NesHex[dz + addrtemp] = NesHex[dz + addrtemp + 1] = 0x00;
  } else {
    var cd = $('#ulother').children().eq(6).find('span').text().substr(0, 2);
    NesHex[dz + addrtemp] = xx[cd]?.[0] || 0;
    NesHex[dz + addrtemp + 1] = xx[cd]?.[1] || 0;
  }
  LoadSkills();
  alertMsg('#isfileload', 'green', 'Special move updated successfully!');
}

function DelSkillsub(id) {
  if ($(id).attr('af') == 'ulshoot') {
    $(id).parent().remove();
  } else {
    $(id).next().html('none');
  }
}

function addSkillsub() {
  var 类型 = $('#skilladdtype').get(0).selectedIndex;
  var text = $('#skillsub option:selected').text();
  if (类型 == 0) {
    if ($('#ulshoot').children().length == 9) {
      alertMsg(
        '#isfileload',
        'red',
        'The number of special shots has exceeded the original limit!',
      );
    } else {
      var selectstr =
        "<li style='display:block;'><button af='ulshoot' onclick='DelSkillsub(this);'>Del (Shot)</button><span>" +
        text +
        '</span></li>';
      $(selectstr).appendTo($('#ulshoot'));
    }
  } else {
    $('#ulother')
      .children()
      .eq([类型 - 1])
      .find('span')
      .html(text);
  }
}

function Changeskilladdtype() {
  var 类型 = $('#skilladdtype').get(0).selectedIndex;
  $('#skillsub').html('');
  var Skillitem = [];
  switch (类型) {
    case 0:
      Skillitem = Skill_SHOT_.split(',');
      break;
    case 1:
      Skillitem = Skill_PASS_.split(',');
      break;
    case 2:
      Skillitem = Skill_DRIBBLE_.split(',');
      break;
    case 3:
      Skillitem = Skill_COMBO_.split(',');
      break;
    case 4:
      Skillitem = Skill_BLOCK_.split(',');
      break;
    case 5:
      Skillitem = Skill_TACKLE_.split(',');
      break;
    case 6:
      Skillitem = Skill_ICEPT_.split(',');
      break;
    case 7:
      Skillitem = Skill_GK_.split(',');
      break;
  }
  var obj = document.getElementById('skillsub');
  for (var i = 0; i < Skillitem.length; i++) {
    obj.options.add(new Option(Skillitem[i], i));
  }
}

function getskillimgcode() {
  var id = $('#skill__addr').get(0).selectedIndex;
  var codes = toHex16(NesHex[Skill_o_addr[id]]);
  肖像数据地址 = Skill_o_addr[id];
  var x = 0;
  for (var i = 0; i < Skill_o_txt.length; i++) {
    if (codes == Skill_o_txt[i].substr(0, 2)) {
      x = i;
      break;
    }
  }
  document.getElementById('skill__code')[x].selected = true;
  $('#InstructTempText').html(
    'Instruction data address: 0x' +
      toHex16(指令数据Addr, 5) +
      ' Portrait data address: 0x' +
      toHex16(肖像数据地址, 5),
  );
}
