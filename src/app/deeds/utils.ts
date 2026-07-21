import { PLACEHOLDERS } from '@/constants/placeholders';

const { NONE } = PLACEHOLDERS;

export let deeds = [
  {
    id: 1,
    name: 'Namaaz',
    scale_type: 'Scale',
    created_at: '2026-01-05T05:30:00.000Z',
    last_recorded: '2026-07-17T18:45:00.000Z',
    children: [
      {
        id: 2,
        name: 'Fajar',
        created_at: '2026-01-05T05:30:00.000Z'
      },
      {
        id: 3,
        name: 'Zuhr',
        created_at: '2026-01-08T12:15:00.000Z'
      },
      {
        id: 4,
        name: 'Asr',
        created_at: '2026-01-12T15:40:00.000Z'
      },
      {
        id: 5,
        name: 'Maghrib',
        created_at: '2026-01-18T18:20:00.000Z'
      },
      {
        id: 6,
        name: 'Isha',
        created_at: '2026-01-25T20:10:00.000Z'
      }
    ]
  },
  {
    id: 7,
    name: 'Daily Qur\'an',
    scale_type: 'Count',
    created_at: '2026-03-14T09:00:00.000Z',
    last_recorded: '2026-07-18T04:50:00.000Z'
  },
  {
    id: 8,
    name: 'Tasbeeh',
    scale_type: 'Count',
    created_at: '2026-02-12T09:00:00.000Z',
    last_recorded: '2025-09-19T02:03:00.000Z'
  }
];

export const getDeedById = (id: number) => deeds?.find((deed) => id === deed.id);

export const getSubDeedsById = (id: number) => deeds.find((deed) => deed.id === id)?.children?.length || NONE;

export const getDeedIds = () => deeds.map((deed) => ({ id: String(deed.id) }));

export const deleteDeedByID = (id: number) => deeds = deeds.filter((deed) => deed.id !== id);