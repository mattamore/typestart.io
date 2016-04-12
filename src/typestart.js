// Generated by CoffeeScript 1.8.0
var TypeStart, typestart;

TypeStart = (function() {
  function TypeStart() {
    this.drive = new Drive(this);
    this.editor = new Editor(this);
    this.commands = [];
    this.createIcon();
    this.context = {};
    this.welcome_text = "typestart.io version 0.1\nFork me here: https://github.com/pmgl/typestart.io\ntype 'help' for help\n";
    this.terminal = $("#terminal").terminal(((function(_this) {
      return function(c, term) {
        var res;
        if (c.trim().length === 0) {
          return;
        }
        res = _this.exec(c);
        if (res === null) {
          res = "null";
        } else if (res === false) {
          res = "false";
        } else {
          switch (typeof res) {
            case "function":
              res = typeof res;
              break;
            case "number":
              res = res.toString();
          }
        }
        _this.terminal.echo(res);
      };
    })(this)), {
      greetings: this.welcome_text,
      name: 'tsio',
      height: "auto",
      prompt: '> ',
      completion: (function(_this) {
        return function(terminal, input, callback) {
          return callback(_this.completion(input));
        };
      })(this)
    });
  }

  TypeStart.prototype.createIcon = function() {
    var canvas, context, link, size;
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    canvas = document.createElement("canvas");
    size = 512;
    canvas.width = size;
    canvas.height = size;
    context = canvas.getContext("2d");
    context.translate(size / 2, size / 2);
    context.scale(size / 2, size / 2);
    context.fillStyle = "#000";
    context.fillRect(-1, -1, 2, 2);
    context.strokeStyle = "hsl(170,50%,50%)";
    context.lineWidth = .3;
    context.beginPath();
    context.moveTo(-.3, -.5);
    context.lineTo(.3, 0);
    context.lineTo(-.3, .5);
    context.stroke();
    link.href = canvas.toDataURL();
    return document.head.appendChild(link);
  };

  TypeStart.prototype.showEditor = function() {
    $(".terminalcontainer").hide();
    $(".editorcontainer").show();
    this.terminal.pause();
    return this.editor.editor.focus(true);
  };

  TypeStart.prototype.showTerminal = function() {
    $(".terminalcontainer").show();
    $(".editorcontainer").hide();
    return this.terminal.resume();
  };

  TypeStart.prototype["eval"] = function(code) {
    return eval.call(this.context, code);
  };

  TypeStart.prototype.exec = function(line) {
    var args, cmd, command, compiled, err, s;
    line = line.trim();
    if (line.length === 0) {
      return;
    }
    s = line.split(" ");
    if (s.length > 0) {
      command = s.splice(0, 1)[0];
      args = s.length > 0 ? s.join(" ").trim() : "";
      if ((this.commands[command] == null) && (this.drive.load(command) != null)) {
        this.load(command);
      }
      if (this.commands[command] != null) {
        if (this.commands[command] instanceof Alias) {
          cmd = this.commands[command].command;
          if (cmd.indexOf("{args}") >= 0) {
            cmd = cmd.replace("{args}", args);
          } else {
            cmd = cmd + " " + args;
          }
          return this.exec(cmd);
        } else if (this.commands[command] instanceof Command) {
          return this.commands[command].f(args);
        }
      } else if (line.indexOf("http://") === 0 || line.indexOf("https://") === 0 || line.indexOf("www.") === 0) {
        return this.open(line);
      } else {
        try {
          compiled = CoffeeScript.compile(line, {
            bare: true
          });
          return this["eval"](compiled, args);
        } catch (_error) {
          err = _error;
          return "[[;#D42;#300]" + err + "]";
        }
      }
    }
  };

  TypeStart.prototype.load = function(command) {
    var code, compiled;
    code = this.drive.load(command);
    if (code != null) {
      compiled = CoffeeScript.compile(code, {
        bare: true
      });
      return this.commands[command] = this["eval"](compiled);
    }
  };

  TypeStart.prototype.echo = function(arg) {
    if (arg == null) {
      arg = " ";
    }
    this.terminal.echo(arg);
  };

  TypeStart.prototype.error = function(text) {
    return this.echo("[[;#D42;#300]" + text + "]");
  };

  TypeStart.prototype.edit = function(arg) {
    this.current_project = arg;
    return this.editor.edit(arg);
  };

  TypeStart.prototype.open = function(arg) {
    if (arg.indexOf("http://") < 0 && arg.indexOf("https://") < 0) {
      arg = "http://" + arg;
    }
    window.open(arg, "_blank");
  };

  TypeStart.prototype["export"] = function() {};

  TypeStart.prototype["import"] = function() {};

  TypeStart.prototype.completion = function(input) {
    var c, res;
    res = [];
    for (c in this.commands) {
      if (c.indexOf(input) === 0) {
        res.push(c);
      }
    }
    return res;
  };

  TypeStart.prototype.store = function(args) {
    var i;
    i = args.indexOf(" ");
    return this.typestart.drive.store(args.substring(0, i), args.substring(i, args.length).trim());
  };

  TypeStart.prototype.list = function() {
    var res;
    res = this.typestart.drive.list();
    return res.join("\n");
  };

  return TypeStart;

})();

typestart = new TypeStart();
