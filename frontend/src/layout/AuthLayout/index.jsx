import React from 'react';
import { Layout, Row, Col } from 'antd';

import { useSelector } from 'react-redux';
import { Content } from 'antd/lib/layout/layout';

export default function AuthLayout({ sideContent, children }) {
  return (
    <div className="animated-bg" style={{ minHeight: '100vh', overflow: 'hidden', width: '100%' }}>
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: '100vh', padding: '20px' }}
      >
        <Col
          xs={0}
          sm={0}
          md={10}
          lg={10}
          xl={8}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="fade-in float">
            {sideContent}
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={10}
          xl={8}
        >
          <div className="glass-panel fade-in" style={{ padding: '40px', borderRadius: '24px' }}>
            {children}
          </div>
        </Col>
      </Row>
    </div>
  );
}
