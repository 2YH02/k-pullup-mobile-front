import MarkerDetail from "@/app/layout/marker-detail";

const PullupPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <MarkerDetail markerId={~~id} slideType="none" />;
};

export default PullupPage;
