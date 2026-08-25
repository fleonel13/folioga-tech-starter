export default function ShopTrustBar() {
  const items = [
    ['🚚', 'Livraison rapide', 'Expédition suivie'],
    ['🔒', 'Paiement sécurisé', 'Transactions protégées'],
    ['♻️', 'Reconditionné', 'Testé et contrôlé'],
    ['🛡️', 'Garantie', 'Produits sélectionnés']
  ];

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([icon, title, text]) => (
        <div key={title} className="bg-white p-5">
          <div className="text-2xl">{icon}</div>
          <div className="mt-2 font-bold text-slate-900">{title}</div>
          <div className="mt-1 text-xs text-slate-500">{text}</div>
        </div>
      ))}
    </div>
  );
}
