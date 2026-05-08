<script lang="ts">
  import ObservationMap from '$lib/components/ui/map/ObservationMap.svelte';
  import * as Select from "$lib/components/ui/select/index.js";
  import type {  Project } from '$lib/components/ui/map/types';

  const mockProjectDetails: Project = {
    id: "smh-2",
    name: "Atlantic Forest Reforestation",
    lifetime_start: "2024-01-01",
    lifetime_end: "2030-12-31",

    location: {
        id: "sh2fwe",
        ecosystem: "Atlantic Forest",
        extent_ha: 150.5,
        country: "Brazil",
        position: {
            type: "Polygon",
            coordinates: [[
                [-52.38, -24.05],
                [-52.38, -24.01],
                [-52.32, -24.01],
                [-52.32, -24.05],
                [-52.38, -24.05]
            ]]
        }
    },
    activities: [
        {
            id: "hash:P",
            name: "Native Seedling Planting",
            indicators: [
                {
                    id: "urgnd",
                    name: "Seedlings Planted",
                    unit: "units",
                    observations: [
                        {
                            id: "scf34fe2",
                            date: "2024-05-10",
                            value: 50,
                            position: { 
                                type: "Point", 
                                coordinates: [-52.35, -24.03] 
                            }
                        },
                        {
                            id: "hjhibae382",
                            date: "2024-05-15",
                            value: 71,
                            position: { 
                                type: "Point", 
                                coordinates: [-52.36, -24.04] 
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "hahadiery832-io",
            name: "Water Quality Monitoring",
            indicators: [
                {
                    id: "u-shube-cds",
                    name: "pH Levels",
                    unit: "pH",
                    observations: [
                        {
                            id: "fjuf23",
                            date: "2024-06-01",
                            value: 7.2,
                            position: { 
                                type: "Point", 
                                coordinates: [-52.37, -24.02] 
                            }
                        }
                    ]
                },
                {
                    id: "arhfi3",
                    name: "Temperature",
                    unit: "°C",
                    observations: [
                        {
                            id: "rjie232",
                            date: "2024-07-01",
                            value: 14,
                            position: { 
                                type: "Point", 
                                coordinates: [-52.36, -24.02] 
                            }
                        },
                        {
                            id: "e3o4",
                            date: "2024-07-07",
                            value: 17,
                            position: { 
                                type: "Point", 
                                coordinates: [-52.37, -24.03] 
                            }
                        }
                    ]
                }
            ]
        }
    ]
  };

  const project = mockProjectDetails;

  let selectedActivityName = $state("");

  const selectedActivity = $derived(
    project.activities.find(
      (activity) => activity.name === selectedActivityName
    )
  );

  function generateColor(index: number) {
    const baseHue = 120; // green
    const hueShift = 45;
    const newHue = (baseHue + (index * hueShift)) % 360;

    return `hsl(${newHue}, 70%, 45%)`
  }

  const indicators = $derived(
    selectedActivity?.indicators.map((indicator, index) => ({
      ...indicator,
      color: generateColor(index)
    }))
  )
</script>

<div class="page-wrapper min-h-screen pt-8 pb-8 px-6">
  <header class="page-header">
    <h1 class="project-title">{project.name}</h1>
    <div class="project-info">
      <p><strong>Duration:</strong> {project.lifetime_start} to {project.lifetime_end}</p>
      <p><strong>Location:</strong> {project.location.country} ({project.location.ecosystem})</p>
      <p><strong>Area:</strong> {project.location.extent_ha} ha</p>
    </div>
  </header>

  <div class="activity-card">
    <Select.Root type="single" name="selectedActivity" bind:value={selectedActivityName}>
      <Select.Trigger class="rounded-md w-[40%]">
        {#if selectedActivityName} 
          {selectedActivityName} 
        {:else} 
          <p>Select an activity</p>
        {/if}
      </Select.Trigger>
      <Select.Content class="rounded-md">
        <Select.Group>
          {#each project.activities as activity (activity.id)}
            <Select.Item value={activity.name} label={activity.name}>
              {activity.name}
            </Select.Item>
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>

    <div class="map-wrapper">
      <h2 class="map-title">Observation Map</h2>
      <ObservationMap projectLocation={project.location} indicators={indicators}/>
    </div>
  </div>

</div>

<style>
   .page-wrapper {
    gap: 1.5rem;
    font-family: system-ui, sans-serif;
    background-color: #ffffff;
  }

  .page-header {
    margin-bottom: 1rem;
  }

  .project-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  .project-info {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #4b5563;
  }

  .project-info p {
    margin: 0;
  }

  .activity-card {
    background-color: #ffffff;
    padding: 1rem;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .map-wrapper {
    margin-top: 1rem;
  }

  .map-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
  }
</style>
