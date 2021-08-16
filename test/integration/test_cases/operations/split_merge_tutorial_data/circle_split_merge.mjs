import { data } from '/test/integration/test_data/tutorial.js';

const testSteps = [
  chart => chart.animate(
    {
      data: data,
      descriptor: {
        channels: {
          x: { attach: ['Timeseries'] },
          y: { attach: ['Categ. Parent', 'Values 1'], range: '0,1.1,%' },
          color: { attach: ['Categ. Parent'] },
          size: { attach: ['Values 2'] },
          label: { attach: ['Values 1'] }
        },
        title: 'Operations: Circle - Merged.',
        legend: 'color',
        geometry: 'circle'
      },
      style:
      { plot:
        { marker:
          { label:
            { position: 'top', filter: 'lightness(0)' }
          }
        }
      }
    }
  ),
  chart => chart.animate(
    {
      descriptor: {
        title: 'Operations: Circle - Splitted.',
        split: true,
      },
    }
  ),
  chart => chart.animate(
    {
      descriptor: {
        title: 'Operations: Circle - Merged.',
        split: false,
      },
    }
  )
];

export default testSteps;