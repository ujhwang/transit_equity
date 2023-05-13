// Create the map with token !토큰이 달라지면 폴리곤 및 다른 정보가 사라짐
mapboxgl.accessToken = 'pk.eyJ1IjoibHNqODY4NyIsImEiOiJjbGM4NzR2cDYzaHVmM29tczdlbXkza3lvIn0.e68GVo5wIz5O9sY2S1FP_w';

const colors = ['#213E9A',' #3C1FA7', '#811CB5', '#C318B0', '#D01367', '#DE0F0E', '#EC7007', '#F9E200']

// Accessibility Map
const mapBefAcc = new mapboxgl.Map({
    container: 'mapBefAcc', // container ID // style URL //dark-v10 // style URL //dark-v10
    style: 'mapbox://styles/uhwang3/cl65mb11m001q15lcdpvr8efm',
    center: [-84.53132, 33.822556], // starting position [lng, lat]
    zoom: 9, // starting zoom
    minZoom: 3
});

const mapAftAcc = new mapboxgl.Map({
    container: 'mapAftAcc', // container ID // style URL //dark-v10 // style URL //dark-v10
    style: 'mapbox://styles/uhwang3/cl65mb11m001q15lcdpvr8efm',
    center: [-84.53132, 33.822556], // starting position [lng, lat]
    zoom: 9, // starting zoom
    minZoom: 3,
});

// create the popup on the before map
const popup_bef = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true
});

// create the popup on the after map
const popup_aft = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true
});

// default (Absolute measure) - only the slider_abs shown
document.getElementsByClassName("sliderAccContentRelative")[0].style.visibility = "hidden";

// set the slider value for absolute measure
let sliderAcc_abs = document.getElementById("myRangeAcc_abs");
let sliderValueAcc_abs = document.getElementById("sliderValueAcc_abs");
sliderValueAcc_abs.innerHTML = sliderAcc_abs.value; // Display the default slider value
let sliderAcc_filter_abs = sliderAcc_abs.value;

// set the slider value for relative measure
let sliderAcc_rel = document.getElementById("myRangeAcc_rel");
let sliderValueAcc_rel = document.getElementById("sliderValueAcc_rel");
sliderValueAcc_rel.innerHTML = sliderAcc_rel.value; // Display the default slider value
let sliderAcc_filter_rel = sliderAcc_rel.value;

// show the absolute slider while hiding the relative one - by clicking the radio button
function getSliderAcc_abs(){
    document.getElementsByClassName("sliderAccContentAbsolute")[0].style.visibility = "visible";
    document.getElementsByClassName("sliderAccContentAbsolute")[0].style.zIndex = "1";
    document.getElementsByClassName("sliderAccContentRelative")[0].style.visibility = "hidden";
    document.getElementById("myRangeAcc_abs").value = 45;
    timeAcc_filter = 45;
    sliderValueAcc_abs.innerHTML = 45;
}
// show the relative slider while hiding the absolute one - by clicking the radio button
function getSliderAcc_rel(){
    document.getElementsByClassName("sliderAccContentAbsolute")[0].style.visibility = "hidden";
    document.getElementsByClassName("sliderAccContentRelative")[0].style.visibility = "visible";
    document.getElementsByClassName("sliderAccContentRelative")[0].style.zIndex = "1";
    document.getElementById("myRangeAcc_rel").value = 2;
    // reset the value and slidervalue
    timeAcc_filter = 2;
    sliderValueAcc_rel.innerHTML = 2;
}

// Because features come from tiled vector data,
// feature geometries may be split or duplicated across tile boundaries.
// As a result, features may appear multiple times in query results.
function getUniqueFeatures(features, comparatorProperty) {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
        const id = feature.properties[comparatorProperty];
        if (!uniqueIds.has(id)) {
            uniqueIds.add(id);
            uniqueFeatures.push(feature);
        }
    }
    return uniqueFeatures;
}

// Load the csv file which includes the specific detail of each OD
Promise.all([d3.dsv(",", "data/od_detail_0420.csv", function (d) {
    return {
        o_id: +d['o_id'],
        d_id: +d['d_id'],
        transit_time_mor: +d['transit.time.morning'],
        odmts_time_mor: +d['total.odmts.time.plus'],
        jobs_all: +d['jobs.all'],
        poi_all: +d['poi.demand'],
        transit_ratio_mor: +d['transit.ratio.mor'],
        odmts_ratio_mor: +d['odmts.ratio.mor']
    }}
  )]
).then(function(dataAcc) {
  readyAcc(dataAcc[0])
})

// set the variable that legend descriptions can be changed upon the trip purpose filter
let element = document.getElementById("legendTitle");
let newcontent =`
    <p>Proportion of residents who can commute to work by transit within <b>45 minutes</b> during morning peak hour
    </p>`
;

let overall_element = document.getElementById("overallContent");
let overallContent =`
    <p>of all residents can <b> commute to work </b> by transit within <b>45 minutes</b> during morning peak hour
    </p>`
;

// **The whole process of dashboard starts by loading csv data
function readyAcc(dataAcc){

  // reload the webpage since the map is not loaded
  window.onload = function() {
    if(!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
  }
  window.onload();

  overallAccBefore.innerHTML = 10
  overallAccAfter.innerHTML = 51

  let jobs_total_bef_abs = 0
  let jobs_total_bef_rel = 0
  let pois_total_bef_abs = 0
  let pois_total_bef_rel = 0
  let jobs_total_aft_abs = 0
  let jobs_total_aft_rel = 0
  let pois_total_aft_abs = 0
  let pois_total_aft_rel = 0

  // used for !!!
  function buildFilter(arr) {
    var filter = ['in', 'o_id'];
    if (arr.length === 0) {
      return filter;
    }
    for(var i = 0; i < arr.length; i += 1) {
      filter.push(arr[i]);
    }
    return filter;
  }

  // initial filtered variable (default) -> used for setting up the PROPERTY value
  let measAcc_filter = 'abs'
  let tripAcc_filter = 'com'

  // show filtered data only within the slider value
  // absolute value_before (conventional transit system)
  data_filtered_transit_time = dataAcc.filter(function(d) {
    return d.transit_time_mor <= sliderAcc_abs.value
  });
  // relative value_before (conventional transit system)
  data_filtered_transit_ratio = dataAcc.filter(function(d) {
    return d.transit_ratio_mor >= (1/sliderAcc_rel.value)
  });
  // absolute value_after (odmts)
  data_filtered_odmts_time = dataAcc.filter(function(d) {
    return d.odmts_time_mor <= sliderAcc_abs.value
  });
  // relative  value_after (odmts)
  data_filtered_odmts_ratio = dataAcc.filter(function(d) {
    return d.odmts_ratio_mor >= (1/sliderAcc_rel.value)
  });

  // CREATE mapBefAcc with more detials
  mapBefAcc.on('load', () => {
    mapBefAcc.addSource('before_access_0418',  {type: 'vector', url: "mapbox://uhwang3.before_access_0418" });

    // Layer with the default property
    mapBefAcc.addLayer(
      {
        'id': 'bg_access_before',
        'type': 'fill',
        'source': 'before_access_0418',
        'source-layer': 'before_access_0418',
        'paint': {
          'fill-color': {
            'property' : 'abs.com.mor.45min',
            'stops': [[0, colors[0]], [0.05, colors[1]], [0.1, colors[2]], [0.2, colors[3]], [0.3, colors[4]], [0.4, colors[5]],  [0.6, colors[6]],  [0.8, colors[7]]]
          },
          'fill-opacity': 0.8,
          'fill-outline-color': 'rgba(0,0,0,0.1)'
        }
      },
    );
    // Layer: showing accessible destination
    mapBefAcc.addLayer(
      {
        'id': 'bg-dest',
        'type': 'fill',
        'source': 'before_access_0418',
        'source-layer': 'before_access_0418',
        'paint': {
          'fill-outline-color': '#ffffff',
          'fill-color': '#ffffff',
          'fill-opacity': 0.5
        },
        // Display none by adding a filter with an empty string.
        'filter': ['in', 'o_id', ]
      },
    );

    // Layer: showing origin block group
    mapBefAcc.addLayer(
      {
        'id': 'bg-origin',
        'type': 'fill',
        'source': 'before_access_0418',
        'source-layer': 'before_access_0418',
        'paint': {
          'fill-outline-color': '#19ff00',
          'fill-color': '#19ff00',
          'fill-opacity': 0.5
        },
        // Display none by adding a filter with an empty string.
        'filter': ['in', 'o_id', ]
      },
    );

    // change the property name by controlling ACCESSIBILITY type (radio button)
    document.getElementById('filtersAcc_meas').addEventListener('change', (event_measAcc) => {
      const measAcc_target = event_measAcc.target.value;
      // set the variable based on the chosen value
      measAcc_filter = measAcc_target

      // if the type is absolute,,, the property refers to the absolute value
      if (measAcc_filter === 'abs') {
        var field_bef = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_abs + 'min';

        data_filtered_transit_time = dataAcc.filter(function(d) {
          return d.transit_time_mor <= sliderAcc_filter_abs
        });

        // change the legend description
        if (tripAcc_filter === 'com') {
          newcontent =
            `<p>Proportion of residents who can commute to work by transit within <b>`
            + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> commute to work </b> by transit within <b>`
          + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
          </p>`
          ;
          jobs_total_bef_abs = 0
          for (let i of data_filtered_transit_time) {
            jobs_total_bef_abs = i.jobs_all + jobs_total_bef_abs
          }
          console.log(Math.round(((jobs_total_bef_abs/627908)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((jobs_total_bef_abs/627908)*1000)/10);
        } else {
          newcontent =
            `<p>Proportion of residents who can travel to non-work-related destinations by transit within <b>`
            + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> travel to non-work-related destinations </b> by transit within <b>`
          + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
          </p>`
          ;
          pois_total_bef_abs = 0
          for (let i of data_filtered_transit_time) {
            pois_total_bef_abs = i.poi_all + pois_total_bef_abs
          }
          console.log(Math.round(((pois_total_bef_abs/129311595)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((pois_total_bef_abs/129311595)*1000)/10);
        }
        
        element.innerHTML = newcontent;
        overall_element.innerHTML = overallContent;
      }
      // if the type is relative,,, the property refers to the relaitve value
      // needs to add the ".0" as the raw value is stored in the natural number without .0
      else {
        var field_bef = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_rel;

        data_filtered_transit_ratio = dataAcc.filter(function(d) {
          return d.transit_ratio_mor >= (1/sliderAcc_filter_rel)
        });

        // change the legend description
        if (tripAcc_filter === 'com') {
          newcontent =
            `<p>Proportion of residents who can commute to work by transit within <b>`
            + sliderAcc_filter_rel + ` times of driving time</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> commute to work </b> by transit within <b>`
          + sliderAcc_filter_rel + ` times of driving time</b> during morning peak hour
          </p>`
          ;
          jobs_total_bef_rel = 0
          for (let i of data_filtered_transit_ratio) {
            jobs_total_bef_rel = i.jobs_all + jobs_total_bef_rel
          }
          console.log(Math.round(((jobs_total_bef_rel/627908)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((jobs_total_bef_rel/627908)*1000)/10);
        } else {
          newcontent =
          `<p>Proportion of residents who can travel to non-work-related destinations by transit within <b>`
            + sliderAcc_filter_rel + ` times of driving time</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> travel to non-work-related destinations </b> by transit within <b>`
            + sliderAcc_filter_rel + ` times of driving time</b> during morning peak hour
            </p>`
          ;
          pois_total_bef_rel = 0
          for (let i of data_filtered_transit_ratio) {
            pois_total_bef_rel = i.poi_all + pois_total_bef_rel
          }
          console.log(Math.round(((pois_total_bef_rel/129311595)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((pois_total_bef_rel/129311595)*1000)/10);
        }

        element.innerHTML = newcontent;
        overall_element.innerHTML = overallContent;
      }
      // change the map's property
      mapBefAcc.setPaintProperty(
        'bg_access_before', 'fill-color', {
        'property' : field_bef,
        'stops': [[0, colors[0]], [0.05, colors[1]], [0.1, colors[2]], [0.2, colors[3]], [0.3, colors[4]], [0.4, colors[5]],  [0.6, colors[6]],  [0.8, colors[7]]]
        }
      )
    });

    // change the property name by controlling TRIP purpose (radio button)
    document.getElementById('filtersAcc_trip').addEventListener('change', (event_tripAcc) => {
    const tripAcc_target = event_tripAcc.target.value;

    tripAcc_filter = tripAcc_target

    // if the type is absolute,,, the property refers to the absolute value
    if (measAcc_filter === 'abs') {
      var field_bef = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_abs + 'min';

      data_filtered_transit_time = dataAcc.filter(function(d) {
        return d.transit_time_mor <= sliderAcc_filter_abs
      });

      // change the legend description
      if (tripAcc_filter === 'com') {
        newcontent =
          `<p>Proportion of residents who can commute to work by transit within <b>`
          + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
          </p>`
        ;
        overallContent =
        `<p>of all residents can <b> commute to work </b> by transit within <b>`
        + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
        </p>`
        ;
        jobs_total_bef_abs = 0
        for (let i of data_filtered_transit_time) {
          jobs_total_bef_abs = i.jobs_all + jobs_total_bef_abs
        }
        console.log(Math.round(((jobs_total_bef_abs/627908)*1000)/10))
        overallAccBefore.innerHTML = Math.round(((jobs_total_bef_abs/627908)*1000)/10);
      } else {
        newcontent =
        `<p>Proportion of residents who can travel to non-work-related destinations by transit within <b>`
          + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
          </p>`
        ;
        overallContent =
        `<p>of all residents can <b> travel to non-work-related destinations </b> by transit within <b>`
          + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
          </p>`
        ;
        pois_total_bef_abs = 0
        for (let i of data_filtered_transit_time) {
          pois_total_bef_abs = i.poi_all + pois_total_bef_abs
        }
        console.log(Math.round(((pois_total_bef_abs/129311595)*1000)/10))
        overallAccBefore.innerHTML = Math.round(((pois_total_bef_abs/129311595)*1000)/10);
      }

      element.innerHTML = newcontent;
      overall_element.innerHTML = overallContent;

    }
    // if the type is relative,,, the property refers to the relaitve value
    // needs to add the ".0" as the raw value is stored in the natural number without .0
    else {
      var field_bef = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_rel;

      data_filtered_transit_ratio = dataAcc.filter(function(d) {
        return d.transit_ratio_mor >= (1/sliderAcc_filter_rel)
      });

      // change the legend description
      if (tripAcc_filter === 'com') {
        newcontent =
          `<p>Proportion of residents who can commute to work by transit within <b>`
          + sliderAcc_filter_rel +
          ` times of driving time</b> during morning peak hour
          </p>`
        ;
        overallContent =
        `<p>of all residents can <b> commute to work </b> by transit within <b>`
        + sliderAcc_filter_rel +
        ` times of driving time</b> during morning peak hour
        </p>`
        ;
        jobs_total_bef_rel = 0
        for (let i of data_filtered_transit_ratio) {
          jobs_total_bef_rel = i.jobs_all + jobs_total_bef_rel
        }
        console.log(Math.round(((jobs_total_bef_rel/627908)*1000)/10))
        overallAccBefore.innerHTML = Math.round(((jobs_total_bef_rel/627908)*1000)/10);
      } else {
        newcontent =
        `<p>Proportion of residents who can travel to non-work-related destinations by transit within <b>`
          + sliderAcc_filter_rel +
          ` times of driving time</b> during morning peak hour
          </p>`
        ;
        overallContent =
        `<p>of all residents can <b> travel to non-work-related destinations </b> by transit within <b>`
          + sliderAcc_filter_rel +
          ` times of driving time</b> during morning peak hour
        </p>`
        ;
        pois_total_bef_rel = 0
        for (let i of data_filtered_transit_ratio) {
          pois_total_bef_rel = i.poi_all + pois_total_bef_rel
        }
        console.log(Math.round(((pois_total_bef_rel/129311595)*1000)/10))
        overallAccBefore.innerHTML = Math.round(((pois_total_bef_rel/129311595)*1000)/10);
      }

      element.innerHTML = newcontent;
      overall_element.innerHTML = overallContent;

    }

    // change the map's property
    mapBefAcc.setPaintProperty(
      'bg_access_before', 'fill-color', {
      'property' : field_bef,
      'stops': [[0, colors[0]], [0.05, colors[1]], [0.1, colors[2]], [0.2, colors[3]], [0.3, colors[4]], [0.4, colors[5]],  [0.6, colors[6]],  [0.8, colors[7]]]
      }
    )

    });

    // change the property name by controlling SLIDER_ABSOLUTE value
    sliderAcc_abs.addEventListener('input', (sa) => {
      //update the printed slider value
      sliderValueAcc_abs.innerHTML = sa.target.value;

      sliderAcc_filter_abs = sa.target.value;

      // if the type is absolute,,, the property refers to the absolute value
      if (measAcc_filter === 'abs') {
        var field_bef = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_abs + 'min';

        data_filtered_transit_time = dataAcc.filter(function(d) {
        return d.transit_time_mor <= sliderAcc_filter_abs
        });

        // change the legend description
        if (tripAcc_filter === 'com') {
          newcontent =
            `<p>Proportion of residents who can commute to work by transit within <b>`
            + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> commute to work </b> by transit within <b>`
          + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
          </p>`
          ;
          jobs_total_bef_abs = 0
          for (let i of data_filtered_transit_time) {
            jobs_total_bef_abs = i.jobs_all + jobs_total_bef_abs
          }
          console.log(Math.round(((jobs_total_bef_abs/627908)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((jobs_total_bef_abs/627908)*1000)/10);
        } else {
          newcontent =
          `<p>Proportion of residents who can travel to non-work-related destinations by transit within <b>`
            + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> travel to non-work-related destinations </b> by transit within <b>`
            + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
            </p>`
          ;
          pois_total_bef_abs = 0
          for (let i of data_filtered_transit_time) {
            pois_total_bef_abs = i.poi_all + pois_total_bef_abs
          }
          console.log(Math.round(((pois_total_bef_abs/129311595)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((pois_total_bef_abs/129311595)*1000)/10);
        }

        element.innerHTML = newcontent;
        overall_element.innerHTML = overallContent;

      }
      // if the type is relative,,, the property refers to the relaitve value
      // needs to add the ".0" as the raw value is stored in the natural number without .0
      else {
        var field_bef = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_rel;

        data_filtered_transit_ratio = dataAcc.filter(function(d) {
          return d.transit_ratio_mor >= (1/sliderAcc_filter_rel)
        });

        // change the legend description
        if (tripAcc_filter === 'com') {
          newcontent =
            `<p>Proportion of residents who can commute to work by transit within <b>`
            + sliderAcc_filter_rel +
            ` times of driving time</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> commute to work </b> by transit within <b>`
          + sliderAcc_filter_rel +
          ` times of driving time</b> during morning peak hour
          </p>`
          ;
          jobs_total_bef_rel = 0
          for (let i of data_filtered_transit_ratio) {
            jobs_total_bef_rel = i.jobs_all + jobs_total_bef_rel
          }
          console.log(Math.round(((jobs_total_bef_rel/627908)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((jobs_total_bef_rel/627908)*1000)/10);
        } else {
          newcontent =
            `<p>Proportion of residents who can travel to non-work-related destinations by transit within <b>`
            + sliderAcc_filter_rel +
            ` times of driving time</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> travel to non-work-related destinations </b> by transit within <b>`
          + sliderAcc_filter_rel +
          ` times of driving time</b> during morning peak hour
          </p>`
          ;
          pois_total_bef_rel = 0
          for (let i of data_filtered_transit_ratio) {
            pois_total_bef_rel = i.poi_all + pois_total_bef_rel
          }
          console.log(Math.round(((pois_total_bef_rel/129311595)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((pois_total_bef_rel/129311595)*1000)/10);
        }

        element.innerHTML = newcontent;
        overall_element.innerHTML = overallContent;

      }
      // change the map's property
      mapBefAcc.setPaintProperty(
        'bg_access_before', 'fill-color', {
        'property' : field_bef,
        'stops': [[0, colors[0]], [0.05, colors[1]], [0.1, colors[2]], [0.2, colors[3]], [0.3, colors[4]], [0.4, colors[5]],  [0.6, colors[6]],  [0.8, colors[7]]]
        }
      )
    });

    // change the property name by controlling SLIDER_ABSOLUTE value
    sliderAcc_rel.addEventListener('input', (sr) => {
      //update the printed slider value
      sliderValueAcc_rel.innerHTML = sr.target.value;

      sliderAcc_filter_rel = sr.target.value;

      // if the type is absolute,,, the property refers to the absolute value
      if (measAcc_filter === 'abs') {
        var field_bef = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_abs + 'min';

        data_filtered_transit_time = dataAcc.filter(function(d) {
        return d.transit_time_mor <= sliderAcc_filter_abs
        });

        // change the legend description
        if (tripAcc_filter === 'com') {
          newcontent =
            `<p>Proportion of residents who can commute to work by transit within <b>`
            + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> commute to work </b> by transit within <b>`
          + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
          </p>`
         ;
         jobs_total_bef_abs = 0
         for (let i of data_filtered_transit_time) {
           jobs_total_bef = i.jobs_all + jobs_total_bef
         }
         console.log(Math.round(((jobs_total_bef/627908)*1000)/10))
         overallAccBefore.innerHTML = Math.round(((jobs_total_bef/627908)*1000)/10);
        } else {
          newcontent =
            `<p>Proportion of residents who can travel to non-work-related destinations by transit within <b>`
            + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> travel to non-work-related destinations </b> by transit within <b>`
          + sliderAcc_filter_abs + ` minutes</b> during morning peak hour
          </p>`
          ;
          pois_total_bef_abs = 0
          for (let i of data_filtered_transit_time) {
            pois_total_bef_abs = i.poi_all + pois_total_bef_abs
          }
          console.log(Math.round(((pois_total_bef_abs/129311595)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((pois_total_bef_abs/129311595)*1000)/10);
        }

        element.innerHTML = newcontent;
        overall_element.innerHTML = overallContent;

      }
      // if the type is relative,,, the property refers to the relaitve value
      // needs to add the ".0" as the raw value is stored in the natural number without .0
      else {
        var field_bef = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_rel;

        data_filtered_transit_ratio = dataAcc.filter(function(d) {
          return d.transit_ratio_mor >= (1/sliderAcc_filter_rel)
        });

        // change the legend description
        if (tripAcc_filter === 'com') {
          newcontent =
            `<p>Proportion of residents who can commute to work by transit within <b>`
            + sliderAcc_filter_rel +
            ` times of driving time</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> commute to work </b> by transit within <b>`
          + sliderAcc_filter_rel +
          ` times of driving time</b> during morning peak hour
          </p>`
          ;
          jobs_total_bef_rel = 0
          for (let i of data_filtered_transit_ratio) {
            jobs_total_bef_rel = i.jobs_all + jobs_total_bef_rel
          }
          console.log(Math.round(((jobs_total_bef_rel/627908)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((jobs_total_bef_rel/627908)*1000)/10);
        } else {
          newcontent =
            `<p>Proportion of residents who can travel to non-work-related destinations by transit within <b>`
            + sliderAcc_filter_rel +
            ` times of driving time</b> during morning peak hour
            </p>`
          ;
          overallContent =
          `<p>of all residents can <b> travel to non-work-related destinations </b> by transit within <b>`
          + sliderAcc_filter_rel +
          ` times of driving time</b> during morning peak hour
          </p>`
          ;
          pois_total_bef_rel = 0
          for (let i of data_filtered_transit_ratio) {
            pois_total_bef_rel = i.poi_all + pois_total_bef_rel
          }
          console.log(Math.round(((pois_total_bef_rel/129311595)*1000)/10))
          overallAccBefore.innerHTML = Math.round(((pois_total_bef_rel/129311595)*1000)/10);
        }

        element.innerHTML = newcontent;
        overall_element.innerHTML = overallContent;

      }

      // change the map's property
      mapBefAcc.setPaintProperty(
        'bg_access_before', 'fill-color', {
        'property' : field_bef,
        'stops': [[0, colors[0]], [0.05, colors[1]], [0.1, colors[2]], [0.2, colors[3]], [0.3, colors[4]], [0.4, colors[5]],  [0.6, colors[6]],  [0.8, colors[7]]]
        }
      )
    });

    mapBefAcc.on('mousemove', 'bg_access_before', (er) => {
      // Change the cursor style as a UI indicator.
      mapBefAcc.getCanvas().style.cursor = 'pointer';

      // pointed block group
      const feature = er.features[0];

      // relative
      const o_d_pairs_rel = data_filtered_transit_ratio.filter(function(d) {
        return d['o_id'] === feature.properties['o_id']})
      // absolute
      const o_d_pairs_abs = data_filtered_transit_time.filter(function(d) {
        return d['o_id'] === feature.properties['o_id']})

      // destinations of the od pair
      const dest_ids_rel = o_d_pairs_rel.map(function(d) {return d.d_id});
      const dest_ids_abs = o_d_pairs_abs.map(function(d) {return d.d_id});

      var myFilter_rel = buildFilter(dest_ids_rel);
      var myFilter_abs = buildFilter(dest_ids_abs);

      // Use filter to collect only results with the same origin id.
      const destBGs_rel = mapBefAcc.querySourceFeatures('bg_access_before', {
        sourceLayer: 'before_access_0418',
        filter: myFilter_rel
      });
      const destBGs_abs = mapBefAcc.querySourceFeatures('bg_access_before', {
        sourceLayer: 'before_access_0418',
        filter: myFilter_abs
      });

      // Remove duplicates by checking for matching ID.
      const destBGs_unique_rel = getUniqueFeatures(destBGs_rel, 'o_id');
      const destBGs_unique_abs = getUniqueFeatures(destBGs_abs, 'o_id');

      // Total accessible jobs.
      const accessibledests_rel_com = o_d_pairs_rel.reduce((memo, feature) => {
        return memo + feature['jobs_all']
      }, 0);
      const accessibledests_abs_com = o_d_pairs_abs.reduce((memo, feature) => {
        return memo + feature['jobs_all']
      }, 0);
      const accessibledests_rel_non = o_d_pairs_rel.reduce((memo, feature) => {
        return memo + feature['poi_all']
      }, 0);
      const accessibledests_abs_non = o_d_pairs_abs.reduce((memo, feature) => {
        return memo + feature['poi_all']
      }, 0);


      if (measAcc_filter === 'abs') {
        mapBefAcc.setFilter('bg-dest', myFilter_abs);
        mapBefAcc.setFilter('bg-origin', ['in', 'o_id', feature.properties['o_id']]);
        mapAftAcc.setFilter('bg-origin', ['in', 'o_id', feature.properties['o_id']]);

        if (tripAcc_filter === 'com') {
        popup_bef
          .setLngLat(er.lngLat)
          .setHTML(
          '<center>' + 'Residents who can access their jobs ' + '<br>' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_abs.value + "</font>" + '</b>' +
          ' minutes: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibledests_abs_com.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibledests_abs_com/feature.properties['jobs.all']*1000)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>'
          )
          .addTo(mapBefAcc);
        }
        else {
        popup_bef
          .setLngLat(er.lngLat)
          .setHTML(
          '<center>' + 'Residents who can access non-work-related destinations ' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_abs.value + "</font>" + '</b>' +
          ' minutes: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibledests_abs_non.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibledests_abs_non/feature.properties['pop']*10)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>'
          )
          .addTo(mapBefAcc);
        }
      }

      else {
        mapBefAcc.setFilter('bg-dest', myFilter_rel);
        mapBefAcc.setFilter('bg-origin', ['in', 'o_id', feature.properties['o_id']]);
        mapAftAcc.setFilter('bg-origin', ['in', 'o_id', feature.properties['o_id']]);

        if (tripAcc_filter === 'com') {
        popup_bef
          .setLngLat(er.lngLat)
          .setHTML(
          '<center>' + 'Residents who can access their jobs ' + '<br>' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_rel.value + "</font>" + '</b>' +
          ' * drive time: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibledests_rel_com.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibledests_rel_com/feature.properties['jobs.all']*1000)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>'
          )
          .addTo(mapBefAcc);
        }
        else {
        popup_bef
          .setLngLat(er.lngLat)
          .setHTML(
          '<center>' + 'Residents who can access non-work-related destinations ' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_rel.value + "</font>" + '</b>' +
          ' * drive time: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibledests_rel_non.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibledests_rel_non/feature.properties['pop']*10)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>'
          )
          .addTo(mapBefAcc);
        }
      };

      // Add the selected features to the highlighted layer.
      if (measAcc_filter === 'abs') {

        const o_d_pairs_abs_on_aft = data_filtered_odmts_time.filter(function(d) {
          return d['o_id'] === feature.properties['o_id']})
        const dest_ids_abs_on_aft = o_d_pairs_abs_on_aft.map(function(d) {return d.d_id});
        var myFilter_abs_on_aft = buildFilter(dest_ids_abs_on_aft);

        mapAftAcc.setFilter('bg-dest', myFilter_abs_on_aft)

      // tooltip = synced info on the absolute map
        const accessibleDest_abs_com_on_aft = o_d_pairs_abs_on_aft.reduce((memo, feature) => {
          return memo + feature['jobs_all'];
        }, 0);
        const accessibleDest_abs_non_on_aft = o_d_pairs_abs_on_aft.reduce((memo, feature) => {
          return memo + feature['poi_all'];
        }, 0);

        const coordiante_for_aft = er.lngLat.wrap()

        if (tripAcc_filter === 'com') {
        popup_aft
          .setLngLat(coordiante_for_aft)
          .setHTML(
          '<center>' + 'Residents who can access their jobs ' + '<br>' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_abs.value + "</font>" + '</b>' +
          ' minutes: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+  accessibleDest_abs_com_on_aft.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibleDest_abs_com_on_aft/feature.properties['jobs.all']*1000)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>')
          .addTo(mapAftAcc)
        }
        else {
          popup_aft
          .setLngLat(coordiante_for_aft)
          .setHTML(
          '<center>' + 'Residents who can access non-work-related destinations ' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_abs.value + "</font>" + '</b>' +
          ' minutes: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibleDest_abs_non_on_aft.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibleDest_abs_non_on_aft/feature.properties['pop']*10)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>')
          .addTo(mapAftAcc)
        }

      }
      else {
        const o_d_pairs_rel_on_aft = data_filtered_odmts_ratio.filter(function(d) {
          return d['o_id'] === feature.properties['o_id']})
        const dest_ids_rel_on_aft = o_d_pairs_rel_on_aft.map(function(d) {return d.d_id});
        var myFilter_rel_on_aft = buildFilter(dest_ids_rel_on_aft);

        mapAftAcc.setFilter('bg-dest', myFilter_rel_on_aft)

      // tooltip = synced info on the absolute map
        const accessibleDest_rel_com_on_aft = o_d_pairs_rel_on_aft.reduce((memo, feature) => {
          return memo + feature['jobs_all'];
        }, 0);
        const accessibleDest_rel_non_on_aft = o_d_pairs_rel_on_aft.reduce((memo, feature) => {
          return memo + feature['poi_all'];
        }, 0);

        const coordiante_for_aft = er.lngLat.wrap()

        if (tripAcc_filter === 'com') {
        popup_aft
          .setLngLat(coordiante_for_aft)
          .setHTML(
          '<center>' + 'Residents who can access their jobs ' + '<br>' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_rel.value + "</font>" + '</b>' +
          ' * drive time: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibleDest_rel_com_on_aft.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibleDest_rel_com_on_aft/feature.properties['jobs.all']*1000)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>')
          .addTo(mapAftAcc)
        }
        else {
          popup_aft
          .setLngLat(coordiante_for_aft)
          .setHTML(
          '<center>' + 'Residents who can access non-work-related destinations ' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_rel.value + "</font>" + '</b>' +
          ' * drive time: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibleDest_rel_non_on_aft.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibleDest_rel_non_on_aft/feature.properties['pop']*10)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>')
          .addTo(mapAftAcc)
        }
      }

    }); //mousemove ends here

    mapBefAcc.on('mouseleave', 'bg_access_before', () => {
      mapBefAcc.getCanvas().style.cursor = '';
      popup_bef.remove();
      popup_aft.remove();
      mapBefAcc.setFilter('bg-dest', ['in', 'o_id', '']);
      mapAftAcc.setFilter('bg-dest', ['in', 'o_id', '']);
      mapBefAcc.setFilter('bg-origin', ['in', 'o_id', '']);
      mapAftAcc.setFilter('bg-origin', ['in', 'o_id', '']);
    });
  
  
  });


  // CREATE mapAftAcc with more detials
  mapAftAcc.on('load', () => {
    mapAftAcc.addSource('after_access_0420',  {type: 'vector', url: "mapbox://uhwang3.after_access_0420" });

    // Layer with the default property
    mapAftAcc.addLayer(
      {
        'id': 'bg_access_after',
        'type': 'fill',
        'source': 'after_access_0420',
        'source-layer': 'after_access_0420',
        'paint': {
          'fill-color': {
            'property' : 'abs.com.mor.45min',
            'stops': [[0, colors[0]], [0.05, colors[1]], [0.1, colors[2]], [0.2, colors[3]], [0.3, colors[4]], [0.4, colors[5]],  [0.6, colors[6]],  [0.8, colors[7]]]
          },
          'fill-opacity': 0.8,
          'fill-outline-color': 'rgba(0,0,0,0.1)'
        }
      },
    );
    // Layer: showing accessible destination
    mapAftAcc.addLayer(
      {
        'id': 'bg-dest',
        'type': 'fill',
        'source': 'after_access_0420',
        'source-layer': 'after_access_0420',
        'paint': {
          'fill-outline-color': '#ffffff',
          'fill-color': '#ffffff',
          'fill-opacity': 0.5
        },
        // Display none by adding a filter with an empty string.
        'filter': ['in', 'o_id', ]
      },
    );

    // Layer: showing origin block group
    mapAftAcc.addLayer(
      {
        'id': 'bg-origin',
        'type': 'fill',
        'source': 'after_access_0420',
        'source-layer': 'after_access_0420',
        'paint': {
          'fill-outline-color': '#19ff00',
          'fill-color': '#19ff00',
          'fill-opacity': 0.5
        },
        // Display none by adding a filter with an empty string.
        'filter': ['in', 'o_id', ]
      },
    );

    // change the property name by controlling ACCESSIBILITY type (radio button)
    document.getElementById('filtersAcc_meas').addEventListener('change', (event_measAcc) => {
      const measAcc_target = event_measAcc.target.value;
      // set the variable based on the chosen value
      measAcc_filter = measAcc_target

      // if the type is absolute,,, the property refers to the absolute value
      if (measAcc_filter === 'abs') {
        var field_aft = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_abs + 'min';

        data_filtered_odmts_time = dataAcc.filter(function(d) {
        return d.odmts_time_mor <= sliderAcc_filter_abs
        });

        if (tripAcc_filter === 'com') {
          jobs_total_aft_abs = 0
          for (let i of data_filtered_odmts_time) {
            jobs_total_aft_abs = i.jobs_all + jobs_total_aft_abs
          }
          console.log(Math.round(((jobs_total_aft_abs/627908)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((jobs_total_aft_abs/627908)*1000)/10);
        } else {
          pois_total_aft_abs = 0
          for (let i of data_filtered_odmts_time) {
            pois_total_aft_abs = i.poi_all + pois_total_aft_abs
          }
          console.log(Math.round(((pois_total_aft_abs/129311595)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((pois_total_aft_abs/129311595)*1000)/10);
        }
      }
      // if the type is relative,,, the property refers to the relaitve value
      // needs to add the ".0" as the raw value is stored in the natural number without .0
      else {
        var field_aft = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_rel;

        data_filtered_odmts_ratio = dataAcc.filter(function(d) {
          return d.odmts_ratio_mor >= (1/sliderAcc_filter_rel)
        });

        if (tripAcc_filter === 'com') {
          jobs_total_aft_rel = 0
          for (let i of data_filtered_odmts_ratio) {
            jobs_total_aft_rel = i.jobs_all + jobs_total_aft_rel
          }
          console.log(Math.round(((jobs_total_aft_rel/627908)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((jobs_total_aft_rel/627908)*1000)/10);
        } else {
          pois_total_aft_rel = 0
          for (let i of data_filtered_odmts_ratio) {
            pois_total_aft_rel = i.poi_all + pois_total_aft_rel
          }
          console.log(Math.round(((pois_total_aft_rel/129311595)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((pois_total_aft_rel/129311595)*1000)/10);
        }
      }

      // change the map's property
      mapAftAcc.setPaintProperty(
        'bg_access_after', 'fill-color', {
        'property' : field_aft,
        'stops': [[0, colors[0]], [0.05, colors[1]], [0.1, colors[2]], [0.2, colors[3]], [0.3, colors[4]], [0.4, colors[5]],  [0.6, colors[6]],  [0.8, colors[7]]]
        }
      )
    });

    // change the property name by controlling TRIP purpose (radio button)
    document.getElementById('filtersAcc_trip').addEventListener('change', (event_tripAcc) => {
      const tripAcc_target = event_tripAcc.target.value;

      tripAcc_filter = tripAcc_target

      // if the type is absolute,,, the property refers to the absolute value
      if (measAcc_filter === 'abs') {
        var field_aft = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_abs + 'min';

        data_filtered_odmts_time = dataAcc.filter(function(d) {
        return d.odmts_time_mor <= sliderAcc_filter_abs
        });

        if (tripAcc_filter === 'com') {
          jobs_total_aft_abs = 0
          for (let i of data_filtered_odmts_time) {
            jobs_total_aft_abs = i.jobs_all + jobs_total_aft_abs
          }
          console.log(Math.round(((jobs_total_aft_abs/627908)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((jobs_total_aft_abs/627908)*1000)/10);        
        } else {
          pois_total_aft_abs = 0
          for (let i of data_filtered_odmts_time) {
            pois_total_aft_abs = i.poi_all + pois_total_aft_abs
          }
          console.log(Math.round(((pois_total_aft_abs/129311595)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((pois_total_aft_abs/129311595)*1000)/10);
        }
      }
      // if the type is relative,,, the property refers to the relaitve value
      // needs to add the ".0" as the raw value is stored in the natural number without .0
      else {
        var field_aft = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_rel;

        data_filtered_odmts_ratio = dataAcc.filter(function(d) {
          return d.odmts_ratio_mor >= (1/sliderAcc_filter_rel)
        });

        if (tripAcc_filter === 'com') {
          jobs_total_aft_rel = 0
          for (let i of data_filtered_odmts_ratio) {
            jobs_total_aft_rel = i.jobs_all + jobs_total_aft_rel
          }
          console.log(Math.round(((jobs_total_aft_rel/627908)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((jobs_total_aft_rel/627908)*1000)/10);
        } else {
          pois_total_aft_rel = 0
          for (let i of data_filtered_odmts_ratio) {
            pois_total_aft_rel = i.poi_all + pois_total_aft_rel
          }
          console.log(Math.round(((pois_total_aft_rel/129311595)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((pois_total_aft_rel/129311595)*1000)/10);
        }
      }
      // change the map's property
      mapAftAcc.setPaintProperty(
        'bg_access_after', 'fill-color', {
        'property' : field_aft,
        'stops': [[0, colors[0]], [0.05, colors[1]], [0.1, colors[2]], [0.2, colors[3]], [0.3, colors[4]], [0.4, colors[5]],  [0.6, colors[6]],  [0.8, colors[7]]]
        }
      )

      });

    // change the property name by controlling SLIDER_ABSOLUTE value
    sliderAcc_abs.addEventListener('input', (sa) => {
      //update the printed slider value
      sliderValueAcc_abs.innerHTML = sa.target.value;

      sliderAcc_filter_abs = sa.target.value;

      // if the type is absolute,,, the property refers to the absolute value
      if (measAcc_filter === 'abs') {
        var field_aft = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_abs + 'min';

        data_filtered_odmts_time = dataAcc.filter(function(d) {
          return d.odmts_time_mor <= sliderAcc_filter_abs
        });

        if (tripAcc_filter === 'com') {
          jobs_total_aft_abs = 0
          for (let i of data_filtered_odmts_time) {
            jobs_total_aft_abs = i.jobs_all + jobs_total_aft_abs
          }
          console.log(Math.round(((jobs_total_aft_abs/627908)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((jobs_total_aft_abs/627908)*1000)/10);
        } else {
          pois_total_aft_abs = 0
          for (let i of data_filtered_odmts_time) {
            pois_total_aft_abs = i.poi_all + pois_total_aft_abs
          }
          console.log(Math.round(((pois_total_aft_abs/129311595)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((pois_total_aft_abs/129311595)*1000)/10);
        }
      }
      // if the type is relative,,, the property refers to the relaitve value
      // needs to add the ".0" as the raw value is stored in the natural number without .0
      else {
        var field_aft = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_rel;

        data_filtered_odmts_ratio = dataAcc.filter(function(d) {
          return d.odmts_ratio_mor >= (1/sliderAcc_filter_rel)
        });

        if (tripAcc_filter === 'com') {
          jobs_total_aft_rel = 0
          for (let i of data_filtered_odmts_ratio) {
            jobs_total_aft_rel = i.jobs_all + jobs_total_aft_rel
          }
          console.log(Math.round(((jobs_total_aft_rel/627908)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((jobs_total_aft_rel/627908)*1000)/10);
        } else {
          pois_total_aft_rel = 0
          for (let i of data_filtered_odmts_ratio) {
            pois_total_aft_rel = i.poi_all + pois_total_aft_rel
          }
          console.log(Math.round(((pois_total_aft_rel/129311595)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((pois_total_aft_rel/129311595)*1000)/10);
        }
      }

      // change the map's property
      mapAftAcc.setPaintProperty(
        'bg_access_after', 'fill-color', {
        'property' : field_aft,
        'stops': [[0, colors[0]], [0.05, colors[1]], [0.1, colors[2]], [0.2, colors[3]], [0.3, colors[4]], [0.4, colors[5]],  [0.6, colors[6]],  [0.8, colors[7]]]
        }
      )
    });


    // change the property name by controlling SLIDER_ABSOLUTE value
    sliderAcc_rel.addEventListener('input', (sr) => {
      //update the printed slider value
      sliderValueAcc_rel.innerHTML = sr.target.value;

      sliderAcc_filter_rel = sr.target.value;

      // if the type is absolute,,, the property refers to the absolute value
      if (measAcc_filter === 'abs') {
        var field_aft = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_abs + 'min';

        data_filtered_odmts_time = dataAcc.filter(function(d) {
         return d.odmts_time_mor <= sliderAcc_filter_abs
        });

        if (tripAcc_filter === 'com') {
          jobs_total_aft_abs = 0
          for (let i of data_filtered_odmts_time) {
            jobs_total_aft_abs = i.jobs_all + jobs_total_aft_abs
          }
          console.log(Math.round(((jobs_total_aft_abs/627908)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((jobs_total_aft_abs/627908)*1000)/10);
        } else {
          pois_total_aft_abs = 0
          for (let i of data_filtered_odmts_time) {
            pois_total_aft_abs = i.poi_all + pois_total_aft_abs
          }
          console.log(Math.round(((pois_total_aft_abs/129311595)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((pois_total_aft_abs/129311595)*1000)/10);
        }
      }
      // if the type is relative,,, the property refers to the relaitve value
      // needs to add the ".0" as the raw value is stored in the natural number without .0
      else {
        var field_aft = measAcc_filter + '.' + tripAcc_filter + '.mor.' + sliderAcc_filter_rel;

        data_filtered_odmts_ratio = dataAcc.filter(function(d) {
          return d.odmts_ratio_mor >= (1/sliderAcc_filter_rel)
        });

        if (tripAcc_filter === 'com') {
          jobs_total_aft_rel = 0
          for (let i of data_filtered_odmts_ratio) {
            jobs_total_aft_rel = i.jobs_all + jobs_total_aft_rel
          }
          console.log(Math.round(((jobs_total_aft_rel/627908)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((jobs_total_aft_rel/627908)*1000)/10);
        } else {
          pois_total_aft_rel = 0
          for (let i of data_filtered_odmts_ratio) {
            pois_total_aft_rel = i.poi_all + pois_total_aft_rel
          }
          console.log(Math.round(((pois_total_aft_rel/129311595)*1000)/10))
          overallAccAfter.innerHTML = Math.round(((pois_total_aft_rel/129311595)*1000)/10);
        }
      }

      // change the map's property
      mapAftAcc.setPaintProperty(
        'bg_access_after', 'fill-color', {
        'property' : field_aft,
        'stops': [[0, colors[0]], [0.05, colors[1]], [0.1, colors[2]], [0.2, colors[3]], [0.3, colors[4]], [0.4, colors[5]],  [0.6, colors[6]],  [0.8, colors[7]]]
        }
      )
    });


    mapAftAcc.on('mousemove', 'bg_access_after', (et) => {
      // Change the cursor style as a UI indicator.
      mapAftAcc.getCanvas().style.cursor = 'pointer';

      const feature_aft = et.features[0];

      // relative
      const o_d_pairs_rel_aft = data_filtered_odmts_ratio.filter(function(d) {
        return d['o_id'] === feature_aft.properties['o_id']})
      const o_d_pairs_abs_aft = data_filtered_odmts_time.filter(function(d) {
        return d['o_id'] === feature_aft.properties['o_id']})

      const dest_ids_rel_aft = o_d_pairs_rel_aft.map(function(d) {return d.d_id});
      const dest_ids_abs_aft = o_d_pairs_abs_aft.map(function(d) {return d.d_id});

      var myFilter_rel_aft = buildFilter(dest_ids_rel_aft);
      var myFilter_abs_aft = buildFilter(dest_ids_abs_aft);

      // Use filter to collect only results with the same origin id.
      const destBGs_rel_aft = mapAftAcc.querySourceFeatures('bg_access_after', {
        sourceLayer: 'after_access_0420',
        filter: myFilter_rel_aft
      });
      const destBGs_abs_aft = mapAftAcc.querySourceFeatures('bg_access_after', {
        sourceLayer: 'after_access_0420',
        filter: myFilter_abs_aft
      });

      // Remove duplicates by checking for matching ID.
      const destBGs_unique_rel_aft = getUniqueFeatures(destBGs_rel_aft, 'o_id');
      const destBGs_unique_abs_aft = getUniqueFeatures(destBGs_abs_aft, 'o_id');

      // Total accessible jobs.
      const accessibledests_rel_com_aft = o_d_pairs_rel_aft.reduce((memo, feature) => {
        return memo + feature['jobs_all']
      }, 0);
      const accessibledests_abs_com_aft = o_d_pairs_abs_aft.reduce((memo, feature) => {
        return memo + feature['jobs_all']
      }, 0);
      const accessibledests_rel_non_aft = o_d_pairs_rel_aft.reduce((memo, feature) => {
        return memo + feature['poi_all']
      }, 0);
      const accessibledests_abs_non_aft = o_d_pairs_abs_aft.reduce((memo, feature) => {
        return memo + feature['poi_all']
      }, 0);


      if (measAcc_filter === 'abs') {
        mapAftAcc.setFilter('bg-dest', myFilter_abs_aft);
        mapAftAcc.setFilter('bg-origin', ['in', 'o_id', feature_aft.properties['o_id']]);
        mapBefAcc.setFilter('bg-origin', ['in', 'o_id', feature_aft.properties['o_id']]);

        if (tripAcc_filter === 'com') {
        popup_aft
          .setLngLat(et.lngLat)
          .setHTML(
          '<center>' + 'Residents who can access their jobs ' + '<br>' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_abs.value + "</font>" + '</b>' +
          ' minutes: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibledests_abs_com_aft.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibledests_abs_com_aft/feature_aft.properties['jobs.all']*1000)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>'
          )
          .addTo(mapAftAcc);
        }
        else {
          popup_aft
          .setLngLat(et.lngLat)
          .setHTML(
          '<center>' + 'Residents who can access non-work-related destinations ' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_abs.value + "</font>" + '</b>' +
          ' minutes: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibledests_abs_non_aft.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibledests_abs_non_aft/feature_aft.properties['pop']*10)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>'
          )
          .addTo(mapAftAcc);
        }
      }

      else {
        mapAftAcc.setFilter('bg-dest', myFilter_rel_aft);
        mapAftAcc.setFilter('bg-origin', ['in', 'o_id', feature_aft.properties['o_id']]);
        mapBefAcc.setFilter('bg-origin', ['in', 'o_id', feature_aft.properties['o_id']]);

        if (tripAcc_filter === 'com') {
        popup_aft
          .setLngLat(et.lngLat)
          .setHTML(
          '<center>' + 'Residents can access their jobs ' + '<br>' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_rel.value + "</font>" + '</b>' +
          ' * drive time: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibledests_rel_com_aft.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibledests_rel_com_aft/feature_aft.properties['jobs.all']*1000)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>'
          )
          .addTo(mapAftAcc);
        }
        else {
        popup_aft
          .setLngLat(et.lngLat)
          .setHTML(
          '<center>' + 'Residents who can access non-work-related destinations ' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_rel.value + "</font>" + '</b>' +
          ' * drive time: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibledests_rel_non_aft.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibledests_rel_non_aft/feature_aft.properties['pop']*10)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>'
          )
          .addTo(mapAftAcc);
        }
      }




        // Add the selected features to the highlighted layer.
      if (measAcc_filter === 'abs') {

        const o_d_pairs_abs_on_bef = data_filtered_transit_time.filter(function(d) {
          return d['o_id'] === feature_aft.properties['o_id']})
        const dest_ids_abs_on_bef = o_d_pairs_abs_on_bef.map(function(d) {return d.d_id});
        var myFilter_abs_on_bef = buildFilter(dest_ids_abs_on_bef);

        mapBefAcc.setFilter('bg-dest', myFilter_abs_on_bef)

        // tooltip = synced info on the absolute map
        const accessibleDest_abs_com_on_bef = o_d_pairs_abs_on_bef.reduce((memo, feature) => {
          return memo + feature['jobs_all'];
        }, 0);
        const accessibleDest_abs_non_on_bef = o_d_pairs_abs_on_bef.reduce((memo, feature) => {
          return memo + feature['poi_all'];
        }, 0);

        const coordiante_for_bef = et.lngLat.wrap()

          if (tripAcc_filter === 'com') {
          popup_bef
            .setLngLat(coordiante_for_bef)
            .setHTML(
            '<center>' + 'Residents who can access their jobs ' + '<br>' +
            'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_abs.value + "</font>" + '</b>' +
            ' minutes: ' + '<br>' +
            "<font size='+1'>"+ '<b>'+ accessibleDest_abs_com_on_bef.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
            Math.round((accessibleDest_abs_com_on_bef/feature_aft.properties['jobs.all']*1000)/10) + '</b>' +
            '% of residents from this Block Group)' + '</font>' +'</center>')
            .addTo(mapBefAcc)
          }
          else {
            popup_bef
            .setLngLat(coordiante_for_bef)
            .setHTML(
            '<center>' + 'Residents who can access non-work-related destinations ' +
            'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_abs.value + "</font>" + '</b>' +
            ' minutes: ' + '<br>' +
            "<font size='+1'>"+ '<b>'+ accessibleDest_abs_non_on_bef.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
            Math.round((accessibleDest_abs_non_on_bef/feature_aft.properties['pop']*10)/10) + '</b>' +
            '% of residents from this Block Group)' + '</font>' +'</center>')
            .addTo(mapBefAcc)
          }

        }

      else {
        const o_d_pairs_rel_on_bef = data_filtered_transit_ratio.filter(function(d) {
          return d['o_id'] === feature_aft.properties['o_id']})
        const dest_ids_rel_on_bef = o_d_pairs_rel_on_bef.map(function(d) {return d.d_id});
        var myFilter_rel_on_bef = buildFilter(dest_ids_rel_on_bef);

        mapBefAcc.setFilter('bg-dest', myFilter_rel_on_bef)

        // tooltip = synced info on the absolute map
        const accessibleDest_rel_com_on_bef = o_d_pairs_rel_on_bef.reduce((memo, feature) => {
          return memo + feature['jobs_all'];
        }, 0);
        const accessibleDest_rel_non_on_bef = o_d_pairs_rel_on_bef.reduce((memo, feature) => {
          return memo + feature['poi_all'];
        }, 0);

        const coordiante_for_bef = et.lngLat.wrap()

        if (tripAcc_filter === 'com') {
        popup_bef
          .setLngLat(coordiante_for_bef)
          .setHTML(
          '<center>' + 'Residents who can access their jobs ' + '<br>' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_rel.value + "</font>" + '</b>' +
          ' * drive time: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+  accessibleDest_rel_com_on_bef.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibleDest_rel_com_on_bef/feature_aft.properties['jobs.all']*1000)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>')
          .addTo(mapBefAcc)
        }
        else {
        popup_bef
          .setLngLat(coordiante_for_bef)
          .setHTML(
          '<center>' + 'Residents who can access non-work-related destinations ' +
          'within ' + '<b>'+ "<font size='+1'>" + sliderAcc_rel.value + "</font>" + '</b>' +
          ' * drive time: ' + '<br>' +
          "<font size='+1'>"+ '<b>'+ accessibleDest_rel_non_on_bef.toString() + "</font>" + '</b>' + "<font size='-1'>" + ' (' + '<b>' +
          Math.round((accessibleDest_rel_non_on_bef/feature_aft.properties['pop']*10)/10) + '</b>' +
          '% of residents from this Block Group)' + '</font>' +'</center>')
          .addTo(mapBefAcc)
        }
      }

    }); //mousemove ends here

    mapAftAcc.on('mouseleave', 'bg_access_after', () => {
      mapAftAcc.getCanvas().style.cursor = '';
      popup_aft.remove();
      popup_bef.remove();
      mapAftAcc.setFilter('bg-dest', ['in', 'o_id', '']);
      mapBefAcc.setFilter('bg-dest', ['in', 'o_id', '']);
      mapAftAcc.setFilter('bg-origin', ['in', 'o_id', '']);
      mapBefAcc.setFilter('bg-origin', ['in', 'o_id', '']);
    });

  }); //mapAftAcc ends

  // add additional maps (atlanta boundary & main road)
  mapBefAcc.on('load', () => {
    mapBefAcc.addSource('atl_boundary',  {type: 'vector', url: "mapbox://uhwang3.atl_boundary" });
  
    mapBefAcc.addSource('main_road_3counties',  {type: 'vector', url: "mapbox://uhwang3.cl0q27y7p3mcw20qgismthmry-4a3tz" });
  
    mapBefAcc.addLayer(
      {
        'id': 'main_road_3counties',
        'type': 'line',
        'source': 'main_road_3counties',
        'source-layer': 'main_road_3counties',
        'paint': {
          'line-color': 'rgba(20,20,20,0.7)',
          'line-width': 1.5
          }
        },
      );
  
      mapBefAcc.addLayer(
        {
          'id': 'atl_boundary',
          'type': 'fill',
          'source': 'atl_boundary',
          'source-layer': 'atl_boundary',
          'paint': {
            'fill-color':'rgba(0,0,0,0)',
            'fill-outline-color': 'rgba(200,200,200,0.5)'
          }
        },
      );
    })
  
    mapAftAcc.on('load', () => {
    mapAftAcc.addSource('atl_boundary',  {type: 'vector', url: "mapbox://uhwang3.atl_boundary" });
  
    mapAftAcc.addSource('main_road_3counties',  {type: 'vector', url: "mapbox://uhwang3.cl0q27y7p3mcw20qgismthmry-4a3tz" });
  
    mapAftAcc.addLayer(
      {
        'id': 'main_road_3counties',
        'type': 'line',
        'source': 'main_road_3counties',
        'source-layer': 'main_road_3counties',
        'paint': {
          'line-color': 'rgba(20,20,20,0.7)',
          'line-width': 1.5
          }
        },
      );
  
      mapAftAcc.addLayer(
        {
          'id': 'atl_boundary',
          'type': 'fill',
          'source': 'atl_boundary',
          'source-layer': 'atl_boundary',
          'paint': {
            'fill-color':'rgba(0,0,0,0)',
            'fill-outline-color': 'rgba(200,200,200,0.5)'
          }
        },
      );
    })
  
    mapAftAcc.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      }),
      'bottom-right'
    );
}

mapBefAcc.scrollZoom.disable();
mapBefAcc.scrollZoom.setWheelZoomRate(0.02); // Default 1/450

mapBefAcc.on("wheel", event => {
  if (event.originalEvent.ctrlKey) { // Check if CTRL key is pressed
    event.originalEvent.preventDefault(); // Prevent chrome/firefox default behavior
    if (!mapBefAcc.scrollZoom._enabled) mapBefAcc.scrollZoom.enable(); // Enable zoom only if it's disabled
  } else {
    if (mapBefAcc.scrollZoom._enabled) mapBefAcc.scrollZoom.disable(); // Disable zoom only if it's enabled
  }
});

mapAftAcc.scrollZoom.disable();
mapAftAcc.scrollZoom.setWheelZoomRate(0.02); // Default 1/450

mapAftAcc.on("wheel", event => {
  if (event.originalEvent.ctrlKey) { // Check if CTRL key is pressed
    event.originalEvent.preventDefault(); // Prevent chrome/firefox default behavior
    if (!mapAftAcc.scrollZoom._enabled) mapAftAcc.scrollZoom.enable(); // Enable zoom only if it's disabled
  } else {
    if (mapAftAcc.scrollZoom._enabled) mapAftAcc.scrollZoom.disable(); // Disable zoom only if it's enabled
  }
});

mapAftAcc.addControl(new mapboxgl.NavigationControl(), 'top-right');

function coordinateAcc() {

    disable = false;

    mapBefAcc.on('move', function() {
    if (!disable) {
        center = mapBefAcc.getCenter();
        zoom = mapBefAcc.getZoom();
        pitch = mapBefAcc.getPitch();
        bearing = mapBefAcc.getBearing();

        disable = true;
        mapAftAcc.setCenter(center);
        mapAftAcc.setZoom(zoom);
        mapAftAcc.setPitch(pitch);
        mapAftAcc.setBearing(bearing);
        disable = false;
    };
    });

    mapAftAcc.on('move', function() {
    if (!disable) {
        center = mapAftAcc.getCenter();
        zoom = mapAftAcc.getZoom();
        pitch = mapAftAcc.getPitch();
        bearing = mapAftAcc.getBearing();

        disable = true;
        mapBefAcc.setCenter(center);
        mapBefAcc.setZoom(zoom);
        mapBefAcc.setPitch(pitch);
        mapBefAcc.setBearing(bearing);
        disable = false;
    };
    });
};

coordinateAcc();