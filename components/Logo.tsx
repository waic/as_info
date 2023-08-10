import Image from 'next/image';

function Logo() {
  return (
    <header id="logo">
      <a href="https://waic.jp/">
        <Image
          src="https://waic.jp/wp-content/themes/waic/images/header_logo_2x.png"
          alt="ウェブアクセシビリティ基盤委員会 Web Accessibility Infrastructure Committee (WAIC)"
          width={314} height={72}
        />
      </a>
    </header>
  )
}
export default Logo;
