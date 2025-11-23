import { Space, Layout, Divider, Typography } from 'antd';
import logo from '@/style/images/crl.png';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content
      style={{
        padding: '150px 30px 30px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        <img
          src={logo}
          alt="CRM Pro"
          style={{ margin: '0 0 40px', display: 'block' }}
          height={220}
          width={400}
        />

        <Title level={1} style={{ fontSize: '48px', fontWeight: 800, color: '#1e293b', marginBottom: '10px', letterSpacing: '-1px' }}>
          Welcome to <span style={{ color: '#2563eb' }}>CRM Pro</span>
        </Title>
        <Text style={{ fontSize: '18px', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '20px' }}>
          Accounting / Invoicing / Quote App
        </Text>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
