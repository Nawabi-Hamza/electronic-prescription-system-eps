import { ShamsiDate } from "../../../componenets/ShamsiDatePicker";

export function printStudentStatus(data, status, start_date, end_date) {
  let rows = ''
  data.forEach( row => {
    if(status == 'c_parcha'){
      rows += `
        <tr key={item.generated_id}>
                <td style="border:1px solid #333; padding:8px;">${row.generated_id}</td>
                  <td style="border:1px solid #333; padding:8px;">${row.firstname+" "+row?.lastname}</td>
                  <td style="border:1px solid #333; padding:8px;">${row.class_code}</td>
                  <td style="border:1px solid #333; padding:8px;">${row.assas_number}</td>
                  <td style="border:1px solid #333; padding:8px;">${row.updated_at}</td>
        </tr>
      `
    }else {
      rows += `
        <tr key={item.generated_id}>
            <td style="border:1px solid #333; padding:8px;">${row.generated_id}</td>
            <td style="border:1px solid #333; padding:8px;">${row.firstname+" "+row?.lastname}</td>
            <td style="border:1px solid #333; padding:8px;">${row.class_code}</td>
            <td style="border:1px solid #333; padding:8px;">${row.assas_number}</td>
        </tr>
      `
    }
  })
  const content = `
    <div style="padding:20px; font-family:Arial, sans-serif; width:210mm;">
      <h2 style="text-align:center; margin-bottom:20px;">Student ${status} - ${start_date}/${end_date}</h2>
      <table style="border-collapse:collapse; width:100%;">
        <thead>
          <tr><th style="border:1px solid #333; padding:8px; font-weight:bold;">ID</th>
          <th style="border:1px solid #333; padding:8px;">FULLNAME</th>
          <th style="border:1px solid #333; padding:8px;">CLASS</th>
          <th style="border:1px solid #333; padding:8px;">ASSAS NUMBER</th>
          ${status=="c_parcha" && '<th style="border:1px solid #333; padding:8px;">LEAVE DATE</th>'}
        </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;

  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Salary Slip</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);



  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}


export function printClassStudentAtt(classes, data, start_date, end_date) {
  let rows = ''
  data.forEach( row => {
      rows += `
        <tr key={item.generated_id}>
                <td style="border:1px solid #333; padding:8px;">${row.generated_id}</td>
                  <td style="border:1px solid #333; padding:8px;">${row.firstname+" "+row?.lastname}</td>
                  <td style="border:1px solid #333; padding:8px;">${row.status}</td>
                  <td style="border:1px solid #333; padding:8px;">${row.leave_count}</td>
                  <td style="border:1px solid #333; padding:8px;">${row.absent}</td>
                  <td style="border:1px solid #333; padding:8px;">${row.present}</td>
        </tr>
      `
  })
  const content = `
    <div style="padding:20px; font-family:Arial, sans-serif; width:210mm;">
      <h2 style="text-align:center; margin-bottom:20px;">Student ${classes} - ${start_date}/${end_date}</h2>
      <table style="border-collapse:collapse; width:100%;">
        <thead>
          <tr><th style="border:1px solid #333; padding:8px; font-weight:bold;">ID</th>
          <th style="border:1px solid #333; padding:8px;">FULLNAME</th>
          <th style="border:1px solid #333; padding:8px;">Status</th>
          <th style="border:1px solid #333; padding:8px;">Leave</th>
          <th style="border:1px solid #333; padding:8px;">Absent</th>
          <th style="border:1px solid #333; padding:8px;">Present</th>
        </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;

  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Salary Slip</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);



  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

export function printStudentFees(date, students) {
  let rows = ''
  students.forEach( row => {
    
      rows += `
        <tr>
            <td style="border:1px solid #333; padding:8px;">${row.student_code}</td>
            <td style="border:1px solid #333; padding:8px;">${row.student_name}</td>
            <td style="border:1px solid #333; padding:8px;">${row.class_code}</td>
            <td style="border:1px solid #333; padding:8px;">${row.class_fee}</td>
        </tr>
      `
    
  })
  const content = `
    <div style="padding:20px; font-family:Arial, sans-serif; width:210mm;">
      <h2 style="text-align:center; margin-bottom:20px;">Student Unpaid Fees - ${date}</h2>
      <table style="border-collapse:collapse; width:100%;">
        <thead>
          <tr>
            <th style="border:1px solid #333; padding:8px; font-weight:bold;">ID</th>
            <th style="border:1px solid #333; padding:8px;">FULLNAME</th>
            <th style="border:1px solid #333; padding:8px;">CLASS</th>
            <th style="border:1px solid #333; padding:8px;">Fees</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;

  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Salary Slip</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);



  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}