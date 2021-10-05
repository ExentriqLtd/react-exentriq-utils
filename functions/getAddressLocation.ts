import { GOOGLE_PLACES_API_KEY } from "../libs/config";

export const getAddressNameByCordinates = async (geoLocation: any,callback) => {
  const latitude = geoLocation.latitude.toFixed(7);
  const longitude = geoLocation.longitude.toFixed(7);
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`)
  .then((response)=>response.json())
  .then((responseData) => {
    callback(responseData.results);
  })
  .catch(error => {
    console.warn("getAddressNameByCordinates::error",error)
    callback([]);
  });
};
