(function () {
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.firstChild ? document.head.insertBefore(style, document.head.firstChild) : document.head.appendChild(style);
    var sheet = style.sheet;
    sheet.insertRule('@keyframes __scroll {from { opacity: 0.99; }to { opacity: 1; }}', 0);
    sheet.insertRule('*{animation-duration: 0.001s;animation-name: __scroll;}', 1);
    sheet.insertRule('.__vertical{width: 8px;height: 0;right: 0;top: 0;}', 2);
    sheet.insertRule('.__horizontal{width: 0;height: 8px;left: 0;bottom: 0;}', 3);
    sheet.insertRule('.__vertical,.__horizontal{border-radius: 4px;position: absolute;background: #888;z-index: 99;opacity: .1;transition: opacity .3s;}', 4);
    sheet.insertRule('.__vertical.__active,.__horizontal.__active{opacity: .6;}', 5);
    function registerScroll(target) {
        var timeoutId, container, oldHeight, oldScrollHeight, oldWidth, oldScrollWidth, verticalBar, horizontalBar, inside,
            observer = new MutationObserver(() => {
                if (target.tagName !== 'HTML' && !document.body.contains(target)) observer.disconnect();
                else updateScroll();
            }),
            activeFn = function () {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                verticalBar && verticalBar.classList.add('__active');
                horizontalBar && horizontalBar.classList.add('__active');
            },
            deActiveFn = function () {
                if (inside) return;
                timeoutId = setTimeout(function () {
                    verticalBar && verticalBar.classList.remove('__active');
                    horizontalBar && horizontalBar.classList.remove('__active');
                    timeoutId = null;
                }, 1000);
            },
            mouseMove = function () {
                updateScroll();
                activeFn();
                deActiveFn();
            },
            scroll = function () {
                observer.disconnect();
                if (verticalBar) {
                    verticalBar.style.transform = `translate(${target.tagName === 'HTML' ? target.clientWidth - target.scrollWidth + target.scrollLeft : target.scrollLeft}px,${(target.scrollTop * (target.clientHeight - verticalBar.clientHeight)) / (target.scrollHeight - target.clientHeight) + target.scrollTop}px)`
                }
                if (horizontalBar) {
                    horizontalBar.style.transform = `translate(${(target.scrollLeft * (target.clientWidth - horizontalBar.clientWidth)) / (target.scrollWidth - target.clientWidth) + target.scrollLeft}px,${target.tagName === 'HTML' ? target.clientHeight - target.scrollHeight + target.scrollTop : target.scrollTop}px)`
                }
                observer.observe(target, { attributes: true, childList: true, subtree: true });
            },
            updateScroll = () => {
                if (target.clientHeight !== oldHeight || target.scrollHeight !== oldScrollHeight) {
                    oldHeight = target.clientHeight;
                    oldScrollHeight = target.scrollHeight;
                    if (target.clientHeight < target.scrollHeight) {
                        if (!verticalBar) {
                            verticalBar = document.createElement('div');
                            verticalBar.style.position = 'absolute';
                            verticalBar.className = '__vertical';
                            verticalBar.style.userSelect = 'none';
                            verticalBar.style.height = '0px';
                            verticalBar.onmouseenter = function () {
                                inside = true;
                                target.removeEventListener('mousemove', mouseMove);
                                activeFn();
                            }
                            verticalBar.onmouseleave = function () {
                                target.addEventListener('mousemove', mouseMove);
                                inside = false;
                                deActiveFn();
                            }
                            verticalBar.onmousedown = function (e) {
                                function disableSelect(event) {
                                    event.preventDefault();
                                }
                                window.addEventListener('selectstart', disableSelect);
                                window.addEventListener('dragstart', disableSelect);

                                var rect = target.getBoundingClientRect();
                                e = e || window.event;
                                verticalBar.topPos = e.offsetY;
                                function mousemove(e) {
                                    e = e || window.event;
                                    var top =
                                        e.clientY -
                                        (target.tagName === 'HTML' ? 0 : rect.top) -
                                        verticalBar.topPos;
                                    if (top < 0) top = 0;
                                    else if (top > target.clientHeight - verticalBar.clientHeight) {
                                        top = target.clientHeight - verticalBar.clientHeight;
                                    }
                                    target.scrollTop =
                                        (top * (target.scrollHeight - target.clientHeight)) /
                                        (target.clientHeight - verticalBar.clientHeight);
                                }
                                function mouseup() {
                                    window.removeEventListener('selectstart', disableSelect);
                                    window.removeEventListener('dragstart', disableSelect);
                                    document.removeEventListener('mousemove', mousemove);
                                    document.removeEventListener('mouseup', mouseup);
                                }
                                document.addEventListener('mousemove', mousemove);
                                document.addEventListener('mouseup', mouseup);
                            };
                            container.appendChild(verticalBar);
                        }
                    } else {
                        if (container.contains(verticalBar)) {
                            container.removeChild(verticalBar)
                            verticalBar = null;
                        }
                    }
                    if (verticalBar) {
                        var max = Math.max(32, target.clientHeight / 2);
                        var size =
                            target.clientHeight / (target.scrollHeight / target.clientHeight);
                        verticalBar.style.height = (size < max ? max : size) + 'px';
                        scroll();
                    }
                }
                if (target.clientWidth !== oldWidth || target.scrollWidth !== oldScrollWidth) {
                    oldWidth = target.clientWidth;
                    oldScrollWidth = target.scrollWidth;
                    if (target.clientWidth < target.scrollWidth) {
                        if (!horizontalBar) {
                            horizontalBar = document.createElement('div');
                            horizontalBar.style.position = 'absolute';
                            horizontalBar.className = '__horizontal';
                            horizontalBar.style.userSelect = 'none';
                            horizontalBar.style.width = '0px';
                            horizontalBar.onmouseenter = function () {
                                inside = true;
                                target.removeEventListener('mousemove', mouseMove);
                                activeFn();
                            }
                            horizontalBar.onmouseleave = function () {
                                target.addEventListener('mousemove', mouseMove);
                                inside = false;
                                deActiveFn();
                            }
                            horizontalBar.onmousedown = function (e) {
                                function disableSelect(event) {
                                    event.preventDefault();
                                }
                                window.addEventListener('selectstart', disableSelect);
                                window.addEventListener('dragstart', disableSelect);

                                var rect = target.getBoundingClientRect();
                                e = e || window.event;
                                horizontalBar.leftPos = e.offsetX;
                                function mousemove(e) {
                                    e = e || window.event;
                                    var left =
                                        e.clientX -
                                        (target.tagName === 'HTML' ? 0 : rect.left) -
                                        horizontalBar.leftPos;
                                    if (left < 0) left = 0;
                                    else if (left > target.clientWidth - horizontalBar.clientWidth) {
                                        left = target.clientWidth - horizontalBar.clientWidth;
                                    }
                                    target.scrollLeft =
                                        (left * (target.scrollWidth - target.clientWidth)) /
                                        (target.clientWidth - horizontalBar.clientWidth);
                                }
                                function mouseup() {
                                    window.removeEventListener('selectstart', disableSelect);
                                    window.removeEventListener('dragstart', disableSelect);
                                    document.removeEventListener('mousemove', mousemove);
                                    document.removeEventListener('mouseup', mouseup);
                                }
                                document.addEventListener('mousemove', mousemove);
                                document.addEventListener('mouseup', mouseup);
                            };
                            container.appendChild(horizontalBar);
                        }
                    } else {
                        if (container.contains(horizontalBar)) {
                            container.removeChild(horizontalBar)
                            horizontalBar = null;
                        }
                    }
                    if (horizontalBar) {
                        var max = Math.max(32, target.clientWidth / 2);
                        var size =
                            target.clientWidth / (target.scrollWidth / target.clientWidth);
                        horizontalBar.style.width = (size < max ? max : size) + 'px';
                        scroll();
                    }
                }
            }
        if (target.tagName === 'HTML') {
            container = document.body;
        } else {
            container = target;
            if (getComputedStyle(target).position === 'static') {
                target.style.position = 'relative';
            }
        }
        target.style.overflowY = 'hidden';
        target.style.overflowX = 'hidden';
        target.addEventListener('wheel', function (e) {
            if (e.ctrlKey || e.altKey) return;
            var old;
            const step = 100 / (window.devicePixelRatio || 1)
            if (e.shiftKey) {
                old = target.scrollLeft;
                if (e.deltaY > 0) target.scrollLeft += step;
                else target.scrollLeft -= step;
                if (old !== target.scrollLeft) {
                    mouseMove();
                    e.stopPropagation();
                }
            } else {
                old = target.scrollTop;
                if (e.deltaY > 0) target.scrollTop += step;
                else target.scrollTop -= step;
                if (old !== target.scrollTop) {
                    mouseMove();
                    e.stopPropagation();
                }
            }
        });
        if (target.tagName === 'HTML') window.addEventListener('scroll', scroll);
        else target.addEventListener('scroll', scroll);
        target.addEventListener('mousemove', mouseMove);
        updateScroll();
        observer.observe(target, { attributes: true, childList: true, subtree: true });
    }
    registerScroll(document.documentElement);
    document.addEventListener('animationstart', (e) => {
        if (e.animationName !== '__scroll') return;
        if (!e.target || !e.target.tagName) return;
        var s = getComputedStyle(e.target);
        if (s.overflowX === 'auto' || s.overflowX === 'scroll' || s.overflowY === 'auto' || s.overflowY === 'scroll') registerScroll(e.target)
    });
})()
