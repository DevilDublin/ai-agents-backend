export const ZYPHER_CONFIG = {
  theme: {
    // default neon = green; dropdown still lets you switch
    accentRgb: [120, 255, 180],
  },
  demos: [
    {
      id: 'car',
      name: 'Car Insurance',
      subtitle: 'Quick-qualify & quote',
      bullets: [
        'Collect → name, phone, vehicle, NCB, claims',
        'Decision → instant quote / manual review',
        'Integrations → Calendar • CRM • Email'
      ],
      hint: 'Get a quick quote'
    },
    {
      id: 'appointly',
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
      id: 'salon',
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
      id: 'property',
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
