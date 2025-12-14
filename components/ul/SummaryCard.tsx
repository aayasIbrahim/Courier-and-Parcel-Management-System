
/* -------------------- Small Component -------------------- */

export default function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`${color} text-black rounded-lg p-4 flex flex-col items-center justify-center`}
    >
      <span className="text-sm opacity-90">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
