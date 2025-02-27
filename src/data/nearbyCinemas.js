import { useEffect, useMemo, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { point } from "@turf/helpers";
import distance from "@turf/distance";
import { sortBy, memoize } from "lodash";
import allCinemas from "./cinemas";

const cinemasWithPoints = allCinemas.map((cinema) => ({
  ...cinema,
  loc: point([cinema.lng, cinema.lat]),
}));

const computeCinemaDistance = memoize((lat, lng) => {
  const location = point([lng, lat]);
  return sortBy(
    cinemasWithPoints.map((cinema) => ({
      ...cinema,
      distance: distance(location, cinema.loc),
    })),
    "distance"
  );
});

const useNearbyCinemas = () => {
  const { coords, getPosition, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!isGeolocationEnabled) {
      getPosition();
    }
  }, [isGeolocationAvailable, isGeolocationEnabled, getPosition]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const cinemas = useMemo(() => {
    if (!userLocation) return [];
    return computeCinemaDistance(
      userLocation.latitude,
      userLocation.longitude
    ).slice(0, 15);
  }, [userLocation]);

  return {
    isGeolocationAvailable,
    isGeolocationEnabled,
    coords,
    cinemas,
    userLocation,
  };
};

export default useNearbyCinemas;
