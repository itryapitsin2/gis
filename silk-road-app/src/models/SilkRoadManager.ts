import {City} from "./City";
import {action, observable} from "mobx";
import {Feature, Map, View} from "ol";
import {Layer, Tile, Vector} from "ol/layer";
import {OSM} from "ol/source";
import {Style, Fill, Stroke, Circle} from "ol/style";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {all, bbox} from "ol/loadingstrategy";
import {Point} from "ol/geom";
import {fromLonLat as fll} from "ol/proj";

const fromLonLat = (coords: [number, number]) => {
    return [coords[1], coords[0]];
}

export class SilkRoadManager {
    @observable cities: City[] = [
        new City("Istanbul", [41.013611, 28.955]),
        new City("Bursa", [40.183333, 29.05]),
        new City("Ankara", [40.170278, 31.921111]),
        new City("Mudurnu", [40.473, 31.20755]),
        new City("Taraklı", [40.396944, 30.492778]),
        new City("Konya", [37.866667, 32.483333]),
        new City("Adana", [37, 35.321333]),
        new City("Antioch", [36.207246, 36.153932]),
        new City("İzmir", [38.42, 27.14]),
        new City("Trabzon", [41, 39.733333]),
    ];

    map: Map;
    view: View;
    pathLayer: Layer;
    hotelLayer: Layer;

    public constructor(map?: Map, view?: View) {

        if (view) {
            this.view = view;
        } else {
            this.view = new View({
                center: [41.013611, 28.955],
                zoom: 5
            });
        }

        if (map) {
            this.map = map;
        } else {
            this.map = new Map({
                target: 'map',
                view: this.view,
                layers: [
                    new Tile({
                        source: new OSM()
                    })
                ]
            });
        }

        this.pathLayer = new Vector({
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#337eff',
                    width: 2
                }),
                image: new Circle({
                    radius: 7,
                    fill: new Fill({
                        color: '#3a33ff'
                    })
                })
            })
        });
        this.hotelLayer = new Vector({
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#ff3374',
                    width: 2
                }),
                image: new Circle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ff3385'
                    })
                })
            })
        });
        this.map.addLayer(this.pathLayer);
        this.map.addLayer(this.hotelLayer);
    }

    @action toggleCity(city: City) {
        city.isSelected = !city.isSelected;
    }

    fetchRouting = () => {

        const apiKey = "5b3ce3597851110001cf6248b139b6a37ca34de7bc703db3f72a7439";
        // const apiKey = "5b3ce3597851110001cf6248587731d5b0ac40bf9d2a41954b64b630";
        const googleApiKey = "AIzaSyCMItmWgP95isRh-qCRf4fUaW8BQH5cxm8";

        const coordinates = this.cities.filter(x => x.isSelected);

        const hotelVectorSource = new VectorSource({
            loader: (p0, p1, p2) => {
                coordinates.forEach(city => {
                    fetch(`http://localhost:80/googleapis/json?location=${city.coords}&radius=1500&keyword=cruise&type=hotel&key=${googleApiKey}`, {
                        method: "GET",
                        headers: {
                            "Accept": 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                            "Content-Type": 'application/json; charset=UTF-8'
                        }
                    })
                        .then((response) => {
                            return response.json();
                        })
                        .then(json => {
                            if (json.status === "OK") {
                                const points = json.results.map((result: any) => {
                                    const coords = [result.geometry.location.lng, result.geometry.location.lat];
                                    return new Feature({
                                        geometry: new Point(
                                            fll(coords, this.view.getProjection())
                                        )
                                    });
                                });

                                hotelVectorSource.addFeatures(points);
                            }
                        })
                });
            }
        });




        const pathVectorSource = new VectorSource({
            format: new GeoJSON({
                dataProjection: 'EPSG:4326',
                featureProjection: this.view.getProjection()
            }),
            strategy: bbox,
            loader: (p0, p1, p2) => {

                fetch(`https://api.openrouteservice.org/v2/pdirections/driving-car/geojson?api_key=${apiKey}`, {
                    method: "POST",
                    headers: {
                        "Accept": 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                        "Authorization": apiKey,
                        "content-type": "application/json;charset=UTF-8",
                    },
                    body: JSON.stringify({
                        "preference": "recommended",
                        "language": "en-US",
                        "instructions": true,
                        "geometry": true,
                        "units": "m",
                        "attributes": ["detourfactor", "percentage"],
                        "instructions_format": "html",
                        "elevation": true,
                        "coordinates": coordinates.map(city => fromLonLat(city.coords)),
                        "extra_info": ["steepness", "waytype", "surface"]
                    })
                })
                    .then((response) => {
                        return response.text()
                    })
                    .then((content) => {
                        if (content) {
                            const features = pathVectorSource.getFormat().readFeatures(content) as Feature[];
                            pathVectorSource.addFeatures(features);
                        }
                    })
                    .catch((err) => console.log(err));
            }
        });

        this.pathLayer.setSource(pathVectorSource);
        this.hotelLayer.setSource(hotelVectorSource);
    }
}
