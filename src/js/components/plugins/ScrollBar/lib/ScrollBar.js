import consts from '../consts';

export default class TurboScrollBar {
    constructor(options) {
        if (options) {
            this.initialize(options);
        }
    }

    initialize(options) {
        let computedStyleContainer = window.getComputedStyle(options.container);

        this._container             = options.container;
        this._borderWidthContainerX = parseInt(computedStyleContainer.borderLeftWidth || 0)
                                      + parseInt(computedStyleContainer.borderRightWidth || 0);
        this._borderWidthContainerY = parseInt(computedStyleContainer.borderTopWidth || 0)
                                      + parseInt(computedStyleContainer.borderBottomWidth || 0);

        this._isScrollHasX = typeof options.isScrollHasX === "boolean"
            ? options.isScrollHasX
            : consts.DEFAULT_SETTINGS.isScrollHasX;

        this._isScrollHasY = typeof options.isScrollHasY === "boolean"
            ? options.isScrollHasY
            : consts.DEFAULT_SETTINGS.isScrollHasY;

        this._isDisableOutScroll = typeof options.isDisableOutScroll === "boolean"
            ? options.isDisableOutScroll
            : consts.DEFAULT_SETTINGS.isDisableOutScroll;

        this.deltaRailX = 0;
        this.deltaRailY = 0;

        this._dynamicHandlers = {
            keyboard: (e) => this._onScrollKeyBoardContent(e),
            drag    : (e) => this._onProcessDrag(e),
            stopDrag: (e) => this._onStopDrag(e)
        };

        this._create();

        if (options.isStickScrollX) {
            this._calcPositionScrollX();

            window.addEventListener("scroll", () => this._calcPositionScrollX());
        }
    }

    /**
     * Создание прокруток контейнера в зависимости от переданных параметров
     */
    _create() {
        if (!this._isHtmlElement()) {
            return;
        }

        if (!this._isScrollContainer()) {
            return;
        }

        if (this._isScrollHasX) {
            this._addScrollerX();
            this.deltaRailX = this._getDeltaRailX();
        }

        if (this._isScrollHasY) {
            this._addScrollerY();
            this.deltaRailY = this._getDeltaRailY();
        }

        this.update();
        this._bindListeners();
    }

    /**
     * Проверка того является ли переданный контейнер HTML элементом
     *
     * @returns {boolean}
     */
    _isHtmlElement() {
        return this._container instanceof HTMLElement;
    }

    /**
     * Проверка что у переданного контейнера есть нужный класс
     *
     * @returns {boolean}
     */
    _isScrollContainer() {
        return this._container.classList.contains(consts.CLASS_CONTAINER);
    }

    /**
     * Проверяет есть ли скроллбар у контейнера.
     * Возвращает true если есть хотя бы один (горизонтальный или вертикальный).
     *
     * @returns {boolean}
     */
    _isContainerHasScroll() {
        let container = this._container,
            isY       = container.scrollHeight > container.clientHeight,
            isX       = container.scrollWidth > container.clientWidth;

        return isY || isX;
    }

    /**
     * Проверяет есть ли у контейнера скролл по оси X.
     *
     * @param {object} element - HTML элемент
     *
     * @returns {boolean}
     */
    _isContainerHasX(element) {
        let container = element || this._container;

        return container.scrollWidth > container.clientWidth;
    }

    /**
     * Проверяет есть ли у контейнера скролл по оси Y.
     *
     * @param {object} element - HTML элемент
     *
     * @returns {boolean}
     */
    _isContainerHasY(element) {
        let container = element || this._container;

        return container.scrollHeight > container.clientHeight;
    }

    /**
     * Добавление горизонтальной прокрутки
     */
    _addScrollerX() {
        this._scrollerX           = document.createElement("div");
        this._scrollerX.className = consts.CLASS_TRIGGER;

        this._scrollerXRail           = document.createElement("div");
        this._scrollerXRail.className = consts.CLASS_RAIL_X;

        this._scrollerXRail.appendChild(this._scrollerX);
        this._scrollerXRail.appendChild(document.createElement('span'));
        this._container.appendChild(this._scrollerXRail);
    }

    /**
     * Определение погрешности длины рельсы горизонтальной прокрутки
     *
     * @returns {number}
     */
    _getDeltaRailX() {
        let styles       = getComputedStyle(this._scrollerXRail),
            paddingLeft  = styles.paddingLeft,
            paddingRight = styles.paddingRight;

        return parseInt(paddingLeft) + parseInt(paddingRight);
    }

    /**
     * Определение погрешности длины рельсы вертикальной прокрутки
     *
     * @returns {number}
     */
    _getDeltaRailY() {
        let styles        = getComputedStyle(this._scrollerYRail),
            paddingTop    = styles.paddingTop,
            paddingBottom = styles.paddingBottom;

        return parseInt(paddingTop) + parseInt(paddingBottom);
    }

    /**
     * Добавление вертикальной прокрутки
     */
    _addScrollerY() {
        this._scrollerY           = document.createElement("div");
        this._scrollerY.className = consts.CLASS_TRIGGER;

        this._scrollerYRail           = document.createElement("div");
        this._scrollerYRail.className = consts.CLASS_RAIL_Y;

        this._scrollerYRail.appendChild(this._scrollerY);
        this._scrollerYRail.appendChild(document.createElement('span'));
        this._container.appendChild(this._scrollerYRail);
    }

    /**
     * Обновление вертикальной полосы прокрутки
     *
     * @param {object} container - родительский элемент скроллбара.
     */
    _updateScrollerY(container) {
        let border           = this._borderWidthContainerY * 2,
            railYHeight      = container.offsetHeight - border,
            scrollerYHeight  = this._calculateScrollerYHeight(),
            maxHeightTrigger = railYHeight - this.deltaRailY;

        if ((scrollerYHeight / maxHeightTrigger) < 1) {
            this._scrollerYRail.style.height = railYHeight + 'px';
            this._scrollerY.style.height     = scrollerYHeight + 'px';

            container.classList.add(consts.CLASS_SCROLL_HAS_Y);
        }
    }

    /**
     * Обновление горизонтальной полосы прокрутки
     *
     * @param {object} container - родительский элемент скроллбара.
     */
    _updateScrollerX(container) {
        let hasY            = container.scrollHeight > container.clientHeight,
            width           = container.offsetWidth - (this._borderWidthContainerX * 2),
            railXWidth      = hasY ? width - consts.MARGIN_RAIL_X : width,
            scrollerXWidth  = this._calculateScrollerXWidth(hasY),
            maxWidthTrigger = railXWidth - this.deltaRailX;

        if ((scrollerXWidth / maxWidthTrigger) < 1) {
            this._scrollerXRail.style.width = railXWidth + 'px';
            this._scrollerX.style.width     = scrollerXWidth + 'px';

            container.classList.add(consts.CLASS_SCROLL_HAS_X);
        }
    }

    /**
     * Обновление данных полос прокрутки.
     *
     * Перед обновлением рельс удаляются css-классы, которые отвечают за
     * отображения рельс. Делается это для того чтобы размер считался корректно.
     * Иначе будут ситуации, когда рельса будет занимать
     * лишний scrollHeight или scrollWidth.
     *
     * Так же тут играет роль последовательность обновления рельс.
     * Сначало необходимо обновить вертикальный скролл,
     * а затем горизонтальный, т.к. ширина горизонтальной рельсы считается в
     * зависимости от наличия вертикальной рельсы.
     */
    update() {
        let container = this._container,
            deltas    = { deltaX: false, deltaY: false };

        container.classList.remove(consts.CLASS_SCROLL_HAS_Y);
        container.classList.remove(consts.CLASS_SCROLL_HAS_X);

        this._calculateOffsetRailAndTrigger(deltas, false);

        if (this._isScrollHasY) {
            this._updateScrollerY(container);
        }

        if (this._isScrollHasX) {
            this._updateScrollerX(container);
        }
    }

    /**
     * Сколит по оси X на количество равное value или в самый конец если
     * value - 'end'.
     *
     * @param {number|string} value - на сколько проскроллить.
     * @param {boolean} isUpdate - флаг обновления после сколла.
     */
    scrollToX(value, isUpdate) {
        let container = this._container;

        container.scrollLeft = value === 'end' ? container.scrollWidth : value;

        if (isUpdate) {
            this.update();
        }
    }

    /**
     * Сколит по оси Y на количество равное value или в самый конец если
     * value - 'end'.
     *
     * @param {number|string} value - на сколько проскроллить.
     * @param {boolean} isUpdate - флаг обновления после сколла.
     */
    scrollToY(value, isUpdate) {
        let container = this._container;

        container.scrollTop = value === 'end' ? container.scrollHeight : value;

        if (isUpdate) {
            this.update();
        }
    }

    /**
     * Вычисление высоты триггера вертикальной прокрутки
     *
     * @returns {number}
     */
    _calculateScrollerYHeight() {
        let container    = this._container,
            border       = this._borderWidthContainerY * 2,
            offset       = container.offsetHeight - border - this.deltaRailY,
            scrollHeight = (container.scrollHeight - container.clientHeight === 1)
                ? (container.scrollHeight - 1)
                : container.scrollHeight,
            visibleRatio = offset / scrollHeight;

        //TODO scrollHeight не всегда адекватно считается, потом ппеределать
        return visibleRatio * container.offsetHeight;
    }

    /**
     * Вычисление ширины триггера горизонтальной прокрутки
     *
     * @param {boolean} hasY - указывает имеет ли контейнер горизонтальный скролл
     *
     * @returns {number}
     */
    _calculateScrollerXWidth(hasY) {
        let container    = this._container,
            offset       = container.offsetWidth - this.deltaRailX,
            part         = hasY ? consts.MARGIN_RAIL_X : 0,
            visibleRatio = (offset - part) / container.scrollWidth;

        return visibleRatio * container.offsetWidth;
    }

    /**
     * Приминение слушателей на элемент и его дочерние элементы,
     * требующиеся для функционала прокруток.
     */
    _bindListeners() {
        let container = this._container,
            triggerX  = this._scrollerX,
            triggerY  = this._scrollerY;

        container.addEventListener(
            "dragover",
            (e) => this._onDragOver(e)
        );

        container.addEventListener(
            "wheel",
            (e) => this._onScrollContent(e)
        );

        container.addEventListener(
            "mouseenter",
            (e) => this._onEnterContainer(e)
        );

        container.addEventListener(
            "mouseleave",
            (e) => this._onLeaveContainer(e)
        );

        if (this._isScrollHasX) {
            this._scrollerXRail.addEventListener(
                "mouseup",
                (e) => this._onMoveToClickX(e)
            );

            triggerX.addEventListener(
                "click",
                (e) => TurboScrollBar._onStopPropagation(e)
            );

            triggerX.addEventListener(
                "mousedown",
                (e) => this._onStartDragX(e)
            );
        }

        if (this._isScrollHasY) {
            this._scrollerYRail.addEventListener(
                "mouseup",
                (e) => this._onMoveToClickY(e)
            );

            triggerY.addEventListener(
                "click",
                (e) => TurboScrollBar._onStopPropagation(e)
            );

            triggerY.addEventListener(
                "mousedown",
                (e) => this._onStartDragY(e)
            );
        }
    }

    /**
     * Приминение слушателей на document.
     */
    _bindGlobalListeners() {
        document.addEventListener("keydown", this._dynamicHandlers.keyboard);
    }

    /**
     * Отвязка слушателей с document.
     */
    _unbindGlobalListeners() {
        document.removeEventListener("keydown", this._dynamicHandlers.keyboard);
    }

    /**
     * Вычисление отступа триггера горизонтальной прокрутки
     *
     * @returns {number}
     */
    _getOffsetTriggerX() {
        let container    = this._container,
            hasY         = container.scrollHeight > container.clientHeight,
            width        = container.offsetWidth,
            offsetWidth  = hasY ? width - consts.MARGIN_RAIL_X : width,
            visibleRatio = (offsetWidth - this.deltaRailX) / container.scrollWidth;

        return visibleRatio * container.scrollLeft;
    }

    /**
     * Вычисление отступа триггера вертикальной прокрутки
     *
     * @returns {number}
     */
    _getOffsetTriggerY() {
        let container    = this._container,
            border       = this._borderWidthContainerY * 2,
            offsetHeight = container.offsetHeight - border,
            visibleRatio = (offsetHeight - this.deltaRailY) / container.scrollHeight;

        return visibleRatio * container.scrollTop;
    }

    /**
     * Обработчик события прокрутки внутри контейнера
     *
     * @param {object} e - event
     */
    _onScrollContent(e) {
        let { deltaX, deltaY } = TurboScrollBar._getWheelDelta(e),
            onlyHasX           = this._isContainerHasX() && !this._isContainerHasY();

        if (!this._isContainerHasScroll()) {
            return;
        }

        if (this._isDisableOutScroll) {
            e.preventDefault();
            e.stopPropagation();
        }

        if ((this._isContainerHasX() && e.shiftKey) || onlyHasX) {
            deltaX = deltaY;
            deltaY = 0;
        }

        this._calculateOffsetRailAndTrigger({ deltaX, deltaY }, true);
    }

    /**
     * Вычсиление интервала прокрутки в разных браузерах
     *
     * @param {object} e - event
     *
     * @returns {object}
     */
    static _getWheelDelta(e) {
        let deltaX   = e.deltaX,
            deltaY   = e.deltaY,
            isDeltaX = typeof deltaX === "undefined",
            isDeltaY = typeof deltaY === "undefined";

        if (isDeltaX || isDeltaY) {
            deltaX = -1 * e.wheelDeltaX / 6;
            deltaY = e.wheelDeltaY / 6;
        }

        if (e.deltaMode === 1) {
            deltaX *= 18;
            deltaY *= 18;
        }

        return { deltaX, deltaY };
    }

    /**
     * Скроллит элемент в центр прокручиваемой зоны.
     * Если элемент проскроллить в центр не возможно, то проскролит на сколько можно.
     *
     * @param  {object} params - параметры.
     */
    static scrollElementToXCenter({ element, smooth, duration, onScroll, onEnd }) {
        let scrollable     = element.closest(`.${consts.CLASS_CONTAINER}`),
            elementRect    = element.getBoundingClientRect(),
            scrollableRect = scrollable.getBoundingClientRect(),
            halfWidth      = (scrollableRect.width - elementRect.width) / 2,
            offset         = 0,
            diff;

        if (elementRect.right > (scrollableRect.right - scrollableRect.width) / 2) {
            diff = elementRect.right - scrollableRect.right;

            offset += diff + halfWidth;
        } else {
            diff = Math.abs(elementRect.left - scrollableRect.left);

            offset -= diff + halfWidth;
        }

        if (smooth) {
            turbo.plugins.TurboSmoothScroll.scrollX({
                element    : scrollable,
                to         : offset,
                duration   : duration || 300,
                startOffset: scrollable.scrollLeft,
                onScroll
            });
        } else {
            scrollable.scrollLeft += offset;
        }

        if (onEnd) {
            onEnd();
        }
    }

    /**
     * Скроллит элемент максимально в верх.
     *
     * @param  {object} params - параметры.
     */
    static scrollElementToYTop({ element, smooth, duration, onScroll, onEnd }) {
        let scrollable     = element.closest(`.${consts.CLASS_CONTAINER}`),
            elementRect    = element.getBoundingClientRect(),
            scrollableRect = scrollable.getBoundingClientRect(),
            height         = scrollableRect.height - elementRect.height,
            offset         = 0,
            diff;

        if (elementRect.top > scrollableRect.top) {
            diff = elementRect.top - scrollableRect.top;

            offset += diff;
        } else {
            diff = Math.abs(elementRect.top - scrollableRect.top);

            offset -= diff;
        }

        if (smooth) {
            turbo.plugins.TurboSmoothScroll.scrollY({
                element    : scrollable,
                to         : offset,
                duration   : duration || 300,
                startOffset: scrollable.scrollTop,
                onScroll,
                onEnd
            });
        } else {
            scrollable.scrollTop += offset;

            if (onEnd) {
                onEnd();
            }
        }
    }

    /**
     * Обработчик события драга. Срабатывает, когда перетаскиваемый элемент
     * находится в зоне скроллбара.
     *
     * Наобходим чтобы скроллить в момент перетаскивания элемента
     *
     * @param {object} e - event
     */
    _onDragOver(e) {
        let element  = this._container,
            rect     = element.getBoundingClientRect(),
            offsetY  = e.clientY - rect.top,
            offsetX  = e.clientX - rect.left,
            deltaX   = 0,
            deltaY   = 0,
            isLeft   = offsetY < consts.DRAG_ZONE_SIZE,
            isRight  = offsetY > rect.height - consts.DRAG_ZONE_SIZE,
            isTop    = offsetX < consts.DRAG_ZONE_SIZE,
            isBottom = offsetX > rect.width - consts.DRAG_ZONE_SIZE;

        if (isLeft) {
            deltaY = -consts.DRAG_SCROLL_NUMBER;
        }

        if (isRight) {
            deltaY = consts.DRAG_SCROLL_NUMBER;
        }

        if (isTop) {
            deltaX = -consts.DRAG_SCROLL_NUMBER;
        }

        if (isBottom) {
            deltaX = consts.DRAG_SCROLL_NUMBER;
        }

        this._calculateOffsetRailAndTrigger({ deltaX, deltaY }, true);
    }

    /**
     * Обработка события входа курсора мыши в контейнер
     *
     * @param {object} e - event
     */
    _onEnterContainer(e) {
        this._isActiveContainer = true;

        this._bindGlobalListeners();
    }

    /**
     * Обработка события покидания курсора мыши конттейнера
     *
     * @param {object} e - event
     */
    _onLeaveContainer(e) {
        this._isActiveContainer = false;

        this._unbindGlobalListeners();
    }

    /**
     * Обработка событий нажатия клавишь клавиатуры
     *
     * @param {object} e - event
     */
    _onScrollKeyBoardContent(e) {
        let deltaX    = 0,
            deltaY    = 0,
            container = this._container,
            borderY   = this._borderWidthContainerY * 2,
            maxDeltaY = container.scrollHeight - container.offsetHeight + borderY,
            activeEl  = document.activeElement,
            focusEl   = activeEl.closest(`.${consts.CLASS_CONTAINER}`),
            isFocus   = (focusEl === container) && (container !== activeEl),
            hasScroll = this._isContainerHasScroll();

        if (!hasScroll || !this._isActiveContainer || isFocus) {
            return;
        }

        switch (e.which) {
            case 37: // left
                deltaX = -30;
                break;

            case 38: // up
                deltaY = -30;
                break;

            case 39: // right
                deltaX = 30;
                break;

            case 40: // down
                deltaY = 30;
                break;

            case 33: // page up
                deltaY = -90;
                break;

            case 32: // space bar
            case 34: // page down
                deltaY = 90;
                break;

            case 35: // end
                deltaY = maxDeltaY;
                break;

            case 36: // home
                deltaY = -maxDeltaY;
                break;

            default:
                return;
        }

        if (this._isDisableOutScroll && (!!deltaX || !!deltaY)) {
            e.preventDefault();
            e.stopPropagation();
        }

        this._calculateOffsetRailAndTrigger({ deltaX, deltaY }, true);
    }

    /**
     * Вычисление положения контента, рельс и триггеров прокрутки.
     *
     * @param {object} scrollDelta - объект содержит отступы прокрутки
     *
     * @param {boolean} isAdditional - признак показывает стоит ли добавлять
     * отступы к имеющемуся значению (true)
     * или заменянить текущее значение(false)
     */
    _calculateOffsetRailAndTrigger(scrollDelta, isAdditional) {
        let container = this._container,
            railX     = this._scrollerXRail,
            railY     = this._scrollerYRail,
            triggerX  = this._scrollerX,
            triggerY  = this._scrollerY,
            offsetTriggerX, offsetTriggerY, deltaX, deltaY;

        if (isAdditional) {
            deltaY = scrollDelta.deltaY ? scrollDelta.deltaY : 0;
            deltaX = scrollDelta.deltaX ? scrollDelta.deltaX : 0;

            container.scrollTop += deltaY;
            container.scrollLeft += deltaX;
        } else {
            if (scrollDelta.deltaY) {
                container.scrollTop = scrollDelta.deltaY;
            }

            if (scrollDelta.deltaX) {
                container.scrollLeft = scrollDelta.deltaX;
            }
        }

        if (this._isScrollHasX) {
            railX.style.left         = container.scrollLeft + "px";
            railX.style.bottom       = -container.scrollTop + "px";
            offsetTriggerX           = this._getOffsetTriggerX();
            triggerX.style.transform = `translateX(${offsetTriggerX}px)`;
        }

        if (this._isScrollHasY) {
            railY.style.right        = -container.scrollLeft + "px";
            railY.style.top          = container.scrollTop + "px";
            offsetTriggerY           = this._getOffsetTriggerY();
            triggerY.style.transform = `translateY(${offsetTriggerY}px)`;
        }
    }

    /**
     * Прокрутки к точке на горизонтальной рельсе на которой был щелчок
     * левой клавишей мыши.
     *
     * @param {object} e - event
     */
    _onMoveToClickX(e) {
        let positionX, railWidth, halfScrollerWidth, deltaX;

        if (!e.target.classList.contains(consts.CLASS_RAIL_X)) {
            return;
        }

        positionX         = e.offsetX;
        halfScrollerWidth = this._scrollerX.offsetWidth / 2;
        railWidth         = this._scrollerXRail.offsetWidth - this.deltaRailX;

        deltaX = (positionX - halfScrollerWidth) / (railWidth / this._container.scrollWidth);

        this._calculateOffsetRailAndTrigger({ deltaX }, false);
    }

    /**
     * Прокрутки к точке на вертикальной рельсе на которой был щелчок
     * левой клавишей мыши
     *
     * @param {object} e - event
     */
    _onMoveToClickY(e) {
        let positionY, railHeight, halfScrollerHeight, deltaY;

        if (!e.target.classList.contains(consts.CLASS_RAIL_Y)) {
            return;
        }

        positionY          = e.offsetY;
        halfScrollerHeight = this._scrollerY.offsetHeight / 2;
        railHeight         = this._scrollerYRail.offsetHeight - this.deltaRailY;

        deltaY = (positionY - halfScrollerHeight) / (railHeight / this._container.scrollHeight);

        this._calculateOffsetRailAndTrigger({ deltaY }, false);
    }

    /**
     * Инициализация перетакивания горизонтального триггера
     *
     * @param {object} e - event
     */
    _onStartDragX(e) {
        let container = this._container;

        container.classList.add(consts.CLASS_DRAGGING_X);

        this._normalizedPosition    = e.pageX;
        this._contentPosition       = container.scrollLeft;
        this._scrollerBeingDraggedX = true;

        window.addEventListener('mousemove', this._dynamicHandlers.drag);
        window.addEventListener('mouseup', this._dynamicHandlers.stopDrag);
    }

    /**
     * Инициализация перетаскивания вертикального триггера
     *
     * @param {object} e - event
     */
    _onStartDragY(e) {
        let container = this._container;

        container.classList.add(consts.CLASS_DRAGGING_Y);

        this._normalizedPosition    = e.pageY;
        this._contentPosition       = container.scrollTop;
        this._scrollerBeingDraggedY = true;

        window.addEventListener('mousemove', this._dynamicHandlers.drag);
        window.addEventListener('mouseup', this._dynamicHandlers.stopDrag);
    }

    /**
     * Процесс перетаскивания триггера
     *
     * @param {object} e - event
     */
    _onProcessDrag(e) {
        let container       = this._container,
            borderX         = this._borderWidthContainerX * 2,
            borderY         = this._borderWidthContainerY * 2,
            containerWidth  = container.scrollWidth / (container.offsetWidth - borderX),
            containerHeight = container.scrollHeight / (container.offsetHeight - borderY),
            mouseDifferential, scrollEquivalent, deltaX, deltaY;

        if (this._scrollerBeingDraggedY === true) {
            mouseDifferential = e.pageY - this._normalizedPosition;
            scrollEquivalent  = mouseDifferential * containerHeight;
            deltaY            = this._contentPosition + scrollEquivalent;

            this._calculateOffsetRailAndTrigger({ deltaY }, false);
        } else if (this._scrollerBeingDraggedX === true) {
            mouseDifferential = e.pageX - this._normalizedPosition;
            scrollEquivalent  = mouseDifferential * containerWidth;
            deltaX            = this._contentPosition + scrollEquivalent;

            this._calculateOffsetRailAndTrigger({ deltaX }, false);
        }
    }

    /**
     * Заверщение процесса перетакивания триггера
     *
     * @private
     */
    _onStopDrag() {
        let container = this._container;

        container.classList.remove(consts.CLASS_DRAGGING_X);
        container.classList.remove(consts.CLASS_DRAGGING_Y);

        this._scrollerBeingDraggedY = false;
        this._scrollerBeingDraggedX = false;

        window.removeEventListener('mousemove', this._dynamicHandlers.drag);
        window.removeEventListener('mouseup', this._dynamicHandlers.stopDrag);
    }

    static _onStopPropagation(e) {
        e.stopPropagation();
    }

    _calcPositionScrollX() {
        let xRail = this._scrollerXRail,
            boxXRail, bottomRail, innerHeight, match, translateY, diff;

        if (!xRail) {
            return;
        }

        match = xRail.style.transform.match(/translateY\(([-\d.]+)px\)/i);

        if (match === null) {
            translateY = 0;
        } else {
            translateY = parseFloat(match[1]);
        }

        innerHeight = window.innerHeight;
        boxXRail    = xRail.getBoundingClientRect();
        bottomRail  = boxXRail.bottom;

        diff = (innerHeight - bottomRail + translateY) < 0 ? (innerHeight - bottomRail + translateY) : 0;

        xRail.style.transform = `translateY(${diff}px)`;
    }
}
