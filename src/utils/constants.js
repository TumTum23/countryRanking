export const SORT_OPTIONS = [
  { value: 'population', label: 'Population' },
  { value: 'name', label: 'Name' },
  { value: 'area', label: 'Area' },
];

export const REGIONS = [
  'Americas', 'Antarctic', 'Africa', 'Asia', 'Europe', 'Oceania'
];

export const PAGE_SIZE = 50;

export const API_ENDPOINTS = {
  ALL_COUNTRIES: 'https://restcountries.com/v3.1/all?fields=name,population,region,subregion,cca3,flags,area,unMember,independent',
  COUNTRY_BY_CODE: (code) => `https://restcountries.com/v3.1/alpha/${code}`,
  COUNTRIES_BY_CODES: (codes) => `https://restcountries.com/v3.1/alpha?codes=${codes.join(',')}&fields=name,cca3,flags`,
}; 