'use strict';

angular.module('InvertyApp')
  .factory('highscore', ['$q',function ($q) {
    var chrome = window.chrome;
    /**
     * @class storage
     * @name storage
     * @memberOf Inverty
     * @description For saving and loading data from localStorage
     **/
    var storage = {
      /**
       * @name get
       * @function get
       * @memberOf travelFactory.storage
       * @param {string} key key to get from storage
       * @param defaultval Value to use if key is not found.
       * @return data parsed json string
       **/
      get: function get(key, defaultval) {
        var item = $q.defer(),
            value;
        if(chrome && chrome.storage) {
          value = {};
          value[key] = defaultval;
          chrome.storage.local.get(value, function(data) {
            console.log('chrome: ', data[key]);
            value =  data[key];
            item.resolve(value);
          });
        } else {
          value = window.localStorage.getItem(key);
          console.log('local: ', value);
          value = value ? JSON.parse(value) : defaultval;
          item.resolve(value);
        }

        return item.promise;
      },
      /**
       * @name set
       * @function set
       * @memberOf travelFactory.storage
       * @param {string} key key to save value with.
       * @param val Value to save.
       * @return val
       **/
      set: function set(key, val) {
        var object;
        if(chrome && chrome.storage) {
          object = {};
          object[key] = val;
          chrome.storage.local.set(object, function() {});
        } else {
          window.localStorage.setItem(key, val ? JSON.stringify(val) : '');
        }
        return val;
      }
    };
    var highScoreTable;
    storage.get('highscore', []).then(function(table) {
      highScoreTable = table;
    });
    var score = null;
    return {
      save: function (player) {
        if(score) {
          highScoreTable.push({'player': player, 'score': score});
          storage.set('highscore', highScoreTable);
          score = null;
        }
      },
      table : function() {
        return highScoreTable;
      },
      score : function(s) {
        if(s) {
          score = s;
          return s;
        } else {
          return score;
        }
      }
    };
  }]);
