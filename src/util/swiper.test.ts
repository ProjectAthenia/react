import { 
  SWIPER_DIRECTIONS, 
  getDirection, 
  getOffset, 
  getEvent, 
  withX, 
  getLimitOffset 
} from './swiper';

describe('swiper utilities', () => {
  describe('SWIPER_DIRECTIONS', () => {
    it('should have LEFT and RIGHT values', () => {
      expect(SWIPER_DIRECTIONS.LEFT).toBe('left');
      expect(SWIPER_DIRECTIONS.RIGHT).toBe('right');
    });
  });

  describe('getDirection', () => {
    it('should return RIGHT when offset is positive', () => {
      expect(getDirection(10)).toBe(SWIPER_DIRECTIONS.RIGHT);
      expect(getDirection(0.1)).toBe(SWIPER_DIRECTIONS.RIGHT);
    });

    it('should return LEFT when offset is negative', () => {
      expect(getDirection(-10)).toBe(SWIPER_DIRECTIONS.LEFT);
      expect(getDirection(-0.1)).toBe(SWIPER_DIRECTIONS.LEFT);
    });

    it('should return LEFT when offset is zero', () => {
      expect(getDirection(0)).toBe(SWIPER_DIRECTIONS.LEFT);
    });
  });

  describe('getOffset', () => {
    it('should calculate offset correctly', () => {
      expect(getOffset(100, 50)).toBe(-37.5); // -((100 - 50) * 0.75)
      expect(getOffset(50, 100)).toBe(37.5);  // -((50 - 100) * 0.75)
      expect(getOffset(0, 0)).toBe(-0);        // -((0 - 0) * 0.75)
    });
  });

  describe('getEvent', () => {
    it('should return touches[0] for touch events', () => {
      const mockTouchEvent = {
        touches: [{ pageX: 100, pageY: 200 }]
      };
      expect(getEvent(mockTouchEvent)).toBe(mockTouchEvent.touches[0]);
    });

    it('should return the event itself for non-touch events', () => {
      const mockMouseEvent = { pageX: 100, pageY: 200 };
      expect(getEvent(mockMouseEvent)).toBe(mockMouseEvent);
    });
  });

  describe('withX', () => {
    it('should call the provided function with the event pageX', () => {
      const mockFn = jest.fn();
      const mockEvent = { pageX: 100 };
      
      withX(mockFn)(mockEvent);
      
      expect(mockFn).toHaveBeenCalledWith(100);
    });

    it('should work with touch events', () => {
      const mockFn = jest.fn();
      const mockTouchEvent = {
        touches: [{ pageX: 100 }]
      };
      
      withX(mockFn)(mockTouchEvent);
      
      expect(mockFn).toHaveBeenCalledWith(100);
    });
  });

  describe('getLimitOffset', () => {
    it('should return limit for RIGHT direction', () => {
      expect(getLimitOffset(100, SWIPER_DIRECTIONS.RIGHT)).toBe(100);
    });

    it('should return negative limit for LEFT direction', () => {
      expect(getLimitOffset(100, SWIPER_DIRECTIONS.LEFT)).toBe(-100);
    });

    it('should handle zero limit', () => {
      expect(getLimitOffset(0, SWIPER_DIRECTIONS.RIGHT)).toBe(0);
      expect(getLimitOffset(0, SWIPER_DIRECTIONS.LEFT)).toBe(-0);
    });
  });
}); 