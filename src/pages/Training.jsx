import React, { useState } from "react";
import CourseCard from "../components/training/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BookOpen, Download, CheckCircle2, Users, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const courses = [
  {
    id: 1, title: "Cyber Threat Fundamentals", category: "Cybersecurity",
    duration: "1h 45m", enrolled: 134, progress: 100, required: true,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop"
  },
  {
    id: 2, title: "Active Shooter Response", category: "Security",
    duration: "1h 30m", enrolled: 56, progress: 78, required: true,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop"
  },
  {
    id: 3, title: "CPR / First Aid Certification", category: "Health & Safety",
    duration: "3h 30m", enrolled: 72, progress: 45, required: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop"
  },
  {
    id: 4, title: "Workplace Violence Response", category: "Security",
    duration: "2h 15m", enrolled: 89, progress: 65, required: true,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop"
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

const staff = [
  { name: "J. Doe", role: "Site Manager", progress: 92 },
  { name: "M. Carter", role: "Security Lead", progress: 78 },
  { name: "R. Singh", role: "Field Agent", progress: 55 },
  { name: "A. Williams", role: "Admin", progress: 100 },
  { name: "T. Hassan", role: "Trainee", progress: 20 },
];

const categories = ["All", "Cybersecurity", "Security", "Health & Safety", "Legal", "Tactical"];

export default function Training() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = courses.filter(c => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = () => {
    toast.success("Generating Compliance Report for Insurance Broker... Download will begin shortly.", {
      description: "Includes NIST alignment score, SOC 2 training completion, and premium reduction eligibility."
    });
  };

  const avgProgress = Math.round(staff.reduce((a, s) => a + s.progress, 0) / staff.length);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Compliance LMS</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Employee training, certifications & insurance compliance reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold gap-1">
            <BookOpen className="w-3 h-3" />
            {courses.length} Courses
          </Badge>
        </div>
      </div>

      {/* Insurance ROI Banner */}
      <div className="bg-tactical-gold/10 border border-tactical-gold/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <Award className="w-6 h-6 text-tactical-gold mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-tactical-gold text-sm">Insurance Premium Reduction Eligible</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Companies with 80%+ staff training completion qualify for up to <span className="text-tactical-gold font-bold">15–22% liability insurance reduction</span>. Current company score: <span className="font-bold text-foreground">{avgProgress}%</span>
            </p>
          </div>
        </div>
        <Button onClick={handleDownload} className="bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold gap-2 shrink-0 w-full sm:w-auto">
          <Download className="w-4 h-4" />
          Download Report for Broker
        </Button>
      </div>

      {/* Staff Progress */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" /> Staff Completion
            </CardTitle>
            <span className="text-xs text-muted-foreground">Company avg: <span className="font-bold text-foreground">{avgProgress}%</span></span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {staff.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                {s.name.split(".")[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.progress}%</span>
                </div>
                <Progress value={s.progress} className="h-1.5" />
              </div>
              <span className="text-[10px] text-muted-foreground w-24 text-right hidden sm:block">{s.role}</span>
              {s.progress === 100 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </div>
          ))}
        </CardContent>
      </Card>

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
    </div>
  );
}