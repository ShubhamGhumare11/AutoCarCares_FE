// import React, { FC } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import { jsPDF } from 'jspdf';

// interface BillRow {
//   id?: number;
//   sNo: number;
//   spareNo: string;
//   spareName: string;
//   qty?: number;
//   rate: number;
//   discountPercent: number;
//   discountAmt: number;
//   cgstPercent: number;
//   cgstAmt: number;
//   sgstPercent: number;
//   sgstAmt: number;
//   taxable?: number;
//   total?: number;
//   quantity?: number;
//   amount?: number;
// }

// interface LocationState {
//   invoiceNumber: string; 
//   invDate: string;
//   customerName: string;
//   customerAddress: string;
//   customerMobile: string;
//   adharNo: string;
//   gstin: string;
//   vehicleNo: string;
//   items?: BillRow[];
//   billRows?: BillRow[];
//   vehicleRegId: string;
  
//   customerAadharNo: string;
//   customerGstin: string;
//   date: string;
//   regNo: string;
//   model: string;
//   kmsDriven: string;
//   comments: string;
//   parts: {
//     partName: string;
//     quantity: string; 
//     unitPrice: string;
//     discountPercent: string;
//     cgstPercent: string;
//     sgstPercent: string;
//     igstPercent: string;
//   }[];
//   labours: {
//     description: string;
//     quantity: string;
//     unitPrice: string;
//     discountPercent: string;
//     cgstPercent: string;
//     sgstPercent: string;
//     igstPercent: string;
//   }[];
//   subTotal: number;
//   totalAmount: number;
//   advanceAmount: string;
//   totalInWords: string;
// }

// const CounterBillPDF: FC = () => {
//   const theme = useTheme();
//   const location = useLocation();
//   const state = location.state as LocationState;

//   const invoiceItems = state.items || state.billRows || [];

//   const grandTotal = invoiceItems
//     .reduce((acc, row) => {
//       const qty = row.qty ?? row.quantity ?? 0;
//       const amt = row.amount ?? row.total ?? row.rate * qty;
//       return acc + amt;
//     }, 0)
//     .toFixed(2);

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     // const theme = useTheme();

//     const invoiceContent = `
//       <div style="font-family: Arial, sans-serif;">
//         <h2 style="text-align: center;">AUTO CAR CARE POINT</h2>
//         <p>Buvasaheb Nagar, Shingnapur Road, Kolki, Tal.Phaltan(415523), Dist.Satara.</p>
//         <p>Ph : 9595054555 / 7758817766   Email : autocarcarepoint@gmail.com</p>
//         <p>GSTIN : 27GLYPS9891C1ZV</p>
//         <h3 style="text-align: center;">TAX INVOICE</h3>
//         <h4>CUSTOMER DETAILS</h4>
//         <p>Name: ${state.customerName}</p>
//         <p>Address: ${state.customerAddress}</p>
//         <p>Mobile: ${state.customerMobile}</p>
//         <p>Vehicle No: ${state.vehicleRegId}</p>
//         <h4>INVOICE DETAILS</h4>
//         <p>Invoice No: ${state.vehicleRegId}</p>
//         <p>Invoice Date: ${state.date}</p>
//         <h4>SPARES / ITEMS</h4>
//         <table style="width: 100%; border-collapse: collapse;">
//           <thead>
//             <tr style="background-color: ${theme.palette.mode === 'dark' ? '#333' : '#f5f5f5'}; color: ${theme.palette.mode === 'dark' ? '#fff' : '#000'};">
//               <th>S.No</th>
//               <th>Particular/Item</th>
//               <th>Qty</th>
//               <th>Unit Price</th>
//               <th>Discount (%)</th>
//               <th>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${state.parts.map((part, index) => `
//               <tr>
//                 <td>${index + 1}</td>
//                 <td>${part.partName}</td>
//                 <td>${part.quantity}</td>
//                 <td>${part.unitPrice}</td>
//                 <td>${part.discountPercent}</td>
//                 <td>${(Number(part.quantity) * Number(part.unitPrice) * (1 - Number(part.discountPercent) / 100)).toFixed(2)}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
//         <h4>LABOUR WORK</h4>
//         <table style="width: 100%; border-collapse: collapse;">
//           <thead>
//             <tr style="background-color: ${theme.palette.mode === 'dark' ? '#333' : '#f5f5f5'}; color: ${theme.palette.mode === 'dark' ? '#fff' : '#000'};">
//               <th>S.No</th>
//               <th>Description</th>
//               <th>Qty</th>
//               <th>Unit Price</th>
//               <th>Discount (%)</th>
//               <th>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${state.labours.map((labour, index) => `
//               <tr>
//                 <td>${index + 1}</td>
//                 <td>${labour.description}</td>
//                 <td>${labour.quantity}</td>
//                 <td>${labour.unitPrice}</td>
//                 <td>${labour.discountPercent}</td>
//                 <td>${(Number(labour.quantity) * Number(labour.unitPrice) * (1 - Number(labour.discountPercent) / 100)).toFixed(2)}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
//         <h4>Grand Total: ${state.totalAmount.toFixed(2)}</h4>
//         <p>Thank You For Visit.... This is a Computer Generated Invoice</p>
//       </div>
//     `;

//     doc.html(invoiceContent, {
//       callback: () => {
//         doc.save('invoice.pdf');
//       },
//       x: 10,
//       y: 10
//     });
//   };

//   return (
//     <div
//       style={{
//         width: '100%',
//         minHeight: '100%',
//         margin: '0 auto',
//         padding: '1rem',
//         fontFamily: 'Arial, sans-serif',
//         backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
//         color: theme.palette.mode === 'dark' ? '#fff' : '#000',
//       }}
//     >
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <tbody>
//           <tr>
//             <td
//               style={{
//                 border: '1px solid #000',
//                 padding: '6px',
//                 textAlign: 'center',
//                 verticalAlign: 'top',
//                 width: '70%',
//               }}
//             >
//               <h2 style={{ margin: 0, fontWeight: 'bold' }}>AUTO CAR CARE POINT</h2>
//               <p style={{ margin: 0 }}>
//                 Buvasaheb Nagar, Shingnapur Road, Kolki, Tal.Phaltan(415523), Dist.Satara.
//               </p>
//               <p style={{ margin: 0 }}>
//                 Ph : 9595054555 / 7758817766   Email : autocarcarepoint@gmail.com
//               </p>
//               <p style={{ margin: 0 }}>GSTIN : 27GLYPS9891C1ZV</p>
//             </td>
//             <td
//               style={{
//                 border: '1px solid #000',
//                 padding: '6px',
//                 textAlign: 'center',
//                 verticalAlign: 'middle',
//                 width: '30%',
//               }}
//             >
//               <strong style={{ fontSize: '1.2rem' }}>TAX INVOICE</strong>
//             </td>
//           </tr>

//           <tr>
//             <td
//               style={{
//                 border: '1px solid #000',
//                 padding: '6px',
//                 fontWeight: 'bold',
//                 verticalAlign: 'top',
//                 width: '50%',
//               }}
//             >
//               CUSTOMER DETAILS
//             </td>
//             <td
//               style={{
//                 border: '1px solid #000',
//                 padding: '6px',
//                 fontWeight: 'bold',
//                 textAlign: 'right',
//                 verticalAlign: 'top',
//                 width: '50%',
//               }}
//             >
//               INVOICE DETAILS
//             </td>
//           </tr>

//           <tr>
//             <td
//               style={{
//                 border: '1px solid #000',
//                 padding: '6px',
//                 verticalAlign: 'top',
//                 width: '50%',
//               }}
//             >
//               <p style={{ margin: 0 }}>Name: {state.customerName}</p>
//               <p style={{ margin: 0 }}>Address: {state.customerAddress}</p>
//               <p style={{ margin: 0 }}>Mobile: {state.customerMobile}</p>
//               <p style={{ margin: 0 }}>Vehicle No: {state.vehicleRegId}</p>
//               {state.customerAadharNo && <p style={{ margin: 0 }}>Aadhaar No: {state.customerAadharNo}</p>}
//               {state.customerGstin && <p style={{ margin: 0 }}>GSTIN: {state.customerGstin}</p>}
//             </td>
//             <td
//               style={{
//                 border: '1px solid #000',
//                 padding: '6px',
//                 verticalAlign: 'top',
//                 width: '50%',
//               }}
//             >
//               <p style={{ margin: 0, textAlign: 'right' }}>
//                 Invoice No: {state.vehicleRegId}
//               </p>
//               <p style={{ margin: 0, textAlign: 'right' }}>
//                 Invoice Date: {state.date}
//               </p>
//             </td>
//           </tr>

//           <tr>
//             <td
//               colSpan={2}
//               style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}
//             >
//               <strong>SPARES / ITEMS</strong>
//             </td>
//           </tr>

//           <tr>
//             <td colSpan={2} style={{ padding: 0, border: '1px solid #000' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead>
//                   <tr
//                     style={{
//                       backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
//                       color: theme.palette.mode === 'dark' ? '#fff' : '#000',
//                     }}
//                   >
//                     <th style={tableHeaderCell}>S.No</th>
//                     <th style={tableHeaderCell}>Particular/Item</th>
//                     <th style={tableHeaderCell}>Qty</th>
//                     <th style={tableHeaderCell}>Unit Price</th>
//                     <th style={tableHeaderCell}>Discount (%)</th>
//                     <th style={tableHeaderCell}>Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {state.parts.map((part, index) => {
//                     const quantity = Number(part.quantity) || 0;
//                     const unitPrice = Number(part.unitPrice) || 0;
//                     const discountPercent = Number(part.discountPercent) || 0;
//                     const base = quantity * unitPrice;
//                     const discount = base * discountPercent / 100;
//                     const amount = base - discount;
//                     return (
//                       <tr key={index}>
//                         <td style={tableBodyCell}>{index + 1}</td>
//                         <td style={tableBodyCell}>{part.partName}</td>
//                         <td style={tableBodyCell}>{quantity}</td>
//                         <td style={tableBodyCell}>{unitPrice.toFixed(2)}</td>
//                         <td style={tableBodyCell}>{discountPercent.toFixed(2)}</td>
//                         <td style={tableBodyCell}>{amount.toFixed(2)}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan={5} style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
//                       GRAND TOTAL
//                     </td>
//                     <td style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
//                       {state.totalAmount.toFixed(2)}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </td>
//           </tr>

//           <tr>
//             <td colSpan={2} style={{ padding: 0, border: '1px solid #000' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <tbody>
//                   <tr>
//                     <td
//                       style={{
//                         position: 'relative',
//                         textAlign: 'center',
//                         borderRight: '1px solid #000',
//                         height: '120px',
//                         width: '33.33%',
//                       }}
//                     >
//                       <img
//                         src="/QR.png"
//                         alt="QR Code"
//                         style={{
//                           display: 'block',
//                           margin: '0 auto',
//                           width: '140px',
//                           height: '140px',
//                           marginBottom: '5px',
//                         }}
//                       />
//                       <div>Scan QR Code</div>
//                     </td>
//                     <td
//                       style={{
//                         position: 'relative',
//                         borderRight: '1px solid #000',
//                         height: '120px',
//                         width: '33.33%',
//                       }}
//                     >
//                       <div
//                         style={{
//                           position: 'absolute',
//                           bottom: '5px',
//                           left: 0,
//                           right: 0,
//                           textAlign: 'center',
//                           fontWeight: 'bold',
//                         }}
//                       >
//                         Customer Signature Thumb
//                       </div>
//                     </td>

//                     <td
//                       style={{
//                         position: 'relative',
//                         height: '120px',
//                         width: '33.33%',
//                       }}
//                     >
//                       <div
//                         style={{
//                           position: 'absolute',
//                           top: '5px',
//                           left: 0,
//                           right: 0,
//                           textAlign: 'center',
//                           fontWeight: 'bold',
//                         }}
//                       >
//                         Auto Car Care Point
//                       </div>
//                       <div
//                         style={{
//                           position: 'absolute',
//                           bottom: '5px',
//                           left: 0,
//                           right: 0,
//                           textAlign: 'center',
//                           fontWeight: 'bold',
//                         }}
//                       >
//                         Authorized Signature
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </td>
//           </tr>

//           <tr>
//             <td
//               colSpan={2}
//               style={{
//                 border: '1px solid #000',
//                 padding: '6px',
//                 textAlign: 'center',
//               }}
//             >
//               Thank You For Visit.... This is a Computer Generated Invoice
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       <button   style={{
//                 border: '1px solid #000',
//                 padding: '6px',
//                 textAlign: 'center',
//                 alignItems:"center",
//                 color:"red",
//               }} onClick={generatePDF}> Generate PDF</button>

//     </div>
    
//   );
// };

// const tableHeaderCell: React.CSSProperties = {
//   border: '1px solid #000',
//   padding: '6px',
//   textAlign: 'center',
//   verticalAlign: 'middle',
// };

// const tableBodyCell: React.CSSProperties = {
//   border: '1px solid #000',
//   padding: '6px',
//   textAlign: 'center',
//   verticalAlign: 'middle',
// };

// export default CounterBillPDF;

import React, { FC, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface BillRow {
  id?: number;
  sNo: number;
  spareNo: string;
  spareName: string;
  qty?: number;
  rate: number;
  discountPercent: number;
  discountAmt: number;
  cgstPercent: number;
  cgstAmt: number;
  sgstPercent: number;
  sgstAmt: number;
  taxable?: number;
  total?: number;
  quantity?: number;
  amount?: number;
}

interface LocationState {
  invoiceNumber: string; 
  invDate: string;
  customerName: string;
  customerAddress: string;
  customerMobile: string;
  adharNo: string;
  gstin: string;
  vehicleNo: string;
  items?: BillRow[];
  billRows?: BillRow[];
  vehicleRegId: string;
  customerAadharNo: string;
  customerGstin: string;
  date: string;
  regNo: string;
  model: string;
  kmsDriven: string;
  comments: string;
  parts: {
    partName: string;
    quantity: string; 
    unitPrice: string;
    discountPercent: string;
    cgstPercent: string;
    sgstPercent: string;
    igstPercent: string;
  }[];
  labours: {
    description: string;
    quantity: string;
    unitPrice: string;
    discountPercent: string;
    cgstPercent: string;
    sgstPercent: string;
    igstPercent: string;
  }[];
  subTotal: number;
  totalAmount: number;
  advanceAmount: string;
  totalInWords: string;
}

const CounterBillPDF: FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const state = location.state as LocationState;

  const invoiceItems = state.items || state.billRows || [];
  const invoiceRef = useRef<HTMLDivElement>(null); // Create a ref for the invoice

  const grandTotal = invoiceItems
    .reduce((acc, row) => {
      const qty = row.qty ?? row.quantity ?? 0;
      const amt = row.amount ?? row.total ?? row.rate * qty;
      return acc + amt;
    }, 0)
    .toFixed(2);

  const generatePDF = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190; // Adjust width as needed
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('invoice.pdf');
    }
  };

  return (
    <div
      ref={invoiceRef} // Attach the ref to the main div
      style={{
        width: '100%',
        minHeight: '100%',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
 }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                textAlign: 'center',
                verticalAlign: 'top',
                width: '70%',
              }}
            >
              <h2 style={{ margin: 0, fontWeight: 'bold' }}>AUTO CAR CARE POINT</h2>
              <p style={{ margin: 0 }}>
                Buvasaheb Nagar, Shingnapur Road, Kolki, Tal.Phaltan(415523), Dist.Satara.
              </p>
              <p style={{ margin: 0 }}>
                Ph : 9595054555 / 7758817766   Email : autocarcarepoint@gmail.com
              </p>
              <p style={{ margin: 0 }}>GSTIN : 27GLYPS9891C1ZV</p>
            </td>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                textAlign: 'center',
                verticalAlign: 'middle',
                width: '30%',
              }}
            >
              <strong style={{ fontSize: '1.2rem' }}>TAX INVOICE</strong>
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                fontWeight: 'bold',
                verticalAlign: 'top',
                width: '50%',
              }}
            >
              CUSTOMER DETAILS
            </td>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                fontWeight: 'bold',
                textAlign: 'right',
                verticalAlign: 'top',
                width: '50%',
              }}
            >
              INVOICE DETAILS
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                verticalAlign: 'top',
                width: '50%',
              }}
            >
              <p style={{ margin: 0 }}>Name: {state.customerName}</p>
              <p style={{ margin: 0 }}>Address: {state.customerAddress}</p>
              <p style={{ margin: 0 }}>Mobile: {state.customerMobile}</p>
              <p style={{ margin: 0 }}>Vehicle No: {state.vehicleRegId}</p>
              {state.customerAadharNo && <p style={{ margin: 0 }}>Aadhaar No: {state.customerAadharNo}</p>}
              {state.customerGstin && <p style={{ margin: 0 }}>GSTIN: {state.customerGstin}</p>}
            </td>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                verticalAlign: 'top',
                width: '50%',
              }}
            >
              <p style={{ margin: 0, textAlign: 'right' }}>
                Invoice No: {state.vehicleRegId}
              </p>
              <p style={{ margin: 0, textAlign: 'right' }}>
                Invoice Date: {state.date}
              </p>
            </td>
          </tr>

          <tr>
            <td colSpan={2} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
              <strong>SPARES / ITEMS</strong>
            </td>
          </tr>

          <tr>
            <td colSpan={2} style={{ padding: 0, border: '1px solid #000' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    }}
                  >
                    <th style={tableHeaderCell}>S.No</th>
                    <th style={tableHeaderCell}>Particular/Item</th>
                    <th style={tableHeaderCell}>Qty</th>
                    <th style={tableHeaderCell}>Unit Price</th>
                    <th style={tableHeaderCell}>Discount (%)</th>
                    <th style={tableHeaderCell}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {state.parts.map((part, index) => {
                    const quantity = Number(part.quantity) || 0;
                    const unitPrice = Number(part.unitPrice) || 0;
                    const discountPercent = Number(part.discountPercent) || 0;
                    const base = quantity * unitPrice;
                    const discount = base * discountPercent / 100;
                    const amount = base - discount;
                    return (
                      <tr key={index}>
                        <td style={tableBodyCell}>{index + 1}</td>
                        <td style={tableBodyCell}>{part.partName}</td>
                        <td style={tableBodyCell}>{quantity}</td>
                        <td style={tableBodyCell}>{unitPrice.toFixed(2)}</td>
                        <td style={tableBodyCell}>{discountPercent.toFixed(2)}</td>
                        <td style={tableBodyCell}>{amount.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
                      GRAND TOTAL
                    </td>
                    <td style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
                      {state.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          <tr>
            <td colSpan={2} style={{ padding: 0, border: '1px solid #000' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        position: 'relative',
                        textAlign: 'center',
                        borderRight: '1px solid #000',
                        height: '120px',
                        width: '33.33%',
                      }}
                    >
                      <img
                        src="/QR.png"
                        alt="QR Code"
                        style={{
                          display: 'block',
                          margin: '0 auto',
                          width: '140px',
                          height: '140px',
                          marginBottom: '5px',
                        }}
                      />
                      <div>Scan QR Code</div>
                    </td>
                    <td
                      style={{
                        position: 'relative',
                        borderRight: '1px solid #000',
                        height: '120px',
                        width: '33.33%',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '5px',
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        Customer Signature Thumb
                      </div>
                    </td>

                    <td
                      style={{
                        position: 'relative',
                        height: '120px',
                        width: '33.33%',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '5px',
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        Auto Car Care Point
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '5px',
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        Authorized Signature
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td
              colSpan={2}
              style={{
                border: '1px solid #000',
                padding: '6px',
                textAlign: 'center',
              }}
            >
              Thank You For Visit.... This is a Computer Generated Invoice
            </td>
          </tr>
        </tbody>
      </table>

      <button style={{
                border: '1px solid #000',
                padding: '6px',
                textAlign: 'center',
                alignItems: "center",
                color: "red",
              }} onClick={generatePDF}> Generate PDF</button>

    </div>
  );
};

const tableHeaderCell: React.CSSProperties = {
  border: '1px solid #000',
  padding: '6px',
  textAlign: 'center',
  verticalAlign: 'middle',
};

const tableBodyCell: React.CSSProperties = {
  border: '1px solid #000',
  padding: '6px',
  textAlign: 'center',
  verticalAlign: 'middle',
};

export default CounterBillPDF;