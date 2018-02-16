const navigationBar = document.querySelector('.nav');
const navigationBarMarginTop = getNavigationBarMarginTop();

const projects = document.querySelectorAll('.project');
const backArrow = document.querySelector('.back__arrow');
const top = document.querySelector('body');

const hashAnchors = document.querySelectorAll('a[href*="#"]');
const navigationOffset = parseInt(getComputedStyle(document.querySelector('.nav')).height, 10);

hashAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => scrollIt(document.querySelector(anchor.hash).offsetTop - navigationOffset , 500));
});

window.addEventListener('scroll', debounce(showProject));
window.addEventListener('scroll', slideNavigationBar);
backArrow.addEventListener('click', scrollToTop);

particlesJS.load('particles-js', 'js/particlesjs-config.json', function() {
    console.log('callback - particles.js config loaded');
  });





function debounce(func, wait = 20, immediate = true) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function showProject() {
    projects.forEach(project => {
        const showAt = (window.scrollY + window.innerHeight) - (project.offsetHeight * 0.3);
        const isPartialShown = showAt > project.offsetTop;
        if (isPartialShown) {
            project.classList.add('active');
        }
    });
}


function scrollIt(destination, duration = 200, easing = 'linear', callback = () => { }) {

    const easings = {
        linear(t) {
            return t;
        },
        easeInQuad(t) {
            return t * t;
        },
        easeOutQuad(t) {
            return t * (2 - t);
        },
        easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        easeInCubic(t) {
            return t * t * t;
        },
        easeOutCubic(t) {
            return (--t) * t * t + 1;
        },
        easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        easeInQuart(t) {
            return t * t * t * t;
        },
        easeOutQuart(t) {
            return 1 - (--t) * t * t * t;
        },
        easeInOutQuart(t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        },
        easeInQuint(t) {
            return t * t * t * t * t;
        },
        easeOutQuint(t) {
            return 1 + (--t) * t * t * t * t;
        },
        easeInOutQuint(t) {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
        }
    };

    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

    if ('requestAnimationFrame' in window === false) {
        window.scroll(0, destinationOffsetToScroll);
        if (callback) {
            callback();
        }
        return;
    }

    function scroll() {
        const now = 'now' in window.performance ? performance.now() : new Date().getTime();
        const time = Math.min(1, ((now - startTime) / duration));
        const timeFunction = easings[easing](time);
        window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

        if (window.pageYOffset === destinationOffsetToScroll) {
            if (callback) {
                callback();
            }
            return;
        }

        requestAnimationFrame(scroll);
    }

    scroll();
}






function getNavigationBarMarginTop() {
    const style = window.getComputedStyle ? getComputedStyle(navigationBar, null) : navigationBar.currentStyle;
    return parseInt(style.paddingTop, 10);
}

function slideNavigationBar() {
    navigationBar.style.marginTop = (window.scrollY < navigationBarMarginTop) ?
        -window.scrollY + 'px' :
        -navigationBarMarginTop + 'px';
}

function scrollToTop() {
    scrollIt(top, 500, 'easeOutQuint');
    window.location.hash='';
}
