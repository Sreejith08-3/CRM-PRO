import { Tag, Divider, Row, Col, Spin, Tooltip } from 'antd';
import { useMoney } from '@/settings';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';
import {
  FileTextOutlined,
  FileProtectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

export default function AnalyticSummaryCard({ title, tagColor, data, prefix, isLoading = false }) {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('invoice')) return <FileTextOutlined style={{ fontSize: '24px', color: '#2563eb' }} />;
    if (t.includes('quote')) return <FileProtectOutlined style={{ fontSize: '24px', color: '#7c3aed' }} />;
    if (t.includes('paid')) return <CheckCircleOutlined style={{ fontSize: '24px', color: '#10b981' }} />;
    if (t.includes('unpaid')) return <ClockCircleOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />;
    return <FileTextOutlined />;
  };

  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 6 }}
    >
      <div
        className="glass-panel float"
        style={{
          minHeight: '140px',
          height: '100%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600,
            }}
          >
            {title}
          </h3>
          <div style={{
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '50%',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {getIcon(title)}
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          {isLoading ? (
            <Spin />
          ) : (
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {data
                ? moneyFormatter({
                  amount: data,
                  currency_code: money_format_settings?.default_currency_code,
                })
                : moneyFormatter({
                  amount: 0,
                  currency_code: money_format_settings?.default_currency_code,
                })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <Tag color={tagColor || 'blue'} style={{ borderRadius: '12px', padding: '0 10px' }}>
            {prefix}
          </Tag>
        </div>
      </div>
    </Col>
  );
}
