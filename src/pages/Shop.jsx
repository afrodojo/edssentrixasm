import React, { useState } from "react";
import ProductCard from "../components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingBag } from "lucide-react";

const products = [
  {
    id: 1, title: "5.11 Tactical Polo — Black", category: "Tactical Apparel",
    price: "$42.99", unit: "/ea", description: "Professional-grade polo for security teams. Moisture-wicking fabric with pen pockets.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
    badge: "Best Seller", rating: 5, reviews: 234, bulkOrder: true,
  },
  {
    id: 2, title: "5.11 Tactical Trauma Kit", category: "Tactical Gear",
    price: "$89.99", unit: "/kit", description: "TCCC-compliant trauma kit with tourniquet, chest seal, and hemostatic gauze.",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&h=400&fit=crop",
    badge: "Essential", rating: 5, reviews: 112, bulkOrder: true,
  },
  {
    id: 3, title: "Cisco Meraki Network Upgrade", category: "Cyber / Tech",
    price: "$4,999", unit: "/site", description: "Enterprise-grade network security with cloud-managed access points, switches, and firewall.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    badge: "Premium", rating: 4, reviews: 47, bulkOrder: false,
  },
  {
    id: 4, title: "Microsoft 365 Secure Migration", category: "Cyber / Tech",
    price: "$2,499", unit: "/org", description: "Full migration to Microsoft 365 with MFA setup, data loss prevention, and compliance policies.",
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=600&h=400&fit=crop",
    badge: "Top Rated", rating: 5, reviews: 89, bulkOrder: false,
  },
  {
    id: 5, title: "Security Body Camera System", category: "Tactical Gear",
    price: "$299.99", unit: "/unit", description: "HD body camera with 12-hour battery, night vision, and cloud evidence management.",
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=600&h=400&fit=crop",
    rating: 4, reviews: 67, bulkOrder: true,
  },
  {
    id: 6, title: "Access Control Starter Kit", category: "Physical Security",
    price: "$1,299", unit: "/door", description: "Keycard access with audit trail, mobile unlock, and visitor management system.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop",
    rating: 4, reviews: 34, bulkOrder: false,
  },
];

const categories = ["All", "Tactical Apparel", "Tactical Gear", "Cyber / Tech", "Physical Security"];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Partner Pro Shop</h1>
          <p className="text-sm text-muted-foreground mt-0.5">B2B gear, tech upgrades, and tactical equipment</p>
        </div>
        <Badge variant="outline" className="text-xs font-semibold gap-1.5 w-fit">
          <ShoppingBag className="w-3 h-3" />
          {products.length} Products
        </Badge>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="text-xs font-medium"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}