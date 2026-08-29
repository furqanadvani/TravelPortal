import jsPDF from 'jspdf';
import { message } from 'antd';
import { formatCountsArray } from '../../utils/Methods';

export const generateStructuredPDF = async ({
  userName,
  userRole,
  departments,
  employees,
  userStates = {}
}) => {
  try {
    message.loading({ content: 'Generating PDF...', key: 'pdf', duration: 0 });

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    const checkPageEnd = (increment = 0) => {
      if (yPosition + increment > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    // ---------- Header ----------
    const gradientHeight = 30;
    pdf.setFillColor(0, 89, 247);
    pdf.rect(0, 0, pageWidth, gradientHeight, 'F');
    pdf.setFontSize(22);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont(undefined, 'bold');
    pdf.text('TMS DASHBOARD REPORT', pageWidth / 2, 18, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setTextColor(220, 220, 220);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 25);
    pdf.text(`By: ${userName} (${userRole})`, pageWidth - 70, 25);

    yPosition += gradientHeight;

    // ---------- Teams Table ----------
    pdf.setFontSize(10);
    pdf.setFillColor(0, 89, 247); // header color
    pdf.setTextColor(255, 255, 255);
    pdf.setFont(undefined, 'bold');
    pdf.rect(15, yPosition, pageWidth - 30, 10, 'F', 'FD');
    pdf.text('Team Name', 20, yPosition + 7);
    pdf.text('Members Count', 150, yPosition + 7);

    yPosition += 10;
    departments.forEach((team, index) => {
      checkPageEnd(10);
      pdf.setFillColor(index % 2 === 0 ? 244 : 255);
      pdf.setTextColor(0, 13, 30);
      pdf.setFont(undefined, 'normal');
      pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
      pdf.text(team.title || 'Unnamed Team', 20, yPosition + 5.5);
      pdf.text(String(team?.membersCount || 0), 150, yPosition + 5.5);
      yPosition += 8;
    });

    yPosition += 8;

    // ---------- Employees Table ----------
    pdf.setFillColor(0, 89, 247);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont(undefined, 'bold');
    pdf.rect(15, yPosition, pageWidth - 30, 10, 'F');
    pdf.text('Employee Name', 20, yPosition + 7);
    pdf.text('Email', 100, yPosition + 7);
    pdf.text('Role', 170, yPosition + 7);
    pdf.text('Department', 220, yPosition + 7);

    yPosition += 10;
    employees.forEach((emp, index) => {
      checkPageEnd(10);
      pdf.setFillColor(index % 2 === 0 ? 244 : 255);
      pdf.setTextColor(0, 13, 30);
      pdf.setFont(undefined, 'normal');
      pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
      pdf.text(`${emp.firstName} ${emp.lastName}` || 'Unknown', 20, yPosition + 5);
      pdf.text(emp.email || 'No email', 100, yPosition + 5);
      pdf.text(emp.role || 'Unknown', 170, yPosition + 5);
      pdf.text(emp?.department[0]?.title || 'Unknown', 220, yPosition + 5);
      yPosition += 8;
    });

    yPosition += 10;

    // ---------- Tasks Table ----------
    pdf.setFillColor(0, 89, 247);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont(undefined, 'bold');
    pdf.rect(15, yPosition, pageWidth - 30, 10, 'F');
    pdf.text('Task Status', 20, yPosition + 7);
    pdf.text('Count', 150, yPosition + 7);
    pdf.text('Percentage', 220, yPosition + 7);

    const tasksArray = formatCountsArray(userStates, 'stats');
    const totalTasks = tasksArray.reduce((sum, t) => sum + (t.count || 0), 0);

    yPosition += 10;
    tasksArray.forEach((task, index) => {
      checkPageEnd(12);
      pdf.setFillColor(index % 2 === 0 ? 244 : 255);
      pdf.setTextColor(0, 13, 30);
      pdf.setFont(undefined, 'normal');
      pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');

      const percentage = totalTasks > 0 ? Math.round((task.count / totalTasks) * 100) : 0;
      pdf.text(task.status || 'Unknown', 20, yPosition + 5);
      pdf.text(String(task.count || 0), 150, yPosition + 5);
      pdf.text(`${percentage}%`, 220, yPosition + 5);

      // Gradient-like progress bar
      const barWidth = (percentage / 100) * 60;
      pdf.setFillColor(251, 133, 0);
      pdf.rect(270, yPosition + 2, barWidth, 5, 'F');

      yPosition += 10;
    });

    // ---------- Footer ----------
    pdf.setDrawColor(222, 234, 255);
    pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
    pdf.setFontSize(8);
    pdf.setTextColor(119, 119, 119);
    pdf.text('© 2023 TMS - Confidential', pageWidth / 2, pageHeight - 10, { align: 'center' });

    pdf.save(`TMS_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success({ content: 'TMS PDF generated successfully!', key: 'pdf' });

  } catch (error) {
    console.log(error);
    message.error({ content: 'Failed to generate PDF', key: 'pdf' });
  }
};
