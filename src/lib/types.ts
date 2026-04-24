import type { Component } from 'svelte';

// Tipos para Gráfico de Linhas
export interface LineChartDataPoint {
	date: Date;
}

export interface LineChartSeries {
	key: string;
	label: string;
	color: string;
}

export interface LineChartProps {
	title: string;
	description?: string;
	data: LineChartDataPoint[];
	series: LineChartSeries[];
	footerTitle?: string;
	footerDescription?: string;
	selectedPeriod?: string;
	periodOptions?: readonly string[];
	onPeriodChange?: (period: string) => void;
	class?: string;
}

// Tipos para Cartão de Métrica
export interface MetricCardProps {
	label: string;
	value: string;
	change: string;
	period: string;
	positive: boolean;
}

// Tipos para Gráfico de Pizza
export interface PieChartSlice {
	label: string;
	value: number;
	color: string;
}

export interface PieChartProps {
	title: string;
	description?: string;
	slices: PieChartSlice[];
	footerTitle?: string;
	footerDescription?: string;
}

// Tipos para Barra Lateral
export interface SidebarItem {
	title: string;
	url: string;
	icon: Component;
}

export interface SidebarProps {
	groupLabel?: string;
	items?: SidebarItem[];
}

// Tipos para Dados
export interface DataPoint {
    date: Date;
    impacto: number;
    credito: number;
  }
