const navigationBar = document.querySelector('.nav');
const navigationBarMarginTop = getNavigationBarMarginTop();

// const projects = document.querySelectorAll('.project');
const backArrow = document.querySelector('.back__arrow');
const top = document.querySelector('body');

const hashAnchors = document.querySelectorAll('a[href*="#"]');
const navigationOffset = parseInt(getComputedStyle(document.querySelector('.nav')).height, 10);

const hamburgerButton = document.querySelector('.hamburger');
const navigationMenu = navigationBar.querySelector('.nav__links');
const menuLinks = navigationMenu.querySelectorAll('a');
const logoImage = navigationBar.querySelector('.logo__image');

menuLinks.forEach(link => {
    link.addEventListener('click', toggleCollapseMenu);
});

hashAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => scrollIt(document.querySelector(anchor.hash).offsetTop - navigationOffset, 500));
});

// window.addEventListener('scroll', debounce(showProject));
window.addEventListener('scroll', slideNavigationBar);
window.addEventListener('beforeunload', animateOut);
backArrow.addEventListener('click', scrollToTop);
hamburgerButton.addEventListener('click', toggleCollapseMenu);



particlesJS.load('particles-js', 'js/particlesjs-config.json');

function animateOut() {
    document.body.classList.add('animate-out');
}

function toggleCollapseMenu() {
    if (window.innerWidth <= 710) {
        hamburgerButton.classList.toggle('is-active');
        navigationMenu.classList.toggle('fixed');
        logoImage.classList.toggle('logo__image-inverted');
        if (navigationMenu.classList.contains('fixed')) {
            disableScrolling();
        } else {
            enableScrolling();
        }
    }
}




// function debounce(func, wait = 20, immediate = true) {
//     var timeout;
//     return function () {
//         var context = this, args = arguments;
//         var later = function () {
//             timeout = null;
//             if (!immediate) func.apply(context, args);
//         };
//         var callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(context, args);
//     };
// }

// function showProject() {
//     projects.forEach(project => {
//         const showAt = (window.scrollY + window.innerHeight) - (project.offsetHeight * 0.3);
//         const isPartialShown = showAt > project.offsetTop;
//         if (isPartialShown) {
//             project.classList.add('active');
//         }
//     });
// }


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
    if (window.innerWidth > 710) {
        const style = window.getComputedStyle ? getComputedStyle(navigationBar, null) : navigationBar.currentStyle;
        return parseInt(style.paddingTop, 10);
    }
    // else {
    //     const element = document.querySelector('.nav__link-bordered');
    //     console.log(element.offsetTop);
    //     return element.offsetTop-3;
    // }
}

function slideNavigationBar() {
    navigationBar.style.marginTop = (window.scrollY < navigationBarMarginTop) ?
        -window.scrollY + 'px' :
        -navigationBarMarginTop + 'px';

        if(window.scrollY >= navigationBarMarginTop) {
            navigationBar.classList.add('bg');
        } else {
            navigationBar.classList.remove('bg');
        }

}

function scrollToTop() {
    scrollIt(top, 500, 'easeOutQuint');
    window.location.hash = '';
}

function disableScrolling() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () { window.scrollTo(x, y); };
}

function enableScrolling() {
    window.onscroll = function () { };
}
