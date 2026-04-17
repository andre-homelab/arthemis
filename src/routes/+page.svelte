<script lang="ts">
	import MetricCard from '$lib/components/MetricCard.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import PieChart from '$lib/components/PieChart.svelte';

	import { Button } from '$lib/components/ui/button';

	// Tipos
  interface DataPoint {
    date: Date;
    impacto: number;
    credito: number;
  }

  // Dados por período (simulados)
  const dataByPeriod: Record<string, DataPoint[]> = {
    '1M': [
      { date: new Date('2024-03-10'), impacto: 0.50, credito: 0.50 },
      { date: new Date('2024-03-12'), impacto: 0.60, credito: 0.75 },
      { date: new Date('2024-03-14'), impacto: 0.75, credito: 1.10 },
      { date: new Date('2024-03-16'), impacto: 0.90, credito: 1.50 },
      { date: new Date('2024-03-18'), impacto: 1.05, credito: 1.90 },
      { date: new Date('2024-03-20'), impacto: 1.20, credito: 2.20 },
      { date: new Date('2024-03-22'), impacto: 1.40, credito: 2.40 },
      { date: new Date('2024-03-24'), impacto: 1.55, credito: 2.50 },
      { date: new Date('2024-03-26'), impacto: 1.50, credito: 2.10 },
      { date: new Date('2024-03-28'), impacto: 1.60, credito: 1.50 },
      { date: new Date('2024-03-30'), impacto: 1.65, credito: 0.80 },
      { date: new Date('2024-04-01'), impacto: 1.70, credito: 0.55 },
      { date: new Date('2024-04-03'), impacto: 1.85, credito: 0.50 },
      { date: new Date('2024-04-05'), impacto: 2.10, credito: 0.55 },
      { date: new Date('2024-04-07'), impacto: 2.30, credito: 0.60 },
    ],
    '1Y': [
      { date: new Date('2023-01-01'), impacto: 0.40, credito: 0.30 },
      { date: new Date('2023-02-01'), impacto: 0.55, credito: 0.50 },
      { date: new Date('2023-03-01'), impacto: 0.70, credito: 0.90 },
      { date: new Date('2023-04-01'), impacto: 0.90, credito: 1.40 },
      { date: new Date('2023-05-01'), impacto: 1.10, credito: 1.80 },
      { date: new Date('2023-06-01'), impacto: 1.30, credito: 2.10 },
      { date: new Date('2023-07-01'), impacto: 1.50, credito: 2.40 },
      { date: new Date('2023-08-01'), impacto: 1.70, credito: 1.80 },
      { date: new Date('2023-09-01'), impacto: 1.90, credito: 1.20 },
      { date: new Date('2023-10-01'), impacto: 2.10, credito: 0.70 },
      { date: new Date('2023-11-01'), impacto: 2.30, credito: 0.55 },
      { date: new Date('2023-12-01'), impacto: 2.50, credito: 0.60 },
    ],
    'All': [
      { date: new Date('2021-01-01'), impacto: 0.30, credito: 0.20 },
      { date: new Date('2022-01-01'), impacto: 0.80, credito: 0.90 },
      { date: new Date('2023-01-01'), impacto: 1.50, credito: 2.00 },
      { date: new Date('2024-01-01'), impacto: 2.30, credito: 0.60 },
    ],
  };

  // Estado reativo
  type Period = '1M' | '1Y' | 'All';
  let selectedPeriod = $state<Period>('1M');

  // $derived recalcula automaticamente quando selectedPeriod muda
  let data = $derived(dataByPeriod[selectedPeriod]);
	
	// Dados das métricas
	interface Metric {
		label: string;
		value: string;
		change: string;
		period: string;
		positive: boolean;
	}

	const metrics: Metric[] = [
		{
			label: 'Impacto Total',
			value: '7.2',
			change: '+2%',
			period: 'no último mês',
			positive: true
		},
		{
			label: 'Crédito Total',
			value: '1.328',
			change: '-7%',
			period: 'no último mês',
			positive: false
		},
		{
			label: 'Projetos Ativos',
			value: '11',
			change: '+5',
			period: 'no último ano',
			positive: true
		}
	];

	const projectSlices = [
		{ label: 'Ativos', value: 72, color: '#2563eb' },
		{ label: 'Finalizados', value: 28, color: '#a855f7' }
	];

  const series = [
    { key: 'impacto', label: 'Impacto', color: '#2563eb' },
    { key: 'credito', label: 'Crédito', color: '#a855f7' }
  ];
</script>

<!-- Conteúdo principal -->
<div class="main-container">
	<!-- Barra superior com ações -->
	<header class="topbar">
		<div class="topbar-actions">
      <div class="period-selector flex gap-1 mr-4">
        {#each ['1M', '1Y', 'All'] as period}
          <Button 
            variant={selectedPeriod === period ? 'default' : 'secondary'} 
            size="sm" 
            onclick={() => selectedPeriod = period as Period}
          >
            {period}
          </Button>
        {/each}
      </div>
			<Button variant="secondary" size="sm" class="action-btn">Adicionar</Button>
			<Button variant="secondary" size="sm" class="action-btn">Ordenar</Button>
		</div>
	</header>

	<!-- Área de conteúdo -->
	<div class="content-area">
		<!-- Cards de métricas -->
		<div class="metrics-grid">
			{#each metrics as m (m.label)}
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
		<div class="charts-grid">
			<!-- Gráfico de linhas integrado -->
			<LineChart
        title="Impacto vs Crédito"
        description="Evolução do impacto e crédito ao longo do tempo"
        {data}
        {series}
        footerTitle="Crescimento constante detectado"
        footerDescription="Dados atualizados para o período {selectedPeriod}"
        class="line-card"
      />

			<!-- Gráfico de pizza -->
			<div class="pie-card">
				<PieChart title="Projetos" slices={projectSlices}/>
			</div>
		</div>
	</div>
</div>

<style>
	.main-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		min-width: 0;
	}

	.topbar {
		display: flex;
		justify-content: flex-end;
		padding: 20px 32px 10px;
	}

	.topbar-actions {
		display: flex;
		gap: 12px;
    align-items: center;
	}

	:global(.action-btn) {
		background-color: #e5e7eb !important;
		color: #111 !important;
		font-weight: 500 !important;
		border-radius: 6px !important;
		border: none !important;
	}

	.content-area {
		flex: 1;
		padding: 10px 32px 32px;
		display: flex;
		flex-direction: column;
		gap: 24px;
		width: 100%;
	}

	/* Cards de métricas */
	.metrics-grid {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
		width: 100%;
	}

	/* Linha dos gráficos */
	.charts-grid {
		display: flex;
		gap: 20px;
		align-items: stretch;
		flex-wrap: wrap;
		width: 100%;
	}

	/* Card do gráfico de linhas */
	:global(.line-card) {
		flex: 2 1 400px;
		min-width: 0;
		border-radius: 12px !important;
		border: 2px solid #3b82f6 !important;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
	}

	/* Card do gráfico de pizza */
	:global(.pie-card) {
		flex: 1 1 100px;
		min-width: 0;
		border-radius: 12px !important;
		border: none !important;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
	}

	@media (max-width: 1024px) {
		:global(.pie-card), :global(.line-card) {
			flex: 1 1 100%;
		}
	}
</style>
