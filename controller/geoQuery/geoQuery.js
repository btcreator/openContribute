const AppError = require('./../../utils/appError');
const axios = require('axios');

// Create geolocation query for mongo DB
exports.createGeoQuery = async function (center, dist, unit, address, locationData) {
  // if distance resolves to undefined, then radius to NaN
  const distance = +dist ?? undefined;
  const radius = unit === 'mi' ? distance / 3958.8 : distance / 6378.1;

  // first priority on localization has center with distance, then address with distance and as last address box
  const geolocation = !(center && distance) && address ? await judgeLocationData(address, locationData) : undefined;

  // set data for cookie - mutate locationData
  locationData.lastLoc = geolocation;

  if (geolocation) {
    if (distance) return { 'locations.coordinates': { $geoWithin: { $centerSphere: [geolocation.center, radius] } } };
    else if (geolocation.box) return { 'locations.coordinates': { $geoWithin: { $box: geolocation.box } } };
  } else if (center && distance) {
    let [lat, lon] = center.split(',');
    lat = +lat;
    lon = +lon;

    if (typeof lat === 'number' && typeof lon === 'number')
      return { 'locations.coordinates': { $geoWithin: { $centerSphere: [[lon, lat], radius] } } };
  }

  return {};
};

// Locate address coordinates (limit call for 1 result)
async function locateAddress(address) {
  console.log('Call for address');
  const link = `https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&limit=1&apiKey=${process.env.GEOAPIFY_API_KEY}`;
  const response = await axios(encodeURI(link));
  if (!response.data.results?.length)
    throw new AppError(404, 'Address could not be located. Try with a different nearby location.');

  // geoapify provide always the center of the address but not the bbox.
  const location = response.data.results[0];
  const center = [location.lon, location.lat];
  const box = location.bbox
    ? [
        [location.bbox.lon1, location.bbox.lat1],
        [location.bbox.lon2, location.bbox.lat2],
      ]
    : undefined;

  return { center, box };
}

// Save geoapify calls
async function judgeLocationData(address, locationData) {
  return locationData.lastLoc ? locationData.lastLoc : await locateAddress(address);
}
