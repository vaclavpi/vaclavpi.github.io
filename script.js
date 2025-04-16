!(function ($) {
  "use strict";

  var Typed = function (el, options) {
    this.el = $(el);
    this.options = $.extend({}, $.fn.typed.defaults, options);
    this.isInput = this.el.is("input");
    this.attr = this.options.attr;
    this.showCursor = this.isInput ? false : this.options.showCursor;
    this.elContent = this.attr ? this.el.attr(this.attr) : this.el.text();
    this.contentType = this.options.contentType;
    this.typeSpeed = this.options.typeSpeed;
    this.startDelay = this.options.startDelay;
    this.backSpeed = this.options.backSpeed;
    this.backDelay = this.options.backDelay;
    this.stringsElement = this.options.stringsElement;
    this.strings = this.options.strings;
    this.strPos = 0;
    this.arrayPos = 0;
    this.stopNum = 0;
    this.loop = this.options.loop;
    this.loopCount = this.options.loopCount;
    this.curLoop = 0;
    this.stop = false;
    this.cursorChar = this.options.cursorChar;
    this.shuffle = this.options.shuffle;
    this.sequence = [];
    this.build();
  };

  Typed.prototype = {
    constructor: Typed,

    init: function () {
      var self = this;
      self.timeout = setTimeout(function () {
        for (var i = 0; i < self.strings.length; ++i) self.sequence[i] = i;

        // shuffle the array if true
        if (self.shuffle) self.sequence = self.shuffleArray(self.sequence);

        // Start typing
        self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
      }, self.startDelay);
    },

    build: function () {
      var self = this;
      // Insert cursor
      if (this.showCursor === true) {
        this.cursor = $(
          '<span class="typed-cursor">' + this.cursorChar + "</span>"
        );
        this.el.after(this.cursor);
      }
      if (this.stringsElement) {
        self.strings = [];
        this.stringsElement.hide();
        var strings = this.stringsElement.find("p");
        $.each(strings, function (_key, value) {
          self.strings.push($(value).html());
        });
      }
      this.init();
    },


    typewrite: function (curString, curStrPos) {

      if (this.stop === true) {
        return;
      }

      var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
      var self = this;

      self.timeout = setTimeout(function () {

        var charPause = 0;
        var substr = curString.substr(curStrPos);
        if (substr.charAt(0) === "^") {
          var skip = 1; 
          if (/^\^\d+/.test(substr)) {
            substr = /\d+/.exec(substr)[0];
            skip += substr.length;
            charPause = parseInt(substr);
          }

  
          curString =
            curString.substring(0, curStrPos) +
            curString.substring(curStrPos + skip);
        }

        if (self.contentType === "html") {
   
          var curChar = curString.substr(curStrPos).charAt(0);
          if (curChar === "<" || curChar === "&") {
            var tag = "";
            var endTag = "";
            if (curChar === "<") {
              endTag = ">";
            } else {
              endTag = ";";
            }
            while (curString.substr(curStrPos).charAt(0) !== endTag) {
              tag += curString.substr(curStrPos).charAt(0);
              curStrPos++;
            }
            curStrPos++;
            tag += endTag;
          }
        }

        // timeout for any pause after a character
        self.timeout = setTimeout(function () {
          if (curStrPos === curString.length) {
            // fires callback function
            self.options.onStringTyped(self.arrayPos);

            // is this the final string
            if (self.arrayPos === self.strings.length - 1) {
              // animation that occurs on the last typed string
              self.options.callback();

              self.curLoop++;

              // quit if we wont loop back
              if (self.loop === false || self.curLoop === self.loopCount)
                return;
            }

            self.timeout = setTimeout(function () {
              self.backspace(curString, curStrPos);
            }, self.backDelay);
          } else {
            /* call before functions if applicable */
            if (curStrPos === 0) self.options.preStringTyped(self.arrayPos);

            // start typing each new char into existing string
            // curString: arg, self.el.html: original text inside element
            var nextString = curString.substr(0, curStrPos + 1);
            if (self.attr) {
              self.el.attr(self.attr, nextString);
            } else {
              if (self.isInput) {
                self.el.val(nextString);
              } else if (self.contentType === "html") {
                self.el.html(nextString);
              } else {
                self.el.text(nextString);
              }
            }

            // add characters one by one
            curStrPos++;
            // loop the function
            self.typewrite(curString, curStrPos);
          }
          // end of character pause
        }, charPause);

        // humanized value for typing
      }, humanize);
    },

    backspace: function (curString, curStrPos) {
      // exit when stopped
      if (this.stop === true) {
        return;
      }

      var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
      var self = this;

      self.timeout = setTimeout(function () {


        if (self.contentType === "html") {
          // skip over html tags while backspacing
          if (curString.substr(curStrPos).charAt(0) === ">") {
            var tag = "";
            while (curString.substr(curStrPos).charAt(0) !== "<") {
              tag -= curString.substr(curStrPos).charAt(0);
              curStrPos--;
            }
            curStrPos--;
            tag += "<";
          }
        }

        // ----- continue important stuff ----- //
        // replace text with base text + typed characters
        var nextString = curString.substr(0, curStrPos);
        if (self.attr) {
          self.el.attr(self.attr, nextString);
        } else {
          if (self.isInput) {
            self.el.val(nextString);
          } else if (self.contentType === "html") {
            self.el.html(nextString);
          } else {
            self.el.text(nextString);
          }
        }

        // if the number (id of character in current string) is
        // less than the stop number, keep going
        if (curStrPos > self.stopNum) {
          // subtract characters one by one
          curStrPos--;
          // loop the function
          self.backspace(curString, curStrPos);
        }
        // if the stop number has been reached, increase
        // array position to next string
        else if (curStrPos <= self.stopNum) {
          self.arrayPos++;

          if (self.arrayPos === self.strings.length) {
            self.arrayPos = 0;

            // Shuffle sequence again
            if (self.shuffle) self.sequence = self.shuffleArray(self.sequence);

            self.init();
          } else
            self.typewrite(
              self.strings[self.sequence[self.arrayPos]],
              curStrPos
            );
        }

        // humanized value for typing
      }, humanize);
    },
    /**
     * Shuffles the numbers in the given array.
     * @param {Array} array
     * @returns {Array}
     */
    shuffleArray: function (array) {
      var tmp,
        current,
        top = array.length;
      if (top)
        while (--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = array[current];
          array[current] = array[top];
          array[top] = tmp;
        }
      return array;
    },

    
    reset: function () {
      var self = this;
      clearInterval(self.timeout);
      var id = this.el.attr("id");
      this.el.after('<span id="' + id + '"/>');
      this.el.remove();
      if (typeof this.cursor !== "undefined") {
        this.cursor.remove();
      }
      // Send the callback
      self.options.resetCallback();
    },
  };

  $.fn.typed = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data("typed"),
        options = typeof option == "object" && option;
      if (!data) $this.data("typed", (data = new Typed(this, options)));
      if (typeof option == "string") data[option]();
    });
  };

  $.fn.typed.defaults = {
    strings: [
      "Václav Pisinger",
    ],
    stringsElement: null,
    typeSpeed: 40,
    startDelay: 1100,
    backSpeed: 40,
    shuffle: false,
    backDelay: 0,
    loop: true,
    // false = infinite
    loopCount: false,
    // show cursor
    showCursor: true,
    // character for cursor
    cursorChar: "|",
    // attribute to type (null == text)
    attr: null,
    // either html or text
    contentType: "html",
    // call when done callback function
    callback: function () {},
    // starting callback function before each string
    preStringTyped: function () {},
    //callback for every typed string
    onStringTyped: function () {},
    // callback for reset
    resetCallback: function () {},
  };
})(window.jQuery);

$(function () {
  $("#typed").typed({
    strings: [
      "hrdý skaut, vedoucí a výchovný zpravodaj střediska Stará Boleslav, který věří, že dobrodružství začíná tam, kde končí komfortní zóna.",
      "průvodce na cestě růstu skautek a skautů, protože právě v jejich příbězích se píše budoucnost.",
      "člen Skautského odboru (Skaboru), kde jako patron podporuji celostátní rozvoj skautského vzdělávání a výchovy.",
      "redaktor časopisu Skauting a fotograf, který přináší pohledy ze života hnutí skrze příběhy i objektiv.",
      "několikanásobný vicemistr ČR v Taekwon-Do ITF, pro něhož je pohyb cestou k vnitřní rovnováze a neustálému sebezlepšení.",
      "bojovník, který hledá harmonii mezi silou a lehkostí — v těle i v duši.",
      "vývojář, jež věří, že i do kódu lze vložit kus své duše a tvořit technologie s vizí.",
      "spoluzakladatel Principle Industries s.r.o., snící o inovacích, které mění svět k lepšímu.",
      "fotograf, který skrze objektiv zachycuje příběhy skryté v obyčejných chvílích.",
      "předseda školního parlamentu, naslouchající hlasům ostatních a usilující o změnu k lepšímu.",
      "držitel skautského vyznamenání Lví skaut II. stupně, pro něhož jsou skautské hodnoty živou inspirací každý den.",
      "student gymnázia, který hledá cestu v chaosu světa a věří ve smysl hlubokého poznání.",
      "nositel vzdělávacích dekretů z Junáka, Taekwon-Do i MŠMT, který věří v sílu neustálého učení a růstu.",
      "Čech, hrdý na své kořeny, kulturu a dědictví, které formuje naši identitu.",
      "člověk, jež se každý den snaží zanechat svět o trochu lepší, než ho našel.",
      "milovník přírody, který nachází klid a inspiraci v jejích krásách.",
    ],
    typeSpeed: 40,
    startDelay: 800,
    backDelay: 1100,
  });
  $("a").click(function () {
    $(this).toggleClass("dont-turn-blue");
  });
});
