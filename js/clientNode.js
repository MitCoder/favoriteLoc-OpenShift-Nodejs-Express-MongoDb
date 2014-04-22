/*
 Author: Mithila Reid
 Date: April 23,2014
 Purpose: The code does the following:
 1. Calculates current location of the user
 2. Allows the user to add a new location other than current location as well as tag(eg: work,home).
 3. Retrieve all the locations that the user has added
 4. Update the selected location to current location or location added by user
 5. Delete the location
 Note: This javascript file refers util.js file to call ajax requests and calculate latitude and longitude of a location. 

 * */

jQuery(document).ready(function($) {
  var countLocationList=0;
  var geocoder;
  var currLocation=[];
 if (navigator.geolocation)
 { 
    navigator.geolocation.getCurrentPosition(showPosition,errorfunction);
 }
 else
 {
  	console.log("Geolocation is not supported by this browser.");
 }
  
function showPosition(position)
{
    console.log(position.coords.latitude +"longitide" + position.coords.longitude);	
    geocoder = new google.maps.Geocoder();
    infoLatLong(position.coords.latitude,position.coords.longitude);
}
  
    
function errorfunction()
{
	console.log("errorfunction");
 }

 
function infoLatLong(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    var address;
    geocoder.geocode({'latLng': latlng}, function(results, status){
    	
      if (status == google.maps.GeocoderStatus.OK)
      {
	        if (results[1]) 
	        {
	       	  	//formatted address
	       	  	address=results[0].formatted_address;
	            $('.currentLocation').html(results[0].formatted_address);

	            for (var i=0; i<results[0].address_components.length; i++)
	            {
		            for (var b=0;b<results[0].address_components[i].types.length;b++)
		            {         	 
						//get city information
		                if (results[0].address_components[i].types[b] == "locality")
		                {
		                    city= results[0].address_components[i];
		                    break;
		                }
		              
		            }
	         }
           currLocation.push({"city":city.long_name,"address":address,"latitude":lat.toString(),"longitude":lng.toString()});
           $util.ajaxGet(currLocation,function(response){
             
    	     var jsonRes=JSON.parse(response);
			 var appendStr="";
		     console.log(jsonRes);
			 $("#listLocationStart").append('<ol class="tracks"> </ol>');
				    
			 for (var i=0;i<jsonRes.length;i++)
			 {       countLocationList++;
                     appendStr=appendStr+'<li class="track"><span class="title">'+jsonRes[i].city+'</span>';
                     appendStr=appendStr+'<span class="title">'+jsonRes[i].address+'</span><span class="title">'+jsonRes[i].application+'</span>';
                     appendStr=appendStr+'<img src="img/update.jpg" id="updateLocation" data="'+jsonRes[i].id+'" width="35" height="35" style="margin:0x padding:14px"><img src="img/delete.jpg" id="deleteLocation" data="'+jsonRes[i].id+'" width="35" height="35"/></li>';       					 
       					    		           
            }  
            $(".tracks").append(appendStr);
				
			//if user clicks update icon, text box appears
		    $(".tracks #updateLocation").click(function(){  
			     	var id=$(this).attr("data");
			     	console.log("id of the user click "+id);
			     	
			      	$(this).after('<input type="text" id="updateLocationText" name="'+id+'" value="Current Location"><img src="img/update.jpg" name="'+id+'" id="updateSend" width="35" height="35">');
			        $(this).next().next().next().hide();
			      	$(this).hide();

             });  
             //code to update the location,if user clicks update icon
             $(document).on('click',"#updateSend",function(){
              
				   	var id=$(this).attr("name");
				   	var updateLocation=$("input:text[name='"+id+"']").val();
				   	console.log(id+updateLocation);	//retrieve content of text and id text box
				   	
				   	//By default the user can update the location field with Current Location.
				    if(updateLocation!='Current Location')//if user enters a different location,other than Current Location
				   	{ 	
				   		//Get latitude,longitude and city name of the location entered in the update field	  	
					  	$util.getLatLong(updateLocation,function(updateTest){//passing a callback function
					  		if(updateTest)
					  		{
					  	       updateTest[0]["id"]=id;	
					  	       updateTest[0]["application"]="";	
	
							   $util.ajaxPut(updateTest);//ajax call to update location information
	   
					  		}
					  	});	
				  	}	
				  	else//if user wants the existing location to be updated with Current Location
				  	{
				  		currLocation[0]["id"]=id;	
					  	currLocation[0]["application"]="";	
				  		$util.ajaxPut(currLocation);//ajax call to update location information.				  		
				  	}		  	
				    
             });
             //delete the specific record pertaining to particular row clicked.	
             $(".tracks #deleteLocation").click(function(){  
             	    var updateArr=[];
				    var id=$(this).attr("data");
				    updateArr.push({"id":id});
				   	console.log("client delete"+id);	
				    $util.ajaxDelete(updateArr);//ajax call to delete location information
	  	     });  
	  	    
              		  	
            }); //end of fn
	          
	          
	        }
	         else 
	        {
	          alert("No results found");
	        }
      }
      else
      {
        console.log("Geocoder failed due to: " + status);
      }
    });
    
 }

 
 
//textbox for location and tag allows the user to add a new location on clicking the radio button.
 $("input:radio[name='addLocationRadio']").change(function(){  
      if(this.checked)
      {       
             $("#addLocationText").append('<input type="text" name="addLocationText" value="Current Location"> </input> Tag As <input type="text" name="addLocationTag" value=""> </input><img src="img/save.jpg" id="logo" width="35" height="35">');
      }
		 	
     console.log(JSON.stringify(currLocation));


          //To insert a location			
			$("#logo").click(function(){  
		          var application=$("input:text[name='addLocationTag']").val();
		          var location=$("input:text[name='addLocationText']").val();
				  
				  /* By default the user can add the Current Location.
				    If user enters a different location, then the below code calculates latidude and longitude of the different location entered
				     and also stores the tag
				  */
		          if(location!='Current Location')
		          {       	
		                var address;
						var geocoderNew =  new google.maps.Geocoder();
						geocoderNew.geocode( { 'address': location}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
						         address=results[0].formatted_address;
						            
						         for (var i=0; i<results[0].address_components.length; i++)
						         {   
						               for (var b=0;b<results[0].address_components[i].types.length;b++)
							           {									            	 
							                if (results[0].address_components[i].types[b] == "locality")
							                {   console.log(results[0].address_components[i]);
							                    currLocation[0]["city"]= results[0].address_components[i].long_name;
							                    console.log(JSON.stringify(currLocation));
							                    break;
							                }
							                
									              
							            }
	        				    }
							            
							    currLocation[0]["address"]=address;							            
							    currLocation[0]["latitude"]=results[0].geometry.location.lat();
							    currLocation[0]["longitude"]=results[0].geometry.location.lng();
    							currLocation[0]["application"]=application;
    							currLocation[0]["id"]=countLocationList.toString();

    							
		          				console.log(JSON.stringify(currLocation));
        					    $util.ajaxPost(currLocation);//add new different location other than Current Location through ajax POST request.

					    } else {
							            alert("Something got wrong " + status);
						  }
      			  });	          	
		          	
		     }
		     else
		     {
		          currLocation[0]["application"]=application;
		          currLocation[0]["id"]=countLocationList.toString();

       		      console.log(JSON.stringify(currLocation));
       		      $util.ajaxPost(currLocation);//add the default Current Location through ajax POST request

		      }
			       
    	});//save location click end
		
   });//radio button click end
    	

});   