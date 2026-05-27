import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout
      title="Документация"
      description="Руководство по работе с проектом Lost Last">
      <header className="hero heroBanner">
        <div className="container">
          <h1 className="hero__title">Lost Last Docs</h1>
          <p className="hero__subtitle">
            Единое руководство по запуску, разработке, архитектуре и API проекта Lost Last.
          </p>
          <div>
            <Link className="button button--primary button--lg" to="/guide/">
              Открыть руководство
            </Link>
          </div>
        </div>
      </header>
      <main className="container">
        <section className="homepageGrid">
          <Link className="homepageTile" to="/guide/">
            <h2>Руководство</h2>
            <p>Рабочий порядок запуска backend, frontend и TG bot, проверки и сборки проекта.</p>
          </Link>
          <Link className="homepageTile" to="/contribution/">
            <h2>Contribution</h2>
            <p>Правила веток, issues, коммитов, merge requests, проверок и секретов.</p>
          </Link>
          <Link className="homepageTile" to="/architecture/backend">
            <h2>Архитектура</h2>
            <p>Устройство backend, frontend и TG bot, а также справочники по компонентам.</p>
          </Link>
          <Link className="homepageTile" to="/api/swagger">
            <h2>API</h2>
            <p>Swagger UI и OpenAPI JSON, сгенерированные backend-проектом.</p>
          </Link>
        </section>
      </main>
    </Layout>
  );
}
