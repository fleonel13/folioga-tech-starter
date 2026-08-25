export default function Badge({
  children,
  type = "blue",
}: {
  children: React.ReactNode;
  type?: "green" | "blue" | "gray";
}) {
  return (
    <span className={`badge badge-${type}`}>
      {children}
    </span>
  );
}
