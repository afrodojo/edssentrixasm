import React from "react";
import { Card } from "@/components/ui/card";
import { Users, BookOpen, Truck, ShieldAlert, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Users", value: "127", change: "+12%", up: true, icon: Users, color: "text-blue-500 bg-blue-50" },
  { label: "Courses Completed", value: "843", change: "+8%", up: true, icon: BookOpen, color: "text-emerald-500 bg-emerald-50" },
  { label: "Dispatches This Month", value: "34", change: "+23%", up: true, icon: Truck, color: "text-violet-500 bg-violet-50" },
  { label: "Open Incidents", value: "3", change: "-40%", up: false, icon: ShieldAlert, color: "text-tactical-red bg-red-50" },
];

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <Card className="p-5 shadow-sm border-border/60 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {stat.up ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span className="text-xs font-semibold text-emerald-600">{stat.change}</span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}