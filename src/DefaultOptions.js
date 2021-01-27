export default {
    modules: [
        'DisplaySize',
        'Toolbar',
        'Resize',
    ],
    overlayStyles: {
        position: 'absolute',
        boxSizing: 'border-box',
        border: '3px solid #b4d7ff',
    },
    handleStyles: {
        position: 'absolute',
        height: '12px',
        width: '12px',
        backgroundColor: '#4099ff',
        border: '1px solid #4099ff',
        boxSizing: 'border-box'
    },
    displayStyles: {
        position: 'absolute',
        font: '12px/1.0 Arial, Helvetica, sans-serif',
        padding: '4px 8px',
        textAlign: 'center',
        backgroundColor: 'white',
        color: '#333',
        border: '1px solid #777',
        boxSizing: 'border-box',
        opacity: '0.80',
        cursor: 'default',
    },
    toolbarStyles: {
        position: 'absolute',
        // top: '-12px',
        // right: '0',
        // left: '0',
        // height: '0',
        minWidth: '100px',
        borderRadius: '3px',
        boxShadow: '0px 1px 1px #ccc',
        font: '12px/1.0 Arial, Helvetica, sans-serif',
        textAlign: 'center',
        color: '#333',
        boxSizing: 'border-box',
        cursor: 'default',
        padding: '3px',
        backgroundColor: 'white',
        border: '1px solid #ccc'
    },
    toolbarButtonStyles: {
        display: 'inline-block',
        width: '24px',
        height: '24px',
        background: 'white',
        // border: '1px solid #999',
        verticalAlign: 'middle',
        borderRadius: '5px'
    },
    toolbarButtonSvgStyles: {
        fill: '#444',
        stroke: '#444',
        strokeWidth: '2',
    },
};
