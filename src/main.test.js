/** @vitest-environment jsdom */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrentPage } from './main.js'; // Adjust path if needed

// Mock the global window object
// We need to mock window.location
// We'll redefine `window` for each test to ensure isolation

describe('getCurrentPage', () => {
  // Store original window properties
  const originalWindow = global.window;

  beforeEach(() => {
    // Restore the original window object before each test
    // Create a fresh mock for each test
    global.window = Object.create(originalWindow);
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '', // Default value, will be overridden in tests
      },
      writable: true, // Important to allow reassignment in tests
    });
  });

  it('should return "home" for the root path ("/")', () => {
    // Arrange: Set the specific path for this test
    window.location.pathname = '/';

    // Act: Call the function
    const result = getCurrentPage();

    // Assert: Check the result
    expect(result).toBe('home');
  });

  it('should return "home" for index.html', () => {
    window.location.pathname = '/index.html';
    expect(getCurrentPage()).toBe('home');
  });

  it('should return "case-studies" for case-studies.html', () => {
    window.location.pathname = '/case-studies.html';
    expect(getCurrentPage()).toBe('case-studies');
  });

  it('should return "contact" for contact.html', () => {
    window.location.pathname = '/contact.html';
    expect(getCurrentPage()).toBe('contact');
  });

  it('should return an empty string for an unknown path', () => {
    window.location.pathname = '/some/other/page.php';
    expect(getCurrentPage()).toBe('');
  });
}); 