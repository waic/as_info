import Image from 'next/image';

function Logo(props) {
  return (
    <div id="logo">
      <a href="https://waic.jp/">
        <Image
          src="https://waic.jp/wp-content/themes/waic/images/header_logo.png"
          srcSet="https://waic.jp/wp-content/themes/waic/images/header_logo.png 1x, https://waic.jp/wp-content/themes/waic/images/header_logo_2x.png 2x"
          alt="ウェブアクセシビリティ基盤委員会 Web Accessibility Infrastructure Committee (WAIC)"
          width={314} height={72}
        />
      </a>
    </div>
  )
}
export default Logo;
