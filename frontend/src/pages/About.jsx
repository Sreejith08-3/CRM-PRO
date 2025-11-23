// import { Button, Result } from 'antd';

// import useLanguage from '@/locale/useLanguage';

// const About = () => {
//   const translate = useLanguage();
//   return (
//     <Result
//       status="info"
//       title={'CRM PRO'}
//       subTitle={translate('Open Source ERP CRM to manage your business')}
//       extra={
//         <>
//           <p>
//             Contact : <a href="https://www.linkedin.com/in/sreejith-m8">www.Srj.com</a>{' '}
//           </p>
//           <p>
//             Loctaion :{'Kochi, Kerala, India'}
//             {/* <a href="https://github.com/idurar/idurar-erp-crm">
//               https://github.com/idurar/idurar-erp-crm
//             </a> */}
//           </p>
//           <Button
//             type="primary"
//             onClick={() => {
//               window.open(`https://www.linkedin.com/in/sreejith-m8`);
//             }}
//           >
//             {translate('Contact us')}
//           </Button>
//         </>
//       }
//     />
//   );
// };

// export default About;

// frontend/src/pages/About/index.jsx
import React from 'react';
import { Button } from 'antd';
import useLanguage from '@/locale/useLanguage';

export default function About() {
  const translate = useLanguage();

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <div style={{ marginTop: 40 }}>
        <div style={{
            width: 84, height: 84, borderRadius: 42, background: 'var(--primary-color, #700ab4ff)',
            display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:40
          }}>
          CP
        </div>
      </div>

      <h1 style={{ marginTop: 20 }}>CRM PRO</h1>
      <p style={{ color: '#666', maxWidth: 820, margin: '12px auto' }}>
        CRM PRO is your in-house ERP & CRM — customized and rebranded for your company.
        Manage customers, invoices, quotes and payments with a modern, lightweight interface.
      </p>

      <div style={{ marginTop: 24 }}>
        <p style={{ margin: 0, color: '#333' }}>
          Website: <a href="https://www.linkedin.com/in/sreejith-m8" target="_blank" rel="noreferrer">Sreejith/srj</a>
        </p>
        {/* <p style={{ marginTop: 6, color: '#333' }}>
          GitHub: <a href="https://github.com/your-repo" target="_blank" rel="noreferrer">github.com/your-repo</a>
        </p> */}
      </div>

      <div style={{ marginTop: 28 }}>
        <Button type="primary" onClick={() => window.open('mailto:hello@your-company.example')}>
          Contact Us
        </Button>
      </div>
    </div>
  );
}
