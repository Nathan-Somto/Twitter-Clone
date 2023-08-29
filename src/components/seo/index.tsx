import Head from 'next/head';
import React from 'react'

type Props  = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

function Seo({ title, description, image, url }: Props) {
  const siteName = 'X'; 
  const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000/'; 

  const pageTitle = title ? `${title}` : siteName;
  const pageDescription = description || 'See what\'s happening connect with peeps around the world through X.';
  const pageImage = image || '/default-image.jpg';
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={pageUrl} />
    </Head>
  )
}

export default Seo