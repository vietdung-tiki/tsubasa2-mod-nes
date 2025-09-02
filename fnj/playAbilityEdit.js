$(document).ready(function () {
  BulidplayerAbilityEditTabHtml();
});

function GetPlayerData(datatypes) {
  if (datatypes == 0) {
    var nowplayerdata = $('#playerAbilitySe').get(0).selectedIndex;
    $('#playerHP').val(NesHex[player_data_addr + nowplayerdata * 24]);
    for (var w = 1; w <= 22; w++) {
      $('#playerAb' + w).val(NesHex[player_data_addr + nowplayerdata * 24 + w]);
    }
  }

  if (datatypes == 1) {
    //GK
    var nowplayerdata2 =
      player_data_GK_addr + $('#playerGKAbilitySe').get(0).selectedIndex * 8;
    for (var i = 0; i <= 7; i++) {
      $('#playerGKAb' + (i + 1)).val(NesHex[nowplayerdata2 + i]);
    }
  }
}

function SetPlayerData(datatypes) {
  if (datatypes == 0) {
    var nowplayerdata = $('#playerAbilitySe').get(0).selectedIndex;
    NesHex[player_data_addr + nowplayerdata * 24] =
      $('#playerHP').get(0).selectedIndex;
    for (var w = 1; w <= 22; w++) {
      NesHex[player_data_addr + nowplayerdata * 24 + w] = $(
        '#playerAb' + w,
      ).get(0).selectedIndex;
    }
    alertMsg('#isfileload', 'green', 'Player ability modified successfully~');
  }

  if (datatypes == 1) {
    //GK
    var nowplayerdata2 =
      player_data_GK_addr + $('#playerGKAbilitySe').get(0).selectedIndex * 8;
    for (var i = 0; i <= 7; i++) {
      NesHex[nowplayerdata2 + i] = $('#playerGKAb' + (i + 1)).get(
        0,
      ).selectedIndex;
    }
    alertMsg(
      '#isfileload',
      'green',
      'Goalkeeper ability modified successfully~',
    );
  }
}

function PlayOneClick(datatypes) {
  if (datatypes == 0) {
    //$('#playerGKAbOnclick').val('0000000');
    //$('#playerAbOnclick').val('0000000');
    var nowplayerdata = $('#playerAbOnclick').get(0).selectedIndex;
    for (var w = 1; w <= 22; w++) {
      $('#playerAb' + w).val(nowplayerdata);
    }
  }

  if (datatypes == 1) {
    //GK
    var nowplayerdata2 = $('#playerGKAbOnclick').get(0).selectedIndex;
    for (var i = 2; i <= 8; i++) {
      $('#playerGKAb' + i).val(nowplayerdata2);
    }
  }
}

function BulidplayerAbilityEditTabHtml() {
  $('#playeredit_a_1').empty();
  var playAbilityEditTabHtml = '<div>';
  playAbilityEditTabHtml +=
    "<span>Player:</span><select id='playerAbilitySe' onchange='GetPlayerData(0)'></select><br>";
  playAbilityEditTabHtml += "<table style='border:1px solid'>";

  playAbilityEditTabHtml +=
    "<tr><td>Stamina:</td><td><select id='playerHP'></select></td></tr>";

  for (var i = 0; i < abilitStr.length / 2; i++) {
    playAbilityEditTabHtml +=
      '<tr><td>' +
      abilitStr[i * 2 + 0] +
      "</td><td><select id='playerAb" +
      (i * 2 + 1) +
      "'></select></td><td>" +
      abilitStr[i * 2 + 1] +
      "</td><td><select id='playerAb" +
      (i * 2 + 2) +
      "'></select></td></tr>";
  }

  playAbilityEditTabHtml += '</table>';
  playAbilityEditTabHtml +=
    "<span>One-click preset:</span><select id='playerAbOnclick' onchange='PlayOneClick(0)'></select>  <button onclick='SetPlayerData(0)'>Apply Player Ability Changes</button><br><br>";
  playAbilityEditTabHtml +=
    "<span>GK:</span><select id='playerGKAbilitySe' onchange='GetPlayerData(1)'></select>";
  playAbilityEditTabHtml += "<table style='border:1px solid'>";

  for (var i = 0; i < abilitGKStr.length / 2; i++) {
    playAbilityEditTabHtml +=
      '<tr><td>' +
      abilitGKStr[i * 2 + 0] +
      "</td><td><select id='playerGKAb" +
      (i * 2 + 1) +
      "'></select></td><td>" +
      abilitGKStr[i * 2 + 1] +
      "</td><td><select id='playerGKAb" +
      (i * 2 + 2) +
      "'></select></td></tr>";
  }

  playAbilityEditTabHtml += '</table>';
  playAbilityEditTabHtml +=
    "<span>One-click preset:</span><select id='playerGKAbOnclick' onchange='PlayOneClick(1)'></select>  <button onclick='SetPlayerData(1)'>Apply GK Ability Changes</button><br><br>";
  playAbilityEditTabHtml +=
    '<span>Left: true values; right: displayed values.<br>One-click preset does not include stamina.<br>Ability editing doesn’t support special mods (e.g., moved player data addresses).<br>Display values show original-game data only; see below to modify display values.<br>Modify displayed stamina values<br>0x39F1E=90 01 98 01....CC 03 D0 03<br>09 01=0109=400, 98 01=0198=408<br>Modify displayed ability values<br>0x39E5E=08 08....FE FF<br>If you need to sync true values with display values, please use the PC version of Hack CT2.</span>';
  playAbilityEditTabHtml += '</div>';

  //return;
  $('#playeredit_a_1').html(playAbilityEditTabHtml);
  for (var i = 0; i < player_data_ab.length; i++) {
    fillSelectlist_x($('#playerGKAbOnclick'), i, player_data_ab[i]);
    fillSelectlist_x($('#playerAbOnclick'), i, player_data_ab[i]);
  }
  for (var i = 0; i < player_data_arr.length; i++) {
    fillSelectlist_x($('#playerAbilitySe'), i, player_data_arr[i]);
  }
  for (var i = 0; i < player_data_GK.length; i++) {
    fillSelectlist_x($('#playerGKAbilitySe'), i, player_data_GK[i]);
  }
  for (var i = 0; i < player_data_hp.length; i++) {
    fillSelectlist_x($('#playerHP'), i, player_data_hp[i]);
    fillSelectlist_x($('#playerGKAb1'), i, player_data_hp[i]);
  }
  for (var w = 1; w <= 22; w++) {
    for (var i = 0; i < player_data_ab.length; i++) {
      if (w > 1 && w <= 8) {
        fillSelectlist_x($('#playerGKAb' + w), i, player_data_ab[i]);
      }
      fillSelectlist_x($('#playerAb' + w), i, player_data_ab[i]);
    }
    $('#playerAb' + w).val('0000000');
    if (w > 1 && w <= 8) {
      $('#playerGKAb' + w).val('0000000');
    }
  }

  $('#playerGKAbOnclick').val('0000000');
  $('#playerAbOnclick').val('0000000');
  $('#playerGKAb1').val('0000000');
  $('#playerAbilitySe').val('0000000');
  $('#playerGKAbilitySe').val('0000000');
  $('#playerHP').val('0000000');
}
