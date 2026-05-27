import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout
      title="Единая документация"
      description="Единая статическая документация Lost Last frontend и backend">
      <header className="hero heroBanner">
        <div className="container">
          <h1 className="hero__title">Lost Last Docs</h1>
          <p className="hero__subtitle">
            Единый статический портал для README, contribution guides, автодокументации и Swagger.
          </p>
          <div>
            <Link className="button button--primary button--lg" to="/docs/intro">
              Открыть документацию
            </Link>
          </div>
        </div>
      </header>
      <main className="container">
        <section className="homepageGrid">
          <Link className="homepageTile" to="/docs/frontend/">
            <h2>Frontend</h2>
            <p>README, contribution guide и Compodoc для Angular-приложения.</p>
          </Link>
          <Link className="homepageTile" to="/docs/backend/">
            <h2>Backend</h2>
            <p>README, правила участия и автоматически собранный индекс Go-пакетов.</p>
          </Link>
          <Link className="homepageTile" to="/docs/api/swagger">
            <h2>Swagger</h2>
            <p>OpenAPI JSON и интерактивный Swagger UI из backend-генератора.</p>
          </Link>
        </section>
      </main>
    </Layout>
  );
}
