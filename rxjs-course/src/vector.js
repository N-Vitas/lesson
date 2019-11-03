/* INSTANCE METHODS */
export class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
	negative() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}
	add(v) {
		if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}
		return this;
	}
	subtract(v) {
		if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
		return this;
	}
	multiply(v) {
		if (v instanceof Vector) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}
		return this;
	}
	divide(v) {
		if (v instanceof Vector) {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}
		return this;
	}
	equals(v) {
		return this.x == v.x && this.y == v.y;
	}
	dot(v) {
		return this.x * v.x + this.y * v.y;
	}
	cross(v) {
		return this.x * v.y - this.y * v.x
	}
	length() {
		return Math.sqrt(this.lengthSquared());//Math.sqrt(this.dot(this));
	}
	normalize() {
		return this.divide(this.length());
	}
	min() {
		return Math.min(this.x, this.y);
	}
	max() {
		return Math.max(this.x, this.y);
	}
	toAngles() {
		return -Math.atan2(-this.y, this.x);
	}
	angleTo(a) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	}
	toArray(n) {
		return [this.x, this.y].slice(0, n || 2);
	}
	clone() {
		return new Vector(this.x, this.y);
	}
	set(x, y) {
		this.x = x; this.y = y;
		return this;
	}
    lengthSquared() {
        return this.x*this.x+this.y*this.y;
    }
    distance(vec1, vec2) {
        return vec1.subtract(vec2).length();
    }
    addScaled(a, f) {
        this.x += a.x * f;
        this.y += a.y * f;
        return this;
    }
};

/* STATIC METHODS */
Vector.negative = (v) => {
	return new Vector(-v.x, -v.y);
};
Vector.add = (a, b) => {
	if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
	else return new Vector(a.x + b, a.y + b);
};
Vector.subtract = (a, b) => {
	if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
	else return new Vector(a.x - b, a.y - b);
};
Vector.multiply = (a, b) => {
	if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
	else return new Vector(a.x * b, a.y * b);
};
Vector.divide = (a, b) => {
	if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
	else return new Vector(a.x / b, a.y / b);
};
Vector.equals = (a, b) => {
	return a.x == b.x && a.y == b.y;
};
Vector.dot = (a, b) => {
	return a.x * b.x + a.y * b.y;
};
Vector.cross = (a, b) => {
	return a.x * b.y - a.y * b.x;
};
Vector.distance = (vec1, vec2) => {
	console.log(vec1 instanceof Vector , vec2 instanceof Vector)
	if (vec1 instanceof Vector && vec2 instanceof Vector ) 
	return vec1.subtract(vec2).length;
};
Vector.lengthSquared = (vec) => {
	if (vec instanceof Vector) 
	return Math.sqrt(vec.x*vec.x+vec.y*vec.y);
}

export class Ball {
    constructor(radius, color, pos, velo, canvas, ctx) {
        this.radius = radius;
        this.color = color;
        this.pos2D = pos;
        this.velo2D = velo;
        this.mass = Math.round(radius + radius / Math.PI*2);
        this.canvas = canvas;
        this.ctx = ctx;
    }
    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.pos2D.x, this.pos2D.y, this.radius, 0, Math.PI*2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBall();
	}
	
	move() {
		// добавляем смещение
		this.pos2D.add(this.velo2D);
		// Меняем направление если мячь соприкосновится со стенкой
		this.revert();
		return this;
	}

	isCollision(velo) {
		const sum = this.radius + velo.radius;
		const a = Vector.subtract(this.pos2D, velo.pos2D);
		const dist = Vector.lengthSquared(a);
		return dist <= sum;
	}
	revert() {
        if(this.pos2D.x - this.radius < 0) { this.velo2D.x *= -1; }
        if(this.pos2D.y - this.radius < 0) { this.velo2D.y *= -1; }
        if(this.pos2D.x + this.radius > this.canvas.width) { 
			this.velo2D.x *= -1;
			this.pos2D.x = this.canvas.width * 2 - this.radius * 2 - this.pos2D.x;
		}
		if(this.pos2D.y + this.radius > this.canvas.height) { 
			this.velo2D.y *= -1;
			this.pos2D.y = this.canvas.height * 2 - this.radius * 2 - this.pos2D.y;
		}
	}
}
