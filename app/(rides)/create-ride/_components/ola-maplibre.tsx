/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
	GeolocateControl,
	Map,
	Marker,
	GeoJSONSource,
	NavigationControl,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { Feature, LineString } from 'geojson';
import { useMarkerPositionsStore } from '@/hooks/store/useLocation';
import { usePlaceStore } from '@/hooks/store/usePlace';
import { usePolyLineStore } from '@/hooks/store/usePolyLineCoords';
const OlaMaplibre = () => {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstance = useRef<Map | null>(null); // Reference to the map instance
	const originMarkerRef = useRef<Marker | null>(null);
	const destinationMarkerRef = useRef<Marker | null>(null);
	const {
		markerOrigin,
		markerDestination,
		setMarkerDestination,
		setMarkerOrigin,
	} = useMarkerPositionsStore();
	const { setLocationA, setLocationB } = usePlaceStore();
	const { polyCords, setPolyCords } = usePolyLineStore();
	// const [markerPositions, setMarkerPositions] = useState({
	// 	markerOrigin: { lng: 73.847466, lat: 18.530823 },
	// 	markerDestination: { lng: 73.8547, lat: 18.4655 },
	// });

	// const [polyCords, setPolyCords] = useState<[number, number][]>([]);

	const sendParamsOla = useCallback(async () => {
		try {
			const response = await axios.post(
				'https://api.olamaps.io/routing/v1/directions',
				null,
				{
					params: {
						api_key: process.env.NEXT_PUBLIC_OLA_API_KEY,
						origin: `${markerOrigin.lat},${markerOrigin.lng}`,
						destination: `${markerDestination.lat},${markerDestination.lng}`,
					},
				}
			);
			if (response.data['status'] === 'SUCCESS') {
				const routes = response.data.routes;
				const polyLine = routes[0].overview_polyline;
				const decoded = polyline.decode(polyLine);
				setPolyCords(decoded.map(([lat, lng]) => [lng, lat])); // Reverse coordinates for GeoJSON
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	}, [markerOrigin, markerDestination]);

	const reverseGeocodeMarkerOrigin = useCallback(async (marker) => {
		try {
			const response = await axios.get(
				'https://api.olamaps.io/places/v1/reverse-geocode',
				{
					params: {
						api_key: process.env.NEXT_PUBLIC_OLA_API_KEY,
						latlng: `${marker.lat},${marker.lng}`,
					},
				}
			);

			const result = response.data.results?.[0];
			if (result) {
				setMarkerOrigin({
					lng: result.geometry.location.lng,
					lat: result.geometry.location.lat,
				});
				setLocationA(result.name);
			}
		} catch (error) {
			console.log(error);
		}
	}, []);
	const reverseGeocodeMarkerDestination = useCallback(async (marker) => {
		try {
			const response = await axios.get(
				'https://api.olamaps.io/places/v1/reverse-geocode',
				{
					params: {
						api_key: process.env.NEXT_PUBLIC_OLA_API_KEY,
						latlng: `${marker.lat},${marker.lng}`,
					},
				}
			);

			const result = response.data.results?.[0];
			if (result) {
				setMarkerDestination({
					lng: result.geometry.location.lng,
					lat: result.geometry.location.lat,
				});
				setLocationB(result.name);
			}
		} catch (error) {
			console.log(error);
		}
	}, []);

	useEffect(() => {
		sendParamsOla();
		console.log(polyCords);
	}, [sendParamsOla]);

	// Initialize the map only once
	useEffect(() => {
		if (!mapRef.current || mapInstance.current) return;

		const myMap = new Map({
			style: `https://api.olamaps.io/styleEditor/v1/styleEdit/styles/923b4afc-f3f9-4d83-8c65-c2eb598f5834/ola-mapbox-dark`,
			container: mapRef.current,
			center: [markerOrigin.lng, markerOrigin.lat],
			zoom: 15,
			maxBounds: [
				68.1766451354, 7.96553477623, 97.4025614766, 35.4940095078,
			],
			rollEnabled: true,
			transformRequest: (url, resourceType) => {
				if (url.includes('?')) {
					url = `${url}&api_key=${process.env.NEXT_PUBLIC_OLA_API_KEY}`;
				} else {
					url = `${url}?api_key=${process.env.NEXT_PUBLIC_OLA_API_KEY}`;
				}
				return { url, resourceType };
			},
		});

		// myMap.scrollZoom.disable();

		myMap.addControl(
			new NavigationControl({
				visualizePitch: true,
				visualizeRoll: true,
				showZoom: true,
				showCompass: true,
			})
		);

		// Save the map instance
		mapInstance.current = myMap;

		// Add origin and destination markers
		originMarkerRef.current = new Marker({
			draggable: true,
			color: 'red',
		})
			.setLngLat([markerOrigin.lng, markerOrigin.lat])
			.addTo(myMap);

		destinationMarkerRef.current = new Marker({
			color: 'blue',
			draggable: true,
		})
			.setLngLat([markerDestination.lng, markerDestination.lat])
			.addTo(myMap);

		originMarkerRef.current.on('dragend', () => {
			const lngLat = originMarkerRef.current!.getLngLat();
			console.log(lngLat);

			setMarkerOrigin({ lng: lngLat.lng, lat: lngLat.lat });
			reverseGeocodeMarkerOrigin({ lng: lngLat.lng, lat: lngLat.lat });
		});
		destinationMarkerRef.current.on('dragend', () => {
			const lngLat = destinationMarkerRef.current!.getLngLat();
			setMarkerDestination({ lng: lngLat.lng, lat: lngLat.lat });
			reverseGeocodeMarkerDestination({
				lng: lngLat.lng,
				lat: lngLat.lat,
			});
		});

		myMap.addControl(
			new GeolocateControl({
				positionOptions: { enableHighAccuracy: true },
				trackUserLocation: true,
			})
		);

		// Ensure we wait for the style to load before adding layers
		myMap.on('style.load', () => {
			console.log('Style loaded successfully.');
		});
	}, [markerOrigin, markerDestination]);

	useEffect(() => {
		if (originMarkerRef.current) {
			originMarkerRef.current.setLngLat([
				markerOrigin.lng,
				markerOrigin.lat,
			]);
		}
	}, [markerOrigin]);
	useEffect(() => {
		if (destinationMarkerRef.current) {
			destinationMarkerRef.current.setLngLat([
				markerDestination.lng,
				markerDestination.lat,
			]);
		}
	}, [markerDestination]);

	// Update the polyline when `polyCords` changes
	useEffect(() => {
		if (!mapInstance.current) return;

		const myMap = mapInstance.current;
		const geoJsonLine: Feature<LineString> = {
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: polyCords,
			},
			properties: {},
		};

		if (myMap.isStyleLoaded()) {
			if (myMap.getSource('route')) {
				(myMap.getSource('route') as GeoJSONSource).setData(
					geoJsonLine
				);
			} else {
				myMap.addSource('route', {
					type: 'geojson',
					data: geoJsonLine,
				});
				myMap.addLayer({
					id: 'route',
					type: 'line',
					source: 'route',
					layout: {
						'line-join': 'round',
						'line-cap': 'round',
					},
					paint: {
						'line-color': '#0f53ff',
						'line-width': 7,
						'line-opacity': 0.75,
					},
				});
			}
		} else {
			myMap.once('style.load', () => {
				if (!myMap.getSource('route')) {
					myMap.addSource('route', {
						type: 'geojson',
						data: geoJsonLine,
					});
					myMap.addLayer({
						id: 'route',
						type: 'line',
						source: 'route',
						layout: {
							'line-join': 'round',
							'line-cap': 'round',
						},
						paint: {
							'line-color': '#3887be',
							'line-width': 5,
							'line-opacity': 0.75,
						},
					});
				}
			});
		}
	}, [polyCords]);

	return (
		<div ref={mapRef} className="w-full h-screen">
			OlaMaplibre
		</div>
	);
};

export default OlaMaplibre;
