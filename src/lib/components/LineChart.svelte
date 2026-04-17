<script lang="ts">
  import { LineChart } from "layerchart";
  import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
  import { scaleUtc } from "d3-scale";
  import { curveNatural } from "d3-shape";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as Card from "$lib/components/ui/card/index.js";

  interface DataPoint {
    date: Date;
    [key: string]: any;
  }

  interface Series {
    key: string;
    label: string;
    color: string;
  }

  interface Props {
    title: string;
    description?: string;
    data: DataPoint[];
    series: Series[];
    footerTitle?: string;
    footerDescription?: string;
    class?: string;
  }

  let {
    title,
    description,
    data,
    series,
    footerTitle,
    footerDescription,
    class: className
  }: Props = $props();

  // Gera a configuração do gráfico dinamicamente com base nas séries
  const chartConfig = $derived(
    series.reduce((acc, s) => {
      acc[s.key] = {
        label: s.label,
        color: s.color
      };
      return acc;
    }, {} as Chart.ChartConfig)
  );
</script>

<Card.Root class="flex flex-col {className}">
  <Card.Header>
    <Card.Title>{title}</Card.Title>
    {#if description}
      <Card.Description>{description}</Card.Description>
    {/if}
    <div class="legend">
      {#each series as s}
        <span class="legend-item">
          <span class="legend-dot" style="background:{s.color}"></span>
          {s.label}
        </span>
      {/each}
    </div>
  </Card.Header>
  <Card.Content class="flex-1">
    <Chart.Container config={chartConfig} class="min-h-[200px] w-full">
      <LineChart
        points={{ r: 4 }}
        {data}
        x="date"
        xScale={scaleUtc()}
        axis="x"
        series={series.map((s) => ({
          key: s.key,
          label: s.label,
          color: s.color
        }))}
        props={{
          spline: { curve: curveNatural, motion: "tween", strokeWidth: 2 },
          highlight: {
            points: {
              motion: "none",
              r: 6
            }
          },
          xAxis: {
            format: (v: Date) => v.toLocaleDateString("en-US", { month: "short" })
          }
        }}
      >
        {#snippet tooltip()}
          <Chart.Tooltip hideLabel />
        {/snippet}
      </LineChart>
    </Chart.Container>
  </Card.Content>
  {#if footerTitle || footerDescription}
    <Card.Footer class="flex-col items-start gap-2 text-sm">
      {#if footerTitle}
        <div class="flex items-center gap-2 leading-none font-medium">
          {footerTitle} <TrendingUpIcon class="size-4" />
        </div>
      {/if}
      {#if footerDescription}
        <div class="text-muted-foreground leading-none">
          {footerDescription}
        </div>
      {/if}
  </Card.Footer>
  {/if}
</Card.Root>

<style>
  .legend {
    display: flex;
    gap: 20px;
    margin-top: 8px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #444;
  }

  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 4px;
  }
</style>
