import "server-only";

/**
 * Reachability + configuration snapshot for the connection panel.
 *
 * Server-side by necessity: the browser has no route to the agent process (and
 * should not have one), so a client-side probe would report a failure even on a
 * correctly configured install.
 *
 * `/health` is the endpoint every LlamaIndex doc sample defines, returning
 * `{"status": "healthy", "agent": "llamaindex"}`. This repo keeps that body
 * unchanged, so the only thing worth reading off it is that the process is up.
 */

export interface HealthReport {
  agent: { ok: boolean; detail: string };
  agentUrl: string;
  licenseKeySet: boolean;
}

export const AGENT_URL =
  process.env.LLAMAINDEX_AGENT_URL ?? "http://localhost:8000";

export async function getHealth(): Promise<HealthReport> {
  const statusUrl = `${AGENT_URL}/health`;

  let agent: HealthReport["agent"];

  try {
    const res = await fetch(statusUrl, {
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (res.ok) {
      const body = (await res.json()) as { status?: string; agent?: string };
      agent = {
        ok: true,
        detail: `200 from ${statusUrl} — status "${body.status}", agent "${body.agent}"`,
      };
    } else {
      agent = { ok: false, detail: `${statusUrl} returned ${res.status}` };
    }
  } catch (error) {
    agent = {
      ok: false,
      detail:
        error instanceof Error
          ? `${statusUrl} unreachable — ${error.message}`
          : `${statusUrl} unreachable`,
    };
  }

  return {
    agent,
    agentUrl: AGENT_URL,
    licenseKeySet: Boolean(process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY),
  };
}
