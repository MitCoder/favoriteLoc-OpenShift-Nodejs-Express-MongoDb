jQuery(document).ready(function($) {
  
  			$('div .musicHomeWrapper a').click(function(){
  				
	  		    var aText=$(this).text();
	  		    var albumText=aText.replace(/\s/g, '')
	  			var linkName=document.location.href;
		   		loc=linkName;
				var params = loc.split("/");
				var fileName=params[params.length-1];
				var link=linkName.replace(fileName,"");

				link=link+"musicAlbums.html"+"?"+albumText;
			
			checkCookie();				
			function checkCookie()
			{
				var album=getCookie("albumName");
				if (album!="")
				{
				 	 console.log("Welcome again " + album);
				 	 deleteAllCookies();
    			     setCookie("albumName",albumText,50);

				}
				else 
				{ 
				  album = albumText;
				  console.log(album);
				  if (album!="" && album!=null)
				  { console.log("check else" +album);
				    setCookie("albumName",album,50);
				  }
				}
			}
			function getCookie(cname)
			{
				var name = cname + "=";
				var ca = document.cookie.split(';');
				for(var i=0; i<ca.length; i++) 
				{
				  var c = ca[i].trim();
				  if (c.indexOf(name)==0) 
				  return c.substring(name.length,c.length);
				}
				return "";
			}
			function setCookie(cname,cvalue,exdays)
			{ 
				var d = new Date();
				d.setTime(d.getTime()+(exdays*24*60*60*1000));
				var expires = "expires="+d.toGMTString();
				document.cookie = cname+"="+cvalue+"; "+expires;
				console.log(document.cookie);
			}
			function deleteAllCookies() 
			{
			    var cookies = document.cookie.split(";");
				console.log("delete cookie function"+cookies);
			    for (var i = 0; i < cookies.length; i++) 
			    {
			    	var cookie = cookies[i];
			    	var eqPos = cookie.indexOf("=");
			    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  		  		}
		   }				
				
				window.location(link);
				//window.open(link,"self",false);			

 	 });
 			
});   