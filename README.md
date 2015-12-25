# Prison-Architect-Web-Planner
A web based prison planner for the game: Prison Architect
 
**Open source under the GPL license.**  
**Live Demo: Remind me **  

Please note that this is just a hobby project I put together in less than a week.
I made most of this from ripping from other open source projects including [Open tile map editor](https://github.com/elias-schuett/Online-Tile-Map-Editor)

----

# PLEASE UNDERSTAND THAT THIS IS A WORK IN PROGRESS AND I AM REALLY LAZY

##How To Use It

At the moment all you can do is import the sprites from your prison architect data files.

You will need these files

* materials.txt
* tileset.png
* objects.png
* people.png

To get access to these files you will need to follow the wiki: [modifying game files](http://prisonarchitectwiki.com/wiki/Modding_guide#Modifying_the_Game_Files)

When you get those files save them somewhere convinient.

To use them with this tool simply 

1. click  'add tileset'
2. choose tileset.png as the image and meterials.txt as the metadata and click add tileset in the popup
3. the window in the top right should show the pieces of the terrain you can use.

4. The objects work the same way as above using materials.txt as the metadata as well.
5. Select the tiles you want from the window and place them on the canvas.

6. People work the same way.

At the moment each tileset is tied to a single layer in the body. This is to preserve the relationship between the spritesheet and your activity. Eventually it would be nice to cut the sprite sheet apart and create a menu with the individual pieces.

##Features

###### Implemented
  
  * Menubar
  * Tileset handling
  * Layer handling
  * Drawing
  * Fancy UI

###### In Progress
  * ZOOM please
  * Prison size presets
  * Rooms
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
