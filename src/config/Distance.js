import getDistance from 'geolib/es/getDistance';

export const distanceCount = (current, drLocation) => {
    const meter = getDistance(
        current,
        drLocation
    )
    return meter/1000
}