from dataclasses import dataclass, field
from datetime import datetime, timedelta
from geopy import distance
import sys

#############################
## Route measurement logic ##
#############################

# Constants

DISTANCE_THRESHOLD = 10 # Minimum distance difference to consider vehicle moving (in meters)

# Coordinates data structure

@dataclass
class Coordinate():

    # Attributes 

    time: int
    latitude: float 
    longitude: float
    distance: float

# Routes data structure

@dataclass
class Route():

    # Attributes 

    coordinates: list[Coordinate] = field(default_factory=list)

    # Setters

    def add_coordinate(self, time, latitude, longitude):
        if isinstance(time, int) and isinstance(latitude, float) and isinstance(longitude, float):
            # Calculate distance (when there is at least one coordinate existing)
            new_distance = 0
            if len(self.coordinates) > 0:
                prev_coord = (self.coordinates[-1].latitude, self.coordinates[-1].longitude)
                next_coord = (latitude, longitude)
                new_distance = distance.distance(prev_coord, next_coord).m
            # Append coordinate
            self.coordinates.append(Coordinate(time, latitude, longitude, new_distance))

    # Measurements

    def average_speed(self):
        # Moving time is the same as the total distance and the total time
        # Return value in kilometers per hour (km/s -> km/h)
        return self.total_distance() / self.total_time() * 3600

    def moving_speed(self):
        # Moving speed gets rid of stopped time to calculate the average speed
        # Return value in kilometers per hour (km/s -> km/h)
        if self.time_moving() > 10 :
            return self.total_distance() / self.time_moving() * 3600
        else :
            return 0


    def max_speed(self):
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
        time_stopped = 0
        for idx, coord in enumerate(self.coordinates):
            # Just consider vehicle stopped when under threshold
            # and the current coordinate is not the first registered
            if (coord.distance < DISTANCE_THRESHOLD and idx > 0):
                prev_coord = self.coordinates[idx - 1]
                time_stopped += coord.time - prev_coord.time
        return time_stopped

    def time_moving(self):
        # Moving time is the same as the difference between the total time
        # and the stopped time
        return self.total_time() - self.time_stopped()

    def total_distance(self):
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

# Retrieve coordinates data

n = len(sys.argv)
if n < 2:
    print('Falta fichero de coordenadas')
    sys.exit()
fichero = sys.argv[1]
salida = fichero + '.ok'
route = Route()
read_file = open('../data/' + fichero)
for line in read_file:
    row = line.split(',')
    route.add_coordinate(int(row[0]), float(row[2]), float(row[3]))

# Return calculated data

#write_file = open('../out/' + str(datetime.now()) + '.txt', 'x')
write_file = open('../out/' + salida, 'w')
sys_stdout = sys.stdout
sys.stdout = write_file

print('TOTAL DISTANCE:', route.total_distance(), 'km')
print('TOTAL TIME:', timedelta(0, route.total_time()), 'hh/mm/ss')
print('TIME MOVING:', timedelta(0, route.time_moving()), 'hh/mm/ss')
print('TIME STOPPED:', timedelta(0, route.time_stopped()), 'hh/mm/ss')
print('AVERAGE SPEED:', route.average_speed(), 'km/h')
print('MOVING SPEED:', route.moving_speed(), 'km/h')
print('MAX SPEED:', route.max_speed(), 'km/h')

sys.stdout = sys_stdout