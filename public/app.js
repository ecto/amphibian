
$(document).ready(function () {
  write('Initializing connection...<br />');

  var socket = io.connect();

  socket.on('connect', function () {
    //write('Connected.<br /><br />');
  });

  socket.on('stdout', function (raw) {
    // \u001b[?1049h\u001b[?1h\u001b=\u001b[1;24r\u001b[?12;25h\u001b[?12l\u001b[?25h\u001b[27m\u001b[m\u001b[H\u001b[2J\u001b[>c\u001b[?25l\u001b[2;1H\u001b[38;5;12m~ 
    console.log(raw);
    if (raw == '\b\u001b[K') {
      $('#term').html($('#term').html().slice(0, -1));
      return;
    }
    var data = parse(raw);
    write(data);
  });

  socket.on('stderr', function (raw) {
    var data = parse(raw);
    write(data);
  });

  $(document).keydown(function (e) {
    console.log(e);
    if (e.keyCode == 16) return;
    if (e.metaKey) return;
    var k = mapKey(e.which);
    var toEmit;
    /*if (e.ctrlKey && e.keyCode != 17) {
      toEmit = '^' + k;
    } else*/ if (e.shiftKey) {
      toEmit = k;
    } else {
      toEmit = k.toLowerCase();
    }
    socket.emit('keypress', toEmit);

    if (e.keyCode === 8 || e.keyCode === 9) {
      e.preventDefault();
      return false;
    }
  });

  document.onpaste = function (e) {
    //console.log(arguments);
    $('<input id="tempPaste">').appendTo('#window').focus();
    setTimeout(function () {
      var t = $('#tempPaste').val();
      $('#tempPaste').remove();
      socket.emit('keypress', t);
    }, 1);
  };
});

function write (data) {
  $('#term').append(data);
  $("html, body").scrollTop($(document).height());
}

function parse (raw) {
  var parsed = raw;
  parsed = parsed.split(' ').join('&nbsp;');
  parsed = parsed.split('\r\n').join('<br />');
  parsed = parsed.split('\r').join('<br />');
  parsed = parsed.split('\n').join('<br />');

  var colorRE = /\[(.*?)\m/gi;
  var m = null;
  while (m = colorRE.exec(parsed)) {
    if (m[0] == '[0m') {
      parsed = parsed.replace(m[0], '</span>');
    } else {
      var r = m[1].split(';');
      if (r[0]) r[0] = 'attribute-' + +r[0];
      if (r[1]) r[1] = 'text-' + +r[1];
      if (r[2]) r[2] = 'background-' + +r[2];
      var output = '<span class="' + r.join(' ') + '">';
      parsed = parsed.replace(m[0], output);
    }
  }

  var clearRE = /\[2J/;
  if (parsed.match(clearRE)) {
    parsed = parsed.replace('[2J', '');
    parsed = parsed.replace('[H', '');
    $('#term').html('');
  }

  return parsed;
}

function mapKey (keyCode) {
  var k = String.fromCharCode(keyCode);
  return k;
      /*
      Enter 13
      Up arrow 38
      Down arrow 40
      Left arrow 37
      Right arrow 39
      Escape 27
      Spacebar 32
      Ctrl 17
      Alt 18
      Tab 9
      Shift 16
      Caps-lock 20
      Windows key 91
      Windows option key 93
      Backspace 8
      Home 36
      End 35
      Insert 45
      Delete 46
      Page Up 33
      Page Down 34
      Numlock 144
      F1-F12 112-123
      Print-screen ??
      Scroll-lock 145
      Pause-break 19
      */
}
