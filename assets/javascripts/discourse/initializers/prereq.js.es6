import { withPluginApi } from 'discourse/lib/plugin-api';
import { h } from 'virtual-dom';

import { popupAjaxError } from 'discourse/lib/ajax-error';
import Topic from 'discourse/models/topic';
import { ajax } from 'discourse/lib/ajax';

var arr = [];
var arr_mapping = {};
var current_topic_id;
var reverse_map = {};
var url_map = new Map();

export default {
  name: 'myprereq',
  initialize(container) {
    withPluginApi('0.8.24', function(api) {
      api.decorateWidget('post-stream:before', helper => {


        var current_topic_url, current_topic_id;
        current_topic_url = window.location.href;

        current_topic_id = parseInt(current_topic_url.split('/')[5]);

        const hostname = window.location.href.split('/');

        var j;

        let url = hostname[0] + '//' + hostname[2] + '/latest.json'

        fetch(url)
          .then(response => response.json())
          .then(data => {
            var temp = data['topic_list']['topics'];
            for (j = 0; j < temp.length; j++) {
              arr_mapping[temp[j].id] = temp[j].title;
              reverse_map[temp[j].title] = temp[j].id;
              url_map.set(temp[j].id, temp[j].slug);
              arr.push(temp[j].title);
            }

            $("#prereq_list").empty();

            ajax('/topic/retrieve_previous', {
              type: 'GET',
              data: {
                topic_id: parseInt(current_topic_id)
              }
            }).then(result => {
              var prior_ids = result.row_value.split(",");
              if(prior_ids) {
                for (var k = 0; k < prior_ids.length; k++) {
                  var idp = parseInt(prior_ids[k]);
                  var ref = url_map.get(idp);
                  var lname = arr_mapping[idp];
                  var text = '<a class="btn btn-warning btn-xs"';
                  text += 'href="' + hostname[0] + '//' + hostname[2] + '/t/';
                  text += ref;
                  text += '/';
                  text += idp;
                  text += '">';
                  // if (note["sequence_on"] == "true")
                  //   text += 'Prev';
                  // else
                    text += lname;
                  text += '</a>&nbsp;';
                  //console.log(text);
                  $("#prereq_list").append(text);
                }
              }
            }).catch(console.error);

            // const store = container.lookup("store:main");
            // store.findAll('note')
            //   .then(result => {
            //     for (const note of result.content) {
            //       if (parseInt(note["id"]) == current_topic_id) {
            //         var prior_ids = note["prior_topic_id"];
            //         if (prior_ids) {
            //           for (var k = 0; k < prior_ids.length; k++) {
            //             var idp = parseInt(prior_ids[k]);
            //             var ref = url_map.get(idp);
            //             var lname = arr_mapping[idp];
            //             var text = '<a class="btn btn-warning btn-xs"';
            //             text += 'href="' + hostname[0] + '//' + hostname[2] + '/t/';
            //             text += ref;
            //             text += '/';
            //             text += idp;
            //             text += '">';
            //             if (note["sequence_on"] == "true")
            //               text += 'Prev';
            //             else
            //               text += lname;
            //             text += '</a>&nbsp;';
            //             //console.log(text);
            //             $("#prereq_list").append(text);
            //           }
            //         }
            //       }
            //     }
            //   })
            //   .catch(console.error);

          });

      });

      //postreqs here............................

      api.decorateWidget('post-stream:after', helper => {


        var current_topic_url, current_topic_id;
        current_topic_url = window.location.href;

        current_topic_id = parseInt(current_topic_url.split('/')[5]);
        //	console.log("topic="+current_topic_id+" "+current_topic_url);

        const hostname = window.location.href.split('/');

        var j;

        let url = hostname[0] + '//' + hostname[2] + '/latest.json'

        fetch(url)
          .then(response => response.json())
          .then(data => {
            var temp = data['topic_list']['topics'];
            for (j = 0; j < temp.length; j++) {
              arr_mapping[temp[j].id] = temp[j].title;
              reverse_map[temp[j].title] = temp[j].id;
              url_map.set(temp[j].id, temp[j].slug);
              arr.push(temp[j].title);
            }

            $("#postreq_list").empty();

            ajax('/topic/retrieve_next', {
              type: 'GET',
              data: {
                topic_id: parseInt(current_topic_id)
              }
            }).then(result => {
              var next_ids = result.row_value.split(",");

              console.log("next_ids: "+next_ids);
              if(next_ids) {
                for (var k = 0; k < next_ids.length; k++) {
                  var idp = parseInt(next_ids[k]);
                  var ref = url_map.get(idp);
                  var lname = arr_mapping[idp];
                  var text = '<a class="btn btn-warning btn-xs"';
                  text += 'href="' + hostname[0] + '//' + hostname[2] + '/t/';
                  text += ref;
                  text += '/';
                  text += idp;
                  text += '">';
                  // if (note["sequence_on"] == "true")
                  //   text += 'Prev';
                  // else
                    text += lname;
                  text += '</a>&nbsp;';
                  //console.log(text);
                  $("#postreq_list").append(text);
                }
              }
            }).catch(console.error);
            

            // const store = container.lookup("store:main");
            // store.findAll('note')
            //   .then(result => {
            //     for (const note of result.content) {
            //       if (parseInt(note["id"]) == current_topic_id) {
            //         var prior_ids = note["next_topic_id"];

            //         if (prior_ids) {
            //           for (var k = 0; k < prior_ids.length; k++) {
            //             var idp = parseInt(prior_ids[k]);
            //             var ref = url_map.get(idp);
            //             var lname = arr_mapping[idp];
            //             var text = '<a class="btn btn-warning btn-xs"';
            //             text += 'href="' + hostname[0] + '//' + hostname[2] + '/t/';
            //             text += ref;
            //             text += '/';
            //             text += idp;
            //             text += '">';
            //             if (note["sequence_on"] == 'true')
            //               text += 'Next';
            //             else
            //               text += lname;
            //             text += '</a>&nbsp;';
            //             $("#postreq_list").append(text);
            //           }
            //         }
            //       }
            //     }
            //   })
            //   .catch(console.error);

          });
      });
    });

  }
};
