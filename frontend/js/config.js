/* Global config + demo definitions + theme palettes */

export const THEMES = [
  { name: 'Iris Magenta', a1: '#7F5CFF', a2: '#FF4DB8' },
  { name: 'Neon Green',   a1: '#00FF88', a2: '#69FF00' },
  { name: 'Laser Blue',   a1: '#00D1FF', a2: '#6C5BFF' },
  { name: 'Hyper Orange', a1: '#FF7A00', a2: '#FFD000' },
  { name: 'Cyber Pink',   a1: '#FF3D81', a2: '#FF9EE5' },
];

export const ZYPHER_CONFIG = {
  demos: [
    {
      name: 'Car Insurance',
      subtitle: 'Quick-qualify & quote',
      bullets: [
        'Collect → name, phone, vehicle, NCB, claims',
        'Decision → instant quote / manual review',
        'Integrations → Calendar · CRM · Email'
      ],
      hint: 'Get a quick quote'
    },
    {
      name: 'Appointly',
      subtitle: 'Appointment Booking',
      bullets: [
        'Collect → service, date & time, notes',
        'Confirm → SMS + calendar invite',
        'Links → reschedule / cancel'
      ],
      hint: 'Book me Friday 3pm'
    },
    {
      name: 'Salon Booker',
      subtitle: 'Services & add-ons',
      bullets: [
        'Upsell → bundles, extras, deposits',
        'Remind → no-show sequences',
        'Ops → CRM summary'
      ],
      hint: 'Cut + beard trim this weekend'
    },
    {
      name: 'Property Qualifier',
      subtitle: 'Tenants & viewings',
      bullets: [
        'Filter → budget, move-in, location, docs',
        'Book → viewing slots / agent call',
        'Sync → CRM with transcript'
      ],
      hint: 'I want to view a 2-bed'
    }
  ]
};
