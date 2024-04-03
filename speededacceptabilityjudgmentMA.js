var WordByWordPlugin = (function(jspsych) {

  const info = {
    name: "wordbyword",
    parameters: {
      words: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Words',
        default: undefined,
        description: 'The words to be displayed, separated by spaces. Use underscores (_) to represent spaces within a word.'
      },
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
    },
  };

  class WordByWordPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    htmlDecode(input) {
      var doc = new DOMParser().parseFromString(input, "text/html");
      return doc.documentElement.textContent;
    }

    getFillerCharacter() {
      // Retourne un caractère de remplissage invisible avec la même largeur qu'un tiret bas
      return '\u200b'; // Caractère "zero width space"
    }

    getMaxCharacterWidth() {
      // Retourne la largeur du caractère chinois le plus large
      var maxWidth = 0;
      for (var i = 0; i < 0x9FA5; i++) {
        var char = String.fromCodePoint(i);
        var span = document.createElement('span');
        span.textContent = char;
        document.body.appendChild(span);
        var width = span.offsetWidth;
        document.body.removeChild(span);
        maxWidth = Math.max(maxWidth, width);
      }
      return maxWidth;
    }

    trial(display_element, trial) {
      var trial_data = {
        words: trial.words
      };
      var current_position = 0;
      var word_list = this.htmlDecode(trial.words).split(' ');
      var n_words = word_list.length;
      var max_character_width = this.getMaxCharacterWidth();

      const show_next_word = (position, that) => {
        if (position < n_words) {
          var stimulus = '';
          for (var i = 0; i < n_words; i++) {
            var word = word_list[i];
            var displayed_word = that.htmlDecode(word).replace(/_/g, ' ');

            if (i === position) {
              var word_spans = displayed_word.split('').map(function(char) {
                return '<span style="display: inline-block; width: ' + max_character_width + 'px;">' + char + '</span>';
              });
              stimulus += word_spans.join('') + ' ';
            } else {
              var filler = '';
              for (var j = 0; j < word.length; j++) {
                filler += '<span style="display: inline-block; width: ' + max_character_width + 'px;">' + that.getFillerCharacter() + '</span>';
              }
              stimulus += filler + ' ';
            }
          }
          display_element.innerHTML = "<p style='font-size: 20pt;'>" + stimulus.trim() + "</p>";
          current_position++;
          jsPsych.pluginAPI.setTimeout(() => {
            show_next_word(current_position, this);
          }, trial.stimulus_duration);
        } else {
          end_trial();
        }
      }

      function end_trial() {
        display_element.innerHTML = '';
        jsPsych.finishTrial(trial_data);
      }

      show_next_word(current_position, this);

    };
  }

  WordByWordPlugin.info = info;

  return WordByWordPlugin;
})(jsPsychModule);
