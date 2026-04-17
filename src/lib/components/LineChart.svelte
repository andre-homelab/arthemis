<script lang="ts">
  // Tipos
  interface DataPoint {
    label: string; // ex: "10/03"
    impacto: number;
    credito: number;
  }

  // Dados por período (simulados)
  const dataByPeriod: Record<string, DataPoint[]> = {
    '1M': [
      { label: '10/03', impacto: 0.50, credito: 0.50 },
      { label: '10/05', impacto: 0.60, credito: 0.75 },
      { label: '10/07', impacto: 0.75, credito: 1.10 },
      { label: '10/09', impacto: 0.90, credito: 1.50 },
      { label: '10/11', impacto: 1.05, credito: 1.90 },
      { label: '10/13', impacto: 1.20, credito: 2.20 },
      { label: '10/15', impacto: 1.40, credito: 2.40 },
      { label: '10/17', impacto: 1.55, credito: 2.50 },
      { label: '10/19', impacto: 1.50, credito: 2.10 },
      { label: '10/21', impacto: 1.60, credito: 1.50 },
      { label: '10/23', impacto: 1.65, credito: 0.80 },
      { label: '10/25', impacto: 1.70, credito: 0.55 },
      { label: '10/27', impacto: 1.85, credito: 0.50 },
      { label: '10/29', impacto: 2.10, credito: 0.55 },
      { label: '10/31', impacto: 2.30, credito: 0.60 },
    ],
    '1Y': [
      { label: 'Jan', impacto: 0.40, credito: 0.30 },
      { label: 'Fev', impacto: 0.55, credito: 0.50 },
      { label: 'Mar', impacto: 0.70, credito: 0.90 },
      { label: 'Abr', impacto: 0.90, credito: 1.40 },
      { label: 'Mai', impacto: 1.10, credito: 1.80 },
      { label: 'Jun', impacto: 1.30, credito: 2.10 },
      { label: 'Jul', impacto: 1.50, credito: 2.40 },
      { label: 'Ago', impacto: 1.70, credito: 1.80 },
      { label: 'Set', impacto: 1.90, credito: 1.20 },
      { label: 'Out', impacto: 2.10, credito: 0.70 },
      { label: 'Nov', impacto: 2.30, credito: 0.55 },
      { label: 'Dez', impacto: 2.50, credito: 0.60 },
    ],
    'All': [
      { label: '2021', impacto: 0.30, credito: 0.20 },
      { label: '2022', impacto: 0.80, credito: 0.90 },
      { label: '2023', impacto: 1.50, credito: 2.00 },
      { label: '2024', impacto: 2.30, credito: 0.60 },
    ],
  };

  // Estado reativo
  type Period = '1M' | '1Y' | 'All';
  let selectedPeriod = $state<Period>('1M');

  // $derived recalcula automaticamente quando selectedPeriod muda
  let data = $derived(dataByPeriod[selectedPeriod]);

  // Configurações do SVG
  const W = 560;      // largura do plot
  const H = 220;      // altura do plot
  const PAD = { top: 12, right: 20, bottom: 30, left: 40 };

  // Converte um valor de dado para coordenada Y no SVG
  // min=0.5, max=2.5 — invertemos porque Y cresce pra baixo no SVG
  function toY(value: number): number {
    const min = 0.5;
    const max = 2.5;
    return PAD.top + H - ((value - min) / (max - min)) * H;
  }

  // Converte um índice de ponto para coordenada X no SVG
  function toX(index: number, total: number): number {
    return PAD.left + (index / (total - 1)) * W;
  }

  // Gera a string de pontos para um <polyline>
  function buildPolyline(key: 'impacto' | 'credito'): string {
    return data
      .map((d, i) => `${toX(i, data.length)},${toY(d[key])}`)
      .join(' ');
  }

  // $derived que depende de `data` — recalcula quando data muda
  let impactoPoints = $derived(buildPolyline('impacto'));
  let creditoPoints = $derived(buildPolyline('credito'));

  // Linhas de grade horizontais (valores 0.5, 1, 1.5, 2, 2.5)
  const gridValues = [0.5, 1, 1.5, 2, 2.5];

  // ──────────────────────────────────────────
  // Tooltip — rastreia posição do mouse
  // ──────────────────────────────────────────
  let tooltipVisible = $state(false);
  let tooltipIndex  = $state(0);
  let tooltipX      = $state(0);
  let tooltipY      = $state(0);

  // Referência ao elemento SVG para calcular posição relativa
  let svgEl = $state<SVGSVGElement | null>(null);

  function handleMouseMove(event: MouseEvent): void {
    if (!svgEl) return;

    const rect = svgEl.getBoundingClientRect();
    const viewBoxWidth = W + PAD.left + PAD.right;
    
    // Converte a posição do mouse (pixels) para a escala do viewBox (0 a 620)
    const mouseX = ((event.clientX - rect.left) / rect.width) * viewBoxWidth;

    // Descobre qual ponto está mais próximo do mouse no eixo X
    let closest = 0;
    let minDist = Infinity;
    data.forEach((_, i) => {
      const px = toX(i, data.length);
      const dist = Math.abs(mouseX - px);
      if (dist < minDist) { minDist = dist; closest = i; }
    });

    tooltipIndex   = closest;
    tooltipX       = toX(closest, data.length);
    tooltipY       = toY(data[closest].impacto);
    tooltipVisible = true;
  }

  function handleMouseLeave(): void {
    tooltipVisible = false;
  }
</script>

<div class="chart-wrapper">
  <!-- Legenda + filtro de período -->
  <div class="chart-header">
    <div class="legend">
      <span class="legend-dot impacto"></span> Impacto
      <span class="legend-dot credito"></span> Créditos
    </div>

    <!-- Botões de filtro — class:active usa Svelte class directive -->
    <div class="period-btns">
      {#each (['1M', '1Y', 'All'] as Period[]) as p}
        <button
          class="period-btn"
          class:active={selectedPeriod === p}
          onclick={() => selectedPeriod = p}
        >
          {p}
        </button>
      {/each}
    </div>
  </div>

  <!-- SVG do gráfico -->
  <!-- bind:this captura referência ao elemento DOM -->
  <svg
    viewBox="0 0 {W + PAD.left + PAD.right} {H + PAD.top + PAD.bottom}"
    bind:this={svgEl}
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    class="chart-svg"
  >
    <!-- Linhas de grade -->
    {#each gridValues as val}
      {@const y = toY(val)}
      <line
        x1={PAD.left} y1={y}
        x2={W + PAD.left} y2={y}
        stroke="#e5e5e5" stroke-width="1"
      />
      <!-- Label do eixo Y -->
      <text x={PAD.left - 6} y={y + 4} text-anchor="end" font-size="10" fill="#aaa">
        {val}
      </text>
    {/each}

    <!-- Linha de Impacto (verde) -->
    <polyline
      points={impactoPoints}
      fill="none"
      stroke="#22c55e"
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"
    />

    <!-- Linha de Crédito (laranja) -->
    <polyline
      points={creditoPoints}
      fill="none"
      stroke="#f97316"
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"
    />

    <!-- Labels do eixo X -->
    {#each data as d, i}
      {#if i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1}
        <text
          x={toX(i, data.length)}
          y={PAD.top + H + 20}
          text-anchor="middle"
          font-size="10"
          fill="#aaa"
        >
          {d.label}
        </text>
      {/if}
    {/each}

    <!-- Tooltip — só renderiza quando visível -->
    {#if tooltipVisible}
      {@const boxW = 120}
      {@const boxH = 64}
      {@const offX = tooltipX + boxW + 20 > W + PAD.left + PAD.right ? -(boxW + 8) : 8}

      <!-- Linha vertical no ponto -->
      <line
        x1={tooltipX} y1={PAD.top}
        x2={tooltipX} y2={PAD.top + H}
        stroke="#bbb" stroke-width="1" stroke-dasharray="3 2"
      />

      <!-- Ponto circulares nos dois valores -->
      <circle cx={tooltipX} cy={toY(data[tooltipIndex].impacto)} r="4" fill="#22c55e"/>
      <circle cx={tooltipX} cy={toY(data[tooltipIndex].credito)} r="4" fill="#f97316"/>

      <!-- Caixa do tooltip -->
      <rect
        x={tooltipX + offX} y={PAD.top + 4}
        width={boxW} height={boxH}
        rx="6" fill="white"
        stroke="#e0e0e0" stroke-width="1"
        filter="url(#shadow)"
      />
      <text x={tooltipX + offX + 8} y={PAD.top + 20} font-size="11" fill="#555">
        Impacto: {data[tooltipIndex].impacto}
      </text>
      <text x={tooltipX + offX + 8} y={PAD.top + 36} font-size="11" fill="#555">
        Créditos: {data[tooltipIndex].credito}
      </text>
      <text x={tooltipX + offX + 8} y={PAD.top + 52} font-size="11" fill="#555">
        Data: {data[tooltipIndex].label}
      </text>

      <!-- Seta de tendência no tooltip -->
      <text x={tooltipX + offX + 104} y={PAD.top + 20} font-size="10" fill="#22c55e">↑</text>

      <!-- Filtro de sombra para o tooltip -->
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.1"/>
        </filter>
      </defs>
    {/if}
  </svg>
</div>

<style>
  .chart-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .legend {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #555;
  }

  .legend-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .legend-dot.impacto { background: #22c55e; }
  .legend-dot.credito { background: #f97316; }

  .period-btns {
    display: flex;
    gap: 2px;
    background: #f1f1ec;
    border-radius: 8px;
    padding: 3px;
  }

  .period-btn {
    padding: 4px 12px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    background: transparent;
    color: #777;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }

  .period-btn:hover { color: #333; }

  .period-btn.active {
    background: white;
    color: #1a1a1a;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .chart-svg {
    width: 100%;
    overflow: visible;
    cursor: crosshair;
  }
</style>
