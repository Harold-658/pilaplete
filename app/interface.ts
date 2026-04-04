export interface GeoJSONProps {
    type: string;
    features: FeatureProps[]
}

export interface FeatureProps {
    type: string;
    properties: FeaturePropertyProps,
    geometry: GeometryProps
}

export interface FeaturePropertyProps {
    osm_type: string,
    osm_id: number,
    osm_key: string,
    osm_value: string,
    type: string,
    countrycode: string,
    name: string,
    country: string,
    extent: number[]
}

export interface GeometryProps {
    type: string,
    coordinates: number[]
}