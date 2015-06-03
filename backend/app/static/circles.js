var kval = 0;
var clicked = true;

var zooming;
var vis;

var width = 500,
    height = 465;
    

var DEFAULT_COLOR =  "black";
var BASE_SIZE = .125;
var BASE_ZOOM = 1;
var BACKGROUND = "#000";
    
var zoomHandler = d3.behavior.zoom().scaleExtent([BASE_ZOOM, 64]);  
var identityScale = d3.scale.linear()
                          .domain([-1, 1])
                          .range([0, width]);  


var name_game;
var windowwidth; 
function init(kvalues, initial_k) {

    //set up a scale which defaults in mapping points from 0-2
    //to 0 to the width, which maps our points appropriately

    
    //the zooming function that allows panning and zooming
    function zoomFunct() {
      svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    
    //null function to disable zooming
    function disableZoom() {}
    
    //variable to change zoom behaviour
    var zooming = zoomFunct;

    function start_overlay() {
        //show the overlay
        var overlay_white = document.getElementById("overlay_scroll");
        var overlay_box = document.getElementById("specialBox");
        overlay_white.style.display = "block";
        overlay_box.style.display = "block";
        
        //hide main content
        d3.select("#main_wrapper").classed("main_wrapper_unhidden", false);
        d3.select("#main_wrapper").classed("main_wrapper_hidden", true);
        clicked = true;
    }
    
    function close_overlay() {
        //close the overlay
        var overlay_white = document.getElementById("overlay_scroll");
        var overlay_box = document.getElementById("specialBox");
        overlay_white.style.display = "none";
        overlay_box.style.display = "none";
        
        //remove all game enries that were added
        d3.select("#specialBox").selectAll("p").remove();
        
        //show main content
        d3.select("#main_wrapper").classed("main_wrapper_unhidden", true);
        d3.select("#main_wrapper").classed("main_wrapper_hidden", false);
        
        //disable the overlay_scroll click event
        d3.select("#overlay_scroll")
          .on("click", null);

    }   
    
    windowwidth = 1186;

    //create the base svg document
    var svg = d3.select(".content").append("svg:svg")
        .attr("width", windowwidth)
        .attr("height", height)
      .append("svg:g")
      .attr("id", "zoomEvent")
        .call(zoomHandler.on("zoom", zooming))
      .append("svg:g");
    
    
    //create a global variable vis to edit the svg elsewhere
    vis = svg;
    
    
    //svg.on("dblclick.zoom", reset_zoom());
    //creates an overlay layer which is used in the transformation
    var rect = svg.append("rect")
        .attr("id", "overlay")
        .attr("width", windowwidth)
        .attr("height", height);
    
    function radius_size(c_size) {
        return c_size/100 + BASE_SIZE;
    }
    
    //create circles for the k-value of i
    function make_circle(i) {
      svg.selectAll("circle").remove(); //remove all old circles
      svg.selectAll("circle")
        .data(kvalues[i])
        .enter().append("circle")
        .attr("x", function(d) {
             return d.xcoor;
        })
        .attr("y", function(d) {
             return d.ycoor;
        })
        .attr("r", function(d) {
            return radius_size(d.size);
        }) //radius of 1
        //scale for the zoom/pan/to the svg element size 
        .attr("transform", function(d) { return "translate(" +  [identityScale(d.xcoor) + (windowwidth/2 - 250), identityScale(d.ycoor)] + ")"; })
        .attr("fill",DEFAULT_COLOR)
        .attr("id", function(d) { return d.title; })
        //on click start up the overlay and add the links to the games in each cluster
        .on("click.d3", function(d) {
            // Create a continuity between the clicked-on circle and the zoomed-in SVG
            // that lists its games by stylizing the latter to have the same background
            // color as the former
            OLD_GOLD = "#D8CF00";
            currentFillColorOfThisCluster = d3.select(document.getElementById(d.title)).attr("fill");
            if (currentFillColorOfThisCluster == OLD_GOLD) {
              classToUseForZoomedInCircle = "specialBoxOldGold";
              document.getElementById("specialBox").style.background = OLD_GOLD;
              document.getElementById("specialBox").style.color = "black";
            }
            else {
              classToUseForZoomedInCircle = "specialBox";
              document.getElementById("specialBox").style.background = "black";
              document.getElementById("specialBox").style.color = "white";
            }
            document.getElementById("specialBox").className = classToUseForZoomedInCircle;
            d3.select("#specialBox")
              .selectAll("p")
              .data(d.games)
              .enter().append("p")
              .append("a")
              .attr({"xlink:href": "#"})
              .on("mouseover", function(datum) {
                d3.select(this).attr({"xlink:href": datum.link});
              })
              .on("click", function(datum) {
                 window.open(datum.link);
              })
              .text(function(datum) {return datum.title;});
            start_overlay();
         })
         //show the tooltip 
         .append("svg:title")
         .text(function(d) { return d.title + " (" + d.year + ")\nand " + d.size + " other games"; });
    }
    
    //reset the zoom by moving to 0,0 setting scale to 1,
    //then notifying the handler of the changes made
    function reset_zoom() {
        zoom_level(BASE_ZOOM);
    }
    
    //setup our ui
    d3.select("#option1")
        .on("click.d3", function() {
            make_circle(0);
            kval = 0;
            reset_zoom()
            $('#option1').focus();
        })   
    d3.select("#option2")
        .on("click.d3", function(d,i) {
            make_circle(1);
            kval = 1;
            reset_zoom()
        }) 
    d3.select("#option3")
        .on("click.d3", function(d,i) {
            make_circle(2);
            kval = 2;
            reset_zoom()
        })   
    d3.select("#option4")
        .on("click.d3", function(d,i) {
           make_circle(3);
           kval = 3;
           reset_zoom()
        }) 
    d3.select("#option5")
        .on("click.d3", function(d,i) {
            make_circle(4);
            kval = 4;
            reset_zoom()
        })   
    d3.select("#option6")
        .on("click.d3", function(d,i) {
            make_circle(5);
            kval = 5;
            reset_zoom()
        }) 
    d3.select("#option7")
        .on("click.d3", function(d,i) {
            make_circle(6);
            kval = 6;
            reset_zoom()
        })   
    d3.select("#option8")
        .on("click.d3", function(d,i) {
            make_circle(7);
            kval = 7;
            reset_zoom()
        }) 
    d3.select("#option9")
        .on("click.d3", function(d,i) {
            make_circle(8);
            kval = 8;
            reset_zoom()
        })   
    d3.select("#option10")
        .on("click.d3", function(d,i) {
            make_circle(9);
            kval = 9;
            reset_zoom()
        }) 
    d3.select("#option11")
        .on("click.d3", function(d,i) {
            make_circle(10);
            kval = 10;
            reset_zoom()
        })   
    d3.select("#option12")
        .on("click.d3", function(d,i) {
            make_circle(11);
            kval = 11;
            reset_zoom()
        }) 
    d3.select("#option13")
        .on("click.d3", function(d,i) {
            make_circle(12);
            kval = 12;
            reset_zoom()
        })   
    d3.select("#option14")
        .on("click.d3", function(d,i) {
            make_circle(13);
            kval = 13;
            reset_zoom()
        }) 
    d3.select("#option15")
        .on("click.d3", function(d,i) {
            make_circle(14);
            kval = 14;
            reset_zoom()
        })   
    d3.select("#option16")
        .on("click.d3", function(d,i) {
            make_circle(15);
            kval = 15;
            reset_zoom()
        }) 
    d3.select("#option17")
        .on("click.d3", function(d,i) {
            make_circle(16);
            kval = 16;
            reset_zoom()
        })   
    d3.select("#option18")
        .on("click.d3", function(d,i) {
            make_circle(17);
            kval = 17;
            reset_zoom()
        }) 
    d3.select("#option19")
        .on("click.d3", function(d,i) {
            make_circle(18);
            kval = 18;
            reset_zoom()
        })   
    d3.select("#option20")
        .on("click.d3", function(d,i) {
            make_circle(19);
            kval = 19;
            reset_zoom()
        }) 
    d3.select("#option21")
        .on("click.d3", function(d,i) {
            make_circle(20);
            kval = 20;
            reset_zoom()
        })   
    d3.select("#option22")
        .on("click.d3", function(d,i) {
            make_circle(21);
            kval = 21;
            reset_zoom()
        }) 
    d3.select("#option23")
        .on("click.d3", function(d,i) {
            make_circle(22);
            kval = 22;
            reset_zoom()
        })   
    d3.select("#option24")
        .on("click.d3", function(d,i) {
            make_circle(23);
            kval = 23;
            reset_zoom()
        }) 
    d3.select("#option25")
        .on("click.d3", function(d,i) {
            make_circle(24);
            kval = 24;
            reset_zoom()
        })   
    d3.select("#option26")
        .on("click.d3", function(d,i) {
            make_circle(25);
            kval = 25;
            reset_zoom()
        })         
    d3.select("#option27")
        .on("click.d3", function(d,i) {
            make_circle(26);
            kval = 26;
            reset_zoom()
        })   
    d3.select("#option28")
        .on("click.d3", function(d,i) {
            make_circle(27);
            kval = 27;
            reset_zoom()
        }) 
    d3.select("#option29")
        .on("click.d3", function(d,i) {
            make_circle(28);
            kval = 28;
            reset_zoom()
        })   
    d3.select("#option30")
        .on("click.d3", function(d,i) {
            make_circle(29);
            kval = 29;
            reset_zoom()
        }) 
    d3.select("#option31")
        .on("click.d3", function(d,i) {
            make_circle(30);
            kval = 30;
            reset_zoom()
        })   
    
    //close overlay when click the outside
    d3.select("#overlay_scroll")
        .on("click.over", function() {
            if(clicked) {
                close_overlay();
            }
        });
        
    
    d3.select("#zoomEvent").call(zoomHandler.on("zoom", zooming)).on("dblclick.zoom", reset_zoom);
    zoomHandler.translate([(windowwidth/2 - windowwidth/2), (height/2 - height/2)]);
    
    $(window).resize(function() {
        // windowwidth = $("body").parent().width();
        windowwidth = 1186;
        d3.select("svg").attr("width", windowwidth);
        rect.attr("width", windowwidth);
        reset_zoom();
        make_circle(kval);
    });
    
    
    // Show an initial visualization according to what the user selected
    // for k at the splash screen
    kval = initial_k;
    make_circle(initial_k);
    reset_zoom();
}

function set_zoom(find_clust) {
    //fill everything default color
    d3.selectAll("circle").attr("fill", DEFAULT_COLOR);
   
   //reset view
    vis.attr("transform", "translate(0,0)scale(1)");

    var scale_level = (kval/10 + 1) * 2;
    var coor_x = windowwidth/2-scale_level*(identityScale(document.getElementById(find_clust).getAttribute("x")) + (windowwidth/2 - 250));
    var coor_y = height/2-scale_level*identityScale(document.getElementById(find_clust).getAttribute("y"));

    //center and zoom into the selected cluster
    vis.transition()
       .delay(250)
       .duration(750)
       .attr("transform", "translate(" +
            (coor_x).toString() + "," + (coor_y).toString() + ")" +
            "scale(" + scale_level.toString() + ")");
   
   //let the handler know where the center/zoom is
    zoomHandler.translate([coor_x,coor_y]);
    zoomHandler.scale(scale_level);
    
    // Color the selected element in GameGlobs old gold
    d3.select(document.getElementById(find_clust)).attr("fill", "#D8CF00");

}

function zoom_level(zoomLevel) {
    vis.attr("transform", "translate(" + (windowwidth/2 - (zoomLevel*(windowwidth/2))).toString() +
             ", " + (height/2 - (zoomLevel*height/2)).toString() + ")scale(" + zoomLevel + ")");
    
    zoomHandler.translate([(windowwidth/2 - (zoomLevel*(windowwidth/2))), (height/2 - (zoomLevel*height/2))]);
    zoomHandler.scale(zoomLevel);
}
