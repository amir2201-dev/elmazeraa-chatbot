export const metadata = {
  title: 'El Mazraa - Assistant Virtuel',
  description: 'Assistant virtuel El Mazraa - Leader de l\'industrie avicole et charcutière en Tunisie',
  icons: {
    icon: 'https://www.elmazraa.com/wp-content/themes/elmazeraa/images/logo-elmazraa.webp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
