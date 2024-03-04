var WordByWordPlugin = (function(jspsych) {

  const info = {
    name: "wordbyword",
    parameters: {
      words: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Words',
        default: undefined,
        description: 'The words to be displayed, separated by forward slashes (/). Use underscores (_) to represent spaces within a word.'
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
      var segment_list = trial.words.split('/');
      var n_segments = segment_list.length;

      function show_next_segment(position) {
        if (position < n_segments) {
          var stimulus = '';
          for (var i = 0; i < n_segments; i++) {
            var segment = segment_list[i];
            var words = segment.split('_');
            var displayed_words = [];

            for (var j = 0; j < words.length; j++) {
              if (i === position && j === current_position) {
                displayed_words.push(words[j]);
              } else {
                displayed_words.push('-'.repeat(words[j].length));
              }
            }

            stimulus += displayed_words.join(' ') + ' ';
          }
          display_element.innerHTML = "<p style='font-family: Arial; font-size: 32pt;'>" + stimulus.trim() + "</p>";
          current_position++;
          jsPsych.pluginAPI.setTimeout(function() {
            show_next_segment(current_position);
          }, trial.stimulus_duration);
        } else {
          end_trial();
        }
      }

      function end_trial() {
        display_element.innerHTML = '';
        jsPsych.finishTrial(trial_data);
      }

      show_next_segment(current_position);
    };
  }

  WordByWordPlugin.info = info;

  return WordByWordPlugin;
})(jsPsychModule);
