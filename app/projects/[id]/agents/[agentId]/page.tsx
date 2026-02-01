import IndividualAgentPage from "@/components/kokonutui/individual-agent-page";

export default async function AgentDetail({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  return <IndividualAgentPage agentId={agentId} />;
}
