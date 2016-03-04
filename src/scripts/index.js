/*!
 * editors-lab-2016
 *
 * @version development
 */

var throttle, template, visualisation, slice,
    TOTAL,
    rootEl, visualisationEl, sectionEls, visualisationUpdateFn;

throttle = require('throttleit');
template = require('../templates/container.hbs');
visualisation = require('./visualisation');
slice = Array.prototype.slice;

TOTAL = 22000000;

rootEl = document.getElementById('root');
rootEl.innerHTML = template({
    title: document.title
});

visualisationEl = document.querySelector('.visualisation');

sectionEls = slice.call(document.querySelectorAll('.section'));

visualisationUpdateFn = visualisation(document.querySelector('.visualisation'), 22000000);

rootEl.addEventListener('click', function (event) {
    var targetEl = event.target;

    if (targetEl.dataset.multiplierChoice != null) {
        return makeChoice(targetEl);
    }
});

function makeChoice(buttonEl) {
    var sectionEl = buttonEl.parentElement;

    while (sectionEl.dataset.multiplier == null) {
        sectionEl = sectionEl.parentElement;
    }

    sectionEl.dataset.multiplier = buttonEl.dataset.multiplierChoice;

    slice.call(sectionEl.querySelectorAll('button[data-multiplier-choice]')).forEach(function (el) {
        el.disabled = (el === buttonEl);
    });

    update();
}

function update() {
    var windowScrollY = window.scrollY;
    var windowHeight = window.innerHeight;
    var halfWindowHeight = Math.round(windowHeight / 2);
    // var quarterWindowHeight = Math.round(windowHeight / 4);

    function isSectionApplied(sectionEl) {
        return sectionEl.dataset.multiplier != null &&
            sectionEl.offsetWidth > 0 &&
            sectionEl.offsetHeight > 0 &&
            sectionEl.offsetTop <= windowScrollY + halfWindowHeight;
            // sectionEl.offsetTop <= windowScrollY + quarterWindowHeight;
    }

    function reducer(product, sectionEl) {
        return +sectionEl.dataset.multiplier * product;
    }

    var appliedSectionEls = sectionEls.filter(isSectionApplied);

    var product = Math.round(appliedSectionEls.reduce(reducer, TOTAL));

    visualisationUpdateFn(product);

    if (windowScrollY < windowHeight / 4) {
        visualisationEl.classList.add('peeking');
    } else {
        visualisationEl.classList.remove('peeking');
    }

    if (appliedSectionEls.length % 2) {
        document.body.classList.add('alt');
    } else {
        document.body.classList.remove('alt');
    }

    sectionEls.forEach(function (sectionEl) {
        if (sectionEl.offsetTop >= windowScrollY && sectionEl.offsetTop < windowScrollY + windowHeight) {
            sectionEl.classList.add('is-active');
        } else {
            sectionEl.classList.remove('is-active');
        }
    });
}

window.addEventListener('scroll', throttle(update, 200));

update();

sectionEls.forEach(function (sectionEl) {
    var buttonEl = sectionEl.querySelector('button[data-multiplier-choice]');

    if (buttonEl != null) {
        makeChoice(buttonEl);
    }
});
