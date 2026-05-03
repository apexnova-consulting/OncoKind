import { initialsForName } from '@/lib/community';

const avatarTones = [
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
];

export function CommunityAvatar({ name }: { name: string }) {
  const tone = avatarTones[name.length % avatarTones.length];

  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${tone}`}>
      {initialsForName(name)}
    </div>
  );
}
