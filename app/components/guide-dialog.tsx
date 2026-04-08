import { useState } from "react";
import { MapPin, Search, MousePointerClick, Navigation, CircleHelp, ArrowRight, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const steps = [
  {
    step: "01",
    icon: MousePointerClick,
    label: "Select a Location Card",
    tag: "First",
    tagColor: "bg-sky-100 text-sky-600",
    iconBg: "bg-sky-50 text-sky-500",
    borderAccent: "border-l-sky-400",
    description:
      "Tap either the Starting Point or Destination card to activate it. The highlighted card tells the app which location you're about to update.",
    tip: null,
  },
  {
    step: "02",
    icon: Search,
    label: "Search for a Place",
    tag: "Option A",
    tagColor: "bg-violet-100 text-violet-600",
    iconBg: "bg-violet-50 text-violet-500",
    borderAccent: "border-l-violet-400",
    description:
      "Type a place name or address in the search bar and pick a result from the dropdown — the pin will jump to that location automatically.",
    tip: "Best for exact addresses or well-known destinations.",
  },
  {
    step: "03",
    icon: MapPin,
    label: "Drop a Pin on the Map",
    tag: "Option B",
    tagColor: "bg-emerald-100 text-emerald-600",
    iconBg: "bg-emerald-50 text-emerald-500",
    borderAccent: "border-l-emerald-400",
    description:
      "Tap anywhere directly on the map to place a pin at that exact spot. The active card updates instantly to reflect your chosen location.",
    tip: "Great for spots that might not appear in search results.",
  },
];

export default function GuideDialog() {
  const [open, setOpen] = useState(true);

  return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <CircleHelp className="w-4 h-4 text-[#0B2D72]" />
                    How to use
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[90%]! lg:max-w-[30%]! h-[70vh]" style={{ fontFamily: "Helvetica Neue, Arial, Helvetica, sans-serif"}}>
                {/* Header */}
                <div className="bg-linear-to-br bg-[#0B2D72] px-6 pt-6 pb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Navigation className="w-4 h-4 text-blue-400" />
                        <span className="text-md font-bold tracking-widest uppercase text-blue-400">
                            Pilaplete Navigation Guide
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold text-white leading-snug mb-1">
                        Setting Your Locations
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-400 leading-relaxed">
                        Two ways to set your start &amp; destination — pick what works for you.
                    </DialogDescription>
                </div>

                {/* Steps */}
                <div className="bg-white px-6 py-5 flex flex-col gap-4 overflow-scroll">
                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        return (
                        <div
                            key={i}
                            className={`flex gap-4 items-start border-l-4 ${s.borderAccent} pl-4 py-1`}
                        >
                            <div className={`rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-[10px] font-bold text-slate-400 tracking-widest">
                                        {s.step}
                                    </span>
                                    <span className="max-w-[60%] font-semibold text-sm text-slate-800">{s.label}</span>
                                    <Badge className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.tagColor}`}>
                                        {s.tag}
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                                {s.tip && (
                                    <div className="mt-2 flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-px" />
                                        <span className="text-[11px] text-amber-700 leading-relaxed">{s.tip}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        );
                    })}
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-5 py-2 bg-[#0B2D72] text-white text-sm font-semibold"
                    >
                        Got it
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
  );
}