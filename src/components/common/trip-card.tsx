import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { AMENITY_LABELS } from "@/lib/amenities";
import { addMinutesToTime, formatVnd } from "@/lib/format";
import type { Amenity, ImageAsset, Trip } from "@/types/domain";

const CARD_AMENITY_ORDER: Amenity[] = ["wifi", "water", "aircon", "usb", "blanket", "toilet"];

/**
 * Figma "YS/TripCard" (3:105 desktop / 3:140 mobile).
 * Desktop: photo 200×160 · info · price column (384). Mobile: stacked.
 */
export function TripCard({
  trip,
  operatorName,
  destinationLabel,
  image,
  seatsLeft,
  detailsHref,
  bookHref,
  preload = false,
}: {
  trip: Trip;
  operatorName: string;
  destinationLabel: string;
  image: ImageAsset;
  seatsLeft: number;
  detailsHref: string;
  bookHref: string;
  /** Preload the photo of the first card (LCP on the results page). */
  preload?: boolean;
}) {
  const arrive = addMinutesToTime(trip.departTime, trip.durationMinutes);
  // Figma shows the vehicle type + three key amenities ("Giường nằm · Wi-Fi · Nước uống · Điều hòa").
  const keyAmenities = CARD_AMENITY_ORDER.filter((a) => trip.amenities.includes(a)).slice(0, 3);
  const amenities = [trip.vehicleType, ...keyAmenities.map((a) => AMENITY_LABELS[a])].join(" · ");
  const soldOut = seatsLeft <= 0;
  return (
    <article className="flex flex-col gap-6 rounded-lg bg-white p-6 lg:flex-row">
      <div className="relative h-[148px] w-full shrink-0 overflow-hidden rounded-md lg:h-40 lg:w-[200px]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          preload={preload}
          sizes="(min-width: 1024px) 200px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <h3 className="text-title font-semibold text-navy">{operatorName}</h3>
        <p className="text-h3 font-bold text-navy">
          {trip.departTime} <span aria-hidden="true">→</span>
          <span className="sr-only">đến</span> {arrive}
        </p>
        <p className="text-sm font-semibold text-ink">
          {trip.pickupPoint} <span aria-hidden="true">&nbsp;→&nbsp;</span>
          <span className="sr-only">đến</span> {destinationLabel}
        </p>
        <p className="text-sm text-muted">{amenities}</p>
        <Link href={detailsHref} className={buttonClass("ghost", "w-full lg:w-[300px]")}>
          Xem tiện ích & lộ trình
          <span className="sr-only">
            : {operatorName} {trip.departTime}
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-3 lg:w-[384px] lg:shrink-0">
        <p className="text-xs font-medium text-green">
          {soldOut ? "Hết chỗ" : `Còn ${seatsLeft} chỗ`} · Ưu đãi chuyến
        </p>
        <p className="text-sm text-muted">
          <span className="sr-only">Giá niêm yết </span>
          <s>{formatVnd(trip.listPrice)}</s>
        </p>
        <p className="text-price font-semibold text-primary">
          <span className="sr-only">Giá ưu đãi </span>
          {formatVnd(trip.price)}
        </p>
        {soldOut ? (
          <button type="button" disabled className={buttonClass("primary", "w-full")}>
            Hết chỗ
          </button>
        ) : (
          <Link href={bookHref} className={buttonClass("primary", "w-full")}>
            Đặt chỗ
            <span className="sr-only">
              : {operatorName} {trip.departTime}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}
