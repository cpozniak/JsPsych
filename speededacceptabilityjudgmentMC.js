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

    trial(display_element, trial) {
      var trial_data = {
        words: trial.words
      };
      var current_position = 0;
      var word_list = this.htmlDecode(trial.words).split(' ');
      var n_words = word_list.length;

      const show_next_word = (position, that) => {
        if (position < n_words) {
          var stimulus = '';
          for (var i = 0; i < n_words; i++) {
            var word = word_list[i];
            var displayed_word = that.htmlDecode(word).replace(/_/g, ' ');

            if (i === position) {
              stimulus += `<span style="display: inline-block; width: ${displayed_word.length * 14}px;">${displayed_word}</span> `;
            } else {
              stimulus += `<span style="display: inline-block; width: ${word.length * 14}px;">${'_'.repeat(word.length)}</span> `;
            }
          }
          display_element.innerHTML = "<p style='font-family: Courier, monospace; font-size: 20pt;'>" + stimulus.trim() + "</p>";
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
