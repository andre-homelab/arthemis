export interface Activity {
  id: string;
  name: string;
  indicators: Indicator[];
}

export interface Indicator {
  id: string;
  name: string;
  unit: string;
  observations: Observation[];
}

export interface Observation {
  id: string;
  date: string;
  value: number;
  position: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface ObservationMapProps {
    projectLocation: ProjectLocation;
    selectedActivity?: Activity;
  }

export interface Project {
  id: string;
  name: string;
  lifetime_start: string;
  lifetime_end: string;
  location: ProjectLocation;
  activities: Activity[];
}

export interface ProjectLocation {
  id: string,
  ecosystem: string,
  extent_ha: number,
  country: string,
  position: {
    type: "Polygon";
    coordinates: number[][][]; // Default GeoJSON
  };
}
