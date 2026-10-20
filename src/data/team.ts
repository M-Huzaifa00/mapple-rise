import type { TeamMember } from '../types';

/**
 * From https://mapleriseestates.com/our-team/. Roles and bios: data.team.<id> in the locales.
 * Wider-team members whose photo is the site's generic silhouette have no image.
 */
export const leaders: TeamMember[] = [
  { id: 'asadKhan', name: 'Asad Khan', image: 'team/asad-khan', leader: true },
  { id: 'azfarZulfiqar', name: 'Azfar Zulfiqar', sourceName: 'Azfar zulfiqar', image: 'team/azfar-zulfiqar', leader: true },
  { id: 'zubairAkbar', name: 'Zubair Akbar', image: 'team/zubair-akbar', leader: true },
  { id: 'muhammadYusuf', name: 'Muhammad Yusuf', image: 'team/muhammad-yusuf', leader: true },
];

export const team: TeamMember[] = [
  { id: 'ihtisham', name: 'Ihtisham ur Rehman', sourceName: 'Ihtisham ur rehman' },
  { id: 'talha', name: 'Talha Ali' },
  { id: 'sadam', name: 'Sadam Hussain' },
  { id: 'rehman', name: 'Muhammad Rehman' },
  { id: 'hadi', name: 'Syed Hadi Raza' },
  // { id: 'arzu', name: 'Arzu D.' },
  { id: 'sabahat', name: 'Sabahat Akbar' },
  { id: 'sidra', name: 'Sidra Sohail' },
  { id: 'tahir', name: 'Syed Muhammad Tahir' },
  { id: 'fawad', name: 'Fawad Nawaz' },
  { id: 'shabih', name: 'Shabih Ul Islam' },
  { id: 'waqar', name: 'Muhammad Waqar' },
  { id: 'azaz', name: 'Azaz Khan' },
  // { id: 'nisha', name: 'Nisha Ilyas' },
  { id: 'ansa', name: 'Ansa Kousar' },
  // { id: 'sheza', name: 'Sheza Sakhawat' },
  { id: 'waqas', name: 'Muhammad Waqas' },
  // { id: 'saif', name: 'Saif Ur Rehman' },
];
