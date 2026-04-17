<script lang="ts">
  // Tipos
  interface Slice {
    label: string;
    value: number;
    color: string;
  }

  interface Props {
    title: string;
    slices: Slice[];
  }

  let { title, slices }: Props = $props();

  // Helpers de geometria SVG
  const CX = 110; // centro X
  const CY = 110; // centro Y
  const R  = 90;  // raio

  // Converte ângulo (radianos) para ponto na circunferência
  function toPoint(angle: number, radius = R): [number, number] {
    return [
      CX + radius * Math.cos(angle),
      CY + radius * Math.sin(angle),
    ];
  }

  // Gera o atributo `d` de um caminho SVG para um slice de pizza
  function slicePath(startAngle: number, endAngle: number): string {
    const [x1, y1] = toPoint(startAngle);
    const [x2, y2] = toPoint(endAngle);
    // largeArcFlag = 1 se o slice for maior que 180°
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return [
      `M ${CX} ${CY}`,
      `L ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      `A ${R} ${R} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      'Z',
    ].join(' ');
  }

  // Calcula os caminhos SVG de cada slice
  // $derived garante recálculo quando `slices` muda
  let paths = $derived(() => {
    const total = slices.reduce((sum, s) => sum + s.value, 0);
    let angle = -Math.PI / 2; // começa pelo topo (12h)

    return slices.map((slice) => {
      const sweep    = (slice.value / total) * 2 * Math.PI;
      const path     = slicePath(angle, angle + sweep);
      const pct      = Math.round((slice.value / total) * 100);
      const midAngle = angle + sweep / 2;

      // Posição do texto percentual (60% do raio)
      const [lx, ly] = toPoint(midAngle, R * 0.6);

      angle += sweep;
      return { ...slice, path, pct, lx, ly };
    });
  });
</script>

<div class="pie-wrapper">
  <h3 class="pie-title">{title}</h3>

  <!-- Legenda -->
  <div class="legend">
    {#each slices as slice}
      <span class="legend-item">
        <span class="legend-dot" style="background:{slice.color}"></span>
        {slice.label}
      </span>
    {/each}
  </div>

  <!-- SVG do gráfico de pizza -->
  <svg viewBox="0 0 220 220" class="pie-svg">
    {#each paths() as slice}
      <!-- Cada slice é um <path> com o caminho calculado -->
      <path
        d={slice.path}
        fill={slice.color}
        stroke="white"
        stroke-width="2"
      />

      <!-- Percentual centralizado no slice -->
      <text
        x={slice.lx}
        y={slice.ly + 5}
        text-anchor="middle"
        font-size="14"
        font-weight="600"
        fill="white"
      >
        {slice.pct}%
      </text>
    {/each}
  </svg>
</div>

<style>
  .pie-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .pie-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }

  .legend {
    display: flex;
    gap: 16px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #555;
  }

  .legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .pie-svg {
    width: 100%;
    height: auto;
    max-width: 300px; /* Limite para não estourar em telas gigantes */
  }
</style>
