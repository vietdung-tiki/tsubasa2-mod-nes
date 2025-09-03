// Player select item add
function LoadTxtData() {
  for (var i = 11; i > 0; i--) {
    var sel;
    if (i == 1) {
      sel = document.getElementById('selectplayerGK');
    } else {
      sel = document.getElementById('selectplayer' + addPreZero(i));
    }
    var str = '';
    str = fillSelectlist_S(str, playerstr);
    sel.innerHTML = str;
  }

  // Substitutes
  for (var i = 1; i <= 10; i++) {
    var resel;
    if (i == 9) {
      resel = document.getElementById('selectplayertgk1');
    } else if (i == 10) {
      resel = document.getElementById('selectplayertgk2');
    } else {
      resel = document.getElementById('selectplayert' + addPreZero(i));
    }
    var restr = '';
    restr = fillSelectlist_S(restr, playerstr);
    resel.innerHTML = restr;
  }
}

// Build HTML elements
function LoadHtmlInner() {
  BulidHTML_Team_Player();
  LoadTxtData();
  BulidHTML_ChrHTML();
  BulidInstructTabHtml();
  BulidHTML_BG_View_Html(); // Build CHR extended HTML
}

// CHR quick editor
function BulidHTML_ChrHTML() {
  // CHR 2.0
  $('#CHRTab').append(
    '<div id="chrEditmeu" style="display:none;position: fixed;">' +
      '<button style="background-color:white;color:black;" onclick="CopyTileData()">Copy</button><br>' +
      '<button style="background-color:white;color:black;" onclick="PastTileData()">Paste</button>' +
      '</div>' +
      '<div id="ChrColors"></div>' +
      '<canvas id="chrCanvas" width="128" height="128"></canvas><br>' +
      '<select id="chrPageSelect"></select>' +
      '<span>View size:</span>' +
      '<select id="chrSizeSelect"><option value="128">128x128</option><option value="256" selected>256x256</option><option value="512">512x512</option></select><br>' +
      '<span id="tileInfo"></span><br>' +
      '<textarea id="tileCode"></textarea><button onclick="changeTile()">Apply</button><br>' +
      '<span>Brush:</span><select id="penSelect"><option value="0"></option><option value="1"></option><option value="2"></option><option value="3"></option></select>&nbsp;' +
      '<canvas id="penCanvas" width="32" height="32"></canvas>&nbsp;' +
      '<span>Clipboard:</span><canvas id="PastTileCanvas" width="32" height="32"></canvas><br>' +
      '<span>Clicked:</span><canvas id="clickedCanvas" width="32" height="32"></canvas><button onclick="clearClicked()">Clear</button><br>' +
      '<textarea id="arrTile"></textarea><button onclick="changeArrTile()">Apply</button><br>' +
      '<canvas id="selectedTileCanvas" width="128" height="128"></canvas><br>' +
      '<button onclick="writeTileData()">Apply Tile Changes</button><br>' +
      '<span>CHR large view: right-click to open Copy/Paste menu.<br>' +
      'Tile edit: left-click paints color, right-click switches brush.<br>' +
      'Tip: hold left mouse and move to paint continuously.<br>' +
      'Tile edit is experimental and not very convenient.</span>',
  );
  $('#ChrColors').append(
    "<span>Chr quick viewer/editor v2.1 by daymoe<br>Palette:</span><select id='ChrColor1' onchange='ChrColorChange()'></select> <select id='ChrColor2'onchange='ChrColorChange()'></select> <select id='ChrColor3'onchange='ChrColorChange()'></select> <select id='ChrColor4'onchange='ChrColorChange()'></select>",
  );
  InputPlayerColorData('#ChrColor1');
  InputPlayerColorData('#ChrColor2');
  InputPlayerColorData('#ChrColor3');
  InputPlayerColorData('#ChrColor4');
  document.getElementById('ChrColor1')[0x0f].selected = true;
  document.getElementById('ChrColor2')[0x07].selected = true;
  document.getElementById('ChrColor3')[0x28].selected = true;
  document.getElementById('ChrColor4')[0x39].selected = true;
}

// Background viewer 1.2
function BulidHTML_BG_View_Html() {
  var inputstyle =
    'word-break:normal;display:block;white-space:pre-wrap;overflow-y:auto;';
  // Story BG
  $('#BGview').empty();
  var htmlstr =
    "<div><span>Model Index Address:</span><input type='text' style='width:60px;' id='BGview_Id' value='E010'>";
  htmlstr +=
    "<span>Data Length:</span><input type='text' style='width:60px;' id='BGview_Id_Len' value='69'>";
  htmlstr += "<button onclick='GetBGview()'>Parse</button><br>";
  htmlstr +=
    '<span>Animation List:</span><select id="BGview_ID_0" onchange="GetBGview_BG(-1)"></select>';
  htmlstr +=
    ' <span>Arrangement Bank:</span><select id="BGview_SeAddr" onchange="GetBGview_BG_1()"><option value="0">0x10010</option><option value="1">0x11110</option></select><span>If display looks wrong, try switching bank.</span><br>';
  htmlstr +=
    '<canvas id="chr_BG0_Canvas" width="512" height="256"></canvas><br>';
  htmlstr += "<span>CHR Bank:</span><span id='BGview_Dat_0'>0</span>";
  htmlstr += "<span>Palette & Bank:</span><span id='BGview_Dat_1'>0</span>";
  htmlstr += "<span>Rows:</span><span id='BGview_Dat_2'>0</span>";
  htmlstr += "<span>Cols:</span><span id='BGview_Dat_3'>0</span>";
  htmlstr += "<span>Start Tile Pos:</span><span id='BGview_Dat_4'>0</span><br>";
  htmlstr +=
    "<span>Tile Index:</span><span id='BGview_Dat_5' style='width:160px;max-height: 80px;" +
    inputstyle +
    "'>0</span>";
  htmlstr += "<span>Tail Anim Data:</span><span id='BGview_Dat_6'>0</span><br>";
  htmlstr +=
    "<span>Raw Data:</span><br><span id='BGview_Dat_7' style='width:520px;max-height: 100px;" +
    inputstyle +
    "'>0</span>";
  htmlstr += '</div>';
  $('#BGview').html(htmlstr);
  document.getElementById('chr_BG0_Canvas').crossorigin = '';

  // 0528 background
  $('#BGview_0528').empty();
  htmlstr = '<div>';
  htmlstr +=
    '<span>Available Version:</span><select id="BGview_0528_05ca_Tpye" onchange="GetBGview_0528_05ca_Tpye()"><option value="0">Original</option><option value="1">1.32</option></select><br>';
  htmlstr +=
    '<span>05CC List:</span><select id="BGview_0528_05cc_list" onchange="GetBGview_0528_05cc_list()"></select> ';
  htmlstr +=
    '<span>05CA List:</span><select id="BGview_0528_05ca_list" onchange="GetBGview_0528_05ca_list()"></select><br>';
  htmlstr +=
    '<span>05CC Addr:</span><input type="text" style="width: 60px;" id="BG05cc_addr" value="16B74"> ';
  htmlstr +=
    '<span>05CA Addr:</span><input type="text" style="width: 60px;" id="BG05ca_addr" value="24010"><br>';
  htmlstr +=
    '<span>Attr Addr:</span><input type="text" style="width: 60px;" id="BGAdb_addr" value="17BF4"> ';
  htmlstr +=
    '<span>CHR Addr:</span><input type="text" style="width: 60px;" id="BGchr_addr" value="166FE"><br>';
  htmlstr +=
    '<canvas id="chr_BGview_0528_Canvas" width="256" height="256"></canvas><br>';
  htmlstr +=
    '<span>05CC Data:<br></span><span id="BGview_0528_Dat_0" style="width:300px;max-height: 80px;' +
    inputstyle +
    '">0</span><br>';
  htmlstr +=
    '<span>05CA Data:<br></span><span id="BGview_0528_Dat_1" style="width:300px;max-height: 80px;' +
    inputstyle +
    '">0</span><br>';
  htmlstr +=
    '<span>Attr Bytes:<br></span><span id="BGview_0528_Dat_2" style="width:300px;max-height: 80px;' +
    inputstyle +
    '">0</span><br>';
  htmlstr +=
    '<span>NAM Layout:<br></span><span id="BGview_0528_Dat_3" style="width:300px;max-height: 80px;' +
    inputstyle +
    '">0</span>';
  htmlstr += '</div>';
  $('#BGview_0528').html(htmlstr);
  document.getElementById('chr_BGview_0528_Canvas').crossorigin = '';
}

function BulidHTML_Team_Player() {
  // Select stage
  $('#Select_stage').empty();
  $('#Select_stage').append(
    $(`<span><input id="sel_stage" type="checkbox"> Can select stage </span>`),
    $(`<button onclick="ChangeSelStage()">Apply</button>`),
  );

  // Players
  $('#Team_player_list').empty();
  var Team_player_list =
    "<div id='playerlistdiv' style='float:left; display:inline;'>";
  // starters
  for (var i = 11; i > 0; i--) {
    if (i == 1) {
      Team_player_list +=
        '<span>No.GK:</span><select id="selectplayerGK" offindex=0></select><br>';
    } else {
      Team_player_list +=
        '<span>No.' +
        addPreZero(i) +
        ':</span><select id="selectplayer' +
        addPreZero(i) +
        '" offindex=0></select><br>';
    }
  }
  Team_player_list += '</div>';
  // subs
  Team_player_list +=
    "<div id='replayerlistdiv' style='float:left; display:none;'>";
  for (var i = 0; i <= 7; i++) {
    Team_player_list +=
      '<span>Re.' +
      addPreZero(i + 1) +
      ':</span><select id="selectplayert' +
      addPreZero(i + 1) +
      '" offindex=0></select><br>';
  }
  Team_player_list +=
    '<span>Re.GK1:</span><select id="selectplayertgk1" offindex=0></select><br>';
  Team_player_list +=
    '<span>Re.GK2:</span><select id="selectplayertgk2" offindex=0></select><br>';
  Team_player_list += '</div>';
  $('#Team_player_list').html(Team_player_list);

  // Teams
  $('#Team_list').empty();
  var Team_list = "<select id='Team_Select' onchange='TeamSelectChange()'>";
  Team_list = fillSelectlist_S(Team_list, teamlist);
  Team_list += '</select>';

  // extra teams
  Team_list +=
    "<select id='Add_Team_Select' style='display:none;' onchange='Add_TeamSelectChange()'>";
  for (var W = 3; W < teamlist.length; W++) {
    Team_list += '<option>' + teamlist[W] + '</option>';
  }
  Team_list += '</select>';
  Team_list +=
    "<button id='showadteambtn' onclick='CAddTeam()'>Add Star Player</button>&nbsp;<button onclick='ChangeTeam()'>Apply</button><br>";
  Team_list +=
    '<div id="Team_AKDFdiv"><span>Tactics:</span><select id="Team_AK"></select>&nbsp;<span>Formation:</span><select id="Team_DF"></select><span id="TeamedStr"> </span><br></div>';
  $('#Team_list').html(Team_list);
  for (var i = 0; i < 4; i++) {
    fillSelectlist_x($('#Team_DF'), i, Formation_Str[i]);
  }
  for (var i = 4; i < Formation_Str.length; i++) {
    fillSelectlist_x($('#Team_AK'), i, Formation_Str[i]);
  }

  // Add team UI
  Team_player_list =
    "<div id='addteam' style='float:left; display:none;'>Use free space <input id='addteamusenewaddr' type='checkbox'><br>";
  for (var i = 11; i > 0; i--) {
    if (i == 1) {
      Team_player_list +=
        '<div><span>No.GK:</span><select id="addplayerGK" offindex=0 onchange="addteamclick()"></select><br></div>';
    } else {
      Team_player_list +=
        '<div><span>No.' +
        addPreZero(i) +
        ':</span><select id="addplayer' +
        addPreZero(i) +
        '" offindex=0 onchange="addteamclick()"></select><br></div>';
    }
  }
  Team_player_list += '<span>Fixed Params:</span><br>';
  Team_player_list +=
    '<div><span>Formation/Tactics</span><select id="addplayeSB1" offindex=0 onchange="addteamclick()"></select><br></div>';
  Team_player_list +=
    '<div><span>Unknown</span><select id="addplayeSB2" offindex=0 onchange="addteamclick()"></select><br></div>';
  Team_player_list +=
    '<div><span>GK</span><select id="addplayeSB3" offindex=0 onchange="addteamclick()"></select><br></div>';
  Team_player_list +=
    '<div><span>DEF</span><select id="addplayeSB4" offindex=0 onchange="addteamclick()"></select><br></div>';
  Team_player_list +=
    '<div><span>MID</span><select id="addplayeSB5" offindex=0 onchange="addteamclick()"></select><br></div>';
  Team_player_list +=
    '<div><span>FW</span><select id="addplayeSB6" offindex=0 onchange="addteamclick()"></select><br></div>';
  Team_player_list +=
    '<div><span>Corner Taker (High)</span><select id="addplayeSB7" offindex=0 onchange="addteamclick()"></select><br></div>';
  Team_player_list +=
    '<div><span>Corner AI1</span><select id="addplayeSB8" offindex=0 onchange="addteamclick()"></select><br></div>';
  Team_player_list +=
    '<div><span>Corner AI2</span><select id="addplayeSB9" offindex=0 onchange="addteamclick()"></select></div>';
  Team_player_list += '<div><span id="addteamStr">Hex:</span></div>';
  Team_player_list += '</div>';
  $('#Team_player_list').append(Team_player_list);

  for (var i = 11; i > 0; i--) {
    var sel;
    if (i == 1) {
      sel = document.getElementById('addplayerGK');
    } else {
      sel = document.getElementById('addplayer' + addPreZero(i));
    }
    var str = '';
    str = fillSelectlist_S(str, playerstr);
    sel.innerHTML = str;
  }

  var strTEMP = '';
  strTEMP = fillSelectlist_S(strTEMP, playerstr);
  document.getElementById('addplayeSB3').innerHTML =
    document.getElementById('addplayeSB4').innerHTML =
    document.getElementById('addplayeSB5').innerHTML =
    document.getElementById('addplayeSB6').innerHTML =
      strTEMP;

  strTEMP = '';
  strTEMP = fillSelectlist_S_16(strTEMP, 256);
  document.getElementById('addplayeSB2').innerHTML =
    document.getElementById('addplayeSB7').innerHTML =
    document.getElementById('addplayeSB8').innerHTML =
    document.getElementById('addplayeSB9').innerHTML =
      strTEMP;

  strTEMP = '';
  document.getElementById('addplayeSB1').innerHTML = fillSelectlist_S(
    strTEMP,
    team_da,
  );

  // Socks
  $('#Teamedit_a_1').empty();
  var Team_SC_list = "<div id='Team_SCDIV'>";
  Team_SC_list += "<select id='Team_SC_Select' onchange='Team_SC_Change()'>";
  Team_SC_list = fillSelectlist_S(Team_SC_list, teamlist);
  Team_SC_list += "</select><span id='Team_SC_str'></span><br>";
  Team_SC_list +=
    '<span>Light:</span><select id="Team_SC_C0" offindex=0 onchange="Team_SC_Change2()"></select>&nbsp;';
  Team_SC_list +=
    '<span>Dark</span><select id="Team_SC_C1" offindex=0 onchange="Team_SC_Change2()"></select><br>';
  Team_SC_list +=
    "<img id='canteamscpict' src=''/><img id='canteamscpictemp' style='display:none;' src=''/>";
  Team_SC_list += "<br><button onclick='CG_Team_SC()'>Apply</button>";
  Team_SC_list += '</div>';
  $('#Teamedit_a_1').html(Team_SC_list);

  strTEMP = '';
  strTEMP = fillSelectlist_S_16(strTEMP, 0x40);
  document.getElementById('Team_SC_C0').innerHTML = document.getElementById(
    'Team_SC_C1',
  ).innerHTML = strTEMP;
}

// Model / Portrait etc.
function LoadPlayerEditHtml() {
  $('#playeredit_a_0').empty();
  var htmlstr =
    "<span>Players:</span> <select id='PlayerEditNameList' offindex=0 onchange='PlayerEditSelectChange();'></select><br>";
  htmlstr +=
    "<span>Mod:</span><select id='PlayerModSelect' offindex=0 onchange='PlayerModSelectChange();'>";
  htmlstr = fillSelectlist_S(htmlstr, PlayModList);
  htmlstr += '</select><br><div>';
  htmlstr += "<table id='PlayerEditColor' style='border:1px solid #F00;'>";
  htmlstr +=
    '<tr><td>Skin</td><td>Hair</td><td>Jersey</td><td>Shorts</td><td>Model</td></tr>';
  htmlstr +=
    "<tr><td><span id='PlayerSkincolour' class='colorpanle'>     </span></td><td><span id='PlayerHaircolor' class='colorpanle'>     </span></td><td><span id='PlayerCoatcolor' class='colorpanle'>     </span></td><td><span id='PlayerShortscolor' class='colorpanle'>     </span></td><td><div id='diccanvasmod'><img id='canvasmod' src='" +
    IMG_ModPic[18] +
    "'/><div id='LoadPlayEditPngChange'></div><div></td></tr>";
  htmlstr +=
    "<tr><td><select id='PlayerSkincolourSe' offindex=0 onchange='getColoroptionsVal(this)'></select></td><td><select id='PlayerHaircolorSe' offindex=0 onchange='getColoroptionsVal(this)'></select></td><td><select id='PlayerCoatcolorSe' offindex=0 onchange='getColoroptionsVal(this)'></select></td><td><select id='PlayerShortscolorSe' offindex=0 onchange='getColoroptionsVal(this)'></select></td><td><button id='GetModBtn' onclick='GetModFunction()'>Refresh Preview</button></td></tr>";
  htmlstr += '</table>';
  htmlstr += '</div>';
  htmlstr += "<span id='SeModeDataSpan'>Data:</span><br>";
  htmlstr +=
    "<button onclick='ChangeNowPlayerMod()'>Apply Current Model Changes</button><img id='canvasmodtemp' style='display:none;' src='" +
    IMG_ModPic[18] +
    "'/>";
  htmlstr +=
    '<br><span>Notes:<br>- Mod preview loads only when a selection is chosen.<br>- From player #0x76 (Tsubasa Ozora) head model is not present.<br>- If preview image fails, click refresh again.<br></span>';
  $('#playeredit_a_0').html(htmlstr);
  $('#PlayerEditNameList').empty();
  for (var i = 0; i < PlayerName.length; i++) {
    fillSelectlist_x($('#PlayerEditNameList'), i, PlayerName[i]);
  }
  InputPlayerColorData('#PlayerSkincolourSe');
  InputPlayerColorData('#PlayerHaircolorSe');
  InputPlayerColorData('#PlayerCoatcolorSe');
  InputPlayerColorData('#PlayerShortscolorSe');
  $('#PlayerEditNameList').val('000000');
  $('#PlayerModSelect').val('000000');

  // Versus portrait colors
  $('#playeredit_a_2').empty();
  htmlstr =
    "<select id='PlayerVSModColorList' onchange='PlayerVSModColorChange();'></select><br>";
  htmlstr +=
    "<div id='vspic_outside' style='width:256px;height:110px;vertical-align: middle;display: table-cell; text-align: center;'><img id='caVSmod' src='" +
    IMG_VS_Pic[0] +
    "'/></div>";
  htmlstr +=
    "<table style='border-collapse: collapse;border: 1px red solid;' id='vspic_Tab'><tr>";
  htmlstr +=
    "<td><span>Light skin</span><br><select id='vscol_1' onchange='PlayerVSModColorChange2();'></select></td>";
  htmlstr +=
    "<td><span>Dark skin</span><br><select id='vscol_2' onchange='PlayerVSModColorChange2();'></select></td>";
  htmlstr +=
    "<td><span id='vscc_1'>GK Collar</span><br><select id='vscol_3' onchange='PlayerVSModColorChange2();'></select></td>";
  htmlstr +=
    "<td><span id='vscc_2'>GK Jersey</span><br><select id='vscol_4' onchange='PlayerVSModColorChange2();'></select></td>";
  htmlstr +=
    "<td><span>Hair Color</span><br><select id='vscol_5' onchange='PlayerVSModColorChange2();'></select></td></tr>";
  htmlstr +=
    "<tr><td><span>Inner Frame BG</span><br><select id='vscol_6' onchange='PlayerVSModColorChange2();'></select></td>";
  htmlstr +=
    "<td><span>Outer Frame BG</span><br><select id='vscol_7' onchange='PlayerVSModColorChange2();'></select></td>";
  htmlstr += '</tr></table>';
  htmlstr +=
    "<button onclick='ChangeVsPic_()'>Apply</button><img id='caVSmodtemp' style='display:none;' src='" +
    IMG_VS_Pic[0] +
    "'/>";

  $('#playeredit_a_2').html(htmlstr);
  for (var i = 0; i < IMG_Name_Portrait.length; i++) {
    fillSelectlist_x($('#PlayerVSModColorList'), i, IMG_Name_Portrait[i][0]);
  }
  for (var i = 0; i < 0x40; i++) {
    fillSelectlist_x($('#vscol_1'), i, toHex16(i));
    fillSelectlist_x($('#vscol_2'), i, toHex16(i));
    fillSelectlist_x($('#vscol_3'), i, toHex16(i));
    fillSelectlist_x($('#vscol_4'), i, toHex16(i));
    fillSelectlist_x($('#vscol_5'), i, toHex16(i));
    fillSelectlist_x($('#vscol_6'), i, toHex16(i));
    fillSelectlist_x($('#vscol_7'), i, toHex16(i));
  }
  $('#vspic_Tab tr th').css('border', '1px solid');
  $('#vspic_Tab tr td').css('text-align', 'center');

  // VS portrait binding
  $('#playeredit_a_3').empty();
  htmlstr =
    "<table style='border-collapse: collapse;border: 1px red solid;' id='vscg_Tab'><tr>";
  htmlstr += '<tr>';
  htmlstr +=
    "<td><select id='PlayerVSModADDList1' onchange='PlayerVSModAddChange(1);'></select><br><select id='Vsmodelist1' onchange='bingDVSimg(1);'></select></td>";
  htmlstr +=
    "<td class='cvspkimg'><img id='VSmodIMG1' src='" +
    IMG_VS_Pic[IMG_VS_Pic.length - 1] +
    "'/><br><span id='VSmodIMG1str'>0x20704</span></td>";
  htmlstr += '</tr>';
  htmlstr += '<tr>';
  htmlstr +=
    "<td><select id='PlayerVSModADDList2' onchange='PlayerVSModAddChange(2);'></select><br><select id='Vsmodelist2' onchange='bingDVSimg(2);'></select></td>";
  htmlstr +=
    "<td class='cvspkimg'><img id='VSmodIMG2' src='" +
    IMG_VS_Pic[0] +
    "'/><br><span id='VSmodIMG2str'>0x21E6C</span></td>";
  htmlstr += '</tr>';
  htmlstr += '</table>';
  htmlstr += "<button onclick='ChangGVsPKpic()'>Apply</button>";

  $('#playeredit_a_3').html(htmlstr);
  for (var i = 0; i < PlayerName_Skill.length; i++) {
    if (i == 0) {
      fillSelectlist_x($('#PlayerVSModADDList1'), i, playerstrtemp0);
    }
    if (
      i == 0x01 ||
      i == 0x0e ||
      i == 0x20 ||
      i == 0x21 ||
      i == 0x25 ||
      i == 0x38 ||
      i == 0x3f ||
      i == 0x4b ||
      i == 0x32 ||
      i == 0x51 ||
      i == 0x55 ||
      i == 0x5a ||
      i == 0x68 ||
      i == 0x73
    ) {
    } else {
      fillSelectlist_x($('#PlayerVSModADDList1'), i, PlayerName_Skill[i]);
    }
  }
  for (var i = 0; i < Portrait_List.length; i++) {
    fillSelectlist_x($('#Vsmodelist1'), i, Portrait_List[i]);
  }
  for (var i = 0; i < 4; i++) {
    fillSelectlist_x($('#PlayerVSModADDList2'), i, Portrait_List_GK[i]);
  }
  for (var i = 4; i < Portrait_List_GK.length; i++) {
    fillSelectlist_x($('#Vsmodelist2'), i, Portrait_List_GK[i]);
  }
  $('#vscg_Tab tr td').css('border', '1px solid');
  $('#vscg_Tab tr td').css('text-align', 'left');
  $('.cvspkimg').css('text-align', 'center');
}

// AI ability index & run
function loadHPandOther() {
  var str = "<select id='AiHPindex' onchange='outAiStr();'>";
  str = fillSelectlist_S(str, Ai_HP_Index);
  str += '</select>';
  $('#aitab0').append(str);

  str = "<select id='AiXXAck' onchange='outAiStr();'>";
  str = fillSelectlist_S_16(str, 0x100);
  str += '</select>';
  $('#aitab2').append(str);

  str = "<select id='AiXXDef' onchange='outAiStr();'>";
  str = fillSelectlist_S_16(str, 0x100);
  str += '</select>';
  $('#aitab3').append(str);
}

// Check and output run-step data
function checkrunai() {
  for (var i = 0; i < 12; i++) {
    var xxxx = '#AiRunType_' + (i + 1);
    $(xxxx).val(
      NesHex[步长类型 + $('#AiRunType').get(0).selectedIndex * 12 + i],
    );
  }
  $('#AiRunType_Addr').html(
    ' 0x' + toHex16(步长类型 + $('#AiRunType').get(0).selectedIndex * 12, 5),
  );
  outAiStr();
}

// Build run-step HTML
function loadAiRun() {
  var str = "<select id='AiRunType' onchange='checkrunai();'>";
  str = fillSelectlist_S(str, Ai_Run);
  str += "</select><span id='AiRunType_Addr'></span>";

  var tempstr = [
    'Marking',
    'Carrying',
    'Attack',
    'Defense',
    'Attack Support',
    'Defense Support',
  ];
  for (var i = 0; i < tempstr.length; i++) {
    str += '<div><span>' + tempstr[i] + '<span>';
    str += "<select id='AiRunType_" + (i * 2 + 1) + "' onchange='outAiStr();'>";
    str += '</select> ';
    str += "<select id='AiRunType_" + (i * 2 + 2) + "' onchange='outAiStr();'>";
    str += '</select></div>';
  }

  $('#aitab1').append(str);
  for (var i = 0; i < 0x100; i++) {
    for (var x = 0; x < 12; x++) {
      $('#AiRunType_' + (x + 1)).append(
        $('<option/>').text(toHex16(i)).attr('value', i),
      );
    }
  }
}

// AI top bar & passing intent
function loadPassAi1() {
  var AI_player_list = '<div>Players:';
  AI_player_list +=
    " <select id='AiPlayerSelect' offindex=0 onchange='AiPlayersChange();'>";
  AI_player_list = fillSelectlist_S(AI_player_list, Aiplayerstr);
  AI_player_list += "</select><div id='AIOutStr'></div></div>";
  $('#AI_Players_Name').html(AI_player_list);

  // Passing intent
  var AiPasslist =
    "<span id='Passtext'></span><select id='AiPasslistSelect' offindex=0 onchange='AiPasslistChange();'>";
  AiPasslist = fillSelectlist_S_16(AiPasslist, 0x2f);
  AiPasslist += '</select><br>';

  // Sub items
  var passdiv = AiPasslist + '<div>';
  for (var i = 0; i <= 7; i++) {
    passdiv +=
      "<select id='passdata" +
      (i + 1) +
      "' offindex=0 onchange='getoptionsVal(this," +
      (i + 1) +
      ")'></select>";
    passdiv += "<span id='passsp" + (i + 1) + "'></span>";
    if (i + 1 != 8) {
      passdiv += '<br>';
    }
  }
  passdiv += '</div>';
  $('#aitab7').html(passdiv);
  loadPassAi2(); // fill codes
}

function AI几率分区数据HTML构造(tempXstr, st, ed, str) {
  var temphtml = '';
  for (var i = st; i <= ed; i++) {
    temphtml +=
      "<div><span id='" +
      str[0] +
      i +
      "' af='" +
      tempXstr[i - st] +
      "'>" +
      tempXstr[i - st] +
      '</span>';
    temphtml += "<span id='" + str[1] + i + "'></span>";
    for (var x = 0; x < 4; x++) {
      temphtml +=
        " <select id='" +
        str[2] +
        i +
        '_' +
        x +
        "' onchange='" +
        str[3] +
        ";'>";
      temphtml += '</select>';
    }
    temphtml += '</div>' + 分割线;
  }
  return temphtml;
}

// Attack AI probability HTML
function loadAckAi() {
  var str = "<div id='tab_Ack'><div>";
  str += "<button onclick='showdiv(0);'>Attack - Ground</button>";
  str += "<button onclick='showdiv(1);'>Attack - P1 Box (High/Low)</button>";
  str += "<button onclick='showdiv(2);'>Attack - NPC Box (High/Low)</button>";
  str += '</div>';

  str += "<div class='tab_content''>";

  // Ground attack
  str += "<div id='aiackdiv1'>";
  str += " <select id='AiAck1' onchange='ldAIData1(0);'>";
  str = fillSelectlist_S(str, Ai_Ack_1str);
  str += '</select>';
  var tempXstr = [
    'Zone 1: P1 corner area',
    'Zone 2: P1 big box edge',
    'Zone 3: P1 small box edge',
    'Zone 4: P1 small box',
    'Zone 5: Midfield',
    'Zone 6: NPC backfield',
  ];
  str += AI几率分区数据HTML构造(tempXstr, 0, 5, [
    'AiEx_',
    'AiEx_Txt_',
    'AiEx_select_',
    'GetAIData1(0);',
  ]);
  str += '</div>';

  // P1 box high/low
  str += "<div id='aiackdiv2' style='display:none;'>";
  str += " <select id='AiAck2' onchange='ldAIData1(1);'>";
  str = fillSelectlist_S(str, Ai_Ack_2str);
  str += '</select>';
  tempXstr = [
    'Zone 7: P1 big box middle',
    'Zone 8: P1 small box edge',
    'Zone 9: P1 small box inside',
  ];
  str += AI几率分区数据HTML构造(tempXstr, 6, 8, [
    'AiEx_',
    'AiEx_Txt_',
    'AiEx_select_',
    'GetAIData1(1);',
  ]);
  str += '</div>';

  // NPC box high/low
  str += "<div id='aiackdiv3' style='display:none;'>";
  str += " <select id='AiAck3' onchange='ldAIData1(2);'>";
  str = fillSelectlist_S(str, Ai_Ack_3str);
  str += '</select>';
  tempXstr = [
    'Zone 10: NPC big box middle',
    'Zone 11: NPC small box edge',
    'Zone 12: NPC small box inside',
  ];
  str += AI几率分区数据HTML构造(tempXstr, 9, 11, [
    'AiEx_',
    'AiEx_Txt_',
    'AiEx_select_',
    'GetAIData1(2);',
  ]);
  str += '</div>';

  str += '</div></div>';
  $('#aitab4').append(str);

  for (var i = 0; i <= 5; i++) {
    for (var x = 0; x < 4; x++) {
      添加几率文本(Ai_data_1_2, '#AiEx_select_' + i + '_' + x);
    }
  }
  for (var i = 6; i <= 8; i++) {
    for (var x = 0; x < 4; x++) {
      添加几率文本(Ai_data_2_2, '#AiEx_select_' + i + '_' + x);
    }
  }
  for (var i = 9; i <= 11; i++) {
    for (var x = 0; x < 4; x++) {
      添加几率文本(Ai_data_3_2, '#AiEx_select_' + i + '_' + x);
    }
  }
}

// Defense AI probability HTML
function loadDefAi() {
  var str = "<div id='tab_Def' ><div>";
  str += "<button onclick='showdiv(3);'>Defense - Ground</button>";
  str += "<button onclick='showdiv(4);'>Defense - P1 Box (High/Low)</button>";
  str += "<button onclick='showdiv(5);'>Defense - NPC Box (High/Low)</button>";
  str += '</div>';

  str += "<div class='tab_content''>";

  // Ground defense
  str += "<div id='aidefdiv1'>";
  str += "<select id='AiDef1' onchange='ldAIData2(0);'>";
  str = fillSelectlist_S(str, Ai_Def_1str);
  str += '</select>';
  var tempXstr = [
    'Zone 1: NPC corner area',
    'Zone 2: NPC big box edge',
    'Zone 3: NPC small box edge',
    'Zone 4: NPC small box',
    'Zone 5: Midfield',
    'Zone 6: P1 backfield',
  ];
  str += AI几率分区数据HTML构造(tempXstr, 0, 5, [
    'AiEx1_',
    'AiEx1_Txt_',
    'AiEx1_select_',
    'GetAIData2(0);',
  ]);
  str += '</div>';

  // NPC high/low defense
  str += "<div id='aidefdiv2' style='display:none;'>";
  str += "<select id='AiDef2' onchange='ldAIData2(1);'>";
  str = fillSelectlist_S(str, Ai_Def_2str);
  str += '</select>';
  tempXstr = [
    'Zone 7: NPC big box middle',
    'Zone 8: NPC small box edge',
    'Zone 9: NPC small box inside',
  ];
  str += AI几率分区数据HTML构造(tempXstr, 6, 8, [
    'AiEx1_',
    'AiEx1_Txt_',
    'AiEx1_select_',
    'GetAIData2(1);',
  ]);
  str += '</div>';

  // P1 high/low defense
  str += "<div id='aidefdiv3' style='display:none;'>";
  str += "<select id='AiDef3' onchange='ldAIData2(2);'>";
  str = fillSelectlist_S(str, Ai_Def_3str);
  str += '</select>';
  tempXstr = [
    'Zone 10: P1 big box middle',
    'Zone 11: P1 small box edge',
    'Zone 12: P1 small box inside',
  ];
  str += AI几率分区数据HTML构造(tempXstr, 9, 11, [
    'AiEx1_',
    'AiEx1_Txt_',
    'AiEx1_select_',
    'GetAIData2(2);',
  ]);
  str += '</div>';

  str += '</div></div>';
  $('#aitab5').append(str);

  for (var i = 0; i <= 5; i++) {
    for (var x = 0; x < 4; x++) {
      添加几率文本(Ai_data_4_2, '#AiEx1_select_' + i + '_' + x);
    }
  }
  for (var i = 6; i <= 8; i++) {
    for (var x = 0; x < 4; x++) {
      添加几率文本(Ai_data_5_2, '#AiEx1_select_' + i + '_' + x);
    }
  }
  for (var i = 9; i <= 11; i++) {
    for (var x = 0; x < 4; x++) {
      添加几率文本(Ai_data_6_2, '#AiEx1_select_' + i + '_' + x);
    }
  }
}

// GK AI probability HTML
function loadGKAi() {
  var str = "<div id='tab_GK' ><div>";
  str +=
    "<button onclick='showdiv(6);'>Normal GK Defense (Punch vs Catch)</button>";
  str +=
    "<button onclick='showdiv(7);'>High/Low Ball: GK Rush Decision</button>";
  str += "<button onclick='showdiv(8);'>Ground: GK Rush Decision</button>";
  str += '</div>';

  str += "<div class='tab_content''>";

  // Normal defense (punch/catch)
  str += "<div id='aiGKdiv1'>";
  str += "<select id='AiGK1' onchange='ldAIData3(0);'>";
  str = fillSelectlist_S(str, Ai_GK_1str);
  str += '</select>';
  var temphtml = '';
  temphtml += "<div><span id='AiEx2_1' af='Normal Defense'></span><br>";
  temphtml += "<span id='AiEx2_Txt_1'></span>";
  for (var x = 0; x < 4; x++) {
    temphtml +=
      " <select id='AiEx2_select_1_" + x + "' onchange='GetAIData3(0);'>";
    temphtml += '</select>';
  }
  temphtml += '</div>';
  str += temphtml;
  str += '</div>';

  // High/Low rush
  str += "<div id='aiGKdiv2' style='display:none;'>";
  str += "<select id='AiGK2' onchange='ldAIData3(1);'>";
  str = fillSelectlist_S(str, Ai_GK_2str);
  str += '</select>';
  temphtml = '';
  temphtml += "<div><span id='AiEx2_2' af='Rush on High/Low Ball'></span><br>";
  temphtml += "<span id='AiEx2_Txt_2'></span>";
  for (var x = 0; x < 4; x++) {
    temphtml +=
      " <select id='AiEx2_select_2_" + x + "' onchange='GetAIData3(1);'>";
    temphtml += '</select>';
  }
  temphtml += '</div>';
  str += temphtml;
  str += '</div>';

  // 1v1 rush
  str += "<div id='aiGKdiv3' style='display:none;'>";
  str += "<select id='AiGK3' onchange='ldAIData3(2);'>";
  str = fillSelectlist_S(str, Ai_GK_3str);
  str += '</select>';
  temphtml = '';
  temphtml += "<div><span id='AiEx2_3' af='Rush when 1v1'></span><br>";
  temphtml += "<span id='AiEx2_Txt_3'></span>";
  for (var x = 0; x < 4; x++) {
    temphtml +=
      " <select id='AiEx2_select_3_" + x + "' onchange='GetAIData3(2);'>";
    temphtml += '</select>';
  }
  temphtml += '</div>';
  str += temphtml;
  str += '</div>';

  str += '</div></div>';
  $('#aitab6').append(str);

  for (var x = 0; x < 4; x++) {
    添加几率文本(Ai_data_7_2, '#AiEx2_select_1_' + x);
    添加几率文本(Ai_data_8_2, '#AiEx2_select_2_' + x);
    添加几率文本(Ai_data_9_2, '#AiEx2_select_3_' + x);
  }
}

// Command (skills) tab
function BulidInstructTabHtml() {
  var btn =
    '<button id="Instructedit_x_0" af="#Instructedit_a_0" onclick="showInstructbuttondiv(0)">Command Data</button>';
  btn +=
    '<button id="Instructedit_x_1" af="#Instructedit_a_1" onclick="showInstructbuttondiv(1)">Skill Add</button>';
  var htmlstr =
    btn +
    "<div id='Instructedit_a_0'><div><span>Note: Aggressiveness/Power should not exceed 0xFC.<br>Stamina/One-two distance can be edited. Web version doesn’t show linked 0440/0443 data.<br>Command editing supports only original-address data.</span></div>";
  htmlstr +=
    "<div><span>Command Set:</span><select id='InstructList' onchange='GetInstruct();'>";
  htmlstr = fillSelectlist_S(htmlstr, 指令文本);
  htmlstr += '</select><br></div>';

  htmlstr +=
    "<div><span>Aggressiveness:</span><select id='InstructB' onchange='CheckInstructB();'>";
  htmlstr = fillSelectlist_S_16(htmlstr, 0x100);
  htmlstr += '</select><br></div>';

  htmlstr += "<div><span>Power:</span><select id='InstructW'>";
  htmlstr = fillSelectlist_S_16(htmlstr, 0x100);
  htmlstr += '</select><br></div>';

  htmlstr +=
    "<div><span>Stamina:</span><select id='InstructT' onchange='CheckInstructT();'>";
  htmlstr = fillSelectlist_S_10(htmlstr, 501);
  htmlstr += '</select></div>';

  htmlstr +=
    "<div id='Instruct2_1DIV'><span>1-2 Distance:</span><select id='Instruct2_1' style='dispaly:none;'>";
  htmlstr = fillSelectlist_S_16(htmlstr, 0x100 / 8);
  htmlstr += '</select></div>';

  htmlstr +=
    "<div><span>Skill Icon ↓</span><br><select id='skill__addr' onchange='getskillimgcode();'>";
  htmlstr = fillSelectlist_S(htmlstr, Skill_o_str);
  htmlstr += "</select><select id='skill__code'>";
  htmlstr = fillSelectlist_S(htmlstr, Skill_o_txt);
  htmlstr += '</select></div>';
  htmlstr += "<span id='InstructTempText'></span>";
  htmlstr +=
    "<div><button onclick='ChangeInstruct();'>Apply Command Changes ↑</button></div></div>";
  htmlstr +=
    "<div id='Instructedit_a_1'><div><span>Specials view/edit supports original & some hacks.</span></div><div><span>Special:</span><select id='SikllNameList' onchange='LoadSkills();'>";
  htmlstr = fillSelectlist_S(htmlstr, PlayerName_Skill);
  htmlstr +=
    "</select><button id='SkillViewType' onclick='ChangeSkillView();'>Toggle Mode</button></div><span id='SkillStr'></span>";
  htmlstr += "<div id='SkillEdit' style='display:none;'></div>";
  htmlstr += '</div>';
  $('#InstructTab').html(htmlstr);
}

var SkillViewTypeVar = 1; // mode flag

function GetSkillEdit() {
  var xdz = $('#SikllNameList').get(0).selectedIndex * 2 + 球员必杀索引;
  var bdz = ramcheck(xdz, NesHex);
  var str =
    '<div><span>Skill entry : 0x' +
    toHex16(xdz, 5) +
    '=' +
    toHex16(NesHex[xdz]) +
    ' ' +
    toHex16(NesHex[xdz + 1]);
  str += '  Index Addr:0x' + toHex16(bdz, 5);
  str += '</span></div><div><span>Skill index : ';
  for (var i = 0; i <= 6; i++) {
    str +=
      toHex16(NesHex[bdz + i * 2 + 0]) +
      ' ' +
      toHex16(NesHex[bdz + i * 2 + 1]) +
      ' ';
  }
  str += '</span></div>';
  var shootaddr = ramcheck(bdz, NesHex);

  var Skilltype = Skill_TYPE_.split(',');
  Skilltype[0] = 'Special Shot';
  var selectstr =
    "<div><span>Special type:</span><select id='skilladdtype' onchange='Changeskilladdtype();'>";
  selectstr = fillSelectlist_S(selectstr, Skilltype);
  selectstr += '</select>';
  selectstr += "<select id='skillsub'>";
  selectstr +=
    "</select><button onclick='addSkillsub();'>Add Skill</button></div>";

  selectstr += "<ul id='ulshoot'>";
  for (var i = 0; i < skilllistshoot.length; i++) {
    let sub = '#ulshoot' + i;
    selectstr +=
      "<li style='display:block;'><button af='ulshoot' onclick='DelSkillsub(this);'>Del (Shot)</button><span>" +
      skilllistshoot[i] +
      '</span></li>';
  }
  selectstr += '</ul>';

  selectstr += "<ul id='ulother'>";
  for (var i = 0; i < skilllistother.length; i++) {
    let sub = '#ulother' + i;
    selectstr +=
      `<li style='display:block;'><button af='ulother' onclick='DelSkillsub(this);'>Del (${skilllistother[i][1]})</button><span>` +
      skilllistother[i][0] +
      '</span></li>';
  }
  selectstr += '</ul>';
  selectstr +=
    "<button onclick='Save_Skills();'>Apply Special Changes</button><span> Force new free space → <input id='usenewaddr' type='checkbox'>(avoid unless needed)</span><br>";
  selectstr +=
    '<div><span>Special add notes<br>The 7-class skill index uses 2*7=0x0E bytes; Special Shot max uses 0x12 bytes.<br>A generic non-shot special index uses 0x0A bytes.' +
    '<br>Single-person special max uses 0x1C bytes (for duo special, write 0xFF in the 2nd byte).<br>Forcing generic index may crash the game.<br>Generic index bytes: 01 02 03 04 05 06 81 82 83 84 00' +
    '<br>Main skill switch points to the index of the 7 classes.<br>Index 00 00 means no special.<br>If index != 00 00, it jumps and reads special code.' +
    '<br>*Force new free space: fixes some hacks where new special shots don’t work.</span></div>';
  $('#SkillEdit').html(str + selectstr);
}
