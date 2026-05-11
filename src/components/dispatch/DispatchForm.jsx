import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Radio, MapPin, Clock, AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const serviceTypes = [
  { value: "notary", label: "Mobile Notary" },
  { value: "process_server", label: "Process Server" },
  { value: "landscaping", label: "Landscaping / Line-of-Sight Clearing" },
  { value: "security_audit", label: "Physical Security Audit" },
];

export default function DispatchForm() {
  const [emergency, setEmergency] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const handleDispatch = () => {
    setDispatched(true);
    toast.success("Service dispatched successfully!");
    setTimeout(() => setDispatched(false), 3000);
  };

  return (
    <Card className="shadow-sm border-border/60 max-w-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center">
            <Radio className="w-5 h-5 text-tactical-gold" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">New Service Request</CardTitle>
            <p className="text-sm text-muted-foreground">Dispatch a service to your location</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Service Type */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Service Type</Label>
          <Select>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a service..." />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Service Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Enter address — DMV area" className="pl-10 h-11" />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Date</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="date" className="pl-10 h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Time</Label>
            <Input type="time" className="h-11" />
          </div>
        </div>

        {/* Emergency Toggle */}
        <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${emergency ? "bg-red-50 border-tactical-red/30" : "bg-muted/30 border-border"}`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-5 h-5 ${emergency ? "text-tactical-red" : "text-muted-foreground"}`} />
            <div>
              <p className="text-sm font-semibold">Emergency Priority</p>
              <p className="text-xs text-muted-foreground">Expedited dispatch with priority routing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {emergency && <Badge className="bg-tactical-red text-white border-0 text-[10px]">URGENT</Badge>}
            <Switch checked={emergency} onCheckedChange={setEmergency} />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Additional Notes</Label>
          <Textarea placeholder="Special instructions, access codes, contact details..." className="resize-none min-h-[80px]" />
        </div>

        {/* Dispatch Button */}
        <Button
          onClick={handleDispatch}
          disabled={dispatched}
          className={`w-full h-12 text-sm font-bold transition-all duration-300 ${
            emergency
              ? "bg-tactical-red hover:bg-red-700 shadow-lg shadow-red-200"
              : "bg-navy-900 hover:bg-navy-800 shadow-lg shadow-navy-200"
          }`}
        >
          {dispatched ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Dispatched Successfully
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {emergency ? "Emergency Dispatch Now" : "Dispatch Now"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}