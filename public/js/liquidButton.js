/**
 * Liquid Button - Vanilla JS Implementation
 * Ported from Aceternity UI React Component to match the 'Midnight Gold' theme
 */

const MidnightGoldColors = {
    color1: '#050505',  // Darkest background
    color2: '#d4af37',  // Primary gold
    color3: '#aa8c2c',  // Dark gold
    color4: '#1a1a1a',  // Dark gray
    color5: '#f3e5ab',  // Vanilla gold
    color6: '#8b6508',  // Deep brown gold
    color7: '#0a0a0a',  // Dark background
    color8: '#e5c158',  // Soft gold
    color9: '#b8860b',  // Dark goldenrod
    color10: '#ffebcd', // Blanched almond
    color11: '#d4af37', // Primary gold
    color12: '#c5a059', // Muted gold
    color13: '#dfc57b', // Bright gold
    color14: '#997a00', // Olive gold
    color15: '#332900', // Very dark gold
    color16: '#fff2cc', // Lightest gold
    color17: '#ffd700'  // Pure gold
};

const svgOrder = ['svg1', 'svg2', 'svg3', 'svg4', 'svg3', 'svg2', 'svg1'];

const svgStates = {
    svg1: {
        gradientTransform: 'translate(287.5 280) rotate(-29.0546) scale(689.807 1000)',
        stops: [
            { offset: 0, stopColor: MidnightGoldColors.color1 },
            { offset: 0.188423, stopColor: MidnightGoldColors.color2 },
            { offset: 0.260417, stopColor: MidnightGoldColors.color3 },
            { offset: 0.328792, stopColor: MidnightGoldColors.color4 },
            { offset: 0.328892, stopColor: MidnightGoldColors.color5 },
            { offset: 0.328992, stopColor: MidnightGoldColors.color1 },
            { offset: 0.442708, stopColor: MidnightGoldColors.color6 },
            { offset: 0.537556, stopColor: MidnightGoldColors.color7 },
            { offset: 0.631738, stopColor: MidnightGoldColors.color1 },
            { offset: 0.725645, stopColor: MidnightGoldColors.color8 },
            { offset: 0.817779, stopColor: MidnightGoldColors.color9 },
            { offset: 0.84375, stopColor: MidnightGoldColors.color10 },
            { offset: 0.90569, stopColor: MidnightGoldColors.color1 },
            { offset: 1, stopColor: MidnightGoldColors.color11 },
        ],
    },
    svg2: {
        gradientTransform: 'translate(126.5 418.5) rotate(-64.756) scale(533.444 773.324)',
        stops: [
            { offset: 0, stopColor: MidnightGoldColors.color1 },
            { offset: 0.104167, stopColor: MidnightGoldColors.color12 },
            { offset: 0.182292, stopColor: MidnightGoldColors.color13 },
            { offset: 0.28125, stopColor: MidnightGoldColors.color1 },
            { offset: 0.328792, stopColor: MidnightGoldColors.color4 },
            { offset: 0.328892, stopColor: MidnightGoldColors.color5 },
            { offset: 0.453125, stopColor: MidnightGoldColors.color6 },
            { offset: 0.515625, stopColor: MidnightGoldColors.color7 },
            { offset: 0.631738, stopColor: MidnightGoldColors.color1 },
            { offset: 0.692708, stopColor: MidnightGoldColors.color8 },
            { offset: 0.75, stopColor: MidnightGoldColors.color14 },
            { offset: 0.817708, stopColor: MidnightGoldColors.color9 },
            { offset: 0.869792, stopColor: MidnightGoldColors.color10 },
            { offset: 1, stopColor: MidnightGoldColors.color1 },
        ],
    },
    svg3: {
        gradientTransform: 'translate(264.5 339.5) rotate(-42.3022) scale(946.451 1372.05)',
        stops: [
            { offset: 0, stopColor: MidnightGoldColors.color1 },
            { offset: 0.188423, stopColor: MidnightGoldColors.color2 },
            { offset: 0.307292, stopColor: MidnightGoldColors.color1 },
            { offset: 0.328792, stopColor: MidnightGoldColors.color4 },
            { offset: 0.328892, stopColor: MidnightGoldColors.color5 },
            { offset: 0.442708, stopColor: MidnightGoldColors.color15 },
            { offset: 0.537556, stopColor: MidnightGoldColors.color16 },
            { offset: 0.631738, stopColor: MidnightGoldColors.color1 },
            { offset: 0.725645, stopColor: MidnightGoldColors.color17 },
            { offset: 0.817779, stopColor: MidnightGoldColors.color9 },
            { offset: 0.84375, stopColor: MidnightGoldColors.color10 },
            { offset: 0.90569, stopColor: MidnightGoldColors.color1 },
            { offset: 1, stopColor: MidnightGoldColors.color11 },
        ],
    },
    svg4: {
        gradientTransform: 'translate(860.5 420) rotate(-153.984) scale(957.528 1388.11)',
        stops: [
            { offset: 0.109375, stopColor: MidnightGoldColors.color11 },
            { offset: 0.171875, stopColor: MidnightGoldColors.color2 },
            { offset: 0.260417, stopColor: MidnightGoldColors.color13 },
            { offset: 0.328792, stopColor: MidnightGoldColors.color4 },
            { offset: 0.328892, stopColor: MidnightGoldColors.color5 },
            { offset: 0.328992, stopColor: MidnightGoldColors.color1 },
            { offset: 0.442708, stopColor: MidnightGoldColors.color6 },
            { offset: 0.515625, stopColor: MidnightGoldColors.color7 },
            { offset: 0.631738, stopColor: MidnightGoldColors.color1 },
            { offset: 0.692708, stopColor: MidnightGoldColors.color8 },
            { offset: 0.817708, stopColor: MidnightGoldColors.color9 },
            { offset: 0.869792, stopColor: MidnightGoldColors.color10 },
            { offset: 1, stopColor: MidnightGoldColors.color11 },
        ],
    },
};

function createGradientSVG(idSuffix) {
    const maxStops = Math.max(...Object.values(svgStates).map(svg => svg.stops.length));
    const gradientId = `liquid-gradient-${idSuffix}`;
    
    // Create base SVG with animated stops
    let stopsHtml = '';
    
    // Instead of complex JS interpolation for stops, we use CSS variables and animate the SVG container itself 
    // to achieve the 'liquid' feel efficiently. We use svg1 as the base design.
    svgStates.svg1.stops.forEach((stop, i) => {
        stopsHtml += `<stop offset="${stop.offset}" stop-color="${stop.stopColor}"></stop>`;
    });

    return `
        <svg class="w-full h-full liquid-svg" width="1030" height="280" viewBox="0 0 1030 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1030" height="280" rx="140" fill="url(#${gradientId})" />
            <defs>
                <radialGradient id="${gradientId}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="${svgStates.svg1.gradientTransform}">
                    ${stopsHtml}
                </radialGradient>
            </defs>
        </svg>
    `;
}

function initLiquidButtons() {
    const buttons = document.querySelectorAll('.btn-liquid');
    
    buttons.forEach((btn, btnIndex) => {
        // Extract original text
        const text = btn.innerHTML;
        
        // Clear button
        btn.innerHTML = '';
        
        // Create text span to be above liquid
        const textSpan = document.createElement('span');
        textSpan.className = 'btn-liquid-text';
        textSpan.innerHTML = text;
        
        // Create liquid container
        const liquidContainer = document.createElement('div');
        liquidContainer.className = 'liquid-container';
        
        // Generate the 7 layers
        const layerClasses = [
            'liquid-layer layer-1',
            'liquid-layer layer-2',
            'liquid-layer layer-3',
            'liquid-layer layer-4',
            'liquid-layer layer-5',
            'liquid-layer layer-6',
            'liquid-layer layer-7'
        ];
        
        layerClasses.forEach((cls, i) => {
            const layer = document.createElement('div');
            layer.className = cls;
            layer.innerHTML = createGradientSVG(`${btnIndex}-${i}`);
            liquidContainer.appendChild(layer);
        });
        
        btn.appendChild(liquidContainer);
        btn.appendChild(textSpan);
    });
}

document.addEventListener('DOMContentLoaded', initLiquidButtons);
