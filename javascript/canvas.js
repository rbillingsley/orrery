// check to see if the browser supports // the addEventListener function
if(window.addEventListener)
{
	window.addEventListener
	(
		'load', // this is the load event
		OnLoad, // this is the event handler we are going to write
		false // useCapture boolean value 
	);
}

// the window load event handler
function OnLoad()
{
	//canvas declarations
	var canvas;
	var context;
	
	//Planets declarations
	var planet;
	var planets; // planets array
	
	//Mode settings
	
	var modes = { planetDrawMode: 1, sunDrawMode: 1,orbitMode: 1, orbitArcMode: 1, paused: 1, drawBackground: 1, showSettings: 1};
	
	//Misc variable declarations
	var modifiers = { scale: 0.9, speed: 0.3, lineNumSegments: 8 , deltaTime: null, ellipseModifier: 1.3, spriteFrameSize: 100, spriteFrames: 6, gravitationalConstant: 0.000003 };
	
	var lastTime = Date.now(); // the current time
	var thisTime;
	
	
	//Image Declarations
	
	var backgroundImage = new Image();
	backgroundImage.src = 'images/Background.png';
	
	var sunImage = new Image();
	sunImage.src = 'images/Sun1.png';
	
	var mercuryImage = new Image();
	mercuryImage.src = 'images/Mercury1.png';
	
	var venusImage = new Image();
	venusImage.src = 'images/Venus1.png';
	
	var earthImage = new Image();
	earthImage.src = 'images/Earth1.png';
	
	var earthSheetImage = new Image();
	earthSheetImage.src = 'images/EarthSheet.png';
	
	var marsImage = new Image();
	marsImage.src = 'images/Mars1.png';
	
	var marsSheetImage = new Image();
	marsSheetImage.src = 'images/MarsSheet.png';
	
	var jupiterImage = new Image();
	jupiterImage.src = 'images/Jupiter1.png';
	
	var saturnImage = new Image();
	saturnImage.src = 'images/Saturn1.png';
	
	var uranusImage = new Image();
	uranusImage.src = 'images/Uranus1.png';
	
	var neptuneImage = new Image();
	neptuneImage.src = 'images/Neptune1.png';
	
	function KeyPressed(evt) 
	{
		switch (evt.keyCode)
		{
			case 65: // a = increase line points
				if (modifiers.lineNumSegments	< 360 && modes.planetDrawMode == 2)
				{
					modifiers.lineNumSegments++
				}
				break;
				
			case 83: // s = decrease line points
				if (modes.planetDrawMode == 2)
				{
					modifiers.lineNumSegments--
					if (modifiers.lineNumSegments == 2 && modes.planetDrawMode == 2)
					{
						modifiers.lineNumSegments = 3;
					}
				}
				break;
				
			case 77: // m = Draw mode select
				modes.planetDrawMode++;
				if (modes.planetDrawMode == 5)
				{
					modes.planetDrawMode = 1;
				}
				break;
				
			case 80: // p = Pause/Resume
				modes.paused++
				if (modes.paused == 3)
				{
					modes.paused = 1;
				}
				break;
				
			case 70: // f = increase speed
				modifiers.speed += 0.1;
				break;
				
			case 82: // r = decrease speed
				if (modifiers.speed > 0.1)
				{
					modifiers.speed -= 0.1;
				}
				break;
				
			case 73: // i = zoom in
				modifiers.scale += 0.04;
				break;
				
			case 79: // o = zoom out
				if (modifiers.scale >= 0.03 )
				{
					modifiers.scale -= 0.04;
				}
				break;
				
			case 71: // g = change orbit arc draw mode
				modes.orbitArcMode++;
				if (modes.orbitArcMode == 3)
				{
					modes.orbitArcMode = 1;
				}
				break;
				
			case 75: // k = select orbit mode
				ResetPlanets();
				modes.orbitMode++
				if (modes.orbitMode == 3)
				{
					modes.orbitMode = 1;
				}
				break;
				
			case 81: //q = toggle current settings display
				modes.showSettings++
				if (modes.showSettings ==3)
				{
					modes.showSettings = 1;
				}
				break;
				
			case 87: //w = toggle current settings display
				modes.drawBackground++
				if (modes.drawBackground ==3)
				{
					modes.drawBackground = 1;
				}
				break;
				
		}
	};
	
	function Initialise() 
	{
		canvas = document.getElementById('canvas');

		if(!canvas) 
		{	
			// make a message box pop up with the error.
			alert('Error: I cannot find the canvas element!');
			return; 
		}

		if (!canvas.getContext)
		{
			// make a message box pop up with the error.
			alert('Error: no canvas.getContext!');
			return; 
		}

		context = canvas.getContext('2d');       
		if (!context) 
		{
			alert('Error: failed to getContext!');
			return;
		}

		context.translate(canvas.width * 0.5, canvas.height * 0.5);	
		planets = new Array();

		AddPlanets();
	};
	
	
	//Populates the planets array with planets ready to be updated and drawn.
	function AddPlanets()
	{	
					   //Planet(x, 	y, radius, mass, orbitRadius, speedDevisor, name, 		planetColour, 	planetImage, planetSheetImage, moonAmount)
		planets.push(new Planet(0, 	0, 50, 		0, 	1, 			0, 				"Sun",		"#FEAE00", 		sunImage, 		null, 					0));
		planets.push(new Planet(70,	0, 4, 		0, 	70,			1, 				"Mercury",	"#DEF0E4", 		mercuryImage, 	null, 					0)); //rot*4
		planets.push(new Planet(90,	0, 4, 		0, 	90, 		2, 				"Venus",	"#D1D3AE", 		venusImage, 	null, 					0)); //rot*2.5
		planets.push(new Planet(110,0, 6, 		0, 	110, 		4, 				"Earth",	"#5BA2F0", 		earthImage, 	earthSheetImage,		1)); //rot
		planets.push(new Planet(130,0, 5, 		0, 	130, 		16, 			"Mars", 	"#FECF59", 		marsImage, 		marsSheetImage, 		0)); //rot/2
		planets.push(new Planet(170,0, 20, 		0, 	170, 		32, 			"Jupiter", 	"#CEB78E",		jupiterImage, 	null, 					0)); //rot/11
		planets.push(new Planet(220,0, 30, 		0, 	220, 		64, 			"Saturn", 	"#C38B70",		saturnImage, 	null, 					0)); //rot/29
		planets.push(new Planet(260,0, 5, 		0, 	260, 		128, 			"Uranus", 	"#0F2C70",		uranusImage, 	null, 					0)); //rot/84
		planets.push(new Planet(270,0, 2, 		0, 	270, 		256, 			"Neptune", 	"#0F2C70",		neptuneImage, 	null, 					0)); //rot/164
	};
	
	//Resets the Planet array to avoid issues when switching between orbit modes.
	function ResetPlanets()
	{	
		planets = new Array();
		AddPlanets();
	};
	
	function GameLoop()
	{
		thisTime = Date.now(); // the current time
		modifiers.deltaTime = lastTime - thisTime; // the difference

		Update(modifiers);
		Draw();

		lastTime = thisTime;
		requestAnimationFrame(GameLoop);
	};
	
	// Root update call from which everything else that updates is called
	function Update(modifiers)
	{
		for(var i = 0; i < planets.length; i+=1)
		{	
			planets[i].Update(modifiers,modes);
		}
	};
	
	//Draws the text for the Current settings panel
	function DrawText(context)
	{
		var roundedScale = Math.round(modifiers.scale*10)/10;
		var roundedSpeed = Math.round(modifiers.speed*10)/10;
		context.save();
		context.beginPath();
		context.fillStyle="#FFFFFF";
		context.lineStyle="#000000";
		context.fontStyle = "20px Arial";
		context.fillText("CURRENT SETTINGS: " ,(-canvas.width/2)+10,(-canvas.height/2)+20);
		if (modes.planetDrawMode == 1)
		{
			context.fillText("Draw Mode: Arc" ,(-canvas.width/2)+10,(-canvas.height/2)+40);
		}
		if (modes.planetDrawMode == 2)
		{
			context.fillText("Draw Mode: Line" ,(-canvas.width/2)+10,(-canvas.height/2)+40);
			context.fillText("Number of Segments: " + modifiers.lineNumSegments ,(-canvas.width/2)+100,(-canvas.height/2)+40);
		}
		if (modes.planetDrawMode == 3)
		{
			context.fillText("Draw Mode: Sprite" ,(-canvas.width/2)+10,(-canvas.height/2)+40);
		}
		if (modes.planetDrawMode == 4)
		{
			context.fillText("Draw Mode: Sprite + Spritesheet" ,(-canvas.width/2)+10,(-canvas.height/2)+40);
		}
		if (modes.orbitMode == 1)
		{
			context.fillText("Orbit Mode: Circular",(-canvas.width/2)+10,(-canvas.height/2)+60);
		}
		if (modes.orbitMode == 2)
		{
			context.fillText("Orbit Mode: Elliptical",(-canvas.width/2)+10,(-canvas.height/2)+60);
		}
		context.fillText("Zoom Scale: " + roundedScale,(-canvas.width/2)+10,(-canvas.height/2)+80);
		context.fillText("Orbit Speed: " + roundedSpeed ,(-canvas.width/2)+10,(-canvas.height/2)+100);
		if (modes.orbitArcMode == 1)
		{
			context.fillText("Orbit Path: On",(-canvas.width/2)+10,(-canvas.height/2)+120);
		}
		if (modes.orbitArcMode == 2)
		{
			context.fillText("Orbit Path: Off",(-canvas.width/2)+10,(-canvas.height/2)+120);
		}
		if (modes.paused == 2)
		{
			context.fillText("Orrery Paused",(-canvas.width/2)+10,(canvas.height/2)-20);
		}
		context.stroke();
		context.closePath();
		context.restore();
	};
	
	// Root draw call from which everything else that draws is called
	function Draw()
	{	
		context.save();
		context.beginPath();
		if (modes.drawBackground == 1)
		{
			if (modes.planetDrawMode <= 2) 
			{
				context.fillStyle = "#000000";
				context.fillRect(-canvas.width,-canvas.height,canvas.width*2,canvas.height*2);
			}
			if (modes.planetDrawMode == 3 || modes.planetDrawMode == 4 ) 
			{
				context.drawImage(backgroundImage,-canvas.width,-canvas.height,canvas.width*2,canvas.height*2);
			}
		}
		context.scale(modifiers.scale,modifiers.scale);
		context.closePath();
		context.restore();
		
		for(var i = 0; i < planets.length; i+=1)
		{	
			planets[i].Draw(context, modes, modifiers);
		}
		
		if (modes.showSettings == 1) 
		{
			DrawText(context);
		}
	};
	
	// call the initialise and draw functions 
	Initialise();
	window.addEventListener('keydown', KeyPressed, true);
	GameLoop();
}
