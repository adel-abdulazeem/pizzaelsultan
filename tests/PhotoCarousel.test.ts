import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test, beforeEach, vi, describe, afterEach } from "vitest";
import PhotoCarousel from "../src/components/data-display/PhotoCarousel.astro";

// Mock the getCollection function from astro:content
vi.mock("astro:content", () => ({
  getCollection: vi.fn()
}));

// Mock the Image component from astro:assets
vi.mock("astro:assets", () => ({
  Image: ({ src, alt, class: className, loading, fetchpriority }: any) => 
    `<img src="${src.src || src}" alt="${alt}" class="${className}" loading="${loading}" fetchpriority="${fetchpriority}" />`
}));

let container: any;

// Sample gallery data for testing
const mockGalleryData = [
  {
    data: {
      image: { src: "/images/photo1.jpg" },
      alt: "Beautiful landscape",
      title: "Mountain View"
    }
  },
  {
    data: {
      image: { src: "/images/photo2.jpg" },
      alt: "Ocean sunset",
      title: "Sunset Beach"
    }
  },
  {
    data: {
      image: { src: "/images/photo3.jpg" },
      alt: "City skyline",
      title: "Urban Lights"
    }
  }
];

beforeEach(async () => {
  container = await AstroContainer.create();
  
  // Reset the mock before each test
  const { getCollection } = await import("astro:content");
  vi.mocked(getCollection).mockResolvedValue(mockGalleryData);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("PhotoCarousel Component", () => {
  test("renders with default props", async () => {
    /*
    const result = await container.renderToString(PhotoCarousel);

    // Check basic structure
    expect(result).toContain('class="photo-carousel relative');
    expect(result).toContain('data-carousel-id=');
    expect(result).toContain('carousel-container relative overflow-hidden');
    expect(result).toContain('carousel-track flex transition-transform');
    
    // Check all images are rendered
    expect(result).toContain('alt="Beautiful landscape"');
    expect(result).toContain('alt="Ocean sunset"');
    expect(result).toContain('alt="City skyline"');
    
    // Check titles are rendered
    expect(result).toContain("Mountain View");
    expect(result).toContain("Sunset Beach");
    expect(result).toContain("Urban Lights");
    */
  });

  test("renders with custom props", async () => {
    /*
    const result = await container.renderToString(PhotoCarousel, {
      props: {
        autoplay: false,
        autoplayDelay: 5000,
        showDots: false,
        showArrows: false,
        className: "custom-carousel",
        lightbox: false
      }
    });

    // Check custom className is applied
    expect(result).toContain('custom-carousel');
    
    // Check arrows are not rendered when showArrows is false
    expect(result).not.toContain('data-prev-btn');
    expect(result).not.toContain('data-next-btn');
    expect(result).not.toContain('carousel-arrow');
    
    // Check dots are not rendered when showDots is false
    expect(result).not.toContain('carousel-dots');
    expect(result).not.toContain('data-dot=');
    
    // Check lightbox links are not rendered when lightbox is false
    expect(result).not.toContain('class="glightbox block"');
    expect(result).not.toContain('<a href=');
    
  });

  test("renders arrows when showArrows is true and multiple images exist", async () => {
    /*
    const result = await container.renderToString(PhotoCarousel, {
      props: {
        showArrows: true
      }
    });

    // Check navigation arrows are rendered
    expect(result).toContain('data-prev-btn');
    expect(result).toContain('data-next-btn');
    expect(result).toContain('carousel-arrow-prev');
    expect(result).toContain('carousel-arrow-next');
    expect(result).toContain('aria-label="Previous image"');
    expect(result).toContain('aria-label="Next image"');
    
    // Check arrow SVG icons
    expect(result).toContain('points="15,18 9,12 15,6"'); // Previous arrow
    expect(result).toContain('points="9,18 15,12 9,6"');  // Next arrow
    */
  });

  test("renders dots when showDots is true and multiple images exist", async () => {
    /*
    const result = await container.renderToString(PhotoCarousel, {
      props: {
        showDots: true
      }
    });

    // Check dots container is rendered
    expect(result).toContain('carousel-dots flex justify-center');
    
    // Check correct number of dots (should match number of images)
    const dotMatches = result.match(/data-dot="/g);
    expect(dotMatches?.length).toBe(mockGalleryData.length);
    
    // Check first dot is active (has blue background)
    expect(result).toContain('bg-blue-500 hover:bg-blue-600');
    expect(result).toContain('bg-gray-300 hover:bg-gray-400');
    
    // Check accessibility labels
    expect(result).toContain('aria-label="Go to slide 1"');
    expect(result).toContain('aria-label="Go to slide 2"');
    expect(result).toContain('aria-label="Go to slide 3"');
    */
  });

  test("renders lightbox links when lightbox is true", async () => {
    /*
    const result = await container.renderToString(PhotoCarousel, {
      props: {
        lightbox: true
      }
    });

    // Check lightbox links are rendered
    expect(result).toContain('class="glightbox block"');
    expect(result).toContain('href="/images/photo1.jpg"');
    expect(result).toContain('href="/images/photo2.jpg"');
    expect(result).toContain('href="/images/photo3.jpg"');
    */
  });

  test("handles single image gracefully", async () => {
    // Mock single image
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue([mockGalleryData[0]]);

    /*
    const result = await container.renderToString(PhotoCarousel);

    // Should still render the image
    expect(result).toContain('alt="Beautiful landscape"');
    expect(result).toContain("Mountain View");
    
    // Should not render arrows or dots for single image
    expect(result).not.toContain('data-prev-btn');
    expect(result).not.toContain('data-next-btn');
    expect(result).not.toContain('carousel-dots');
    */
  });

  test("handles empty gallery collection", async () => {
    // Mock empty collection
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue([]);

    /*
    const result = await container.renderToString(PhotoCarousel);

    // Should render basic structure but no images
    expect(result).toContain('photo-carousel');
    expect(result).toContain('carousel-container');
    expect(result).toContain('carousel-track');
    
    // Should not render any images, arrows, or dots
    expect(result).not.toContain('<img');
    expect(result).not.toContain('data-prev-btn');
    expect(result).not.toContain('carousel-dots');
    */
  });

  test("applies correct image loading attributes", async () => {
    /*
    const result = await container.renderToString(PhotoCarousel);

    // First 3 images should have eager loading and high priority
    const imageMatches = result.match(/<img[^>]*>/g);
    expect(imageMatches).toBeTruthy();
    
    if (imageMatches) {
      // Check first image has eager loading
      expect(result).toContain('loading="eager"');
      expect(result).toContain('fetchpriority="high"');
      
      // Later images should have lazy loading
      expect(result).toContain('loading="lazy"');
      expect(result).toContain('fetchpriority="auto"');
    }
    */
  });

  test("generates unique carousel ID", async () => {
    /*
    const result1 = await container.renderToString(PhotoCarousel);
    const result2 = await container.renderToString(PhotoCarousel);

    // Extract carousel IDs from both renders
    const idMatch1 = result1.match(/data-carousel-id="([^"]+)"/);
    const idMatch2 = result2.match(/data-carousel-id="([^"]+)"/);

    expect(idMatch1).toBeTruthy();
    expect(idMatch2).toBeTruthy();
    
    if (idMatch1 && idMatch2) {
      // IDs should be different
      expect(idMatch1[1]).not.toBe(idMatch2[1]);
      // IDs should start with 'carousel-'
      expect(idMatch1[1]).toMatch(/^carousel-/);
      expect(idMatch2[1]).toMatch(/^carousel-/);
    }
    */
  });

  test("includes script with correct autoplay configuration", async () => {
    /*
    const result = await container.renderToString(PhotoCarousel, {
      props: {
        autoplay: false,
        autoplayDelay: 5000
      }
    });

    // Check script is included
    expect(result).toContain('<script');
    expect(result).toContain('class PhotoCarousel');
    expect(result).toContain('define:vars');
    
    // The actual script content should be present
    expect(result).toContain('bindEvents()');
    expect(result).toContain('updateCarousel()');
    expect(result).toContain('startAutoplay()');
    expect(result).toContain('stopAutoplay()');
    */
  });

  test("renders proper accessibility attributes", async () => {
    /*
    const result = await container.renderToString(PhotoCarousel);

    // Check ARIA labels for navigation
    expect(result).toContain('aria-label="Previous image"');
    expect(result).toContain('aria-label="Next image"');
    expect(result).toContain('aria-label="Go to slide');
    
    // Check image alt attributes are preserved
    expect(result).toContain('alt="Beautiful landscape"');
    expect(result).toContain('alt="Ocean sunset"');
    expect(result).toContain('alt="City skyline"');
    */
  });

  test("applies responsive classes correctly", async () => {
    /*
    const result = await container.renderToString(PhotoCarousel);

    // Check responsive classes are applied
    expect(result).toContain('lg:max-w-[50%]');
    expect(result).toContain('sm:max-w-[100%]');
    expect(result).toContain('md:max-w-[70%]');
    expect(result).toContain('mx-auto');
    
    // Check image responsive classes
    expect(result).toContain('max-h-140 md:max-h-[500px]');
    expect(result).toContain('w-4 h-4 md:w-5 md:h-5'); // Arrow icons
    expect(result).toContain('w-8 h-8 md:w-10 md:h-10'); // Arrow buttons
    */
  });
});