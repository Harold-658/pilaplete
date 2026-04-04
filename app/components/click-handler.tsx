"use client"

import { useMap } from "@/components/ui/map";
import { useEffect } from "react";
import { GeoJSONProps } from "../interface";

interface ClickHandlerProps {
    onMapClick: (lng: number, lat: number) => void;
    radioButtonState: string;
    setStart: (data: { name: string; lng: number; lat: number }) => void;
    setEnd: (data: { name: string; lng: number; lat: number }) => void;
    setStartSearch: (value: string) => void;
    setEndSearch: (value: string) => void;
    setStartSearchResults: (results: GeoJSONProps | null) => void;
    setEndSearchResults: (results: GeoJSONProps | null) => void;
}

export function ClickHandler({
    onMapClick, radioButtonState, setStart, setEnd, setStartSearch, setEndSearch, setStartSearchResults, setEndSearchResults
}: ClickHandlerProps) {
    const { map, isLoaded } = useMap();

    useEffect(() => {
        if (!map || !isLoaded) return;

        const handleClick = (e: any) => {
            const { lng, lat } = e.lngLat;
            onMapClick(lng, lat);
            if (radioButtonState === "start") {
                setStart({name: "Starting Point", lng: lng, lat: lat})
                setStartSearch("")
                setStartSearchResults(null)
            } else {
                setEnd({name: "Destination", lng: lng, lat: lat})
                setEndSearch("")
                setEndSearchResults(null)
            }
        };

        map.on("click", handleClick);
        return () => {
            map.off("click", handleClick);
        };
    }, [map, isLoaded, onMapClick]);

    return null;
}