<script lang="ts">
  import * as Card from '$lib/components/ui/card';

  // Props tipadas com interface
  interface Props {
    label: string;
    value: string;
    change: string;
    period: string;
    positive: boolean; // true = seta verde pra cima, false = seta vermelha pra baixo
  }

  let { label, value, change, period, positive }: Props = $props();
</script>

<!-- Usando Card do shadcn -->
<Card.Root class="metric-card">
  <Card.Content class="metric-content">
    <span class="metric-label">{label}:</span>

    <!-- Seta de tendência ao lado do label -->
    <span class="trend-arrow" class:up={positive} class:down={!positive}>
      {#if positive}
        <!-- Seta pra cima -->
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l8 8H4z"/>
        </svg>
      {:else}
        <!-- Seta pra baixo -->
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l-8-8h16z"/>
        </svg>
      {/if}
    </span>

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
    min-width: 160px;
    border-radius: 12px !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06) !important;
  }

  :global(.metric-content) {
    padding: 16px 20px !important;
  }

  .metric-label {
    font-size: 13px;
    color: #555;
    font-weight: 500;
    display: inline;
  }

  .trend-arrow {
    display: inline-flex;
    margin-left: 4px;
    vertical-align: middle;
  }

  .trend-arrow.up  { color: #22c55e; }
  .trend-arrow.down { color: #ef4444; }

  .metric-value {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 4px 0;
    letter-spacing: -0.5px;
  }

  .metric-change {
    font-size: 12px;
    font-weight: 500;
  }

  .metric-change.positive  { color: #22c55e; }
  .metric-change.negative  { color: #ef4444; }
</style>
