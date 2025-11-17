import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BottomCTA from "@/components/BottomCTA";
import { inventoryCategories } from "@/data/inventory-categories";

export default function InventoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-ink dark:text-zinc-50 mb-4">Property Inventory</h1>
        <p className="text-lg text-ink/70 dark:text-zinc-400 mb-12">
          Browse replacement property types available nationwide for your 1031 exchange.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventoryCategories.map((category) => (
            <Link
              key={category.slug}
              href={category.route}
              className="overflow-hidden bg-panel border border-outline rounded-lg hover:shadow-lg transition-shadow"
            >
              {category.heroImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={category.heroImage}
                    alt={`${category.name} property type`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-ink dark:text-zinc-50 mb-2">
                  {category.name}
                </h2>
                {category.note && (
                  <p className="text-sm text-ink/70 dark:text-zinc-400">{category.note}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <BottomCTA />
      <Footer />
    </div>
  );
}

