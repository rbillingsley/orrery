var Vector = (function () 
{
	function Vector(x, y)
	{
		this.SetX(x);
		this.SetY(y);
	};
		
	Vector.prototype.GetX = function()
	{
		return this.x;
	};
	Vector.prototype.SetX = function (x)
	{
		this.x = x;
	};
	
	Vector.prototype.GetY = function()
	{
		return this.y;
	};
	Vector.prototype.SetY = function (y)
	{
		this.y = y;
	};
	
	Vector.prototype.Add = function(otherVector)
	{
		this.SetX((this.GetX() + otherVector.GetX()));
		this.SetY((this.GetY() + otherVector.GetY()));
	};
	
	Vector.prototype.Subtract = function(otherVector)
	{
		this.SetX((this.GetX() - otherVector.GetX()));
		this.SetY((this.GetY() - otherVector.GetY()));
	};
	
	Vector.prototype.Multiply = function(scalar)
	{
		this.SetX((this.GetX()*scalar));
		this.SetY((this.GetY()*scalar));
	};
	
	Vector.prototype.Divide = function(scalar)
	{
		this.SetX((this.GetX()/scalar));
		this.SetY((this.GetY()/scalar));
	};
	
	Vector.prototype.Magnitude = function()
	{
		this.magnitude = (this.GetX()*this.GetX()) + (this.GetY()*this.GetY());
	};
	
	Vector.prototype.Normalise = function()
	{
		this.SetX((this.GetX()/this.Magnitude()));
		this.SetY((this.GetY()/this.Magnitude()));
	};
	
	Vector.prototype.Copy = function()
	{
		this.copy = new Vector(this.GetX(),this.GetY());
		
		return this.copy;
	};
	
	Vector.prototype.LimitTo = function(scalar)
	{
	
	};
	
	return Vector; 
})();