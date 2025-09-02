$(document).ready(function () {
  BulidEdit16TabHtml();
});

function hex2int(hex) {
  var len = hex.length,
    a = new Array(len),
    code;
  for (var i = 0; i < len; i++) {
    code = hex.charCodeAt(i);
    if (48 <= code && code < 58) {
      code -= 48;
    } else {
      code = (code & 0xdf) - 65 + 10;
    }
    a[i] = code;
  }

  return a.reduce(function (acc, c) {
    acc = 16 * acc + c;
    return acc;
  }, 0);
}

function LoadHex16() {
  //@"\b(0[xX])?[A-Fa-f0-9]+\b";
  var ff = $('#offEditNo').val();
  /*	var offtd=ff;
        if(offtd.length>1)
            {
            offtd.substr(offtd.length-1,1);
            }*/
  ff = hex2int(ff);
  $('#HexPreView').empty();
  var budHexHtml = '';
  budHexHtml +=
    "<table id='Edit16ViewTabs' style='border:1px solid #090;border-radius: 3px;'>";
  budHexHtml += '<tr>';
  budHexHtml += '<td><pre>Offset:</pre></td>';
  for (var i = 0; i <= 0x0f; i++) {
    //budHexHtml+="<td>"+addPreZero((i).toString(16).toUpperCase())+"</td>";
    budHexHtml +=
      '<td><pre>0' +
      addPreZero((ff + i).toString(16).toUpperCase()).substring(1) +
      '</pre></td>';
  }
  budHexHtml += '</tr>';
  for (var i = 0; i <= 0x0f; i++) {
    budHexHtml += '<tr>';
    var defid = i + ff;
    var topoff = addPreZero2((defid + i * 0x0f).toString(16), 6);
    //budHexHtml+="0x"+topoff.toUpperCase()+"0:";
    budHexHtml += '<td><pre>' + '' + topoff.toUpperCase() + ':' + '</pre></td>';
    for (var w = 0; w <= 0x0f; w++) {
      var oftdtd = ff + i * 0x10 + w;
      var bhex = addPreZero(NesHex[oftdtd].toString(16).toUpperCase());
      budHexHtml +=
        "<td onclick='GetRditAddr(this)' offset='" +
        oftdtd +
        "' ><pre>" +
        bhex +
        '</pre></td>';
      /*		if(w==0x0F)
                    {
                        budHexHtml+=bhex+"<br>";
                    }
                    else
                    {
                        budHexHtml+=bhex+" ";
                    }*/
    }
    budHexHtml += '</tr>';
  }

  budHexHtml += '</table>';
  $('#HexPreView ').html(budHexHtml);
  $('#HexPreView td').css({
    'font-size': defEditFontSize,
  });
  $('#HexPreView table').css({
    'font-size': defEditFontSize,
  });
  $('#HexPreView tr').css({
    'font-size': defEditFontSize,
  });
  $('#HexPreView').css('font-size', defEditFontSize);
}

function NextHexData(nexttype) {
  var ff = $('#offEditNo').val();
  ff = hex2int(ff);
  if (nexttype == 0) {
    ff = ff - 0x100;
  } else {
    ff = ff + 0x100;
  }
  if (ff < 0) {
    $('#offEditNo').val(0);
    return;
  }
  $('#offEditNo').val(ff.toString(16).toUpperCase());
  LoadHex16();
}

function HexFontSize(fonttype) {
  //$("#HexPreView")
  var cssfontSize = $('#HexPreView').css('font-size'); //
  //alert(cssfontSize);
  var unit = cssfontSize.replace('px', '');
  unit = parseInt(unit);
  if (unit <= 5 && fonttype == 1) {
    alert('太小啦....');
    return;
  }
  if (unit >= 28 && fonttype == 0) {
    alert('太大啦....');
    return;
  }
  if (fonttype == 0) {
    unit = unit + 1;
  } else {
    unit = unit - 1;
  }
  defEditFontSize = unit + 'px';
  $('#HexPreView td').css({
    'font-size': unit + 'px',
  });
  $('#HexPreView table').css({
    'font-size': unit + 'px',
  });
  $('#HexPreView tr').css({
    'font-size': unit + 'px',
  });
  $('#HexPreView div').css({
    'font-size': unit + 'px',
  });
  $('#HexPreView pre').css({
    'font-size': unit + 'px',
  });
  $('#HexPreView').css('font-size', unit + 'px');
}

var defEditFontSize = '12px';

function BulidEdit16TabHtml() {
  $('#Edit16Tab ').empty();
  var edit16html = '';
  edit16html += "<button onclick='LoadHex16()'>Load/Refresh</button> ";
  edit16html +=
    "<button onclick='NextHexData(0)'>↑(-0x100)</button> <button onclick='NextHexData(1)'>↓(+0x100)</button><br>";
  edit16html +=
    "<span style='color:red;'>Data Address:</span><input type='text' style='width:60px;' id='offEditNo' value='0'>";
  edit16html +=
    " <button onclick='HexFontSize(0)'>Enlarge Text</button> <button onclick='HexFontSize(1)'>Shrink Text</button>(may not work)";
  edit16html += '<div>';
  edit16html += "<div id='HexPreView' style='font-size:12px;'></div>";
  edit16html +=
    "<span>Target Address:</span><input type='text' style='width:60px;'  editindex=0  id='ShowEditIndex' > <button onclick='EditSeValue()'>Find</button><div id='EditSEdivSe'></div>";
  edit16html +=
    "<span>Data:</span> <span id='EditAlertSpan' style='color:red;'></span><br><textarea  id='ShowEditValue' cols='25' rows='5'></textarea><br>";
  edit16html += "<button onclick='WriteEdit16()'>Write Data</button>";
  edit16html +=
    "<div><span>Warning: do not search for long runs of 00 or FF — it can <span style='color:red;'>really really really</span> freeze your browser!</span><br>";
  edit16html +=
    "<span>1. Enter the address (without 0x, and not beyond file size − 0x100) in the red '</span><span style='color:red;'>Data Address</span><span>' field.<br>2. Click “Load/Refresh” to fetch data.<br>3. Click any loaded byte to show its address and value below.<br>4. Then do whatever you like.</span><br>";
  edit16html +=
    '<span>About writing data directly to a specified address:<br>1. Fill the target address in “Target Address”.<br>2. Enter the bytes in “Data”.<br>3. Click “Write Data”.</span><br>';
  edit16html +=
    '<span>PS: Separate multiple bytes with spaces.<br>On mobile, shrinking the font may not work.</span></div>';
  edit16html += '</div>';

  $('#Edit16Tab ').html(edit16html);
  $('#offEditNo').bind('keydown', function (e) {
    // 兼容FF和IE和Opera

    var theEvent = e || window.event;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
      //回车执行查询
      LoadHex16();
    }
  });
}
function EditSeValue() {
  $('#EditAlertSpan').css('color', 'red');
  $('#EditAlertSpan').html('');
  if ($('#ShowEditValue').val().length <= 1) {
    $('#EditAlertSpan').html('Please enter the code sequence to search!');
    return;
  }
  if ($('#ShowEditValue').val().length < 5) {
    $('#EditAlertSpan').html('Please enter at least 2 bytes to search!');
    return;
  }
  var edvalue = $('#ShowEditValue').val().split(' ');
  for (var i = 0; i < edvalue.length; i++) {
    edvalue[i] = hex2int(edvalue[i]);
  }
  if (edvalue.length == 2) {
    if (edvalue[0] == edvalue[1]) {
      if (edvalue[0] == 0 || edvalue[0] == 0xff) {
        $('#EditAlertSpan').html(
          'Do not search for long runs of 00/FF. The browser may freeze.',
        );
        return;
      }
    }
  }
  if (edvalue.length == 3) {
    if (edvalue[0] == edvalue[1] && edvalue[1] == edvalue[2]) {
      if (edvalue[0] == 0 || edvalue[0] == 0xff) {
        $('#EditAlertSpan').html(
          'Do not search for long runs of 00/FF. The browser may freeze.',
        );
        return;
      }
    }
  }
  if (edvalue.length == 4) {
    if (
      edvalue[0] == edvalue[1] &&
      edvalue[1] == edvalue[2] &&
      edvalue[2] == edvalue[3]
    ) {
      if (edvalue[0] == 0 || edvalue[0] == 0xff) {
        $('#EditAlertSpan').html(
          'Do not search for long runs of 00/FF. The browser may freeze.',
        );
        return;
      }
    }
  }
  //alert(edvalue[0]+" "+edvalue[1]+" "+edvalue[2])
  var okbool = false;
  var unix = new Array();
  for (var i = 0; i < NesHex.length; i++) {
    for (var w = 0; w < edvalue.length; w++) {
      if (NesHex[i + w] != edvalue[w]) {
        okbool = false;
      }
    }
    if (okbool == true) {
      unix.push(i);
    }
    okbool = true;
  }
  $('#EditSEdivSe').empty();
  if (unix.length <= 0) {
    $('#EditAlertSpan').html('No matching data found.');
    return;
  }
  var Editselecthtml = '';
  Editselecthtml += "<select id='EditselectId'>";
  for (var i = 0; i < unix.length; i++) {
    Editselecthtml +=
      "<option value='" + unix[i] + "'>" + unix[i].toString(16) + '</option>';
  }
  Editselecthtml += "</select><button onclick='JumpEdit()'>Go</button>";
  $('#EditSEdivSe').html(Editselecthtml);
  $('#EditAlertSpan').html('Found ' + unix.length + ' matches.');
  $('#EditAlertSpan').css('color', 'green');
}

function JumpEdit() {
  var vls = parseInt($('#EditselectId').val());
  $('#offEditNo').val(vls.toString(16).toUpperCase());
  LoadHex16();
}

function WriteEdit16() {
  if ($('#ShowEditValue').val().length <= 1) {
    alertMsg('#isfileload', 'red', 'Please enter a byte or byte sequence!');
    return;
  }
  if ($('#ShowEditIndex').val().length <= 0) {
    alertMsg('#isfileload', 'red', 'Please enter the target address!');
    return;
  }
  var edindex = hex2int($('#ShowEditIndex').val());
  if ($('#ShowEditValue').val().length == 2) {
    NesHex[edindex] = hex2int($('#ShowEditValue').val());
  } else {
    var edvalue = $('#ShowEditValue').val().split(' ');
    for (var i = 0; i < edvalue.length; i++) {
      NesHex[edindex + i] = hex2int(edvalue[i]);
    }
  }
  alertMsg('#isfileload', 'green', 'Write successful!');
}

function GetRditAddr(ojb) {
  var offindex = $(ojb).attr('offset');
  offindex = parseInt(offindex);
  var topoffsssss = addPreZero2(offindex.toString(16), 6);
  $('#ShowEditIndex').attr('ShowEditIndex', offindex);
  $('#ShowEditIndex').val(topoffsssss.toUpperCase());
  $('#ShowEditValue').val(
    addPreZero(NesHex[offindex].toString(16).toUpperCase()),
  );
}

function strToHexCharCode(str) {
  if (str === '') return '';
  var hexCharCode = [];
  hexCharCode.push('0x');
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push(str.charCodeAt(i).toString(16));
  }
  return hexCharCode.join('');
}

function BandHex16Se() {
  $('#Edit16Se ').empty();
}
