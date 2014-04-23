/*
 * Author: Mithila Reid
 * Date: April 22,2014
 * This file is called by clientNode.js.
 */
;(function($) {
 
  (function() {
      
  })();
 
  $util = {
     ajaxGet: function(currLocation,callback)
     {
         
		$.ajax({
				type: "GET",
				url: "http://favloc-favspot.rhcloud.com/index",
				contentType: "application/json",
				data: JSON.stringify(currLocation) ,
				dataType: "text",//type of data expecting from server
				success: function(response){
					console.log("get request success");
      			callback(response);
               },				error: function( error ){
    				console.log( "ERROR:", error );

				}
			});
     },
     ajaxPost: function(currLocation,callback)
     { console.log(currLocation);
         
		$.ajax({
				type: "POST",
				url: "http://favloc-favspot.rhcloud.com",
				contentType: "application/json",
				data: JSON.stringify(currLocation),
				dataType: "text",
				success: function( response ){
					console.log("post "+response);	
					callback(response);					
				},
				error: function( error ){

    				console.log( "ERROR:", error );

				}
			});
     },
     ajaxPut: function(currLocation,callback)
     {
        console.log(JSON.stringify(currLocation)); 
        $.ajax({
				type: "PUT",
				url: "http://favloc-favspot.rhcloud.com",
				contentType: "application/json",
				data: JSON.stringify(currLocation),
				dataType: "text",
				success: function( response ){
				console.log("put request success");
				console.log(response);
				callback(response);
	
					
				},
				error: function( error ){
    				console.log( "ERROR:", error );

				}
			});
		
     },
      ajaxDelete: function(id,callback)
     {  console.log("ajax delete");
        console.log(JSON.stringify(id)); 
        $.ajax({
				type: "DELETE",
				url: "http://favloc-favspot.rhcloud.com",
				contentType: "application/json",
				data: JSON.stringify(id),
				dataType: "text",
				success: function( response ){
					console.log("delete request success");
					console.log(response);	
					callback(response);			
				},
				error: function( error ){
    				console.log( "ERROR:", error );

				}
			});
		
     },/*The user can update the existing location. This function is called when the user needs to update a existing location with a new location.
        Function calcuates the validity of newly entered location, retreives the latitude and longitude and calculates city name. 
     */
     getLatLong: function(location,callback)
     {     
     	   var updateLocationArr=[]; 
           var geocoderNew =  new google.maps.Geocoder();
		   geocoderNew.geocode( { 'address': location}, function(results, status) {
		   if (status == google.maps.GeocoderStatus.OK)
		   {
				  address=results[0].formatted_address;
						            
				  for (var i=0; i<results[0].address_components.length; i++)
				  {     console.log(results[0].address_components);
				        for (var b=0;b<results[0].address_components[i].types.length;b++)
				        {									            	 
				                if (results[0].address_components[i].types[b] == "locality")
				                {   console.log(results[0].address_components[i]);
	                                updateLocationArr.push({"city":results[0].address_components[i].long_name,"address":address,"latitude":results[0].geometry.location.lat(),"longitude":results[0].geometry.location.lng()});

				                    break;
				                }
							                
								              
				          }
	        	   }
				   callback( updateLocationArr);
    			       							
		     }
		     else
		     {
				   alert("Something got wrong, location entered to update the existing one was invalid " + status);
			 }
      	 });
        	
     }
};
})(jQuery);