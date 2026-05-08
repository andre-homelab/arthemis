<script lang="ts">
  import { Map, MapMarker, MarkerContent,  MarkerPopup } from '$lib/components/ui/map';
  import type { Map as MapLibreMap } from 'maplibre-gl';
  import type { ObservationMapProps } from '$lib/components/ui/map/types';

  let { projectLocation, indicators }: ObservationMapProps = $props();
  let mapInstance = $state<MapLibreMap | null>(null);

  let observations = $derived(
    indicators?.flatMap((indicator) => 
      indicator.observations.map(obs => ({
        id: obs.id,
        name: indicator.name,
        value: obs.value,
        unit: indicator.unit,
        date: obs.date,
        lng: obs.position.coordinates[0],
        lat: obs.position.coordinates[1],
        color: indicator.color
      }))
    ) || []
  );

  let centerLng = $derived(projectLocation.position.coordinates[0][0][0] || 0);
  let centerLat = $derived(projectLocation.position.coordinates[0][0][1] || 0);

  // Drwas a custom layer; no built-in mapcn-svelte component 
  function drawLocationBoundary() {
    const map = mapInstance;
    if (!map) return;
    
    const sourceName = "boundary";

    if (!map.getSource(sourceName)) {

      // Adds new GeoJSON polygon to the map instance
      map.addSource(sourceName, { 
        type: "geojson", 
        data: {
          type: "Feature",
          properties: {}, // properties can have a name to be displayed for every polygon on hover, for example
          geometry: projectLocation.position
        }
      });

      // Adds a fill to the polygon
      map.addLayer({
        id: "boundary-fill",
        type: "fill",
        source: sourceName,
        paint: {
          "fill-color": "#22c55e",
          "fill-opacity": 0.4
        },
      });

      // Adds a outline to the polygon
      map.addLayer({
        id: "boundary-outline",
        type: "line",
        source: sourceName,
        paint: {
          "line-color": "#16a34a",
          "line-width": 2
        },
      });
    }
  }
</script>

<div class="map-container">  
  <Map 
    bind:map={mapInstance} 
    onstyleloaded={drawLocationBoundary}
    center={[centerLng, centerLat]} 
    zoom={12} 
  >
    {#each observations as obs (obs.id)}
      <MapMarker longitude={obs.lng} latitude={obs.lat}>
        <MarkerContent>
          <div class="marker-dot" style="background-color: {obs.color};"></div>
        </MarkerContent>
        
        <MarkerPopup>
          <div class="popup-content">
            <p class="popup-title">{obs.name}</p>
            <p class="popup-value">{obs.value} {obs.unit}</p>
            <p class="popup-date">{obs.date}</p>
          </div>
        </MarkerPopup>
      </MapMarker>
    {/each}
  </Map>
</div>

<style>
  .map-container {
    height: 500px; 
    width: 100%; 
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    overflow: hidden;
    position: relative;
    background-color: #f9fafb;
  }

  .marker-dot {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: transform 0.1s ease-in-out;
  }

  .marker-dot:hover {
    transform: scale(1.2);
  }

  .popup-content {
    padding: 0.5rem;
  }

  .popup-title {
    font-weight: 700;
    font-size: 0.875rem;
    margin: 0 0 0.25rem 0;
    color: #111827;
  }

  .popup-value {
    font-size: 0.875rem;
    margin: 0 0 0.25rem 0;
    color: #374151;
  }

  .popup-date {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
  }
</style>
