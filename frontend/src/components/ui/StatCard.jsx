import Card from "./Card";

const StatCard = ({ title, value }) => {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-4 text-4xl font-semibold text-slate-950">{value}</p>
    </Card>
  );
};

export default StatCard;
