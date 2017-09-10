var Planet = (function () 
{
	function Planet(x, y, radius, mass, orbitRadius, speedDevisor, name, planetColour, planetImage, planetSheetImage, moonAmount)
	{	
		this.SetX(x);
		this.SetY(y);
		this.SetMoonX(this.GetX());
		this.SetMoonY(this.GetY());
		this.SetRadius(radius);
		this.SetMass(mass);
		this.SetOrbitRadius(orbitRadius);
		this.SetSpeedDevisor(speedDevisor);
		this.SetName(name);
		this.SetPlanetColour(planetColour);
		this.SetPlanetImage(planetImage, radius);
		this.SetPlanetSheetImage(planetSheetImage);
		this.SetMoonAmount(moonAmount);
		this.moons = new Array();
		this.orbit = {centerX:0, centerY:0, radius: this.GetOrbitRadius(), angle:0};
		this.CreateMoons();
		this.planetVector = new Vector(this.GetX(),this.GetY())
		this.frameIndex = 1;
		this.frameTimer = 0;
	};
	
	Planet.prototype.GetX = function()
	{
		return this.x;
	};
	Planet.prototype.SetX = function (x)
	{
		this.x = x;
	};
	
	Planet.prototype.GetY = function()
	{
		return this.y;
	};
	Planet.prototype.SetY = function (y)
	{
		this.y = y;
	};
	
	Planet.prototype.GetMoonX = function()
	{
		return this.x;
	};
	Planet.prototype.SetMoonX = function (x)
	{
		this.x = x;
	};
	
	Planet.prototype.GetMoonY = function()
	{
		return this.y;
	};
	Planet.prototype.SetMoonY = function (y)
	{
		this.y = y;
	};
	
	Planet.prototype.GetRadius = function()
	{
		return this.radius;
	};
	Planet.prototype.SetRadius = function (radius)
	{
		this.radius = radius;
	};
	
	Planet.prototype.GetMass = function()
	{
		return this.mass;
	};
	Planet.prototype.SetMass = function (mass)
	{
		this.mass = mass;
	};
	
	Planet.prototype.GetOrbitRadius = function()
	{
		return this.orbitRadius;
	};
	Planet.prototype.SetOrbitRadius = function (orbitRadius)
	{
		this.orbitRadius = orbitRadius;
	};
	
	Planet.prototype.GetSpeedDevisor = function()
	{
		return this.speedDevisor;
	};
	Planet.prototype.SetSpeedDevisor = function (speedDevisor)
	{
		this.speedDevisor = speedDevisor;
	};	
	
	Planet.prototype.GetName = function()
	{
		return this.name;
	};
	Planet.prototype.SetName = function (name)
	{
		this.name = name;
	};
	
	Planet.prototype.GetPlanetColour = function()
	{
		return this.planetColour;
	};
	Planet.prototype.SetPlanetColour = function (planetColour)
	{
		this.planetColour = planetColour;
	};
	
	Planet.prototype.GetPlanetImage = function()
	{
		return this.planetImage;
	};
	Planet.prototype.SetPlanetImage = function (planetImage, radius)
	{
		this.planetImage = planetImage;
		this.planetImage.width = radius;
		this.planetImage.height = radius;
	};
	
	Planet.prototype.GetPlanetSheetImage = function()
	{
		return this.planetSheetImage;
	};
	Planet.prototype.SetPlanetSheetImage = function (planetSheetImage)
	{
		this.planetSheetImage = planetSheetImage;
	};

	Planet.prototype.GetMoonAmount = function()
	{
		return this.moonAmount;
	};
	Planet.prototype.SetMoonAmount = function (moonAmount)
	{
		this.moonAmount = moonAmount;
	};
	
	//Creates the Moon if the planet has been constructed to allow one.
	Planet.prototype.CreateMoons = function()
	{
		var moonImage = new Image();
		moonImage.src = 'images/Mercury1.png';
		for(var i = 0; i < this.GetMoonAmount(); i+=1)
		{
		
			//		function    Moon(x, 	y, 	radius, mass, 	orbitRadius, 	speedDevisor, 	planetColour, 	planetImage,	planetSheetImage)
			this.moons.push(new Moon(270,	10, 2, 		0, 		10, 			2, 				"#ffffff",		moonImage,		null			)); //rot/164
		}
	};
	
	Planet.prototype.GetSpeed = function()
	{
		return this.speed;
	};
	Planet.prototype.SetSpeed = function (modifiers)
	{
		this.speed = modifiers.speed/this.GetSpeedDevisor();
	};
	
	Planet.prototype.UpdateCircleOrbit = function(modifiers, modes)
	{
		if (modes.paused == 1)
		{
			this.orbit.angle += (this.GetSpeed()/(-modifiers.deltaTime));
			if (this.orbit.angle > 360)
			{
				this.orbit.angle = 0;
			}
		}
		this.SetMoonX(this.orbit.centerX + Math.cos(this.orbit.angle) * this.orbit.radius);
		this.SetMoonY(this.orbit.centerY + Math.sin(this.orbit.angle) * this.orbit.radius);
	};
	
	Planet.prototype.UpdateEllipseOrbit = function(modifiers, modes)
	{
		if (modes.paused == 1)
		{
			this.orbit.angle += (this.GetSpeed()/(-modifiers.deltaTime));
			if (this.orbit.angle > 360)
			{
				this.orbit.angle = 0;
			}
		}
		this.planetVector.SetX(0 + Math.cos(this.orbit.angle) * this.orbit.radius*modifiers.ellipseModifier);
		this.planetVector.SetY(0 + Math.sin(this.orbit.angle) * this.orbit.radius);
		
		this.SetMoonX(this.planetVector.GetX());
		this.SetMoonY(this.planetVector.GetY());
	};
	
	Planet.prototype.Update = function (modifiers, modes)
	{
		this.SetSpeed(modifiers);
		if (modes.orbitMode == 1)
		{
			this.UpdateCircleOrbit(modifiers,modes);
		}
		if (modes.orbitMode == 2)
		{
			this.UpdateEllipseOrbit(modifiers,modes);
		}
		
		if (this.GetMoonAmount() > 0)
		{
			for(var i = 0; i < this.moons.length; i+=1)
			{	
				this.moons[i].Update(modifiers, modes, this.GetMoonX(),this.GetMoonY());
			}
		}
	};
	
	Planet.prototype.DrawCircleOrbitArc = function (context)
	{
		context.arc(0,0,this.GetOrbitRadius(),0,Math.PI*2, false);
	};
	
	Planet.prototype.DrawEllipseOrbitArc = function (context, modifiers)
	{	
		var ellipseNumSegments = 360;
		var anglePerSegment = (Math.PI * 2 / ellipseNumSegments);
		for (var i = 0; i <= ellipseNumSegments; i = i + 1)
		{
			var angle = anglePerSegment * i;
			var x = 0 + this.GetOrbitRadius() * Math.cos(angle)*modifiers.ellipseModifier;
			var y = 0 + this.GetOrbitRadius() * Math.sin(angle);
			if (i == 0)
			{
				context.moveTo(x,y);
			}
			else
			{
				context.lineTo(x,y);
			}
		}
	};
	
	Planet.prototype.DrawArcMode = function(context, modes, modifiers)
	{
		context.save();
		context.beginPath();
		context.scale(modifiers.scale, modifiers.scale);
		if ( modes.orbitMode == 1)
		{
			context.rotate(this.orbit.angle);
		}
		this.DrawArc(context);
		context.fillStyle = this.GetPlanetColour();
		context.fill();
		context.stroke();
		context.closePath();
		context.restore();
	
		if (this.GetMoonAmount() > 0)
		{
			for(var i = 0; i < this.moons.length; i+=1)
			{	
				this.moons[i].Draw(context, modes, modifiers);
			}
		}
	};
	
	Planet.prototype.DrawArc = function (context)
	{
		context.arc(this.planetVector.GetX(),this.planetVector.GetY(), this.GetRadius(),0, Math.PI*2, false);
	};
	
	Planet.prototype.DrawLineMode = function(context, modes, modifiers)
	{
		context.save();
		context.beginPath();

		if ( modes.orbitMode == 1)
		{
			context.rotate(this.orbit.angle);
		}
		context.closePath();
		context.restore();
		
		if (this.GetMoonAmount() > 0)
		{
			for(var i = 0; i < this.moons.length; i+=1)
			{	
				this.moons[i].Draw(context, modes, modifiers);
			}
		}
		
		context.save();
		context.beginPath();
		context.scale(modifiers.scale,modifiers.scale)
		this.DrawLines(context,modifiers);
		context.fillStyle = this.GetPlanetColour();
		context.fill();
		context.stroke();
		context.closePath();
		context.restore();
	};
	
	Planet.prototype.DrawLines = function (context, modifiers)
	{
		var anglePerSegment = (Math.PI * 2 / modifiers.lineNumSegments);
		for (var i = 0; i <= modifiers.lineNumSegments; i = i + 1)
		{
			var angle = anglePerSegment * i;
			var x = this.GetX() + this.GetRadius() * Math.cos(angle);
			var y = this.GetY() + this.GetRadius() * Math.sin(angle);
			if (i == 0)
			{
				context.moveTo(x,y);
			}
			else
			{
				context.lineTo(x,y);
			}
		}
	};
	
	Planet.prototype.DrawSpriteMode = function(context, modes, modifiers)
	{
		context.save();
		context.beginPath();
		context.scale(modifiers.scale, modifiers.scale);
		if ( modes.orbitMode == 1)
		{
			context.rotate(this.orbit.angle);
		}
		if (modes.planetDrawMode == 3)
		{
			this.DrawSprites(context);
		}
		if (modes.planetDrawMode == 4 && this.GetPlanetSheetImage() != null)
		{
			this.DrawSpriteSheets(context, modifiers);
		}
		else if (modes.planetDrawMode == 4 && this.GetPlanetSheetImage() == null)
		{
			this.DrawSprites(context);
		}
		context.fillStyle = this.GetPlanetColour();
		context.fill();
		context.stroke();
		context.closePath();
		context.restore();
	
		if (this.GetMoonAmount() > 0)
		{
			for(var i = 0; i < this.moons.length; i+=1)
			{	
				this.moons[i].Draw(context, modes, modifiers);
			}
		}
	};
	
	Planet.prototype.DrawSprites = function (context)
	{
		//context.drawImage(image, x, y, width, height);
		context.drawImage(this.GetPlanetImage(),(this.planetVector.GetX() - (this.planetImage.width)),(this.planetVector.GetY()-(this.planetImage.height)), (this.GetRadius()*2), (this.GetRadius()*2));
	};
	
	Planet.prototype.DrawSpriteSheets = function (context, modifiers)
	{
		this.frameX = this.frameIndex * modifiers.spriteFrameSize;
		this.frameY = 0;
		//drawImage( image, leftOfSpriteFrame, topOfSpriteFrame, widthOfSpriteFrame, heightOfSpriteFrame, x, y, widthToDraw, heightToDraw );
		if (this.frameIndex > modifiers.spriteFrames)
		{
			this.frameIndex = 1;
		}
		context.drawImage(this.GetPlanetSheetImage(), this.frameX, this.frameY, modifiers.spriteFrameSize, modifiers.spriteFrameSize,(this.planetVector.GetX() - (this.planetImage.width)),(this.planetVector.GetY()-(this.planetImage.height)), (this.GetRadius()*2), (this.GetRadius()*2));
		this.frameTimer++;
		if (this.frameTimer == 5)
		{
			this.frameIndex++;
			this.frameTimer = 0;
		}
	};
	
	Planet.prototype.Draw = function(context, modes, modifiers)
	{
		context.save();
		context.beginPath();
		context.scale(modifiers.scale, modifiers.scale);
		if (modes.orbitMode == 1 && modes.orbitArcMode == 1)
		{
			this.DrawCircleOrbitArc(context);
		}
		if (modes.orbitMode == 2 && modes.orbitArcMode == 1)
		{
			this.DrawEllipseOrbitArc(context, modifiers);
		}
		context.lineWidth = 1;
		context.strokeStyle = 'FFFFFF';
		context.stroke();
		context.closePath();
		context.restore();
		if (modes.planetDrawMode == 1)
		{
			this.DrawArcMode(context, modes, modifiers);
		}
		if (modes.planetDrawMode == 2)
		{
			this.DrawLineMode(context, modes, modifiers);
		}
		if (modes.planetDrawMode == 3 || modes.planetDrawMode == 4)
		{
			this.DrawSpriteMode(context, modes, modifiers);
		}
	};
	
	return Planet; 
})();