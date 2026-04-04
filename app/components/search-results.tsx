import { MapPin } from "lucide-react";

// Reusable search results component
export const SearchResults = ({ results, onSelect }: { 
    results: any, 
    onSelect: (result: any) => void 
}) => {
    if (!results?.features?.length) return null;

    return (
        <div className="rounded-md border border-border shadow-sm overflow-hidden">
            {results.features.map((result: any, index: number) => (
                <div
                    key={index}
                    className="flex items-start gap-3 px-4 py-3 bg-white hover:bg-accent cursor-pointer transition-colors border-b border-border last:border-0"
                    onClick={() => onSelect(result)}
                >
                    <MapPin className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{result.properties.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            {result.properties.full_address ?? `${result.geometry.coordinates[1].toFixed(5)}, ${result.geometry.coordinates[0].toFixed(5)}`}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};