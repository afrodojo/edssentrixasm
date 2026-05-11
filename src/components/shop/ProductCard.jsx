import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <Card className="group shadow-sm border-border/60 hover:shadow-lg hover:border-border transition-all duration-300 overflow-hidden">
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <Badge className="absolute top-3 right-3 bg-tactical-gold text-navy-900 border-0 text-[10px] font-bold">
            {product.badge}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{product.category}</p>
        <h3 className="font-bold text-sm text-foreground mb-1 group-hover:text-navy-700 transition-colors">{product.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{product.description}</p>
        
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < product.rating ? "text-tactical-gold fill-tactical-gold" : "text-slate-200"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-foreground">{product.price}</span>
            {product.unit && <span className="text-xs text-muted-foreground ml-1">{product.unit}</span>}
          </div>
          <Button size="sm" className="bg-navy-900 hover:bg-navy-800 text-xs font-semibold gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.bulkOrder ? "Bulk Order" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}