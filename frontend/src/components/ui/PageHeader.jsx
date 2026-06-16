const PageHeader = ({ title, description, action }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
};

export default PageHeader;
