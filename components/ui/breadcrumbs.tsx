interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[#0E2536]/70">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-[#0E2536]">{item.label}</span>
              ) : (
                <a
                  href={item.href}
                  className="text-[#1F3C58] transition hover:text-[#4DA49B]"
                >
                  {item.label}
                </a>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export const buildBreadcrumbJsonLd = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: item.href,
  })),
});
