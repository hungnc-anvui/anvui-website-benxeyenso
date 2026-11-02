import type { IconName } from "@/components/ui/icon";
import type { Amenity } from "@/types/domain";

export const AMENITY_LABELS: Record<Amenity, string> = {
  wifi: "Wi-Fi",
  water: "Nước uống",
  usb: "Cổng sạc",
  aircon: "Điều hòa",
  blanket: "Chăn gối",
  toilet: "Nhà vệ sinh",
};

export const AMENITY_ICONS: Record<Amenity, IconName> = {
  wifi: "wifi",
  water: "water",
  usb: "usb",
  aircon: "shield",
  blanket: "bag",
  toilet: "check",
};
