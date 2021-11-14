let canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
canvas.width = ctx.width = canvas.clientWidth;
canvas.height = ctx.height = canvas.clientHeight;

let particles = [],
	particlesColor = function() {
		return `rgba(${(Math.random() * 20)}, ${(150 + Math.random() * 40)}, ${(200 + Math.random() * 55)}, ALPHA)`;
	},
	background = document.querySelector('.triangle-loading .background');

window.onresize = function() {
	canvas.width = ctx.width = canvas.clientWidth;
	canvas.height = ctx.height = canvas.clientHeight;
}

setTimeout(function() {
	particlesColor = function() {
		return `rgba(${(200 + Math.random() * 55)}, ${(10 + Math.random() * 30)}, ${(Math.random() * 20)}, ALPHA)`;
	}

	setTimeout(function() {
		background.style.animation = 'unset';
		delete background.style.animation;
		background.style.background = '#f00';
		background.style.transition = 'filter 3s, -webkit-filter 3s';
	}, 1000);

	setInterval(function() {
		let filter = (background.style.filter === 'brightness(1.4)') ? 'brightness(.8)' : 'brightness(1.4)';
		background.style.filter = filter;
		background.style['-webkit-filter'] = filter;
	}, 3000);
}, 20000);

setInterval(function() {
	let particle = particles[Math.round(Math.random() * (particles.length - 1))];
	particle.targetAngle = particle.angle + (-20 + Math.random() * 40);
}, 800);

function render() {
	let w = {
		width: canvas.clientWidth,
		height: canvas.clientHeight,
	}
	
	let totalParticles = particles.length;
	while(totalParticles < 10) {
		let nx = w.height * Math.random() * 1.4,
			ny = w.width * Math.random() * 1.4,
			ang = Math.random() * 360;
		particles.push({
			angle: ang,
			targetAngle: ang + (-20 + Math.random() * 40),
			x: nx,
			y: ny,
			color: particlesColor(),
			maxAlpha: (0.3 + Math.random() * 5),
			alpha: 0,
			speed: 1 + Math.random() * 3,
			size: 10 + Math.random() * 50,
			maxLifeTime: 20 * (Math.random() * .4 + .7),
			lifeTime: 0
		});
		totalParticles++;
	}
	ctx.clearRect(0, 0, w.width, w.height);

	let i = 0;
	do {
		let particle = particles[i];
		ctx.fillStyle = particle.color.replace('ALPHA', particle.alpha);
		ctx.moveTo(particle.x, particle.y);
		ctx.beginPath();
		ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI*2);
		ctx.closePath();
		ctx.fill();
		if (particle.alpha < particle.maxAlpha) particle.alpha += 0.01;
		if (particle.alpha > particle.maxAlpha) particle.alpha -= 0.01;
		if (particle.lifeTime >= particle.maxLifeTime / 2) particle.maxAlpha = 0;
		if (particle.angle < particle.targetAngle) particle.angle += (particle.targetAngle - particle.angle) / 15;
		if (particle.angle > particle.targetAngle) particle.angle -= (particle.targetAngle - particle.angle) / 15;
		if (particle.angle > particle.targetAngle - 0.05 || particle.angle < particle.targetAngle + 0.05) particle.angle = particle.targetAngle;
		particle.x += particle.speed / 2 * Math.cos(particle.angle);
		particle.y += particle.speed / 2 * Math.sin(particle.angle);
		particle.lifeTime += 0.05;
		if (particle.lifeTime >= particle.maxLifeTime || particle.x < -particle.size * 1.9 || particle.y < -particle.size * 1.9 || particle.x > canvas.width + particle.size * 1.9 || particle.y > canvas.height + particle.size * 1.9) {
			particles.splice(i, 1);
		} else {
			i++;
		}
	} while (i < particles.length);

	requestAnimationFrame(render);
}
setTimeout(render, 6000);
