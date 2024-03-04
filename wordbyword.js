var WordByWordPlugin = (function(jspsych) {

  const info = {
    name: "wordbyword",
    parameters: {
      words: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Words',
        default: undefined,
        description: 'The words to be displayed, separated by spaces.'
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

    trial(display_element, trial) {
      var trial_data = {
        words: trial.words
      };
      var current_position = 0;
      var word_list = trial.words.split('-');
      var n_words = word_list.length;

      function show_next_word(position) {
        if (position < n_words) {
          var stimulus = '';
          for (var i = 0; i < n_words; i++) {
            var original_word = word_list[i];
            var word = original_word.replace(/_/g, ' '); // Replace underscores with spaces

            if (i === position) {
              stimulus += word + ' ';
            } else {
              stimulus += '-'.repeat(original_word.length) + ' '; // Use the original word's length for the mask
            }
          }
          display_element.innerHTML = "<p style='font-family: Arial; font-size: 32pt;'>" + stimulus.trim() + "</p>";
          current_position++;
          jsPsych.pluginAPI.setTimeout(function() {
            show_next_word(current_position);
          }, trial.stimulus_duration);
        } else {
          end_trial();
        }
      }

      function end_trial() {
        display_element.innerHTML = '';
        jsPsych.finishTrial(trial_data);
      }

      show_next_word(current_position);
    };
  }

  WordByWordPlugin.info = info;

  return WordByWordPlugin;
})(jsPsychModule);
