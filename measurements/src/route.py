from dataclasses import dataclass, field
from datetime import timedelta
from geopy import distance
from pathlib import Path
import json, string, time

#################################################
##           Route measurement logic           ##
#################################################

##                                             ##
##                  Constants                  ##
##                                             ##

# Minimum distance difference to consider vehicle moving 
# (In meters)
DISTANCE_THRESHOLD = 10 

# Minimum time difference to consider route current 
# (In miliseconds)
REAL_TIME_MINIMUM_GAP = 5 * 60 * 1000 

##                                             ##
##          Coordinates data structure         ##
##                                             ##

@dataclass
class Coordinate():

    # Attributes 

    time: int
    lat: float 
    lng: float
    distance: float

##                                             ##
##            Routes data structure            ##
##                                             ##

@dataclass
class Route():

    # Attributes 

    file: string
    coordinates: list[Coordinate] = field(default_factory=list)

    # Constructor

    def __post_init__(self):
        # Retrieve coordinates data
        read_file = open(self.file)
        for line in read_file:
            row = line.split(',')
            if len(row) > 0:
                self.add_coordinate(int(row[0]), float(row[1]), float(row[2]))

    # Setters

    def add_coordinate(self, time, lat, lng):
        # Check whether values provided are valid or not
        if isinstance(time, int) and isinstance(lat, float) and isinstance(lng, float):
            # Calculate distance (when there is at least one coordinate existing)
            new_distance = 0
            if len(self.coordinates) > 0:
                prev_coord = (self.coordinates[-1].lat, self.coordinates[-1].lng)
                next_coord = (lat, lng)
                new_distance = distance.distance(prev_coord, next_coord).m

            # Append coordinate
            self.coordinates.append(Coordinate(time, lat, lng, new_distance))

    # Measurements

    def average_speed(self):
        # When less than one coordinate no speed can be provided
        if len(self.coordinates) < 1:
            return 0

        # Moving time is the same as the total distance and the total time
        # Return value in kilometers per hour (km/s -> km/h)
        return self.total_distance() / self.total_time() * 3600

    def moving_speed(self):
        # When less than one coordinate no speed can be provided
        if len(self.coordinates) < 1:
            return 0

        # Moving speed gets rid of stopped time to calculate the average speed
        # Return value in kilometers per hour (km/s -> km/h)
        return self.total_distance() / self.time_moving() * 3600

    def max_speed(self):
        # When less than one coordinate no speed can be provided
        if len(self.coordinates) < 1:
            return 0

        # Calculate max speed
        max_speed = 0
        for idx, coord in enumerate(self.coordinates):
            if (idx > 0):
                prev_coord = self.coordinates[idx - 1]
                time = coord.time - prev_coord.time
                speed = coord.distance / time
                if speed > max_speed:
                    max_speed = speed

        # Return value in kilometers per hour (m/s -> km/h)
        return max_speed * 3.6

    def time_stopped(self):
        # When less than one coordinate no time can be provided
        if len(self.coordinates) < 1:
            return 0

        # Calculate stopped time
        time_stopped = 0
        for idx, coord in enumerate(self.coordinates):
            # Just consider vehicle stopped when under threshold
            # and the current coordinate is not the first registered
            if (coord.distance < DISTANCE_THRESHOLD and idx > 0):
                prev_coord = self.coordinates[idx - 1]
                time_stopped += coord.time - prev_coord.time
        return time_stopped

    def time_moving(self):
        # When less than one coordinate no time can be provided
        if len(self.coordinates) < 1:
            return 0

        # Moving time is the same as the difference between the total time
        # and the stopped time
        return self.total_time() - self.time_stopped()

    def total_distance(self):
        # When less than one coordinate no distance can be provided
        if len(self.coordinates) < 1:
            return 0

        # Calculate total distance
        total = 0
        for coord in self.coordinates: 
            total += coord.distance

        # Return value in kilometers (m -> km)
        return total / 1000 

    def total_time(self):
        # When less than two coordinates no time can be provided
        if len(self.coordinates) < 2:
            return 0

        # Result is the difference between the first and last registers
        return self.coordinates[-1].time - self.coordinates[0].time

    # File I/O

    def save(self):
        # When less than one coordinate no file will be saved
        if len(self.coordinates) < 1:
            return 0

        # Create name
        name = Path(self.file).stem
        if len(self.coordinates) > 0 and self.coordinates[-1].time + REAL_TIME_MINIMUM_GAP >= time.time() :
            name = "current"
            
        # Create file
        write_file = open('../out/' + name + '.json', 'w')

        # Create JSON
        route = json.dumps({
            "coordinates": [coord.__dict__ for coord in self.coordinates],
            "distance": {
                "value": self.total_distance(),
                "unit": 'km'
            },
            "time": {
                "total": {
                    "value": str(timedelta(0, self.total_time())),
                    "unit": "hh/mm/ss"
                },
                "moving": {
                    "value": str(timedelta(0, self.time_moving())),
                    "unit": "hh/mm/ss"
                },
                "stopped": {
                    "value": str(timedelta(0, self.time_stopped())),
                    "unit": "hh/mm/ss"
                }
            },
            "speed": {
                "average": {
                    "value": self.average_speed(),
                    "unit": "km/h"
                },
                "max": {
                    "value": self.max_speed(),
                    "unit": "km/h"
                },
                "moving": {
                    "value": self.moving_speed(),
                    "unit": "km/h"
                }
            }
        })

        # Save JSON into file
        write_file.write(route)

        # Return whether file is the current route or not
        return name == "current"

#################################################
##                 End of file                 ##
#################################################