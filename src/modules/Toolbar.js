import IconAlignLeft from 'quill/assets/icons/align-left.svg';
import IconAlignCenter from 'quill/assets/icons/align-center.svg';
import IconAlignRight from 'quill/assets/icons/align-right.svg';
import { BaseModule } from './BaseModule';
const { StyleAttributor } = window.Quill.imports['parchment']

const FloatStyle = new StyleAttributor('float', 'float');
const MarginStyle = new StyleAttributor('margin', 'margin');
const DisplayStyle = new StyleAttributor('display', 'display');

/**
 * Toolbar 应该具有的三种定位
 * 定位在顶部，底部，和内容顶部
 * Toolbar 的服务对象，不止是图片，以后还会是表格，涂蓝后的文本，所以会在外部进行继承
 */
export class Toolbar extends BaseModule {
    /**
     * 定位，可选值有 `top`, `bottom`, `base-top`
     * top 代表Toolbar在当前选中元素的上方
     * bottom 代表 Toolbar 在当前元素的下方
     * base-top 代表 Toolbar 在当前元素上边界的下方
     */
    position = 'top'
    onCreate = () => {
		// Setup Toolbar
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, this.options.toolbarStyles);
        this.overlay.appendChild(this.toolbar);

        // Setup Buttons
        this._defineAlignments();
        this._addToolbarButtons();

        this._renderPosition()
        this._createTriangle(this.position)
    };

	// The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => {};

    // Nothing to update on drag because we are are positioned relative to the overlay
    // 现在采用浮动的形式，需要判断 Toolbar 和 编辑边界是否重合
    onUpdate = () => {

    };
    // 根据 toolbar 高度，和 quill.bounds 边界元素，以及 img 元素对比来判断应该如何定位
    _renderPosition  = () => {
        /** @type { HTMLElement } */
        let boundsContainer = this.quill.options.bounds || document.body
        
        /** @type { HTMLElement } */
        let rootContainer = this.root

        let boundsRect = boundsContainer.getBoundingClientRect()
        let rootRect = rootContainer.getBoundingClientRect()
        let toolbarRect = this.toolbar.getBoundingClientRect()
        /** @type {number} 表示间隔，从toolbar到root的间隔 */
        const MARGIN = 10
        const HEIGHT = toolbarRect.height + MARGIN

        if (
            boundsRect.top + HEIGHT < rootRect.top
            && (rootRect.top - HEIGHT > window.scrollY)
        ) {
            this.position = 'top'
        } else if (
            rootRect.bottom < window.outerHeight
            && (rootRect.bottom + HEIGHT < boundsRect.bottom)
            && (rootRect.bottom + HEIGHTt < window.outerHeight)
        ) {
            this.position = 'bottom'
        } else {
            this.position = 'base-top'
        }

        // 计算 Position 定位
        // 首选计算宽度是否比 toolbar 少
        if (toolbarRect.width > rootRect.width) {
            this.toolbar.style.left = '0'
        } else {
            this.toolbar.style.left = '50%'
            this.toolbar.style.transform = 'translateX(-50%)'
        }
        if (this.position === 'top') {
            this.toolbar.style.top = '-' + Math.ceil(HEIGHT) + 'px'
        } else if (this.position === 'bottom') {
            this.toolbar.style.bottom = '-' + Math.ceil(HEIGHT) + 'px'
        } else {
            this.toolbar.style.top = MARGIN + 'px'
        }
    }
    _createTriangle = (position) => {
        let fn = function (borderColor = 'white', borderWidth = 5) {
            let triangleDom = document.createElement('div')
            triangleDom.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                border: 5px solid white;
                left: 50%;
                transform: translateX(-50%);
            `
            triangleDom.style.borderWidth = borderWidth + 'px'
            triangleDom.style.borderLeftColor = 'transparent'
            triangleDom.style.borderRightColor = 'transparent'
            if (position === 'top') {
                triangleDom.style.borderBottomColor = 'transparent'
                triangleDom.style.borderTopColor = borderColor
                triangleDom.style.bottom = '-' + 2 * borderWidth + 'px'
            } else {
                triangleDom.style.borderTopColor = 'transparent'
                triangleDom.style.borderBottomColor = borderColor
                triangleDom.style.top = '-' + 2 * borderWidth + 'px'
            }
            return triangleDom
        }
        let triangleDom = fn()
        let borderTriangleDom = fn('#ccc', 6)
        this.toolbar.appendChild(borderTriangleDom)
        this.toolbar.appendChild(triangleDom)
    }
    _defineAlignments = () => {
        this.alignments = [
            {
                icon: IconAlignLeft,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'left');
                    MarginStyle.add(this.img, '0 1em 1em 0');
                },
                isApplied: () => FloatStyle.value(this.img) == 'left',
            },
            {
                icon: IconAlignCenter,
                apply: () => {
                    DisplayStyle.add(this.img, 'block');
                    FloatStyle.remove(this.img);
                    MarginStyle.add(this.img, 'auto');
                },
                isApplied: () => MarginStyle.value(this.img) == 'auto',
            },
            {
                icon: IconAlignRight,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'right');
                    MarginStyle.add(this.img, '0 0 1em 1em');
                },
                isApplied: () => FloatStyle.value(this.img) == 'right',
            },
        ];
    };

    _addToolbarButtons = () => {
		const buttons = [];
		this.alignments.forEach((alignment, idx) => {
			const button = document.createElement('span');
			buttons.push(button);
			button.innerHTML = alignment.icon;
			button.addEventListener('click', () => {
					// deselect all buttons
				buttons.forEach(button => button.style.filter = '');
				if (alignment.isApplied()) {
						// If applied, unapply
					FloatStyle.remove(this.img);
					MarginStyle.remove(this.img);
					DisplayStyle.remove(this.img);
				}				else {
						// otherwise, select button and apply
					this._selectButton(button);
					alignment.apply();
				}
					// image may change position; redraw drag handles
				this.requestUpdate();
            });
            button.addEventListener('mouseenter', () => {
                // 鼠标移入时，切换背景色
                if (alignment.isApplied()) {
                    // 已选中时，无反应
                } else {
                    button.style.backgroundColor = '#dee0e2'
                    button.addEventListener('mouseleave', () => {
                        button.style.backgroundColor = 'white'
                    })
                }
            })
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = '0';
			}
			Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
			if (alignment.isApplied()) {
					// select button if previously applied
				this._selectButton(button);
			}
			this.toolbar.appendChild(button);
		});
    };

    _selectButton = (button) => {
		button.style.filter = 'invert(20%)';
    };

}
