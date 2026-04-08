import axios from "axios";
import { GeoJSONProps } from "./interface";

export function formatDuration(seconds: number): string {
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
}

export function formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
}

export function formatFare(fare: number): string {
    return `₱ ${fare.toFixed(2)}`
}

export function computeFare(matrix: (number | number[])[], distance: number, type: string) {
    const distanceKM = Math.ceil(distance / 1000)
    const excessKM = distanceKM - 3
    const fareValue = matrix[type === "regular" ? 1: 2]
    const baseFare = typeof fareValue === 'number' ? fareValue : 0
    return baseFare + (excessKM * 2)
}

export const fetchSearchResults = async (
    query: string, type: "start" | "end",
    setStartSearchResults: (results: GeoJSONProps | null) => void,
    setEndSearchResults: (results: GeoJSONProps | null) => void,
    setIsLoading: (isLoading: boolean) => void
) => {
    try {
        const response = await axios.get(`/api/map-search`, {
            params: { q: query }
        });
        if (type === "start") {
            setStartSearchResults(response.data);
            setEndSearchResults(null);
        } else {
            setStartSearchResults(null);
            setEndSearchResults(response.data);
        }
        setIsLoading(false);
    } catch (error) {
        console.error("Error!", error);
    }
};

function showLocationPermissionModal() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    let instructions = "";

    if (isIOS) {
        instructions = `To enable location on iPhone:\n\n1. Open Settings\n2. Scroll down to Safari (or your browser)\n3. Tap "Location" → select "Allow"\n4. Return to this page and try again.`;
    } else if (isAndroid) {
        instructions = `To enable location on Android:\n\n1. Tap the lock icon in your browser's address bar\n2. Tap "Permissions" → enable Location\nOR\n1. Open Settings → Apps → [your browser]\n2. Tap Permissions → Location → Allow\n3. Return to this page and try again.`;
    } else {
        instructions = `To enable location:\n\n1. Click the lock icon in your browser's address bar\n2. Set Location to "Allow"\n3. Refresh the page and try again.`;
    }

    alert(`Location access was denied.\n\n${instructions}`);
}

export function getUserLocation(
    setCenter: (center: { lng: number, lat: number }) => void,
    setStart: (location: { name: string, lng: number, lat: number }) => void,
    setStartSearch: (search: string) => void,
    setMarker: (marker: any) => void,
    setIsLoadingLocation: (isLoading: boolean) => void
) {
    setIsLoadingLocation(true);
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        setIsLoadingLocation(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { longitude, latitude } = position.coords;
            setCenter({ lng: longitude, lat: latitude });
            setStart({ name: "Current Location", lng: longitude, lat: latitude });
            setStartSearch("Current Location");
            setMarker(null)
            setIsLoadingLocation(false);
        },
        (error) => {
            setIsLoadingLocation(false);
            if (error.code === error.PERMISSION_DENIED) {
                showLocationPermissionModal();
            } else if (error.code === error.TIMEOUT) {
                alert("Location request timed out. Please try again.");
            } else {
                alert("Unable to retrieve your location. Please try again.");
            }
        },
        {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
        }
    );
}