import React, { useState } from "react";
import CourseCard from "../components/training/CourseCard";
import UpsellBanner from "../components/training/UpsellBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen } from "lucide-react";

const courses = [
  {
    id: 1, title: "Workplace Violence Response", category: "Security",
    duration: "2h 15m", enrolled: 89, progress: 65, required: true,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop"
  },
  {
    id: 2, title: "Cyber Threat Basics for SMBs", category: "Cybersecurity",
    duration: "1h 45m", enrolled: 134, progress: 100, required: true,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop"
  },
  {
    id: 3, title: "First Aid / CPR Certification", category: "Health & Safety",
    duration: "3h 30m", enrolled: 72, progress: 30, required: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop"
  },
  {
    id: 4, title: "Active Shooter Preparedness", category: "Security",
    duration: "1h 30m", enrolled: 56, progress: 0, required: false,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop"
  },
  {
    id: 5, title: "Legal Compliance for Security Teams", category: "Legal",
    duration: "2h 00m", enrolled: 45, progress: 15, required: false,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop"
  },
  {
    id: 6, title: "Firearms Safety & Handling", category: "Tactical",
    duration: "4h 00m", enrolled: 38, progress: 0, required: false,
    image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=600&h=400&fit=crop"
  },
  {
    id: 7, title: "De-Escalation Techniques", category: "Security",
    duration: "1h 15m", enrolled: 98, progress: 80, required: true,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop"
  },
  {
    id: 8, title: "Physical Security Fundamentals", category: "Security",
    duration: "2h 45m", enrolled: 67, progress: 45, required: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop"
  },
];

const categories = ["All", "Security", "Cybersecurity", "Health & Safety", "Legal", "Tactical"];

export default function Training() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = courses.filter(c => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Training & LMS</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage compliance training and certifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold gap-1">
            <BookOpen className="w-3 h-3" />
            {courses.length} Courses
          </Badge>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
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

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Upsell Banner */}
      <UpsellBanner />
    </div>
  );
}