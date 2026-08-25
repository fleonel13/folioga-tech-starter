import TechnicianCard, { Technician } from "./TechnicianCard";

export default function TechnicianGrid({
  technicians,
  locale,
}: {
  technicians: Technician[];
  locale: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {technicians.map((technician) => (
        <TechnicianCard
          key={technician.id}
          technician={technician}
          locale={locale}
        />
      ))}
    </div>
  );
}
