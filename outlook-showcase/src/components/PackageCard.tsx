interface PackageCardProps {
  name: string;
  description: string;
  installCommand: string;
  icon: React.ReactNode;
  features: string[];
  href: string;
}

export function PackageCard({ name, description, installCommand, icon, features, href }: PackageCardProps) {
  return (
    <div className="group relative bg-(--surface-elevated) rounded-3xl p-8 hover-lift border border-(--border)">
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-(--accent) to-blue-600 flex items-center justify-center text-white">
          {icon}
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-(--muted) hover:text-(--foreground) transition-colors"
          aria-label={`View ${name} on npm`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-(--muted) mb-6 leading-relaxed">{description}</p>

      <div className="mb-6">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-(--surface) rounded-xl font-mono text-sm">
          <span className="text-(--muted)">$</span>
          <code className="flex-1 truncate">{installCommand}</code>
        </div>
      </div>

      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-(--muted)">
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
