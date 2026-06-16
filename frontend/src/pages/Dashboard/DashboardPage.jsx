import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";

const stats = [
  { title: "Applications", value: 0 },
  { title: "Interviews", value: 0 },
  { title: "Offers", value: 0 },
  { title: "AI Analyses", value: 0 },
];

const DashboardPage = () => {
  return (
    <section>
      <PageHeader
        title="Dashboard"
        description="Track job applications, interviews, offers, and AI resume analyses."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>
    </section>
  );
};

export default DashboardPage;
