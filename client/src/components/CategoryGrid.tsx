import { Link } from "wouter";
import { Card } from "@/components/ui/card";

const categories = [
  { name: "T-Shirts", slug: "t-shirts", icon: "👕" },
  { name: "Shirts", slug: "shirts", icon: "👔" },
  { name: "Jeans", slug: "jeans", icon: "👖" },
  { name: "Jackets", slug: "jackets", icon: "🧥" },
  { name: "Pants", slug: "pants", icon: "👔" },
  { name: "Vintage", slug: "vintage", icon: "🕰️" },
];

export function CategoryGrid() {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2
          className="text-3xl md:text-5xl font-bold text-center mb-12"
          data-testid="text-categories-title"
        >
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/shop?category=${category.slug}`}>
              <Card
                className="hover-elevate active-elevate-2 cursor-pointer transition-transform duration-300 p-6 md:p-8 text-center"
                data-testid={`card-category-${category.slug}`}
              >
                <div className="text-4xl md:text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl md:text-2xl font-semibold">{category.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
