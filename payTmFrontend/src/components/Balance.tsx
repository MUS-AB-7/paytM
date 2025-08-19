
type BalanceProps = {
  label: number | string; 
};

export function Balance({ label }: BalanceProps) {
  return (
    <div className="flex">
      <div className="font-bold text-lg">Your balance</div>
      <div className="font-semibold ml-4 text-lg">Rs {label}</div>
    </div>
  );
}
