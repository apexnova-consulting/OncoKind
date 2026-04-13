import crypto from 'crypto';

type ActiveArtifact = {
  id: string;
  kind: string;
  createdAt: number;
};

const artifacts = new Map<string, ActiveArtifact>();

export function trackTemporaryArtifact(kind: string) {
  const id = crypto.randomUUID();
  artifacts.set(id, {
    id,
    kind,
    createdAt: Date.now(),
  });

  return function releaseTemporaryArtifact() {
    artifacts.delete(id);
  };
}

export function getZeroRetentionSnapshot() {
  return {
    activeTempArtifacts: artifacts.size,
    artifacts: Array.from(artifacts.values()).map((artifact) => ({
      kind: artifact.kind,
      ageMs: Date.now() - artifact.createdAt,
    })),
  };
}
