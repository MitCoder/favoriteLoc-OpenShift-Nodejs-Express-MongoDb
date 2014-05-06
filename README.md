Utility: This is an application to view current location, add a new location along with its tag, update and delete locations.The application is
hosted on http://favloc-favspot.rhcloud.com/.

UI:HTML,Bootstrap
Javascript:jquery
Server-side scripting:Nodejs express
Database:Mongodb
Host:openshift


Application:
1. The user can view its current location which is also incorporated on the map. The current location on the map is shown with a green marker.

2. The user can view a list of all locations that have been added along with the address and tag. User can update and delete, each location.
The list of locations are shown in the map with a red marker.

3. The user can add a new location. The user can add the default current location or type a new locaiton. If a new location is entered, the 
respective latitude and longituded is calculated and stored in mongodb,along with address, city name and id. 

4.The user can update from the list of locations stored. By default, user can update the respective row with Current location or a new 
location.If new location is entered, respective latitude and longitude is calculated and stored in mongodb,along with address, city name and id.

5.The user can also delete a location from list of locations. 

On submit for add,update and delete operations the page is refreshed. The respective changes are reflected in the list as well as the map.