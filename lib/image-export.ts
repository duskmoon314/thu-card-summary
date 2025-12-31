/**
 * Image export using modern-screenshot for DOM to image conversion
 */

import { domToPng } from 'modern-screenshot';

/**
 * Download a poster as PNG image using modern-screenshot
 */
export async function downloadPosterImage(
  element: HTMLElement,
  slideIndex: number
): Promise<void> {
  console.log('[IMAGE-EXPORT] Starting image generation for slide:', slideIndex);

  try {
    // Wait for Recharts SVG to fully render (especially labels)
    console.log('[IMAGE-EXPORT] Waiting for charts to render...');
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log('[IMAGE-EXPORT] Converting DOM to PNG with modern-screenshot...');

    // Use modern-screenshot to capture the element
    const dataUrl = await domToPng(element, {
      scale: 2, // 2x for better quality
      quality: 1.0,
      width: element.offsetWidth,
      height: element.offsetHeight,
      features: {
        // Ensure we capture all fonts
        fontEmbedCss: true,
      },
    });

    console.log('[IMAGE-EXPORT] PNG generated');

    // Download the image
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `thu-card-report-${slideIndex + 1}.png`;
    link.click();

    console.log('[IMAGE-EXPORT] Download complete');
  } catch (error) {
    console.error('[IMAGE-EXPORT] Error:', error);
    throw error;
  }
}

