const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

let particles = [];

const mouse = {
    x: null,
    y: null,
    radius: 140
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createParticles();
}

function createParticles() {

    const particleCount =
        window.innerWidth < 700 ? 35 : 75;

    particles = [];

    for (let i = 0; i < particleCount; i++) {

        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,

            size: Math.random() * 1.5 + 0.5,

            speedX:
                (Math.random() - 0.5) * 0.35,

            speedY:
                (Math.random() - 0.5) * 0.35
        });
    }
}

function connectParticles() {

    const connectionDistance = 120;

    for (let i = 0; i < particles.length; i++) {

        for (
            let j = i + 1;
            j < particles.length;
            j++
        ) {

            const dx =
                particles[i].x -
                particles[j].x;

            const dy =
                particles[i].y -
                particles[j].y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {

                const opacity =
                    1 -
                    distance / connectionDistance;

                ctx.beginPath();

                ctx.moveTo(
                    particles[i].x,
                    particles[i].y
                );

                ctx.lineTo(
                    particles[j].x,
                    particles[j].y
                );

                ctx.strokeStyle =
                    `rgba(216, 255, 62, ${opacity * 0.08})`;

                ctx.lineWidth = 1;

                ctx.stroke();
            }
        }
    }
}

function drawParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(particle => {

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) {
            particle.x = canvas.width;
        }

        if (particle.x > canvas.width) {
            particle.x = 0;
        }

        if (particle.y < 0) {
            particle.y = canvas.height;
        }

        if (particle.y > canvas.height) {
            particle.y = 0;
        }

        if (mouse.x !== null) {

            const dx =
                particle.x - mouse.x;

            const dy =
                particle.y - mouse.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (
                distance < mouse.radius &&
                distance > 0
            ) {

                const force =
                    (mouse.radius - distance) /
                    mouse.radius;

                particle.x +=
                    (dx / distance) *
                    force *
                    0.7;

                particle.y +=
                    (dy / distance) *
                    force *
                    0.7;
            }
        }

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(216, 255, 62, 0.35)";

        ctx.fill();
    });

    connectParticles();

    requestAnimationFrame(drawParticles);
}

window.addEventListener(
    "mousemove",
    event => {

        mouse.x = event.clientX;
        mouse.y = event.clientY;

    }
);

window.addEventListener(
    "mouseleave",
    () => {

        mouse.x = null;
        mouse.y = null;

    }
);

window.addEventListener(
    "resize",
    resizeCanvas
);


/* Mobile Navigation */

const menuButton =
    document.querySelector(".menu-button");

const navLinks =
    document.querySelector(".nav-links");

if (menuButton && navLinks) {

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                navLinks.classList.toggle("active");

            menuButton.classList.toggle("active");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );

    const navigationLinks =
        document.querySelectorAll(
            ".nav-links a"
        );

    navigationLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navLinks.classList.remove(
                    "active"
                );

                menuButton.classList.remove(
                    "active"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    });

}


/* Scroll Reveal */

const revealElements =
    document.querySelectorAll(".reveal");

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.15
        }
    );

revealElements.forEach(element => {
    observer.observe(element);
});


/* Start Animation */

resizeCanvas();
drawParticles();
