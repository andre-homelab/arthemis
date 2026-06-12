<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import type { MetricCardProps } from '$lib/components/ui/card/types';

  let { label, value, change, period, positive }: MetricCardProps = $props();
</script>

<!-- Usando Card do shadcn -->
<Card.Root class="metric-card">
  <Card.Content class="metric-content">
    <div class="metric-header">
      <span class="metric-label">{label}:</span>
      <!-- Seta de tendência ao lado do label -->
      <span class="trend-arrow" class:up={positive} class:down={!positive}>
        {#if positive}
          <!-- Seta pra cima -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        {:else}
          <!-- Seta pra baixo -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M7 7l10 10M17 7v10H7"/>
          </svg>
        {/if}
      </span>
    </div>

    <!-- Valor principal em destaque -->
    <div class="metric-value">{value}</div>

    <!-- Variação percentual com cor condicional -->
    <div class="metric-change" class:positive class:negative={!positive}>
      {change} {period}
    </div>
  </Card.Content>
</Card.Root>

<style>
  /* :global() permite estilizar elementos de componentes externos como o shadcn */
  :global(.metric-card) {
    min-width: 180px;
    border-radius: var(--radius-lg) !important;
    border: 1px solid var(--border) !important;
    background-color: var(--card) !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  :global(.metric-card:hover) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
    border-color: var(--primary) / 20% !important;
  }

  :global(.metric-content) {
    padding: 1.25rem !important;
  }

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .metric-label {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    font-weight: 500;
  }

  .trend-arrow.up  { color: var(--success); }
  .trend-arrow.down { color: var(--error); }

  .metric-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 0.25rem;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  .metric-change {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .metric-change.positive  { color: var(--success); }
  .metric-change.negative  { color: var(--error); }
</style>
