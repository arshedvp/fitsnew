import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Product } from "@shared/schema";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const categories = ["All", "T-Shirts", "Shirts", "Jeans", "Jackets", "Pants", "Vintage"];

export default function Shop() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const categoryParam = params.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<"All" | "FitsNew" | "FitsAgain">("All");

  useEffect(() => {
    if (categoryParam) {
      const formatted = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).replace("-", " ");
      setSelectedCategory(formatted);
    }
  }, [categoryParam]);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesBrand =
      brandFilter === "All" || product.brand === brandFilter;

    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesSearch;
  });

  return (
    <div className="min-h-screen py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <section>
          <div className="mb-8 space-y-6">
            <h1
              className="text-xl font-semibold text-ui-text"
              data-testid="text-shop-title"
            >
              Shop
            </h1>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-ui-border"
                data-testid="input-search"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 border-ui-border" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 mb-6 relative z-10">
            <div className="flex gap-2 flex-wrap">
              {categories
                .filter((c) => c !== "Vintage")
                .map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className={selectedCategory === cat 
                      ? "bg-brand-navy text-white hover:bg-[#0B2458]" 
                      : "border border-ui-border text-ui-text hover:bg-ui-bg-soft"}
                    onClick={() => setSelectedCategory(cat)}
                    data-testid={`button-filter-${cat.toLowerCase()}`}
                  >
                    {cat}
                  </Button>
                ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant={brandFilter === "All" ? "default" : "outline"}
                className={brandFilter === "All"
                  ? "bg-brand-navy text-white hover:bg-[#0B2458]"
                  : "border border-ui-border text-ui-text hover:bg-ui-bg-soft"}
                onClick={() => setBrandFilter("All")}
                data-testid="button-brand-all"
              >
                All Products
              </Button>
              <Button
                variant={brandFilter === "FitsNew" ? "default" : "outline"}
                className={brandFilter === "FitsNew"
                  ? "bg-brand-navy text-white hover:bg-[#0B2458]"
                  : "border border-ui-border text-ui-text hover:bg-ui-bg-soft"}
                onClick={() => setBrandFilter("FitsNew")}
                data-testid="button-brand-fitsnew"
              >
                FitsNew
              </Button>
              <Button
                variant={brandFilter === "FitsAgain" ? "default" : "outline"}
                className={brandFilter === "FitsAgain"
                  ? "bg-brand-green text-white hover:bg-brand-green-100"
                  : "border border-ui-border text-ui-text hover:bg-ui-bg-soft"}
                onClick={() => setBrandFilter("FitsAgain")}
                data-testid="button-brand-fitsagain"
              >
                FitsAgain
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-0">
          {isLoading ? (
            <div className="col-span-full text-center py-12">Loading products...</div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-[#666666]" data-testid="text-no-products">
                No products found
              </p>
            </div>
          )}
          </div>
        </section>
      </div>
    </div>
  );
}
