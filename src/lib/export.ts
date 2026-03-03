import { toPng, toJpeg, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';

export type ExportFormat = 'pdf' | 'png' | 'jpeg' | 'svg';

export async function exportSlides(slideIds: string[], width: number, height: number, format: ExportFormat) {
  if (format === 'pdf') {
    const doc = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height],
    });

    for (let i = 0; i < slideIds.length; i++) {
      const element = document.getElementById(slideIds[i]);
      if (!element) continue;

      // Use toPng for PDF content to ensure high quality and compatibility
      const dataUrl = await toPng(element, {
        width,
        height,
        pixelRatio: 2,
        style: {
          transform: 'none',
        }
      });

      if (i > 0) {
        doc.addPage([width, height]);
      }

      doc.addImage(dataUrl, 'PNG', 0, 0, width, height);
    }

    doc.save('CarouselPro.pdf');
  } else {
    // For images, we export each slide individually or as a zip?
    // The user didn't specify, but usually for carousels, people want individual images.
    // However, for simplicity in a single button click, let's export the active slide or all?
    // The previous PDF export exported all slides.
    // Let's export all slides as separate files (or maybe just the active one if it's an image?)
    // Actually, let's export all slides.
    
    for (let i = 0; i < slideIds.length; i++) {
      const element = document.getElementById(slideIds[i]);
      if (!element) continue;

      let dataUrl: string;
      const options = {
        width,
        height,
        pixelRatio: 2,
        style: {
          transform: 'none',
        }
      };

      switch (format) {
        case 'png':
          dataUrl = await toPng(element, options);
          break;
        case 'jpeg':
          dataUrl = await toJpeg(element, { ...options, quality: 0.95 });
          break;
        case 'svg':
          dataUrl = await toSvg(element, options);
          break;
        default:
          return;
      }

      const link = document.createElement('a');
      link.download = `CarouselPro-Slide-${i + 1}.${format}`;
      link.href = dataUrl;
      link.click();
    }
  }
}
