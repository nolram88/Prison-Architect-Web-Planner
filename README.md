# Prison-Architect-Web-Planner
A web based prison planner for the game: Prison Architect
 
**Open source under the GPL license.**  
**Live Demo: Remind me **  

Please note that this is just a hobby project I put together in less than a week

----

##Features

###### Implemented
  
  * Menubar
  * Tileset handling
  * Layer handling
  * Drawing
  * Fancy UI

###### In Progress

  * Animated tiles `(for a more alive environment)`
  
  * Tools `(select, fill, flip/rotate, ...)`
  * Save/Load `(JSON, XML, .prison, ...)`


##Dependencies

  * **[HTML5 FileReader API](http://www.w3.org/TR/FileAPI/#dfn-filereader)** [1]
  * **[jQuery](http://jquery.com/), [jQuery UI](http://jqueryui.com/)**
  * **[Underscore.js](http://underscorejs.org/)**, **[RequireJS](http://requirejs.org/)**


######Browser Support

  * Google Chrome
  * Mozilla Firefox
  * Opera (latest)
  * Internet Explorer 9+ [2]

Version info will be added soon.

[1] Ajax is used as a fallback solution  
[2] No alpha definition support (yet)


##How to Contribute

1. Install [**git**](http://git-scm.com/), [**node**](http://nodejs.org/)  and [**grunt-cli**](http://gruntjs.com/getting-started) and fork this repo:  
   `git clone https://github.com/nolram88/Prison-Architect-Web-Planner.git`
3. Enter the direcotry:  
   `cd Prison-Architect-Web-Planner`
3. Install grunt and its plugins to your directory:  
   `npm install`
4. Once you've made your changes, run grunt to minify all css/js files inside the `src` directory:  
   `grunt`

Also make sure to direct all your pull requests to the `pull-requests` branch.
