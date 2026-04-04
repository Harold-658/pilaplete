import { Card, CardFooter } from "@/components/ui/card"
import { Clock, Route } from "lucide-react";
import { formatDistance, formatDuration, formatFare } from "../utils";

interface FareCardProps {
    isActive: boolean;
    isFastest: boolean;
    route: {
        duration: number;
        distance: number;
        fare: number;
        discounted: number;
    }
    index: number;
    setSelectedIndex: (index: number) => void;
}

export const FareCard = ({ isActive, isFastest, route, index, setSelectedIndex }: FareCardProps) => {
    return (
        <Card 
            className={`w-full rounded-2xl p-6 mb-6 ${isActive ? "bg-[#0B2D72] text-primary-foreground [a]:hover:bg-primary/80" : "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground"}`}
            key={index}
            onClick={() => setSelectedIndex(index)}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Trip Details</h2>
                <div className="flex gap-4">
                    <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                        Tricycle Fare
                    </span>
                    {isFastest && (
                        <span className="text-sm px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-green-900 dark:text-green-300">
                            Fastest
                        </span>
                    )}
                </div>
            </div>

            <div className="space-x-4 grid grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4 flex items-center justify-between">
                    <Clock color="#000000"/>
                    <span className="text-sm lg:text-md text-gray-500">Duration</span>
                    <span className="text-md lg:text-lg font-medium text-gray-900">{formatDuration(route.duration)}</span>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 flex items-center justify-between">
                    <Route color="#000000"/>
                    <span className="text-sm lg:text-md text-gray-500">Distance</span>
                    <span className="text-md lg:text-lg font-medium text-gray-900">{formatDistance(route.distance)}</span>
                </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm lg:text-md text-gray-500">Regular Fare</span>
                    <span className="text-xl font-bold text-gray-900">{formatFare(route.fare)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-md text-gray-500">Student / Senior Citizen / PWDs</span>
                    <span className="text-lg font-semibold text-blue-600">{formatFare(route.discounted)}</span>
                </div>
            </div>
        </Card>
    )
}