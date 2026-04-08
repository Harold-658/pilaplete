"use client";

import { useMap } from "@/components/ui/map";
import { useEffect } from "react";

export function MapResizer({ panelSize }: { panelSize: number }) {
    const mapContext = useMap();

    useEffect(() => {
        // mapContext.map is the actual MapLibre instance
        if (mapContext && mapContext.map) {
            mapContext.map.resize();
        }
    }, [panelSize, mapContext]);

    return null;
}