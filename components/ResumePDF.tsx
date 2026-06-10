'use client';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeData {
  fullName: string;
  jobTitle: string;
  skills: string;
  summary: string;
}

export function ResumePDF({ data }: { data: ResumeData }) {
  const elementRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!elementRef.current) return;
    try {
      const canvas = await html2canvas(elementRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 277;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${data.fullName.replace(/\s/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to generate PDF');
    }
  };

  return (
    <>
      <button
        onClick={handleExport}
        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
      >
        Export PDF
      </button>
      <div
        ref={elementRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '800px',
          padding: '20px',
          background: 'white',
          color: 'black',
          fontFamily: 'sans-serif'
        }}
      >
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>{data.fullName}</h1>
        <h2 style={{ fontSize: '18px', color: '#555' }}>{data.jobTitle}</h2>
        <hr style={{ margin: '10px 0' }} />
        <h3>Skills</h3>
        <p>{data.skills}</p>
        <h3>Professional Summary</h3>
        <p>{data.summary}</p>
      </div>
    </>
  );
}