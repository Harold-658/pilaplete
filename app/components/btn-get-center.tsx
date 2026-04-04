import { Button } from "@/components/ui/button";
import { useMap } from "@/components/ui/map";

export const BtnGetCenter = ({ onClick }: { onClick: (data: {
	name: string;
	lng: number,
	lat: number
}) => void }) => {
    const { map, isLoaded } = useMap();

    const handleGetCenter = () => {
        if (!map || !isLoaded) return;
        const center = map.getCenter();
        onClick({ name: "Current Location", lng: center.lng, lat: center.lat });
    };

    return (
        <Button onClick={handleGetCenter}>
            Use My Location
        </Button>
    );

}