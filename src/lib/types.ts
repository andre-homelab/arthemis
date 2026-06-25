import type { Geometry } from "geojson";

export interface Activity {
  id: string;
  name: string;
  description: string;
  justification: string;
  activity_locations: Location[];
  indicators: Indicator[];
}

export interface Indicator {
  id: string;
  name: string;
  unit: string;
  value_baseline: number;
  value_reference: number;
  observation_method: string;
  justification: string;
  observations: Observation[];
}

export interface Location {
  id: string;
  ecosystem: string;
  extent_ha: number;
  country: string;
  position: Geometry;
}

export interface Observation {
  id: string;
  date: string;
  value: number;
  position: Geometry;
}

export interface Project {
  id: string;
  name: string;
  lifetime_start: string;
  lifetime_end: string;
  justification: string;
  locations: Location[];
  project_sdgs: Sdg[];
  project_proponents: ProjectProponent[];
  activities: Activity[];
}

export interface ProjectProponent {
  id: string;
  project_id: string;
  proponent_id: string;
  role: string;
}

export interface Sdg {
  id: string;
  name: string;
  number: number;
  icon_url: string;
}

export interface Proponent {
    id: string;
    name: string;
    email: string
}
