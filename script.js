// ===========================================
// Weatherly Landing Page
// script.js
// ===========================================

// Smooth Scroll
const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {

    link.addEventListener("click", function(e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});

// ===========================================
// Navbar Background on Scroll
// ===========================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        navbar.style.background = "rgba(0,0,0,0.35)";
        navbar.style.backdropFilter = "blur(12px)";
        navbar.style.transition = "0.4s";

    }

    else{

        navbar.style.background = "rgba(255,255,255,0.08)";

    }

});

// ===========================================
// Reveal Animation
// ===========================================

const reveals = document.querySelectorAll(".card, .about, .cta");

function reveal(){

    reveals.forEach(item=>{

        const windowHeight = window.innerHeight;

        const top = item.getBoundingClientRect().top;

        if(top < windowHeight-100){

            item.style.opacity="1";

            item.style.transform="translateY(0)";

        }

    });

}

reveals.forEach(item=>{

    item.style.opacity="0";

    item.style.transform="translateY(40px)";

    item.style.transition="0.7s";

});

window.addEventListener("scroll", reveal);

reveal();

// ===========================================
// Greeting Message
// ===========================================

const heading = document.querySelector(".hero-content h1");

const hour = new Date().getHours();

let greet = "";

if(hour < 12){

    greet = "🌞 Good Morning";

}

else if(hour < 17){

    greet = "🌤 Good Afternoon";

}

else{

    greet = "🌙 Good Evening";

}

heading.innerHTML = `
${greet}<br>
Weather Forecast<br>
At Your Fingertips
`;

// ===========================================
// Hero Image Animation
// ===========================================

const heroImage = document.querySelector(".hero-image img");

if(heroImage){

heroImage.addEventListener("mouseenter",()=>{

heroImage.style.transform="scale(1.08)";

heroImage.style.transition=".4s";

});

heroImage.addEventListener("mouseleave",()=>{

heroImage.style.transform="scale(1)";

});

}

// ===========================================
// Active Navigation
// ===========================================

const sections = document.querySelectorAll("section");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const top=section.offsetTop-120;

if(pageYOffset>=top){

current=section.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")==="#"+current){

link.classList.add("active");

}

});

});

// ===========================================
// Footer Year
// ===========================================

const year=document.querySelector(".copyright");

if(year){

year.innerHTML=
`© ${new Date().getFullYear()} Weatherly. All Rights Reserved.`;

}

// ===========================================
// Button Ripple Effect
// ===========================================

const buttons=document.querySelectorAll(".primary-btn,.btn");

buttons.forEach(button=>{

button.addEventListener("click",function(e){

const circle=document.createElement("span");

const x=e.clientX-this.offsetLeft;

const y=e.clientY-this.offsetTop;

circle.style.left=x+"px";
circle.style.top=y+"px";

circle.classList.add("ripple");

this.appendChild(circle);

setTimeout(()=>{

circle.remove();

},600);

});

});

// ===========================================
// Console Message
// ===========================================

console.log("Weatherly Landing Page Loaded Successfully 🚀");