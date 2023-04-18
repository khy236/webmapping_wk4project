// test: output geojson dataset
console.log(parkpoints)

// test: output type of data that parkpoints is
console.log(typeof parkpoints)

// my token
mapboxgl.accessToken = 'pk.eyJ1Ijoia2h5MjM2IiwiYSI6ImNsZzVxYTVnNDA1d2kzZW45b3l5d280N3oifQ.GqfNX5HwLaA5utEN2iQkXg';

// map start location
const NYC_COORDINATES = [-74.00630, 40.71419] // FiDi

// initialize basemap
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: NYC_COORDINATES,
    zoom: 9.8,
    pitch: 15,
    bearing: 0,
    container: 'map',
    antialias: true
});

// add geojson data layer to basemap
map.on('load', function () {

    // add park data source
    map.addSource('parkpointssource', {
        type: 'geojson',
        data: parkpoints // variable created in park-points.js and loaded in index.html
    })

    // add bridge data source
    map.addSource('bridgesource', {
        type: 'geojson',
        data: bridgelines
    })

    // add sunnyside data source
    map.addSource('sunnysidesource', {
        type: 'geojson',
        data: sunnyside
    })

    // add downtown bk pluto export
    map.addSource('downtownbksource', {
        type: 'geojson',
        data: downtownbk
    })

    // add park point circles onto basemap
    map.addLayer({
        id: 'circle-parkpoints',
        type: 'circle',
        source: 'parkpointssource',
        paint: {
            'circle-color': '#69D354',
            'circle-radius': 8,
            'circle-opacity': 0.6
        }
    })

    // add bridge circles onto basemap
    map.addLayer({
        id: 'line-bridges',
        type: 'line',
        source: 'bridgesource',
        paint: {
            'line-width': 10,
            'line-color': '#7E867C'
        },
        layout: {
            'line-cap': 'round'
        }
    })

    // add sunnyside circles onto basemap
    map.addLayer({
        id: 'polygon-sunnywide',
        type: 'fill',
        source: 'sunnysidesource',
        paint: {
            'fill-color': '#04FCEC'
        }
    })

    // add a line laye that uses the polygon source to demonstrate that two layers can use the same source
    map.addLayer({
        id: 'line-polygon',
        type: 'line',
        source: 'sunnysidesource',
        paint: {
            'line-color': '#2FACA4',
            'line-width': 3
        }
    })

    // add downtownbk onto basemap
    map.addLayer({
        id: 'polygon-downtownbk',
        type: 'fill',
        source: 'downtownbksource',
        paint: {
            'fill-color': [ // data-driven styling: PLUTO Land Use code
                'match',
                ['get', 'LandUse'],
                "11", // vacant
                "#2FACA4",
                "#cccccc" // not vacant
            ]
        }
    },
        'road-label-simple') // order pluto to be under roads

    // test: print all layers to console - can hide/show existing base layers (like water)
    console.log(map.getStyle().layers)


    // view address on click
    map.on('click', 'polygon-downtownbk', (e) => {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(e.features[0].properties.BBL)
        .addTo(map);
        });
         
        // Change the cursor to a pointer when
        // the mouse is over the states layer.
        map.on('mouseenter', 'states-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
        });
         
        // Change the cursor back to a pointer
        // when it leaves the states layer.
        map.on('mouseleave', 'states-layer', () => {
        map.getCanvas().style.cursor = '';
        });



})
