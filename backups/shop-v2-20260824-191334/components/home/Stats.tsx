const stats = [
  ['10k+', 'Appareils réparés'],
  ['2k+', 'Techniciens'],
  ['25+', 'Pays'],
  ['4.9/5', 'Satisfaction'],
];

export default function Stats() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4 lg:px-8">
        {stats.map(([value, label]) => (
          <div key={label}>
            <div className="text-3xl font-bold text-slate-950">{value}</div>
            <div className="mt-1 text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
