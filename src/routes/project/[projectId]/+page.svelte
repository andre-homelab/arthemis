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
</script>

<div class="page-wrapper">
  <header class="page-header">
    <h1 class="project-title">{project.name}</h1>
    <div class="project-meta">
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
          Select an activity 
          {/if}
    </Select.Trigger>
      <Select.Content class="rounded-md">
        <Select.Group>
          {#each project.activities as activity (activity.id)}
            <Select.Item
              value={activity.name}
              label={activity.name}
            >
              {activity.name}
            </Select.Item>
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>

    <div class="map-wrapper">
      <h2 class="section-title">Observation Map</h2>
      <ObservationMap 
      projectLocation={project.location} 
      selectedActivity={selectedActivity} 
      />
    </div>
  </div>

</div>

<style>
  .page-wrapper {
    padding: 1.5rem;
    max-width: 64rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: system-ui, sans-serif;
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

  .project-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #4b5563;
  }

  .project-meta p {
    margin: 0;
  }

  .activity-card {
    background-color: #ffffff;
    padding: 1rem;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

   .activity-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  /* .activity-select {
    width: 100%;
    max-width: 50%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: #ffffff;
    font-size: 1rem;
  } */

  .map-wrapper {
    margin-top: 1rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
  }
</style>
