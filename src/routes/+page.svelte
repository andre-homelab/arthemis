<script lang="ts">
  import Sidebar    from '$lib/components/Sidebar.svelte';
  import MetricCard from '$lib/components/MetricCard.svelte';
  import LineChart  from '$lib/components/LineChart.svelte';
  import PieChart   from '$lib/components/PieChart.svelte';
  import * as Card  from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';

  // Dados das métricas — tipagem inline (ou
  // poderia estar em src/lib/types.ts)
  interface Metric {
    label:    string;
    value:    string;
    change:   string;
    period:   string;
    positive: boolean;
  }

  const metrics: Metric[] = [
    {
      label:    'Impacto Total',
      value:    '7.2',
      change:   '+2%',
      period:   'no último mês',
      positive: true,
    },
    {
      label:    'Crédito Total',
      value:    '1.328',
      change:   '-7%',
      period:   'no último mês',
      positive: false,
    },
    {
      label:    'Projetos Ativos',
      value:    '11',
      change:   '+5',
      period:   'no último ano',
      positive: true,
    },
  ];

  // Dados do gráfico de pizza
  const projectSlices = [
    { label: 'Ativos',      value: 72, color: '#3b5bdb' },
    { label: 'Finalizados', value: 28, color: '#7950f2' },
  ];
</script>

<div class="layout">
  <!-- Sidebar de navegação -->
  <Sidebar />

  <!-- Conteúdo principal -->
  <main class="main">

    <!-- Barra superior com ações -->
    <header class="topbar">
      <div class="topbar-actions">
        <!-- Button do shadcn-svelte -->
        <Button variant="ghost" size="sm">Adicionar</Button> <!-- — variant="ghost" = botão sem fundo -->
        <Button variant="ghost" size="sm">Ordenar</Button>
      </div>
    </header>

    <!-- Área de conteúdo -->
    <div class="content">

      <!-- Cards de métricas -->
      <!-- {#each} itera o array — (m.label) é a chave para o Svelte rastrear -->
      <div class="metrics-row">
        {#each metrics as m (m.label)} <!-- each faz a iteração -->
          <MetricCard
            label={m.label}
            value={m.value}
            change={m.change}
            period={m.period}
            positive={m.positive}
          />
        {/each}
      </div>

      <!-- Linha de gráficos -->
      <div class="charts-row">

        <!-- Gráfico de linhas -->
        <Card.Root class="line-card">
          <Card.Content class="line-content">
            <LineChart />
          </Card.Content>
        </Card.Root>

        <!-- Gráfico de pizza -->
        <Card.Root class="pie-card">
          <Card.Content class="pie-content">
            <PieChart title="Projetos" slices={projectSlices} />
          </Card.Content>
        </Card.Root>

      </div>
    </div>
  </main>
</div>

<style>
  /* Layout principal em flex — sidebar + conteúdo */
  .layout {
    display: flex;
    min-height: 100vh;
    background: #f1f1ec;
    font-family: inherit;
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; /* evita overflow em flex */
  }

  .topbar {
    display: flex;
    justify-content: flex-end;
    padding: 12px 24px;
  }

  .topbar-actions {
    display: flex;
    gap: 8px;
  }

  .content {
    padding: 8px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Cards de métricas lado a lado */
  .metrics-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  /* Linha dos gráficos */
  .charts-row {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  /* Card do gráfico de linhas — ocupa o espaço restante */
  :global(.line-card) {
    flex: 1;
    border-radius: 12px !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06) !important;
  }

  :global(.line-content) {
    padding: 20px !important;
  }

  /* Card do gráfico de pizza — largura fixa */
  :global(.pie-card) {
    width: 340px;
    flex-shrink: 0;
    border-radius: 12px !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06) !important;
  }

  :global(.pie-content) {
    padding: 20px !important;
  }
</style>
