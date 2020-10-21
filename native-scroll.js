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
        var observer = new MutationObserver(() => {
            if (target.tagName !== 'HTML' && !document.body.contains(target)) observer.disconnect();
            else updateScroll();
        });
        var container;
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
        var timeoutId;
        var activeFn = function () {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            container.vBar && container.vBar.classList.add('__active');
            container.hBar && container.hBar.classList.add('__active');
        };
        var deActiveFn = function () {
            if (inside) return;
            timeoutId = setTimeout(function () {
                container.vBar && container.vBar.classList.remove('__active');
                container.hBar && container.hBar.classList.remove('__active');
                timeoutId = null;
            }, 1000);
        }
        var mouseMove = function () {
            activeFn();
            deActiveFn();
        };
        var inside = false;
        target.addEventListener('wheel', function (e) {
            if (e.ctrlKey || e.altKey) return;
            var old;
            if (e.shiftKey) {
                old = target.scrollLeft;
                if (e.deltaY > 0) target.scrollLeft += 100;
                else target.scrollLeft -= 100;
                if (old !== target.scrollLeft) {
                    mouseMove();
                    e.stopPropagation();
                }
            } else {
                old = target.scrollTop;
                if (e.deltaY > 0) target.scrollTop += 100;
                else target.scrollTop -= 100;
                if (old !== target.scrollTop) {
                    mouseMove();
                    e.stopPropagation();
                }
            }
        });
        var scroll = function () {
            observer.disconnect();
            if (container.vBar) {
                container.vBar.style.transform = `translateY(${(target.scrollTop * (target.clientHeight - container.vBar.clientHeight)) / (target.scrollHeight - target.clientHeight) + target.scrollTop}px)`
            }
            if (container.hBar) {
                container.hBar.style.transform = `translateX(${(target.scrollLeft * (target.clientWidth - container.hBar.clientWidth)) / (target.scrollWidth - target.clientWidth) + target.scrollLeft}px)`
            }
            observer.observe(target, { attributes: true, childList: true, subtree: true });
        };
        if (target.tagName === 'HTML') window.addEventListener('scroll', scroll);
        else target.addEventListener('scroll', scroll);
        target.addEventListener('mousemove', mouseMove);
        var oldHeight, oldScrollHeight, oldWidth, oldScrollWidth;
        var updateScroll = () => {
            if (target.clientHeight !== oldHeight || target.scrollHeight !== oldScrollHeight) {
                oldHeight = target.clientHeight;
                oldScrollHeight = target.scrollHeight;
                if (target.clientHeight < target.scrollHeight) {
                    if (!container.vBar) {
                        var vBar = document.createElement('div');
                        vBar.style.position = 'absolute';
                        vBar.className = '__vertical';
                        vBar.style.userSelect = 'none';
                        vBar.style.height = '0px';
                        vBar.onmouseenter = function () {
                            inside = true;
                            target.removeEventListener('mousemove', mouseMove);
                            activeFn();
                        }
                        vBar.onmouseleave = function () {
                            target.addEventListener('mousemove', mouseMove);
                            inside = false;
                            deActiveFn();
                        }
                        vBar.onmousedown = function (e) {
                            function disableSelect(event) {
                                event.preventDefault();
                            }
                            window.addEventListener('selectstart', disableSelect);
                            window.addEventListener('dragstart', disableSelect);

                            var rect = target.getBoundingClientRect();
                            e = e || window.event;
                            vBar.topPos = e.offsetY;
                            function mousemove(e) {
                                e = e || window.event;
                                var top =
                                    e.clientY -
                                    (target.tagName === 'HTML' ? 0 : rect.top) -
                                    vBar.topPos;
                                if (top < 0) top = 0;
                                else if (top > target.clientHeight - vBar.clientHeight) {
                                    top = target.clientHeight - vBar.clientHeight;
                                }
                                target.scrollTop =
                                    (top * (target.scrollHeight - target.clientHeight)) /
                                    (target.clientHeight - vBar.clientHeight);
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
                        container.vBar = vBar;
                        container.appendChild(container.vBar);
                    }
                } else {
                    if (container.vBar) {
                        container.removeChild(container.vBar)
                        delete container.vBar;
                    }
                }
                if (container.vBar) {
                    var max = Math.max(32, target.clientHeight / 2);
                    var size =
                        target.clientHeight / (target.scrollHeight / target.clientHeight);
                    container.vBar.style.height = (size < max ? max : size) + 'px';
                    scroll();
                }
            }
            if (target.clientWidth !== oldWidth || target.scrollWidth !== oldScrollWidth) {
                oldWidth = target.clientWidth;
                oldScrollWidth = target.scrollWidth;
                if (target.clientWidth < target.scrollWidth) {
                    if (!container.hBar) {
                        var hBar = document.createElement('div');
                        hBar.style.position = 'absolute';
                        hBar.className = '__horizontal';
                        hBar.style.userSelect = 'none';
                        hBar.style.width = '0px';
                        hBar.onmouseenter = function () {
                            inside = true;
                            target.removeEventListener('mousemove', mouseMove);
                            activeFn();
                        }
                        hBar.onmouseleave = function () {
                            target.addEventListener('mousemove', mouseMove);
                            inside = false;
                            deActiveFn();
                        }
                        hBar.onmousedown = function (e) {
                            function disableSelect(event) {
                                event.preventDefault();
                            }
                            window.addEventListener('selectstart', disableSelect);
                            window.addEventListener('dragstart', disableSelect);

                            var rect = target.getBoundingClientRect();
                            e = e || window.event;
                            hBar.leftPos = e.offsetX;
                            function mousemove(e) {
                                e = e || window.event;
                                var left =
                                    e.clientX -
                                    (target.tagName === 'HTML' ? 0 : rect.left) -
                                    hBar.leftPos;
                                if (left < 0) left = 0;
                                else if (left > target.clientWidth - hBar.clientWidth) {
                                    left = target.clientWidth - hBar.clientWidth;
                                }
                                target.scrollLeft =
                                    (left * (target.scrollWidth - target.clientWidth)) /
                                    (target.clientWidth - hBar.clientWidth);
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
                        container.hBar = hBar;
                        container.appendChild(container.hBar);
                    }
                } else {
                    if (container.hBar) {
                        container.removeChild(container.hBar)
                        delete container.hBar;
                    }
                }
                if (container.hBar) {
                    var max = Math.max(32, target.clientWidth / 2);
                    var size =
                        target.clientWidth / (target.scrollWidth / target.clientWidth);
                    container.hBar.style.width = (size < max ? max : size) + 'px';
                    scroll();
                }
            }
        }
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
