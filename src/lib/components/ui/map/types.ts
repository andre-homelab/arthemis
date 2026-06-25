import type { Indicator, Location } from "$lib/types";

export interface ChartDataPoint {
  date: Date;
  [key: string]: number | Date;
};

export interface MapIndicator extends Indicator {
  color: string;
}

export interface ObservationMapProps {
    locations: Location[];
    indicators?: MapIndicator[];
  }
