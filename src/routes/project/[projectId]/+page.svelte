<script lang="ts">
  import LineChart from '$lib/components/ui/chart/LineChart.svelte';
  import ObservationMap from '$lib/components/ui/map/ObservationMap.svelte';
  import * as Select from "$lib/components/ui/select/index.js";
  import type {  Project } from '$lib/components/ui/map/types';
	import { SvelteMap } from 'svelte/reactivity';

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
              { id: "obs-1", date: "2024-05-10", value: 120, position: { type: "Point", coordinates: [-52.380, -24.050] } },
              { id: "obs-2", date: "2024-06-10", value: 340, position: { type: "Point", coordinates: [-52.375, -24.045] } },
            ]
          },
          {
            id: "surv-rate",
            name: "Survival Rate",
            unit: "%",
            observations: [
              { id: "sr-1", date: "2024-05-10", value: 91, position: { type: "Point", coordinates: [-52.370, -24.040] } },
              { id: "sr-2", date: "2024-06-10", value: 87, position: { type: "Point", coordinates: [-52.365, -24.035] } },
            ]
          },
          {
            id: "canopy-cov",
            name: "Canopy Coverage",
            unit: "%",
            observations: [
              { id: "cc-1", date: "2024-05-10", value: 12, position: { type: "Point", coordinates: [-52.360, -24.030] } },
              { id: "cc-2", date: "2024-06-10", value: 18, position: { type: "Point", coordinates: [-52.355, -24.025] } },
            ]
          },
          {
            id: "avg-height",
            name: "Average Seedling Height",
            unit: "cm",
            observations: [
              { id: "ah-1", date: "2024-05-10", value: 15, position: { type: "Point", coordinates: [-52.350, -24.020] } },
              { id: "ah-2", date: "2024-06-10", value: 23, position: { type: "Point", coordinates: [-52.345, -24.015] } },
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
              { id: "ph-1", date: "2024-06-01", value: 7.2, position: { type: "Point", coordinates: [-52.340, -24.050] } },
              { id: "ph-2", date: "2024-07-01", value: 6.8, position: { type: "Point", coordinates: [-52.335, -24.045] } },
            ]
          },
          {
            id: "arhfi3",
            name: "Temperature",
            unit: "°C",
            observations: [
              { id: "tmp-1", date: "2024-06-01", value: 18, position: { type: "Point", coordinates: [-52.330, -24.040] } },
              { id: "tmp-2", date: "2024-07-01", value: 22, position: { type: "Point", coordinates: [-52.325, -24.035] } },
            ]
          },
          {
            id: "turb-01",
            name: "Turbidity",
            unit: "NTU",
            observations: [
              { id: "trb-1", date: "2024-06-01", value: 3.1, position: { type: "Point", coordinates: [-52.380, -24.030] } },
              { id: "trb-2", date: "2024-07-01", value: 4.5, position: { type: "Point", coordinates: [-52.375, -24.025] } },
            ]
          },
          {
            id: "dissolved-o2",
            name: "Dissolved Oxygen",
            unit: "mg/L",
            observations: [
              { id: "do-1", date: "2024-06-01", value: 8.4, position: { type: "Point", coordinates: [-52.370, -24.020] } },
              { id: "do-2", date: "2024-07-01", value: 7.9, position: { type: "Point", coordinates: [-52.365, -24.015] } },
            ]
          }
        ]
      },
      {
        id: "soil-mon-03",
        name: "Soil Health Monitoring",
        indicators: [
          {
            id: "soil-org",
            name: "Organic Matter",
            unit: "%",
            observations: [
              { id: "som-1", date: "2024-04-01", value: 2.1, position: { type: "Point", coordinates: [-52.360, -24.050] } },
              { id: "som-2", date: "2024-07-01", value: 2.8, position: { type: "Point", coordinates: [-52.355, -24.045] } },
            ]
          },
          {
            id: "soil-moist",
            name: "Soil Moisture",
            unit: "%",
            observations: [
              { id: "smo-1", date: "2024-04-01", value: 38, position: { type: "Point", coordinates: [-52.350, -24.040] } },
              { id: "smo-2", date: "2024-07-01", value: 55, position: { type: "Point", coordinates: [-52.345, -24.035] } },
            ]
          },
          {
            id: "soil-nitrogen",
            name: "Nitrogen Content",
            unit: "mg/kg",
            observations: [
              { id: "nit-1", date: "2024-04-01", value: 142, position: { type: "Point", coordinates: [-52.340, -24.030] } },
              { id: "nit-2", date: "2024-07-01", value: 178, position: { type: "Point", coordinates: [-52.335, -24.025] } },
            ]
          },
          {
            id: "soil-ph",
            name: "Soil pH",
            unit: "pH",
            observations: [
              { id: "sph-1", date: "2024-04-01", value: 5.8, position: { type: "Point", coordinates: [-52.330, -24.020] } },
              { id: "sph-2", date: "2024-07-01", value: 6.1, position: { type: "Point", coordinates: [-52.325, -24.015] } },
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

  const chartEntries = $derived(
    indicators?.map((indicator) => ({
      key: indicator.id,
      label: indicator.name,
      color: indicator.color
    }))
  );

  interface ChartDataPoint {
    date: Date;
    [key: string]: number | Date;
  };

  const chartData = $derived.by(() => {
    if (!selectedActivity) return [];

    const data = new SvelteMap<string, ChartDataPoint>();

    indicators?.forEach(({ id, observations }) => {
      observations.forEach((obs) => {
        if (!data.has(obs.date)) {
          data.set(obs.date, { date: new Date(`${obs.date}T12:00:00`) });
        }
        data.get(obs.date)![id] = obs.value;
      });
    });

    return Array.from(data.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  });
</script>

<div class="page-wrapper pt-8 pb-8 px-6">
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

    {#if selectedActivity}
      <div class="chart-wrapper">
        <LineChart
          title="Activity Evolution"
          description="Observations over time for {selectedActivity.name}"
          data={chartData}
          series={chartEntries!}
          class="line-card"
          dotted={true}
        />
      </div>

      <div class="map-wrapper">
        <h2 class="map-title">Observation Map</h2>
        <ObservationMap projectLocation={project.location} indicators={indicators}/>
      </div>
    {/if}
  </div>
</div>

<style>
  .page-wrapper {
    min-height: 100%;
    gap: 1.5rem;
    margin: 0.3rem;
    border-radius: 5px;
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

  .chart-wrapper {
    width: 60%;
    margin-top: 1rem;
  }

  .map-wrapper {
    width: 60%;
    margin-top: 1rem;
  }

  .map-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
  }
</style>
