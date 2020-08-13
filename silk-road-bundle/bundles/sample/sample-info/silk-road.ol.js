import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import * as olExtent from 'ol/extent';
import olInteractionDraw, { createRegularPolygon } from 'ol/interaction/Draw';
import olInteractionModify from 'ol/interaction/Modify';
import * as olEventsCondition from 'ol/events/condition';
import olOverlay from 'ol/Overlay';
import * as olGeom from 'ol/geom';
import LinearRing from 'ol/geom/LinearRing';
import olProjection from 'ol/proj/Projection'
import GeometryCollection from 'ol/geom/GeometryCollection';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import olCollection from 'ol/Collection';
import olFeature from 'ol/Feature';
import jstsOL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import { BufferOp, BufferParameters } from 'jsts/org/locationtech/jts/operation/buffer';
import isValidOp from 'jsts/org/locationtech/jts/operation/valid/IsValidOp';
import {getZoomLevelHelper} from "oskari-frontend/bundles/mapping/mapmodule/util/scale";
import olLayerImage from 'ol/layer/Image';
import olSourceImageWMS from 'ol/source/ImageWMS';
import {fromLonLat} from 'ol/proj';

const olParser = new jstsOL3Parser();
olParser.inject(olGeom.Point, olGeom.LineString, LinearRing, olGeom.Polygon, olGeom.MultiPoint, olGeom.MultiLineString, olGeom.MultiPolygon, GeometryCollection);
const AbstractMapModulePlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin');

Oskari.clazz.defineES(
    'Oskari.sample.info.silk-road',
    class SilkRoadPlugin extends AbstractMapModulePlugin {
        constructor() {
            super();
            this._drawLayers = undefined;
        }

        draw () {

            jQuery("#contentMap").css("position", "relative");
            jQuery("#contentMap").append(
                "<div id='react-container' style='position: absolute;top: 50px;left: 10px;'></div>"
            );
            window.OskariMap = this.getMap();
            window.OskariView = this.getMap().getView();
            window.ReactDOMCaller(
                this.getMap(),
                this.getMap().getView()
            );
        }
    },
    {
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
