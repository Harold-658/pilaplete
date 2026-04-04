"use client";

import { useEffect, useRef, useState } from "react";
import {
	Map,
	MapMarker,
	MarkerContent,
	MapRoute,
	MarkerLabel,
	MarkerPopup,
	MapControls,
	MapRef,
} from "@/components/ui/map";
import { Loader2, Locate, LocateFixed, MapPin, Fuel, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { computeFare, fetchSearchResults, getUserLocation } from "./utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GeoJSONProps } from "./interface";
import { SearchResults } from "./components/search-results";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FareCard } from "./components/fare-card";
import { MatrixDialog } from "./components/matrix-dialog";
import { CenterTracker } from "./components/center-tracker";
import { ClickHandler } from "./components/click-handler";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PointData {
	name: string;
	lng: number,
	lat: number
}

const FAREMATRIX: [ [number, number], number, number ][] = [
	[[20, 29.99], 13, 11],
	[[30, 39.99], 14, 12],
	[[40, 49.99], 15, 13],
	[[50, 59.99], 16, 14],
	[[60, 69.99], 17, 15],
	[[70, 79.99], 18, 16],
	[[80, 89.99], 19, 17],
	[[90, 99.99], 20, 18],
	[[100, Infinity], 21, 19]
]

interface RouteData {
	coordinates: [number, number][];
	duration: number; // seconds
	distance: number; // meters
	fare: number;
	discounted: number;
}

interface MarkerData {
	lng: number;
	lat: number;
}

export default function Home() {
	const [start, setStart] = useState<PointData>({ name: "Starting Point", lng: 125.81198, lat: 7.449292 })
	const [end, setEnd] = useState<PointData>({ name: "Destination", lng: 125.82647, lat: 7.44079 })
	const [center, setCenter] = useState<{lng: number, lat: number}>({ lng: (start.lng + end.lng) / 2, lat: (start.lat + end.lat) / 2 });
	const [marker, setMarker] = useState<MarkerData | null>(null);
	const [routes, setRoutes] = useState<RouteData[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [radioButtonState, setRadioButtonState] = useState("start")
	const [startSearch, setStartSearch] = useState("")
	const [startSearchResults, setStartSearchResults] = useState<GeoJSONProps | null>(null)
	const [endSearch, setEndSearch] = useState("")
	const [endSearchResults, setEndSearchResults] = useState<GeoJSONProps | null>(null)
	const [searchType, setSearchType] = useState<"start" | "end">("start")
	const [fuelIndex, setFuelIndex] = useState("7")
	const [hide, setHide] = useState(false)
	const mapRef = useRef<MapRef>(null);

	useEffect(() => {
		if ((startSearch === "" || startSearch === "Current Location") && searchType === "start") {
			setStartSearchResults(null);
			console.log("Cleared start search results");
		}
		if (endSearch === "" && searchType === "end") setEndSearchResults(null);
		const debounceTimer = setTimeout(() => {
			if (startSearch && startSearch != "Current Location" && searchType === "start") fetchSearchResults(startSearch, "start", setStartSearchResults, setEndSearchResults, setIsLoading);
			if (endSearch && searchType === "end") fetchSearchResults(endSearch, "end", setStartSearchResults, setEndSearchResults, setIsLoading);
		}, 500);

		return () => clearTimeout(debounceTimer);
	}, [startSearch, endSearch, searchType]);

	useEffect(() => {
		async function fetchRoutes() {
			try {
				const response = await fetch(
					`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`
				);
				const data = await response.json();

				if (data.routes?.length > 0) {
					const routeData: RouteData[] = data.routes.map(
						(route: {
							geometry: { coordinates: [number, number][] };
							duration: number;
							distance: number;
							fare: number;
							discounted: number;
						}) => ({
							coordinates: route.geometry.coordinates,
							duration: route.duration,
							distance: route.distance,
							fare: computeFare(FAREMATRIX[Number(fuelIndex)], route.distance, "regular"),
							discounted: computeFare(FAREMATRIX[Number(fuelIndex)], route.distance, "discounted")
						})
					);
					setRoutes(routeData);
					setStartSearchResults(null);
					setEndSearchResults(null);
					setSelectedIndex(0);
					setCenter({ lng: (start.lng + end.lng) / 2, lat: (start.lat + end.lat) / 2 });
				}
			} catch (error) {
				console.error("Failed to fetch routes:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchRoutes();
	}, [start, end]);

	useEffect(() => {
		if (mapRef.current) {
			mapRef.current.fitBounds(
				[
					[Math.min(start.lng, end.lng), Math.min(start.lat, end.lat)], // southwest
        			[Math.max(start.lng, end.lng), Math.max(start.lat, end.lat)], // northeast
				],
				{
					padding: 100, // padding in pixels around the bounds
					duration: 0, // animation duration in ms
				}
			);
		}
	}, [center])

	useEffect(() => {
		const updated = routes.map(route => ({...route, fare: computeFare(FAREMATRIX[Number(fuelIndex)], route.distance, "regular"), discounted: computeFare(FAREMATRIX[Number(fuelIndex)], route.distance, "discounted")}))
		setRoutes(updated)
	}, [fuelIndex])

	// Sort routes: non-selected first, selected last (renders on top)
	const sortedRoutes = routes.map((route, index) => ({ route, index }))
	.sort((a, b) => {
		if (a.index === selectedIndex) return 1;
		if (b.index === selectedIndex) return -1;
		return 0;
	});

	return (
		<div className="h-screen w-full flex flex-col lg:flex-row" onClick={() => {setStartSearchResults(null); setEndSearchResults(null)}}>
			<div className={`transition-all duration-300 ease-in-out ${hide ? 'h-full w-full' : 'h-[50%] w-full lg:h-full lg:w-[70%]'} relative`}>
				<Map ref={mapRef} center={center} zoom={15}>
					<MapControls showLocate/>
					<div className="absolute w-full">
						<RadioGroup value={radioButtonState} onValueChange={setRadioButtonState} className="flex flex-col lg:flex-row gap-2 p-4">
							<FieldLabel className="w-[42.5%]" htmlFor="starting">
								<Field 
									orientation="vertical" 
									className={`border border-neutral-300 rounded-lg p-4 ${radioButtonState === "start"
										? "border-[#0AC4E0] bg-blue-50 shadow-md"
										: "border-neutral-300 bg-neutral-50"} relative space-y-3
									`}>
									<div className="flex gap-3">
										<RadioGroupItem 
											value="start" id="starting" 
											className="rounded-full border border-neutral-500 
											data-[state=checked]:border-[#0AC4E0] data-[state=checked]:bg-[#0B2D72]
											data-[state=unchecked]:bg-white"
										/>
										<Label htmlFor="starting">
											{radioButtonState === "start" ? "Editing Starting Point" : "Click to edit starting point"}
										</Label>
									</div>

									<div className="flex items-center gap-2">
										<LocateFixed size={35}/>
										<Input
											className="border-neutral-950 bg-white"
											type="search"
											placeholder="Starting Point..."
											value={startSearch}
											onChange={(e) => {setStartSearch(e.target.value); setSearchType("start")}}
											onFocus={() => setRadioButtonState("start")}
											onClick={() => setRadioButtonState("start")}
										/>
										<Button className="bg-[#0B2D72]" onClick={() => getUserLocation(setCenter, setStart, setStartSearch, setMarker)}>
											<Locate/>My Location
										</Button>
									</div>
									<SearchResults
										results={(startSearchResults)}
										onSelect={(result) => {
											const payload = {
												lng: result.geometry.coordinates[0],
												lat: result.geometry.coordinates[1],
												name: result.properties.name,
											};
											setStart(payload);
											setStartSearch(result.properties.name);
											setStartSearchResults(null);
											setMarker(null)
										}}
									/>
								</Field>
							</FieldLabel>
							<FieldLabel className="w-[42.5%]" htmlFor="destination">
								<Field orientation="vertical" className={`border border-neutral-300 rounded-lg p-4 ${radioButtonState === "end"
									? "border-blue-600 bg-blue-50 shadow-md"
									: "border-neutral-300 bg-neutral-50"} relative space-y-3
								`}>
									<div className="flex gap-3">
										<RadioGroupItem 
											value="end" id="destination" 
											className="rounded-full border border-neutral-500 
											data-[state=checked]:border-green-600 data-[state=checked]:bg-[#0B2D72]
											data-[state=unchecked]:bg-white"
										/>
										<Label htmlFor="destination">
											{radioButtonState === "end" ? "Editing Destination" : "Click to edit destination"}
										</Label>
									</div>

									<Field orientation="horizontal">
										<MapPin/>
										<Input
											className="border-neutral-950 bg-white"
											type="search"
											placeholder="Destination..."
											value={endSearch}
											onChange={(e) => {setEndSearch(e.target.value); setSearchType("end")}}
											onClick={() => setRadioButtonState("end")}
											onFocus={() => setRadioButtonState("end")}
										/>
									</Field>

									<SearchResults
										results={(endSearchResults)}
										onSelect={(result) => {
											const payload = {
												lng: result.geometry.coordinates[0],
												lat: result.geometry.coordinates[1],
												name: result.properties.name,
											};
											setEnd(payload);
											setEndSearch(result.properties.name);
											setEndSearchResults(null);
											setMarker(null)
										}}
									/>
									
								</Field>
							</FieldLabel>
							
							<div className="w-[15%] lg:flex items-center justify-center">
								<MatrixDialog fuelIndex={fuelIndex} matrix={FAREMATRIX} />
							</div>
						</RadioGroup>
					</div>
					<ClickHandler 
						onMapClick={(lng, lat) => setMarker({ lng, lat })} 
						radioButtonState={radioButtonState}
						setStart={setStart}
						setEnd={setEnd}
						setStartSearch={setStartSearch}
						setEndSearch={setEndSearch}
						setStartSearchResults={setStartSearchResults}
						setEndSearchResults={setEndSearchResults}
					/>
					<CenterTracker />
					{marker && (
						<MapMarker longitude={marker.lng} latitude={marker.lat}>
							<MarkerContent />
							<MarkerPopup>
								<p className="text-sm font-semibold">Dropped Pin</p>
								<p className="text-xs text-muted-foreground">
									{marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
								</p>
							</MarkerPopup>
						</MapMarker>
					)}
					{sortedRoutes.map(({ route, index }) => {
						const isSelected = index === selectedIndex;
						return (
							<MapRoute
								key={index}
								coordinates={route.coordinates}
								color={isSelected ? "#0B2D72" : "#94a3b8"}
								width={isSelected ? 6 : 5}
								opacity={isSelected ? 1 : 0.6}
								onClick={() => setSelectedIndex(index)}
							/>
						);
					})}

					<MapMarker longitude={start.lng} latitude={start.lat}>
						<MarkerContent>
							<div className="size-5 rounded-full bg-green-500 border-2 border-white shadow-lg" />
							<MarkerLabel position="top">{start.name}</MarkerLabel>
						</MarkerContent>
					</MapMarker>

					<MapMarker longitude={end.lng} latitude={end.lat}>
						<MarkerContent>
							<div className="size-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
							<MarkerLabel position="bottom">{end.name}</MarkerLabel>
						</MarkerContent>
					</MapMarker>

					{/* Button Toggler */}
					<Button className="absolute left-0 bottom-0 lg:left-auto lg:right-0 lg:top-1/2 bg-[#0B2D72]" size="icon-lg" onClick={() => setHide(!hide)}>
						{hide ? <ChevronLeft className="hidden lg:block" color="#FFFFFF"/> : <ChevronRight className="hidden lg:block" color="#FFFFFF"/>}
						{hide ? <ChevronUp className="block lg:hidden" color="#FFFFFF"/> : <ChevronDown className="block lg:hidden" color="#FFFFFF"/>}
					</Button>
				</Map>

				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-background/50">
						<Loader2 className="size-6 animate-spin text-muted-foreground" />
					</div>
				)}
			</div>

			<div className={`${`transition-transform duration-300 ease-in-out overflow-hidden ${hide ? "translate-y-full h-0 w-0 lg:translate-y-0 lg:translate-x-full" : "translate-y-0 lg:translate-x-0 w-full h-[50%] lg:w-[30%] lg:h-full"}`} bg-[#FFFFFF]`} style={{ fontFamily: "Helvetica Neue, Arial, Helvetica, sans-serif"}}>
				<div className="flex flex-col gap-2 h-full">
					<div className="flex flex-col gap-2 p-4 bg-white ">
						<div className="flex items-center gap-2">
							<Fuel size={16} className="text-green-600" />
							<span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
								Current Gasoline Price / per Liter
							</span>
						</div>
						<Field id="fuel-select">
							<Select value={fuelIndex} onValueChange={setFuelIndex}>
							<SelectTrigger className="bg-neutral-50 border-neutral-300 font-medium">
								<SelectValue placeholder="Select price range..." />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectGroup>
								{FAREMATRIX.map((row, i) => (
									<SelectItem key={i} value={`${i}`} style={{ fontFamily: "Helvetica Neue, Arial, Helvetica, sans-serif"}}>
									{i === 8
										? `Php ${row[0][0]} and above`
										: `Php ${row[0][0]} – ${row[0][1]}`}
									</SelectItem>
								))}
								</SelectGroup>
							</SelectContent>
							</Select>
						</Field>
					</div>
					<Separator/>
					<div className="p-4 flex-1 min-h-0">
						{routes.length > 0 && (
							<ScrollArea className="h-full">
								<div className="flex flex-col p-2">
									{routes.map((route, index) => {
										const isActive = index === selectedIndex;
										const isFastest = index === 0;
										return (
											<FareCard 
												isActive={isActive}
												isFastest={isFastest}
												route={route}
												index={index}
												setSelectedIndex={setSelectedIndex}
												key={index}
											/>
										);
									})}
								</div>
							</ScrollArea>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}