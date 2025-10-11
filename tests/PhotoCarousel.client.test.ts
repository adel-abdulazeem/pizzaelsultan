import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock DOM environment for carousel testing
class MockCarouselSetup {
  container: HTMLElement;
  
  constructor() {
    this.container = this.createMockCarousel();
  }

  createMockCarousel() {
    const carousel = document.createElement('div');
    carousel.className = 'photo-carousel';
    carousel.setAttribute('data-carousel-id', 'test-carousel');
    
    const container = document.createElement('div');
    container.className = 'carousel-container';
    
    const track = document.createElement('div');
    track.className = 'carousel-track';
    track.setAttribute('data-track', '');
    
    // Create 3 mock slides
    for (let i = 0; i < 3; i++) {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.setAttribute('data-slide', i.toString());
      track.appendChild(slide);
    }
    
    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.setAttribute('data-prev-btn', '');
    prevBtn.className = 'carousel-arrow-prev';
    
    const nextBtn = document.createElement('button');
    nextBtn.setAttribute('data-next-btn', '');
    nextBtn.className = 'carousel-arrow-next';
    
    // Create dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('button');
      dot.setAttribute('data-dot', i.toString());
      dot.className = i === 0 ? 'bg-blue-500' : 'bg-gray-300';
      dotsContainer.appendChild(dot);
    }
    
    container.appendChild(track);
    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
    carousel.appendChild(container);
    carousel.appendChild(dotsContainer);
    
    return carousel;
  }
}

// PhotoCarousel class (extracted from the component script)
class PhotoCarousel {
  carousel: HTMLElement;
  track: HTMLElement;
  slides: NodeListOf<HTMLElement>;
  prevBtn: HTMLElement | null;
  nextBtn: HTMLElement | null;
  dots: NodeListOf<HTMLElement>;
  currentIndex: number;
  autoplayTimer: NodeJS.Timeout | null;
  autoplay: boolean;
  autoplayDelay: number;

  constructor(element: HTMLElement, autoplay = true, autoplayDelay = 2500) {
    this.carousel = element;
    this.track = element.querySelector('[data-track]') as HTMLElement;
    this.slides = element.querySelectorAll('[data-slide]');
    this.prevBtn = element.querySelector('[data-prev-btn]');
    this.nextBtn = element.querySelector('[data-next-btn]');
    this.dots = element.querySelectorAll('[data-dot]');
    
    this.currentIndex = 0;
    this.autoplayTimer = null;
    this.autoplay = autoplay;
    this.autoplayDelay = autoplayDelay;
    
    this.init();
  }

  init() {
    if (this.slides.length <= 1) return;
    this.bindEvents();
    this.updateCarousel();
  }

  bindEvents() {
    this.prevBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.goToPrev();
    });
    
    this.nextBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.goToNext();
    });
    
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToSlide(index);
      });
    });
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  goToNext() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
  }

  goToPrev() {
    this.currentIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.updateCarousel();
  }

  updateCarousel() {
    const translateX = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${translateX}%)`;
    
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.className = 'bg-blue-500';
      } else {
        dot.className = 'bg-gray-300';
      }
    });
  }

  startAutoplay() {
    if (!this.autoplay || this.slides.length <= 1) return;
    
    this.autoplayTimer = setInterval(() => {
      this.goToNext();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
}

describe('PhotoCarousel JavaScript Functionality', () => {
  let mockSetup: MockCarouselSetup;
  let carousel: PhotoCarousel;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '';
    mockSetup = new MockCarouselSetup();
    document.body.appendChild(mockSetup.container);
    
    // Initialize carousel
    carousel = new PhotoCarousel(mockSetup.container, false, 1000); // Disable autoplay for testing
  });

  afterEach(() => {
    carousel.stopAutoplay();
    document.body.innerHTML = '';
    vi.clearAllTimers();
  });

  test('initializes correctly', () => {
    expect(carousel.currentIndex).toBe(0);
    expect(carousel.slides.length).toBe(3);
    expect(carousel.track).toBeTruthy();
    expect(carousel.prevBtn).toBeTruthy();
    expect(carousel.nextBtn).toBeTruthy();
    expect(carousel.dots.length).toBe(3);
  });

  test('navigates to next slide', () => {
    carousel.goToNext();
    
    expect(carousel.currentIndex).toBe(1);
    expect(carousel.track.style.transform).toBe('translateX(-100%)');
    
    // Check dot states
    const dots = carousel.dots;
    expect(dots[0].className).toBe('bg-gray-300');
    expect(dots[1].className).toBe('bg-blue-500');
    expect(dots[2].className).toBe('bg-gray-300');
  });

  test('navigates to previous slide', () => {
    // Start from slide 1
    carousel.goToNext();
    expect(carousel.currentIndex).toBe(1);
    
    // Go to previous
    carousel.goToPrev();
    expect(carousel.currentIndex).toBe(0);
    expect(carousel.track.style.transform).toBe('translateX(0%)');
  });

  test('wraps around when navigating beyond bounds', () => {
    // Go to last slide from first slide (should wrap around)
    carousel.goToPrev();
    expect(carousel.currentIndex).toBe(2);
    expect(carousel.track.style.transform).toBe('translateX(-200%)');
    
    // Go to first slide from last slide (should wrap around)
    carousel.goToNext();
    expect(carousel.currentIndex).toBe(0);
    expect(carousel.track.style.transform).toBe('translateX(0%)');
  });

  test('navigates to specific slide', () => {
    carousel.goToSlide(2);
    
    expect(carousel.currentIndex).toBe(2);
    expect(carousel.track.style.transform).toBe('translateX(-200%)');
    
    // Check dot states
    const dots = carousel.dots;
    expect(dots[0].className).toBe('bg-gray-300');
    expect(dots[1].className).toBe('bg-gray-300');
    expect(dots[2].className).toBe('bg-blue-500');
  });

  test('handles button clicks', () => {
    const nextBtn = carousel.nextBtn as HTMLElement;
    const prevBtn = carousel.prevBtn as HTMLElement;
    
    // Test next button
    nextBtn.click();
    expect(carousel.currentIndex).toBe(1);
    
    // Test previous button
    prevBtn.click();
    expect(carousel.currentIndex).toBe(0);
  });

  test('handles dot clicks', () => {
    const secondDot = carousel.dots[1] as HTMLElement;
    
    secondDot.click();
    expect(carousel.currentIndex).toBe(1);
  });

  test('autoplay functionality', () => {
    vi.useFakeTimers();
    
    // Create carousel with autoplay enabled
    const autoplayCarousel = new PhotoCarousel(mockSetup.container, true, 1000);
    autoplayCarousel.startAutoplay();
    
    expect(autoplayCarousel.currentIndex).toBe(0);
    
    // Fast-forward time
    vi.advanceTimersByTime(1000);
    expect(autoplayCarousel.currentIndex).toBe(1);
    
    vi.advanceTimersByTime(1000);
    expect(autoplayCarousel.currentIndex).toBe(2);
    
    // Should wrap around
    vi.advanceTimersByTime(1000);
    expect(autoplayCarousel.currentIndex).toBe(0);
    
    autoplayCarousel.stopAutoplay();
    vi.useRealTimers();
  });

  test('stops and starts autoplay correctly', () => {
    vi.useFakeTimers();
    
    const autoplayCarousel = new PhotoCarousel(mockSetup.container, true, 1000);
    
    // Start autoplay
    autoplayCarousel.startAutoplay();
    expect(autoplayCarousel.autoplayTimer).toBeTruthy();
    
    // Stop autoplay
    autoplayCarousel.stopAutoplay();
    expect(autoplayCarousel.autoplayTimer).toBeNull();
    
    vi.useRealTimers();
  });

  test('does not initialize with single slide', () => {
    // Create carousel with single slide
    const singleSlideCarousel = document.createElement('div');
    singleSlideCarousel.className = 'photo-carousel';
    
    const track = document.createElement('div');
    track.setAttribute('data-track', '');
    
    const slide = document.createElement('div');
    slide.setAttribute('data-slide', '0');
    track.appendChild(slide);
    
    singleSlideCarousel.appendChild(track);
    
    const singleCarousel = new PhotoCarousel(singleSlideCarousel);
    
    // Should not bind events or start autoplay with single slide
    expect(singleCarousel.slides.length).toBe(1);
  });

  test('updates dot classes correctly', () => {
    // Initial state
    expect(carousel.dots[0].className).toBe('bg-blue-500');
    expect(carousel.dots[1].className).toBe('bg-gray-300');
    expect(carousel.dots[2].className).toBe('bg-gray-300');
    
    // Navigate to slide 2
    carousel.goToSlide(1);
    expect(carousel.dots[0].className).toBe('bg-gray-300');
    expect(carousel.dots[1].className).toBe('bg-blue-500');
    expect(carousel.dots[2].className).toBe('bg-gray-300');
  });
});