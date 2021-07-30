import { data } from '/test/integration/test_data/chart_types_eu.js';

let styles = {
    plot: {
        marker: {
            label: { position: 'above', filter: 'lightness(0)' }
        },
    }
};

const testSteps = [
    chart => chart.animate(
        {
            data: data,
            descriptor:
            {
                channels:
                {
                    x: { attach: ['Year'] },
                    y: { attach: ['$exists', 'Positive nums'], range: '0,1.1,%' },
                    label: { attach: ['Positive nums'] }
                },
                title: 'Spiderweb 1Line (fake. no multiaxes)',
                align: 'none',
                geometry: 'line',
                coordSystem: 'polar'
            },
            style: styles
        }
    )
];

export default testSteps;