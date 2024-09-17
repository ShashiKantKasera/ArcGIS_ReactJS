import React, { useEffect, useRef } from "react";

// ArcGIS CSS (you can import this in your App or directly in the component)
import "@arcgis/core/assets/esri/themes/light/main.css";

// Your React component
const ArcGISMap = () => {
  const viewDivRef = useRef(null); // Reference to the div element for the map

  useEffect(() => {
    // Load ArcGIS JS API dynamically
    const loadArcGISModules = async () => {
      const [
        esriConfig,
        Map,
        MapView,
        Graphic,
        GraphicsLayer,
        BasemapGallery,
        ScaleBar,
        Sketch,
      ] = await Promise.all([
        import("@arcgis/core/config"),
        import("@arcgis/core/Map"),
        import("@arcgis/core/views/MapView"),
        import("@arcgis/core/Graphic"),
        import("@arcgis/core/layers/GraphicsLayer"),
        import("@arcgis/core/widgets/BasemapGallery"),
        import("@arcgis/core/widgets/ScaleBar"),
        import("@arcgis/core/widgets/Sketch"),
      ]);

      // Set API key
      esriConfig.default.apiKey =
        "AAPK323fad20acf84a5ab776af75176d35a9xXLcx-COjPFvOJ_qn2FS2vbHpc0FyTzepomqlzlZsMlr3PYOYXCWRHwwMz7RUtC6";

      // Create map instance
      const map = new Map.default({
        basemap: "arcgis/topographic", // Basemap style
      });

      // Create a view
      const view = new MapView.default({
        container: viewDivRef.current, // Reference to the div element for the map
        map: map,
        center: [-118.805, 34.027], // Longitude, latitude
        zoom: 13,
      });

      //Widget 1- BasemapGallery

      // Fix: Ensure the BasemapGallery uses .default
      const basemapGallery = new BasemapGallery.default({
        view: view,
        container: document.createElement("div"), // We will add this dynamically later
      });

      // Add the widget to the top-right corner of the view
      view.ui.add(basemapGallery, {
        position: "top-right",
      });

      // Initially collapse the basemap gallery using CSS
      basemapGallery.container.style.display = "none";

      // Create a button to toggle the visibility of the BasemapGallery
      const toggleButton = document.createElement("button");
      toggleButton.innerHTML = "Toggle Basemap Gallery";
      toggleButton.style.position = "absolute";
      toggleButton.style.top = "10px";
      toggleButton.style.right = "10px";
      toggleButton.style.zIndex = "1"; // Make sure the button appears on top of the map

      // Append the button to the map's container
      viewDivRef.current.appendChild(toggleButton);

      // Add event listener to toggle the gallery visibility
      toggleButton.addEventListener("click", () => {
        if (basemapGallery.container.style.display === "none") {
          basemapGallery.container.style.display = "block";
        } else {
          basemapGallery.container.style.display = "none";
        }
      });

      //Widget 2 .Scalebar

      const scaleBar = new ScaleBar.default({
        view: view,
        unit: "dual", // The scale bar displays both metric and imperial units.
      });

      // Add the widget to the bottom left corner of the view
      view.ui.add(scaleBar, {
        position: "bottom-left",
      });

      //sketch

      view.when(() => {
        const sketch = new Sketch.default({
          layer: graphicsLayer,
          view: view,
          // graphic will be selected as soon as it is created
          creationMode: "update",
        });

        view.ui.add(sketch, "top-right");
      });

      // Add Point , Line , Polygon

      // Add GraphicsLayer
      const graphicsLayer = new GraphicsLayer.default();
      map.add(graphicsLayer);

      // Create and add point graphic
      const point = {
        type: "point",
        longitude: -118.80657463861,
        latitude: 34.0005930608889,
      };
      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40], // Orange
        outline: {
          color: [255, 255, 255], // White
          width: 1,
        },
      };
      const pointGraphic = new Graphic.default({
        geometry: point,
        symbol: simpleMarkerSymbol,
      });
      graphicsLayer.add(pointGraphic);

      // Create and add polyline graphic
      const polyline = {
        type: "polyline",
        paths: [
          [-118.821527826096, 34.0139576938577],
          [-118.814893761649, 34.0080602407843],
          [-118.808878330345, 34.0016642996246],
        ],
      };
      const simpleLineSymbol = {
        type: "simple-line",
        color: [226, 119, 40], // Orange
        width: 2,
      };
      const polylineGraphic = new Graphic.default({
        geometry: polyline,
        symbol: simpleLineSymbol,
      });
      graphicsLayer.add(polylineGraphic);

      // Create and add polygon graphic
      const polygon = {
        type: "polygon",
        rings: [
          [-118.818984489994, 34.0137559967283],
          [-118.806796597377, 34.0215816298725],
          [-118.791432890735, 34.0163883241613],
          [-118.79596686535, 34.008564864635],
          [-118.808558110679, 34.0035027131376],
        ],
      };
      const simpleFillSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.8], // Orange, opacity 80%
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
      };
      const popupTemplate = {
        title: "{Name}",
        content: "{Description}",
      };
      const attributes = {
        Name: "Graphic",
        Description: "I am a polygon",
      };
      const polygonGraphic = new Graphic.default({
        geometry: polygon,
        symbol: simpleFillSymbol,
        attributes: attributes,
        popupTemplate: popupTemplate,
      });
      graphicsLayer.add(polygonGraphic);
    };

    // Load modules when component mounts
    loadArcGISModules();
  }, []);

  return (
    <div>
      <div
        ref={viewDivRef}
        style={{ padding: 0, margin: 0, height: "100vh", width: "100%" }}
      ></div>
    </div>
  );
};

export default ArcGISMap;
