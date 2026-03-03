import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(slideIds: string[], width: number, height: number) {
  const doc = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height],
  });

  for (let i = 0; i < slideIds.length; i++) {
    const element = document.getElementById(slideIds[i]);
    if (!element) continue;

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: null, // Transparent to capture element bg
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(slideIds[i]);
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          // Fix clipping from parent
          if (clonedElement.parentElement) {
            clonedElement.parentElement.style.overflow = 'visible';
            clonedElement.parentElement.style.width = `${width}px`;
            clonedElement.parentElement.style.height = `${height}px`;
            clonedElement.parentElement.style.maxWidth = 'none';
          }
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    if (i > 0) {
      doc.addPage([width, height]);
    }

    doc.addImage(imgData, 'JPEG', 0, 0, width, height);
  }

  doc.save('CarouselPro.pdf');
}
