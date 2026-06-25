<script lang="ts">
  import LineChart from '$lib/components/ui/chart/LineChart.svelte';
  import ObservationMap from '$lib/components/ui/map/ObservationMap.svelte';
  import * as Select from "$lib/components/ui/select/index.js";
	import { SvelteMap } from 'svelte/reactivity';
	import type { PageData } from './$types';
  import type { Project } from '$lib/types';
  import type { ChartDataPoint, MapIndicator } from '$lib/components/ui/map/types.js'
	import type { Point } from 'geojson';

	let { data }: { data: PageData } = $props();
  
  const project = $derived(data.project as Project);

  const projectArea =  $derived(
    project.locations?.reduce((sum, l) => sum + (Number(l.extent_ha)), 0) || 0
  );

  const projectLocations = $derived(
    Array.from(new Set(project.locations?.map(l => `${l.country} (${l.ecosystem})`))).join('; ')
  );

  let selectedActivityId = $state("");
  const selectedActivity = $derived(
    project.activities?.find(a => String(a.id) === selectedActivityId) || project.activities?.[0]
  );

  const indicators = $derived<MapIndicator[]>((selectedActivity?.indicators || []).map((indicator, index) => ({
      ...indicator,
      id: String(indicator.id),
      color: generateColor(index)
    }))
  );

  let observations = $derived.by(() => {
    if (!indicators) return [];
    
    return indicators.flatMap(i => {
      if (!i.observations) return [];
      
      return i.observations.map(o => {
        const coordinates = structuredClone((o.position as Point)?.coordinates);        
        
        return {
          id: String(o.id),
          name: i.name,
          value: o.value,
          unit: i.unit,
          date: o.date,
          position: o.position,
          lng: coordinates?.[0] ?? 0, 
          lat: coordinates?.[1] ?? 0,
          color: i.color
        };
      });
    });
  });
  
  const chartEntries = $derived(
    indicators?.map((indicator) => ({
      key: indicator.id,
      label: indicator.name,
      color: indicator.color
    }))
  );
  
  const chartData = $derived.by(() => {
    if (!selectedActivity) return [];

    const map = new SvelteMap<string, ChartDataPoint>();
    
    indicators?.forEach(({ id, observations }) => {
      observations?.forEach((o) => {
        const dateKey = String(o.date)

        if (!map.has(dateKey)) {
          map.set(dateKey, { date: new Date(dateKey) });
        }

        map.get(dateKey)![id] = o.value;
      });
    });
    
    return Array.from(map.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  });
  
  function generateColor(index: number) {
    const baseHue = 120; // green
    const hueShift = 45;
    const newHue = (baseHue + (index * hueShift)) % 360;
  
    return `hsl(${newHue}, 70%, 45%)`
  }
</script>

<div class="page-wrapper pt-8 pb-8 px-6">
  <header class="page-header">
    <h1 class="project-title">{project.name}</h1>
    <div class="project-info">
      <p><strong>Duração:</strong>
        {new Date(project.lifetime_start).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} 
        até 
        {new Date(project.lifetime_end).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
      </p>
      <p><strong>Localização:</strong> {projectLocations}</p>
      <p><strong>Área Total:</strong> {projectArea} ha</p>
    </div>

    <div class="sdg-container">
      {#each project.project_sdgs as s (s.id)}
        <img src={s.icon_url} alt={s.name} title={s.name} class="sdg-icon" />
      {/each}
    </div>
  </header>
  
  <div class="activity-card">
    <Select.Root type="single" name="selectedActivity" bind:value={selectedActivityId}>
      Atividade
      <Select.Trigger class="rounded-md w-[40%]">
        {#if selectedActivity} 
          {selectedActivity.name} 
        {:else} 
          Selecione uma atividade
        {/if}
      </Select.Trigger>
      <Select.Content class="rounded-md">
        <Select.Group>
          {#each project.activities as activity (activity.id)}
            <Select.Item value={String(activity.id)} label={activity.name}>
              {activity.name}
            </Select.Item>
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>

    {#if selectedActivity}
      <div class="chart-wrapper">
        <LineChart
          title="Evolução das Atividades"
          description="Observations pelo tempo para {selectedActivity.name}"
          data={chartData}
          series={chartEntries}
          class="line-card"
          dotted={true}
        />
      </div>
    
      <div class="map-wrapper">
        <h2 class="map-title">Observation Map</h2>
        <ObservationMap locations={selectedActivity.activity_locations} observations={observations}/>
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

  .sdg-container {
    display: flex; 
    gap: 0.75rem; 
    margin-top: 1rem;
    flex-wrap: wrap; 
  }

  .sdg-icon {
    width: 6rem; 
    height: auto; 
    object-fit: cover;
    border-radius: 0.25rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    transition: transform 0.2s ease-in-out;
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
