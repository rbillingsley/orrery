var Moon = (function ()
{
	function Moon(x, y, radius, mass, orbitRadius, speedDevisor, planetColour, planetImage, planetSheetImage)
	{
		this.SetX(x);
		this.SetY(y);
		this.SetRadius(radius);
		this.SetMass(mass);
		this.SetOrbitRadius(orbitRadius);
		this.SetSpeedDevisor(speedDevisor);
		this.SetPlanetColour(planetColour);
		this.SetPlanetImage(planetImage, radius);
		this.SetPlanetSheetImage(planetSheetImage);
		this.orbit = {centerX:0, centerY:0, radius: this.GetOrbitRadius(), angle:0};
		this.frameIndex = 1;
		this.frameTimer = 0;
	};
	
	Moon.prototype.GetX = function()	
	{
		return this.x;
	};
	Moon.prototype.SetX = function (x) 
	{
		this.x = x;
	};
	
	Moon.prototype.GetY = function() 
	{
		return this.y;
	};
	Moon.prototype.SetY = function (y) 
	{
		this.y = y;
	};
	
	Moon.prototype.GetRadius = function() 
	{
		return this.radius;
	};
	Moon.prototype.SetRadius = function (radius) 
	{
		this.radius = radius;
	};
	
	Moon.prototype.GetMass = function() 
	{
		return this.mass;
	};
	Moon.prototype.SetMass = function (mass) 
	{
		this.mass = mass;
	};
	
	Moon.prototype.GetOrbitRadius = function() 
	{
		return this.OrbitRadius;
	};
	Moon.prototype.SetOrbitRadius = function (orbitRadius) 
	{
		this.OrbitRadius = orbitRadius;
	};

	Moon.prototype.GetSpeedDevisor = function()
	{
		return this.speedDevisor;
	};
	Moon.prototype.SetSpeedDevisor = function (speedDevisor)
	{
		this.speedDevisor = speedDevisor;
	};
	
	Moon.prototype.GetPlanetColour = function() 
	{
		return this.planetColour;
	};
	Moon.prototype.SetPlanetColour = function (planetColour) 
	{
		this.planetColour = planetColour;
	};
	
	Moon.prototype.GetPlanetImage = function()
	{
		return this.planetImage;
	};
	Moon.prototype.SetPlanetImage = function (planetImage, radius)
	{
		this.planetImage = planetImage;
		this.planetImage.width = radius;
		this.planetImage.height = radius;
	};
	
	Moon.prototype.GetPlanetSheetImage = function()
	{
		return this.planetSheetImage;
	};
	Moon.prototype.SetPlanetSheetImage = function (planetSheetImage)
	{
		this.planetSheetImage = planetSheetImage;
	};
	
	Moon.prototype.GetSpeed = function()
	{
		return this.speed;
	};
	Moon.prototype.SetSpeed = function (modifiers)
	{
		this.speed = modifiers.speed/this.GetSpeedDevisor();
	};
	
	Moon.prototype.GetPlanetX = function() 
	{
		return this.planetX;
	};
	
	Moon.prototype.SetPlanetX = function (planetX) 
	{
		this.planetX = planetX;
	};
	
	Moon.prototype.GetPlanetY = function() 
	{
		return this.planetY;
	};
	Moon.prototype.SetPlanetY = function (planetY) 
	{
		this.planetY = planetY;
	};
	
	Moon.prototype.UpdateCircleOrbit = function(modifiers, modes) 
	{
		if (modes.paused == 1)
		{
			this.orbit.angle += (this.GetSpeed()/(-modifiers.deltaTime));
			if (this.orbit.angle > 360)
			{
				this.orbit.angle = 0;
			}
		}
		this.SetX(this.GetPlanetX() + Math.cos(this.orbit.angle) * this.orbit.radius);
		this.SetY(this.GetPlanetY() + Math.sin(this.orbit.angle) * this.orbit.radius);
	};
	
	Moon.prototype.UpdateEllipseOrbit = function(modifiers, modes) 
	{
		if (modes.paused == 1)
		{
			this.orbit.angle += (this.GetSpeed()/(-modifiers.deltaTime));
			if (this.orbit.angle > 360)
			{
				this.orbit.angle = 0;
			}
		}
		this.SetX(this.GetPlanetX() + Math.cos(this.orbit.angle) * this.orbit.radius*modifiers.ellipseModifier);
		this.SetY(this.GetPlanetY() + Math.sin(this.orbit.angle) * this.orbit.radius);
	};
	
	Moon.prototype.Update = function ( modifiers, modes, planetX, planetY) 
	{
		this.SetSpeed(modifiers);
		this.SetPlanetX(planetX);
		this.SetPlanetY(planetY);
		
		if (modes.orbitMode == 1)
		{
			this.UpdateCircleOrbit(modifiers,modes);
		}
		if (modes.orbitMode == 2)
		{
			this.UpdateEllipseOrbit(modifiers,modes);
		}
	};
	
	Moon.prototype.DrawCircleOrbitArc = function (context)
	{
		context.arc(this.GetPlanetX(),this.GetPlanetY(),this.GetOrbitRadius(),0,Math.PI*2, false);
	};
	
	Moon.prototype.DrawEllipseOrbitArc = function (context, modifiers)
	{	
		var ellipseNumSegments = 360;
		var anglePerSegment = (Math.PI * 2 / ellipseNumSegments);
		for (var i = 0; i <= ellipseNumSegments; i = i + 1)
		{
			var angle = anglePerSegment * i;
			var x = this.GetPlanetX() + this.GetOrbitRadius() * Math.cos(angle)*modifiers.ellipseModifier;
			var y = this.GetPlanetY() + this.GetOrbitRadius() * Math.sin(angle);
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
	
	Moon.prototype.DrawArc = function (context)
	{
		context.arc(this.GetX(),this.GetY(), this.GetRadius(),0, Math.PI*2, false);
	};	
	
	Moon.prototype.DrawLines = function (context,modifiers)
	{
		var anglePerSegment = (Math.PI * 2 / modifiers.lineNumSegments);
		for (var i = 0; i <= modifiers.lineNumSegments; i = i + 1) {
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
	
	Moon.prototype.DrawSprites = function (context)
	{
		context.drawImage(this.GetPlanetImage(),(this.GetX() - (this.planetImage.width)),(this.GetY()-(this.planetImage.height)), (this.GetRadius()*2), (this.GetRadius()*2));
	};
	
	Moon.prototype.DrawSpriteSheets = function (context, modifiers)
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
	
	Moon.prototype.Draw = function(context, modes, modifiers)
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
		
		context.save();
		context.beginPath();
		context.scale(modifiers.scale, modifiers.scale);
		if (modes.planetDrawMode == 1)
		{
			this.DrawArc(context);
		}
		if (modes.planetDrawMode == 2)
		{
			this.DrawLines(context,modifiers);
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
	};
	
	return Moon; 
})();