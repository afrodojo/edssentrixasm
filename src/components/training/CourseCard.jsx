import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Clock, Users } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <Card className="group shadow-sm border-border/60 hover:shadow-lg hover:border-border transition-all duration-300 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-40 bg-navy-900 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <Badge className="bg-navy-800/80 text-white border-0 text-[10px] backdrop-blur-sm">
            <Clock className="w-3 h-3 mr-1" />
            {course.duration}
          </Badge>
          {course.required && (
            <Badge className="bg-tactical-red/90 text-white border-0 text-[10px]">Required</Badge>
          )}
        </div>
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{course.category}</p>
        <h3 className="font-bold text-sm text-foreground leading-snug mb-2 group-hover:text-navy-700 transition-colors">{course.title}</h3>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{course.enrolled} enrolled</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-1.5" />
        </div>

        <Button variant="outline" size="sm" className="w-full mt-3.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
          {course.progress > 0 ? "Continue Course" : "Start Course"}
        </Button>
      </CardContent>
    </Card>
  );
}