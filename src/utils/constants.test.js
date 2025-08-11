import { 
  SORT_OPTIONS, 
  REGIONS, 
  PAGE_SIZE, 
  API_ENDPOINTS 
} from './constants';

describe('Constants', () => {
  describe('SORT_OPTIONS', () => {
    test('should have correct structure', () => {
      expect(Array.isArray(SORT_OPTIONS)).toBe(true);
      expect(SORT_OPTIONS).toHaveLength(3);
    });

    test('should contain population option', () => {
      const populationOption = SORT_OPTIONS.find(option => option.value === 'population');
      expect(populationOption).toBeDefined();
      expect(populationOption.label).toBe('Population');
    });

    test('should contain name option', () => {
      const nameOption = SORT_OPTIONS.find(option => option.value === 'name');
      expect(nameOption).toBeDefined();
      expect(nameOption.label).toBe('Name');
    });

    test('should contain area option', () => {
      const areaOption = SORT_OPTIONS.find(option => option.value === 'area');
      expect(areaOption).toBeDefined();
      expect(areaOption.label).toBe('Area');
    });

    test('all options should have value and label properties', () => {
      SORT_OPTIONS.forEach(option => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('label');
        expect(typeof option.value).toBe('string');
        expect(typeof option.label).toBe('string');
      });
    });
  });

  describe('REGIONS', () => {
    test('should be an array of strings', () => {
      expect(Array.isArray(REGIONS)).toBe(true);
      REGIONS.forEach(region => {
        expect(typeof region).toBe('string');
      });
    });

    test('should contain all expected regions', () => {
      const expectedRegions = ['Americas', 'Antarctic', 'Africa', 'Asia', 'Europe', 'Oceania'];
      expect(REGIONS).toEqual(expect.arrayContaining(expectedRegions));
      expect(REGIONS).toHaveLength(expectedRegions.length);
    });

    test('should not contain duplicates', () => {
      const uniqueRegions = new Set(REGIONS);
      expect(uniqueRegions.size).toBe(REGIONS.length);
    });
  });

  describe('PAGE_SIZE', () => {
    test('should be a number', () => {
      expect(typeof PAGE_SIZE).toBe('number');
    });

    test('should be a positive integer', () => {
      expect(PAGE_SIZE).toBeGreaterThan(0);
      expect(Number.isInteger(PAGE_SIZE)).toBe(true);
    });

    test('should be 50', () => {
      expect(PAGE_SIZE).toBe(50);
    });
  });

  describe('API_ENDPOINTS', () => {
    test('should be an object', () => {
      expect(typeof API_ENDPOINTS).toBe('object');
      expect(API_ENDPOINTS).not.toBeNull();
    });

    test('should have ALL_COUNTRIES endpoint', () => {
      expect(API_ENDPOINTS).toHaveProperty('ALL_COUNTRIES');
      expect(typeof API_ENDPOINTS.ALL_COUNTRIES).toBe('string');
      expect(API_ENDPOINTS.ALL_COUNTRIES).toContain('restcountries.com');
    });

    test('should have COUNTRY_BY_CODE function', () => {
      expect(API_ENDPOINTS).toHaveProperty('COUNTRY_BY_CODE');
      expect(typeof API_ENDPOINTS.COUNTRY_BY_CODE).toBe('function');
    });

    test('should have COUNTRIES_BY_CODES function', () => {
      expect(API_ENDPOINTS).toHaveProperty('COUNTRIES_BY_CODES');
      expect(typeof API_ENDPOINTS.COUNTRIES_BY_CODES).toBe('function');
    });

    test('COUNTRY_BY_CODE should construct correct URL', () => {
      const testCode = 'USA';
      const result = API_ENDPOINTS.COUNTRY_BY_CODE(testCode);
      expect(result).toBe(`https://restcountries.com/v3.1/alpha/${testCode}`);
    });

    test('COUNTRIES_BY_CODES should construct correct URL', () => {
      const testCodes = ['USA', 'CAN', 'MEX'];
      const result = API_ENDPOINTS.COUNTRIES_BY_CODES(testCodes);
      expect(result).toBe('https://restcountries.com/v3.1/alpha?codes=USA,CAN,MEX&fields=name,cca3,flags');
    });

    test('COUNTRIES_BY_CODES should handle empty array', () => {
      const result = API_ENDPOINTS.COUNTRIES_BY_CODES([]);
      expect(result).toBe('https://restcountries.com/v3.1/alpha?codes=&fields=name,cca3,flags');
    });

    test('ALL_COUNTRIES should have correct fields parameter', () => {
      const expectedFields = ['name', 'population', 'region', 'subregion', 'cca3', 'flags', 'area', 'unMember', 'independent'];
      expectedFields.forEach(field => {
        expect(API_ENDPOINTS.ALL_COUNTRIES).toContain(field);
      });
    });
  });
});
