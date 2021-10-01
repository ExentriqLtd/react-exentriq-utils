import { GOOGLE_PLACES_API_KEY } from "../libs/config";


export const getAddressNameByCordinates = async (geoLocation: any) => {
  const latitude = geoLocation.latitude.toFixed(7);
  const longitude = geoLocation.longitude.toFixed(7);
  let res = [];
  const response  = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`);

  const json = await response.json();
  res = json.results; 

  return res;
};
