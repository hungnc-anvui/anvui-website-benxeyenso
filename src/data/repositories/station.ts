import {
  aboutHighlights,
  policySections,
  serviceDepartments,
  stationAreas,
  stationContact,
} from "@/data/mock/station";

export type { InfoItem, StationArea } from "@/data/mock/station";

export function getAboutHighlights() {
  return aboutHighlights;
}

export function getStationAreas() {
  return stationAreas;
}

export function getServiceDepartments() {
  return serviceDepartments;
}

export function getPolicySections() {
  return policySections;
}

export function getStationContact() {
  return stationContact;
}
