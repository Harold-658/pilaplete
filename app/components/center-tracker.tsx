"use client"

import { useMap } from "@/components/ui/map";
import { useEffect } from "react";

export function CenterTracker() {
    const { map, isLoaded } = useMap();
    
    useEffect(() => {
        if (!map || !isLoaded) return;

        const handleMove = () => {
            const center = map.getCenter();
            console.log(`Map center: ${center.lng.toFixed(5)}, ${center.lat.toFixed(5)}`);
        }

        map.on("move", handleMove);
        return () => {
            map.off("move", handleMove);
        }
    }, [map, isLoaded])

    return null
}